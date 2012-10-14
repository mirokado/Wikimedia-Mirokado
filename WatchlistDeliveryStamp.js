if (!window.mirokado) {
  window.mirokado = {};
}
//
if (!window.mirokado.watchlistDeliveryStampLoaded && mw.config.get('wgPageName') == 'Special:Watchlist') {
  window.mirokado.watchlistDeliveryStampLoaded = true;
  // taken from https://gist.github.com/1771618
  // Slightly more concise and improved version based on http://www.jquery4u.com/snippets/url-parameters-jquery/
  var getUrlVar = function(key) {
    var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
    return result && unescape(result[1]) || "";
  }
  // taken from http://www.quirksmode.org/js/cookies.html
  // jQuery cookies addon is a dead link
  var createCookie = function(name,value,days) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days*24*60*60*1000));
      var expires = '; expires='+ date.toGMTString();
    }
    else {
      var expires = "";
    }
    document.cookie = name+ '='+ value+ expires+ '; path=/';
  };
  var readCookie = function(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split(';');
    for (var i=0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1,c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  };
  //var eraseCookie = function(name) {
  //  createCookie(name, '', -1);
  //};
  cookie = mw.config.get('wgCookiePrefix')+ '-'+ mw.config.get('wgPageName')+ '-deliverystamp';
  var h4 = $('h4');
  if (h4) {
    // no real need to update the cookie if we don't have an id, may be more reliable
    var trace;
    if (window.watchlistDeliveredLog || getUrlVar('watchlist-delivery-debug')) {
      var log = h4.first().before('<pre>Starting local2 cookie '+ cookie+ "\n</pre>").prev();
      trace = function(tt) { log.append(tt); };
    }
    var oldId = readCookie(cookie) || '';
    var newId;
    var idRe = /&diff=(\d+)/; // this misses new pages, protection log etc entries, boundary would go after them
    var nothing = [ '' ];
    // user can determine the added class by window variable
    var classes = window.watchlistLatestDeliveredClass || 'mw-watchlist-latest-delivered';
    if (!oldId) {
      var classes = ''; // no highlighting if no prior stamp
    }
    if (trace) trace("Old "+ oldId+ ", classes '''"+ classes+ "''' "+ (classes? 'true': 'false')+ "\n");
    try {
      var act = function(rec, find, mark) {
	var href = find(rec).attr('href');
	if (trace) trace("href = "+ href + "\n");
	var id = (href.match(idRe) || [])[1];
	if (id) {
	  if (!newId) {
	    newId = id;
	    createCookie(cookie, newId, 180);
	    if (trace) trace('New '+ (readCookie(cookie) || 'unset -- problem')+ "\n");
	    if (!oldId) throw new Error("OK\n");
	  }
	  if (id <= oldId) {
	    mark(rec).addClass(classes);
	    throw new Error("OK\n");
	  }
	}
      };
      h4.each(function(ii) {
		var recs = $(this).next('div').find('table.mw-enhanced-rc'); // .each(function(ii) { trace("table '''"+ $(this).text()+ "'''\n"); });
		var find;
		var mark;
		if (recs.length) {
		  find = function(xx) { return xx.find('a:eq(1)'); };
		  mark = function(xx) { return xx.closest('table'); };
		}
		else {
		  recs = $(this).next('ul').children('li'); // .each(function(ii) { trace("li '''"+ $(this).text()+ "'''\n"); });
		  find = function(xx) { return xx.find('a:first'); };
		  mark = function(xx) { return xx; }
		}
		recs.each(function(ii) { act($(this), find, mark); });
	      }); // each h4
    }
    catch(ee) {
      if (ee.message == 'OK') {
        if (trace) trace("OK\n");
      } else {
        if (trace) trace(ee.message); else throw ee;
      }
    }
  } // if h4
} // page name
window.mirokado.watchlistDeliveryStampLoaded = true;
// end of file
