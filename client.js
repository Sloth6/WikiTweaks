$("document").ready(function() {
    reStylePage();
});

function reStylePage() {
//     $('head link, head style').remove();
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
