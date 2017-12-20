/*
	产生随机字符串
	number 是否含有数字
	lowerLetter 是否含有小写字母
	capitalLetter 是否含有大写字母
	specialSymbol 是否含有特殊符号
*/
const querystring = require('querystring'),
  request = require('request');
function getRandomStr({number = true, lowerLetter = false, capitalLetter = false, specialSymbol = false, len = 6} = {}){
    const numberStr = '0123456789',
        capitalLetterStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowerLetterStr = capitalLetterStr.toLowerCase(),
        specialSymbolStr = '~!@#$%^&*(){}[]?\.\/\-';
    let checkStr = '', str = '', i = 0;
        if(number){
            checkStr += numberStr;
            str +=  numberStr[Math.floor(Math.random() * numberStr.length)];
        }
        if(lowerLetter){
            checkStr += lowerLetterStr;
            str +=  lowerLetterStr[Math.floor(Math.random() * lowerLetterStr.length)];
        }
        if(capitalLetter){
            checkStr += capitalLetterStr;
            str +=  capitalLetterStr[Math.floor(Math.random() * capitalLetterStr.length)];
        }
        if(specialSymbol){
            checkStr += specialSymbolStr;
            str +=  specialSymbolStr[Math.floor(Math.random() * specialSymbolStr.length)];
        }
        let whileLen = (len - number - lowerLetter - capitalLetter - specialSymbol),
            checkStrLen = checkStr.length;
            if(whileLen == len || whileLen < 0){
                throw Error('请设置正确的格式');
            }
        while (i < whileLen) {
            str +=  checkStr[Math.floor(Math.random() * checkStrLen)];
            i++;
        }
    return str;

}

async function myRequest({url, body, type = 'POST'}){
  return new Promise((resolve, reject) => {
    url = 'https://api.weixin.qq.com' + url;
    if(type == 'GET'){
      url = url + '?' + querystring.stringify(body);
      body = undefined
    }
    request({
      method: type, url, body,
      headers: {
        'content-type': 'application/json'
      }
    }, function(err, res, _body){
      if(err){
        console.error(err);
        reject(err);
      }else{
        resolve(JSON.parse(_body));
      }
    });
  });
}

module.exports = {
	getRandomStr,
  myRequest
};