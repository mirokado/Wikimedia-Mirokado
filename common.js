if (!window.mirokado) window.mirokado = {};
// console.log('Running jquery '+ $.fn.jquery);
(function () {
  if (window.mirokado.loaded) return;
  //
  window.mirokado.loadit = function(path) {
    mw.loader.using('jquery.cookie', function() {
		       mw.loader.load(path);
		    });
  };
  var deferred = $.Deferred(); // we don't get a fail if the crossDomain request fails
  if (window.mirokado.doactions) {
    // do things locally without trying to call getscript
    // always fails, fail does things locally
    window.mirokado.local = true;
    deferred.reject(deferred, '', 'doactions'); // dummy arguments
  }
  else {
    // console.log('1. wmloaded '+ (window.mirokado.loaded || 'false')+ ' wmlocal '+ (window.mirokado.local || 'false') );
    // try to call localhost, success will have done action directly locally, fail does things remotely
    window.mirokado.doactions = true;
    // using ajax because getScript does not fail for a crossDomain request, need async and timeout for error
    $.ajax({
          url: '//localhost/wp/Wikimedia-Mirokado/common.js',
	  dataType: 'script',
	  async: true,
	  crossDomain: true, 
	  timeout: 1000,
	  error: function() {
	    console.log("deferred ajax error: page not found");
	    deferred.reject(deferred, '', 'doactions');
          }
    });
  }
  // console.log('0, actions direct');
  deferred.fail(function(jqxhr, settings, exception) {
    if (window.mirokado.local) {
      console.log('3. wmloaded '+ (window.mirokado.loaded || 'false')+ ' wmlocal '+ (window.mirokado.local || 'false') );
      window.mirokado.templatescript_url = '//localhost/wp/Wikimedia-contrib/pathoschild.templatescript.js';
      window.mirokado.watchlistDeliverystamp_url = '//localhost/wp/Wikimedia-Mirokado/WatchlistDeliverystamp.js';
      // debugging
      window.watchlistDeliveredLog = true;
    } else {
      console.log('4. wmloaded '+ (window.mirokado.loaded || 'false')+ ' wmlocal '+ (window.mirokado.local || 'false') );
      window.mirokado.templatescript_url = '//meta.wikimedia.org/w/index.php?title=User:Pathoschild/Scripts/TemplateScript/dev.js&action=raw&ctype=text/javascript';
      window.mirokado.watchlistDeliverystamp_url = '//meta.wikimedia.org/w/index.php?title=User:Mirokado/WatchlistDeliverystamp.js&action=raw&ctype=text/javascript';
    }
    window.mirokado.loaded = true;
    popupFixDabs = true;
    //
    importScript('User:Anomie/linkclassifier.js'); // Linkback: [[User:Anomie/linkclassifier.js]]
    importStylesheet('User:Anomie/linkclassifier.css'); // Linkback: [[User:Anomie/linkclassifier.css]]
    var pagename = mw.config.get('wgPageName');
    if (pagename == 'Special:Watchlist') {
      // things only for the watchlist, load that a lot so trim down what it needs
      // window.watchlistLatestDeliveredClass = 'whatever';
      //$.getScript(window.mirokado.watchlistDeliverystamp_url);
      window.mirokado.loadit(window.mirokado.watchlistDeliverystamp_url);
      // importScript('User:Equazcion/ReverseMarked.js');
      // $.getScript('//en.wikipedia.org/w/index.php?title=User:Equazcion/ReverseMarked.js&action=raw&ctype=text/javascript');
      window.mirokado.loadit('//en.wikipedia.org/w/index.php?title=User:Equazcion/ReverseMarked.js&action=raw&ctype=text/javascript');
      console.log('5, returning. wmloaded '+ (window.mirokado.loaded || 'false')+ ' wmlocal '+ (window.mirokado.local || 'false') );
      return;
    }
    //
    // we might need to load something from Pathoschild earlier if we need anything for the watchlist
    //
    // ** TemplateScript: http://meta.wikimedia.org/wiki/User:Pathoschild/Scripts/TemplateScript
    //
    //<pre> retain pre in case template defs in strings...
    // console.log('6, calling pts '+ window.mirokado.templatescript_url);
    var ts = $.getScript(window.mirokado.templatescript_url);
    ts.done(function() { pathoschild.TemplateScript.Add([
        {
	  name: 'horror',
	  forActions: 'edit',                         // or array of string
	  forNamespaces: 0,                           // or array of int
	  script: function(context) {
	    var xx = context.$target.val();
	    xx.replace(/^\| {{[Yy]ear *header}} \| '''\[\[(\d\d\d\d) in film\|\1\]\]'''/mg, '! {{year header}} | [[$1 in film|$1]]');
	    // xx.replace(xxxxx, 'yyyyy');
	    // xx.replace(xxxxx, 'yyyyy');
	    // xx.replace(xxxxx, 'yyyyy');
	    // xx.replace(xxxxx, 'yyyyy');
	    context.$target.val(xx);
	    xx = context.$editSummary.val();
	    if (xx) xx = xx+ '; ';
	    context.$editSummary.val(xx+ 'update table for [[WP:ACCESSIBILITY]], [[WP:MOS]]');
          }
        }
      ]); // Add
    }); // done
    //</pre>
    // only when editing
    // depend on an old Pathoschild framework
    importScript('User:Ohconfucius/script/MOSNUM dates.js');     // [[User:Ohconfucius/script/MOSNUM dates.js]]
    //importScript('User:Ohconfucius/script/formatgeneral.js');  // [[User:Ohconfucius/script/formatgeneral.js]]
    //importScript('User:Ohconfucius/script/EngvarB.js');        // [[User:Ohconfucius/script/EngvarB.js]]
    //importScript('User:Ohconfucius/script/Common Terms.js');   // [[User:Ohconfucius/script/Common Terms.js]]
    //
    // non-local things
    // console.log('8, beginning of non-local things');
    // importScript('User:Anomie/linkclassifier.js'); // Linkback: [[User:Anomie/linkclassifier.js]]
    // importStylesheet('User:Anomie/linkclassifier.css'); // Linkback: [[User:Anomie/linkclassifier.css]]
    // Ctrl-click (PC) and Command-click (Mac) to open search in new tab
    // The Command key is the Apple key on Apple keyboards
    // commons.wikimedia.org/wiki/User_talk:Timeshifter/Open_search_in_new_tab.js

    // mw.loader.load('//commons.wikimedia.org/w/index.php?title=User:Timeshifter/Open_search_in_new_tab.js&action=raw&ctype=text/javascript');

    // didn't seem to work at all
    // m:User:Remember_the_dot/Syntax_highlighter
    // importScriptURI("https://meta.wikimedia.org/w/index.php?title=User:Remember_the_dot/Syntax_highlighter.js&action=raw");

    // reminder about code which may be required in MW 1.19, available now
    // * see mw:ResourceLoader
    // * mw.loader.using( 'jquery.cookie', function() {
    // *     mw.loader.load('//en.wikipedia.org/w/index.php?title=User:Edokter/MenuTabsToggle.js&action=raw&ctype=text/javascript');
    // } );
    // see Wikipedia:HotCat#Easy_categorizing_to_child_or_parent_categories
    var hotcat_use_category_links = true;

    var namespaceNo = mw.config.get('wgNamespaceNumber');
    console.log('namespaceNo '+ namespaceNo+ ' & 1 = '+ (namespaceNo & 1)+ ' action '+ mw.config.get('wgAction'));
    console.log('local storage '+ (window.localStorage || 'no'));
    //
    if ((namespaceNo & 1) == 0) {                                 // not a talk page
      // see also User talk:GregU/hotkeys.js, but that only manages ctrl keys...
      // User:GregU/dashes, this can start an edit
      console.log('loading dashes.js');
      importScript("User:GregU/dashes.js");
      if (mw.config.get('wgAction') == 'edit') {                  // editing
	// style advice
	console.log('loading Advisor.js');
	importScript('User:Cameltrader/Advisor.js');              // only while editing
      }
      else if (namespaceNo == 0 && mw.config.get('wgIsArticle')) {
	// Add WP:Reflinks launcher in the toolbox on left, this *must* start an edit
	console.log('loading Reflinks');
	addOnloadHook(function () {
			addPortletLink("p-tb",     // toolbox portlet
				       "http://toolserver.org/~dispenser/cgi-bin/webreflinks.py/"+ pagename+
				       "?client=script&citeweb=on&overwrite=&limit=20&lang="+ mw.config.get('wgContentLanguage'),
				       "Reflinks"  // link label
				       )});
      }
    }
    // anything below is for editable pages (and diff pages)
    // arr, but this is false for an edit page!
    // need to distinguish between scripts which can initiate an edit and those which work on an edit page...
    //if (!mw.config.get('wgIsArticle')) return;
    //
    if (namespaceNo == 0) {
      // view and edit persondata
      importScript('User:Dr pda/persondata.js');
      importScript('User:Ucucha/HarvErrors.js');
    }
    else if (namespaceNo == 4 && /:(?:Featured|Valued)/.test(pagename)) {
      importScript('User:Gary King/nominations viewer.js');
    }
    //
    //// Citation bot Wikipedia:UCB
    // importScript('User:Smith609/toolbox.js');
    //
    // wordcount
    //// importScript('User:Dr pda/prosesize.js'); //[[User:Dr pda/prosesize.js]]
    // importScript('User:Dr pda/prosesize.js');

    //// install [[Wikipedia:User:Cacycle/wikEd]] in-browser text editor
    //document.write('<script type="text/javascript" src="'
    //+ 'http://en.wikipedia.org/w/index.php?title=User:Cacycle/wikEd.js'
    //+ '&action=raw&ctype=text/javascript"></' + 'script>');

    //// Keep the line below. It is used to check the global usage of the script at [[Special:GlobalUsage/User:Helder.wiki///Scripts/LanguageConverter.js]]
    //// [[File:User:Helder.wiki/Scripts/LanguageConverter.js]]
    //mw.loader.load( '//en.wikipedia.org/w/index.php?title=User:Helder.wiki/Scripts/LanguageConverter.js&action=raw&ctype=text/javascript&smaxage=21600&maxage=86400' );
    //mw.loader.load( '//en.wikipedia.org/w/index.php?title=User:Helder.wiki/Scripts/LanguageConverter.css&action=raw&ctype=text/css&smaxage=21600&maxage=86400', 'text/css' );

    //importScript("User:PleaseStand/hide-vector-sidebar.js");
    // other wikis
    //importScriptURI("http://en.wikipedia.org/w/index.php?title=User:PleaseStand/hide-vector-sidebar.js&action=raw");
  
    //// nice but some strange behaviour too
    //importScript('user:js/diffs.js');

    //// Wikipedia:WikiProject User scripts/Scripts/Inclusion
    //// Wikipedia:Script Installer

    // [[Wikipedia:User script sandbox/Installation]]
    if (window.localStorage) {
      mw.loader.load( "//en.wikipedia.org/w/index.php?title=User:PleaseStand/userScriptSandbox.js&action=raw&ctype=text/javascript" );
    }

    // no local storage for some reason...
    // importScript('User:UncleDouggie/smart watchlist.js');   // [[User:UncleDouggie/smart watchlist.js]]

    // addrefs.js
    // importScript('User:Mirokado/addrefs.js'):

    // this did not seem to work, but now fixed the missing quote...
    //importScript('User:Equazcion/ActiveWatchers.js');

    // might be interesting for watchlist customisation
    //importscript('User:Ais523/watchlistnotifier.js');

    // ldr etc
    //importScript("User:PleaseStand/segregate-refs.js");

    // console.log('11, end of anon actions function');
  }); // deferred.fail
  // console.log('10. actions finished');
  // console.log('2. wmloaded '+ (window.mirokado.loaded || 'false')+ ' wmlocal '+ (window.mirokado.local || 'false') );
}());

// end of file
