var actualCode = '(' + function() {
  var memCache = {}
  var search = $('#p-search');
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
  $(document.body).append(preview)
  $('#firstHeading').append(search)
  $('#mw-head,#mw-page-base').hide();

  $('#mw-panel').hide();
  $('#content').css('margin-left', 0);
  var mouseX;
  var mouseY;
  $(document).mousemove( function(e) {
     mouseX = e.pageX; 
     mouseY = e.pageY;
  }); 

  $('a').hover(function(){
    this.title = ''
    if (this.href.indexOf(document.location.href) == 0) return
    createPreview(this, this.href);
  },function(){
    preview.hide();
  });

  function createPreview(link, url) {
    if (memCache[url]) place(memCache[url]);
    else {
      $.get(url, function(data) {
        data = $(data);
        var text = '';
        var n = 0;
        while ((n++) <= 50) {
          text = format(data.find('#mw-content-text > p:nth-child('+n+')')[0])
          if (text != '') {
            memCache[url] = text;
            return place(text);
          }
        }
      });
    }
  }
  function format(html) {
    return ($(html).text() || '').replace(/ *\[[^)]*\]*/g, "").replace(/ *\([^)]*\) */g, "")
  }
  function place(text) {
    preview.text(text)
    left = Math.min($(document).width()-300, mouseX+5)
    preview.css({top:mouseY+10, left:left});
    preview.show();
  }
} + ')();';

var script = document.createElement('script');
script.textContent = actualCode;
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
