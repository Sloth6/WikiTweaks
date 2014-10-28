$(document).ready(function(){
   $('body').on('click', 'a', function(){
     chrome.tabs.create({url: $(this).attr('href')});
     return false;
   });
});

var key = 'wikiHistory';
chrome.storage.local.get(key, function(results){

  hist = results[key]
  hist = (!!hist ? JSON.parse(hist) : []);
  console.log(hist);
  var ul = $('#history')
  hist.forEach(function(url){
    var li = $( '<li>' ).append($("<a />", {
        href : url,
        text : url.replace('http://en.wikipedia.org/wiki/','')
    }));
    ul.prepend(li);
  })
});