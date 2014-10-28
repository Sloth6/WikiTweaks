// var actualCode = '(' + function() {
var memCache = {}
var search = $('#p-search').css({float:'right','margin-right':0});
var mouseX;
var mouseY;

reStyle()
addToHistory();
var preview = $('<div>').attr({id:'preview'}).css({
    position:'absolute',
    width:300,
    'background-color':'white',
    'z-index':300,
    'padding': 3,
    'font-size':'small',
    'border-color':'gray',
    'border-width': 2,
    'border-style':'solid'
  }).hide();
$(document.body).append(preview);
$(document).mousemove( function(e){
   mouseX = e.pageX; 
   mouseY = e.pageY;
}); 

$('a').hover(function(){
  this.title = ''
  if (this.href.indexOf(document.location.href) != 0) {
    createPreview(this, this.href);
  }
},function(){
  preview.hide();
});

function reStyle() {
  $('#siteSub,#contentSub,.metadata').remove();
  $('#mw-head,#mw-page-base,#mw-panel').hide();
  $('#firstHeading').append(search)
  $('#content').css('margin-left', 0);
  $('#simpleSearch').css({
    'padding-right': 20,
    'width': 100,
    'margin-top': 5,
    'margin-bottom': 5
  });
  $('#content').css({
    'padding-top':0
  });
}

function createPreview(link, url) {
  if (memCache[url]) place(memCache[url]);
  else {
    $.get(url, function(data) {
      data = $(data);
      var text = '';
      var n = 0;
      while ((n++) <= 50) {
        text = format(data.find('#mw-content-text > p:nth-child('+n+')')[0])
        if (text != '' && text.indexOf('Coordinates') != 0) {
          memCache[url] = text;
          return place(text);
        }
      }
    });
  }
}

function format(html) {
  return ($(html).text()||'').replace(/ *\[[^)]*\]*/g, "").replace(/ *\([^)]*\) */g, " ")
}

function place(text) {
  preview.text(text)
  left = Math.min($(document).width()-295, mouseX+5)
  preview.css({ top: mouseY+10, left: left });
  preview.show();
}

function addToHistory() {
  var key = 'wikiHistory';
  var loc = document.location.href
  chrome.storage.local.get(key, function(results){
    hist = results[key]
    hist = (!!hist ? JSON.parse(hist) : []);
    if (loc.match(/en.wikipedia.org\/wiki\/(?!Main_Page)/)) {
      hist.push(loc);
      if (hist.length > 20) 
        hist.shift()
      chrome.storage.local.set({wikiHistory: JSON.stringify(hist)});
    }
  });
}
// } + ')();';


// var script = document.createElement('script');
// script.textContent = actualCode;
// (document.head||document.documentElement).appendChild(script);
// script.parentNode.removeChild(script);
