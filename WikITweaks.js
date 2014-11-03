// var actualCode = '(' + function() {
var memCache = {}
var preview;
var search = $('#p-search').css({float:'right','margin-right':0});
var mouseX;
var mouseY;

reStylePage()
addPageToHistory();
createPreview()

function createPreview() {
  preview = $('<div>').attr({id:'preview'}).css({
      position:'absolute',
      width:300,
      'background-color':'rgb(245,245,245)',
      'z-index':300,
      'padding': 5,
      'font-size':'small',
      'border-color':'rgb(4,0,117)',
      'border-width': 2,
      'border-style':'solid',
      'box-shadow':'5px 5px 10px gray'
    }).hide();

  $(document.body).append(preview);
  
  $(document).mousemove( function(e){
     mouseX = e.pageX; 
     mouseY = e.pageY;
     // moveToMouse();
  });

  $('a').hover(function(){
    var link = this;
    link.title = ''
    if (link.href.indexOf(document.location.href+'#') != 0) {
      var text = getText(link, function(text) {
        place(text, $(link));
      });
    }
  }, function(){
    preview.hide();
  });
}

function reStylePage() {
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
var f;
function getText(link, cb) {
  var url = link.href
  if (memCache[url]) return cb(memCache[url])
  $.get(url, function(data) {
    data = $(data);
    f = data
    var text = '';
    var n = 0;
    while ((n++) <= 50) {
      text = data.find('#mw-content-text > p:nth-child('+n+')')[0]
      text = format(text)
      if (text != '' && text.indexOf('Coordinates') != 0) {
        return cb(text);
      }
    }
  });
}

function format(html) {
  return ($(html).text()||'').replace(/ *\[[^\]]*\]*/g, "").replace(/ *\([^)]*\) */g, " ")
}

function place(text, elem) {
  preview.text(text);
  // moveToMouse();
  movePreviewToElement(elem);
  preview.show();
}

function moveToMouse() {
  var left = Math.min($(document).width()-295, mouseX+5)
  preview.css({ top: mouseY+10, left: left });
}

function movePreviewToElement(elem) {
  var pos = elem.offset()
  var left = Math.min($(document).width()-295, pos.left+5)
  var top = pos.top+20
  // Deal with links that wrap around.
  if (mouseX > left +300)
    left = Math.min($(document).width()-295, mouseX.left+5)
  if (top < mouseY + 5)
    top = mouseY + 20
  preview.css({left:left, top:top})
}

function addPageToHistory() {
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
