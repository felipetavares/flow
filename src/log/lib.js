exports.log = function (message) {
  console.log(message);
}

exports.heading = function (keywords) {
  var keywordsString = '#';

  if (typeof keywords === 'object' && keywords.length) {
    for (var k in keywords) {
      keywordsString += keywords[k] + (k==keywords.length-1)?'':', ';
    }
  } else {
    keywordsString += keywords;
  }

  var date = new Date();
  var time = '';

  time += (date.getMonth()+1)+'/'+date.getDate()+'/'+date.getFullYear();
  time += ' '+date.getHours()+':'+date.getMinutes();

  console.log (time+' | '+keywordsString);
}
