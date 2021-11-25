function getScriptj(scriptUrl, callback) {
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.onload = callback;

    document.head.appendChild(script);
}

getScriptj('src/js/plugins/jquery/jquery-3.3.1.min.js', () => {
    console.log('jquery done');
    
    $('body').html(`
    <nav class="navbar _navbar-inverse navbar-fixed-top">
      <div class="container-fluid col-12 col-xs-12 col-sm-12 col-md-12" style="height: 100%;">
        <div class="navbar-header">
          <button type="button" class="hidden-lg hidden-md navbar-toggle collapsed pull-left" data-toggle="collapse"
            data-target="#sidebar-container" aria-expanded="false" aria-controls="sidebar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand navbar-right">
            <span class="xxsmall-hide">
              <a id="top-left-logo-link" href="#" target="_blank">
                <img id="top-left-logo" src="src/styles/images/noimage.gif" alt="" title="">
              </a>
            </span>
          </a>
        </div>
        <div id="navbar" class="navbar-collapse collapse"></div>
        <span class="xxsmall-hide">
          <a id="top-right-logo-link" href="#" target="_blank">
            <img id="top-right-logo" src="src/styles/images/noimage.gif" alt="" title="">
          </a>
        </span>
      </div>
    </nav>
    <div class="container-fluid" style="height: 100%;">
      <div class="row" style="height: 100%;">
        <nav id="sidebar-container" class="col-12 col-xs-12 col-sm-12 col-md-2 collapse sidebar _panel-group"
          aria-expanded="false">
          <div class="loading"><img src="src/styles/images/loading.svg"></div>
          <div id="sidebar" class="nav nav-sidebar panel panel-default"></div>
        </nav>
        <div class="map-container">
          <div id="mapa" class="col-xs-12 col-sm-12 col-md-10 col-md-offset-2 main"></div>
        </div>
      </div>
    </div>
    <div id="basemap-selector"></div>
    <div id="template"></div>
    `)

   
$.when(
     //<!-- Bootstrap core CSS -->
    //<link href="https://getbootstrap.com/docs/3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    $('head').append('<link href="https://getbootstrap.com/docs/3.3/dist/css/bootstrap.min.css" rel="stylesheet">'),
    
    //<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    //<link href="https://getbootstrap.com/docs/3.3/assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">
    $('head').append('<link href="https://getbootstrap.com/docs/3.3/assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">'),
    
    //<link rel="stylesheet" href="src/js/plugins/jquery/ui/jquery-ui.min.css">
    $('head').append('<link rel="stylesheet" href="src/js/plugins/jquery/ui/jquery-ui.min.css">'),

    //<!-- Bootstrap core CSS -->
    //<link href="https://getbootstrap.com/docs/3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    $('head').append('<link href="https://getbootstrap.com/docs/3.3/dist/css/bootstrap.min.css" rel="stylesheet">'),

    //<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    //<link href="https://getbootstrap.com/docs/3.3/assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">
    $('head').append('<link href="https://getbootstrap.com/docs/3.3/assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">'),

    // <link rel="stylesheet" href="src/js/plugins/jquery/ui/jquery-ui.min.css">
    $('head').append('<link rel="stylesheet" href="src/js/plugins/jquery/ui/jquery-ui.min.css">'),

    //<!-- Main Styles -->
    //<link rel="stylesheet" href="src/styles/css/main.css">
    $('head').append('<link rel="stylesheet" href="src/styles/css/main.css">'),
    
    //<link href="src/styles/css/dashboard.css" rel="stylesheet">
    $('head').append('<link href="src/styles/css/dashboard.css" rel="stylesheet">'),

    //<!-- Plugins -->
    //<!-- jQuery -->
    //<script src='src/js/plugins/jquery/jquery-3.3.1.min.js'></script>
    $.getScript('src/js/plugins/jquery/jquery-3.3.1.min.js'),

    //<script src="src/js/plugins/jquery/ui/jquery-ui.min.js"></script>
    $.getScript('src/js/plugins/jquery/ui/jquery-ui.min.js'),

    //<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/leaflet.css' />
    $('head').append(`<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.6.0/leaflet.css'/>`),

    //<script src="https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js"></script>
    $.getScript('https://cdn.jsdelivr.net/gh/fancyapps/fancybox@3.5.7/dist/jquery.fancybox.min.js'),

    //<script src="https://getbootstrap.com/docs/3.3/assets/js/ie-emulation-modes-warning.js"></script>
    $.getScript('https://getbootstrap.com/docs/3.3/assets/js/ie-emulation-modes-warning.js'),

    //<!-- Bootstrap core JavaScript placed at the end of the document so the pages load faster -->
    //<script src="https://getbootstrap.com/docs/3.3/dist/js/bootstrap.min.js"></script>
    $.getScript('https://getbootstrap.com/docs/3.3/dist/js/bootstrap.min.js'),

    //<!-- Just to make our placeholder images work. Don't actually copy the next line! -->
    //<script src="https://getbootstrap.com/docs/3.3/assets/js/vendor/holder.min.js"></script>
    $.getScript('https://getbootstrap.com/docs/3.3/assets/js/vendor/holder.min.js'),

    //<!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    //<script src="https://getbootstrap.com/docs/3.3/assets/js/ie10-viewport-bug-workaround.js"></script>
    $.getScript('https://getbootstrap.com/docs/3.3/assets/js/ie10-viewport-bug-workaround.js'),

    //<!-- Argenmap basic libraries  -->
    //<script src="src/js/utils/analytics/analytics.js"></script>
    $.getScript('src/js/utils/analytics/analytics.js'),

    //<script src="src/js/utils/constants/constants.js"></script>
    $.getScript('src/js/utils/constants/constants.js'),

   

    //<script src='src/js/utils/functions/functions.js'></script>
    $.getScript('src/js/utils/functions/functions.js'),
).done(function(){
    $.when(
     
         //<script src="src/js/entities.js"></script>
        $.getScript('src/js/entities.js'),

        //<script src="src/js/components/url-interaction/URLInteraction.js"></script>
        $.getScript('src/js/components/url-interaction/URLInteraction.js'),
            $.Deferred(function( deferred ){
                $( deferred.resolve );
            })
        ).done(function(){
            
        $.getScript("src/js/components/context-menu/context-menu.js")


        $.getScript("src/js/components/user-message/user-message.js")


        //<script src="src/js/app.js"></script>
        $.getScript('src/js/app.js');
    
        //<script src="src/js/components/styles/styles.js"></script>
        $.getScript('src/js/components/styles/styles.js');
    
        //<script src="src/js/components/login/login.js"></script>
        $.getScript('src/js/components/login/login.js');
            
        });

  })
    
});


