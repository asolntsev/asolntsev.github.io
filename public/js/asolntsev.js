function rememberLanguageOrRedirect() {
  var regex = /\/(en|ru)\/.*/;
  if (window.location.pathname.match(regex)) {
    var language = window.location.pathname.replace(regex, "$1") || 'en';
    localStorage.setItem('language', language);
  }
  else {
    var language = localStorage.getItem('language') || 'en';
    if (language != 'en' && language != 'ru') {
      language = 'en';
      localStorage.removeItem('language');
    }

    window.location = '/' + language + window.location.pathname;
  }
}

function centerThings() {
  $('.post blockquote > blockquote > p').each(function(i, p) {
    p = $(p);
    var parentBlockquote = p.parent().parent();
    
    //var centeredDiv = $('<div class="center"></div>');
    var centeredDiv = $('<center></center>');
    p.detach().appendTo(centeredDiv);
    parentBlockquote.replaceWith(centeredDiv);
  });
}

rememberLanguageOrRedirect();
