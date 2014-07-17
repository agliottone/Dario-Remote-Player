<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
    <title></title>

    <link href="lib/ionic/css/ionic.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

    <!-- IF using Sass (run gulp sass first), then uncomment below and remove the CSS includes above
    <link href="css/ionic.app.css" rel="stylesheet">
    -->

    <!-- ionic/angularjs js -->
    <script src="lib/ionic/js/ionic.bundle.js"></script>

    <!-- cordova script (this will be a 404 during development)
    <script src="cordova.js"></script>
     -->
    <!-- your app's js -->
    <script src="js/jquery.min.js"></script>
    <script src="js/underscore-min.js"></script>
    <script src="js/jquery.tube.js"></script>
    <script src="js/date.js"></script>
    <script src="js/translation.js"></script>
    <script src="js/angular-translate.min.js"></script>
    <script src="js/socket.io.js"></script>
    <?php if(isset($_REQUEST['d'])){ ?>
    <script src="js/download.js"></script>
    <?php }else{ ?>
    <script>
    var downloader = false
    </script>
    <?php } ?>
    <script src="js/app.js"></script>
    <script src="js/controllers.js"></script>
    <script src="js/services.js"></script>
  </head>
  <body ng-app="starter" animation="slide-left-right-ios7">
    <!-- 
      The nav bar that will be updated as we navigate between views.
    -->
    
    <ion-nav-bar class="bar-stable nav-title-slide-ios7">
      <ion-nav-back-button class="button-icon icon  ion-ios7-arrow-back">
        Back
      </ion-nav-back-button>
    </ion-nav-bar>
    <!-- 
      The views will be rendered in the <ion-nav-view> directive below
      Templates are in the /templates folder (but you could also
      have templates inline in this html file if you'd like).
    -->
    <ion-nav-view></ion-nav-view>
  </body>
</html>
