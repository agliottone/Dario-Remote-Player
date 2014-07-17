// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
key = 'AI39si4_o0x9AELkUm2d2M30xfHzbgEjFtZgzV8C7Ydu2f6eRZ6XaYaRxD07qwEVBQkMiOK0pwOFbQ4M7sWl6jcJ7r102BsRJg'
var url = 'http://suggestqueries.google.com/complete/search?callback=JSON_CALLBACK&hl=en&ds=yt&oi=spell&spell=1&json=t&client=youtube&_=1404840655404&q='
var url2 = 'https://gdata.youtube.com/feeds/api/videos?callback=JSON_CALLBACK&alt=jsonc&v=2&start-index=1&max-results=25&key='+key+'&q='
//socket.io url
var url4 = 'http://emc.darioagliottone.it/'

var app = angular.module('starter', ['ionic','pascalprecht.translate', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: (downloader) ? "templates/tabs.html" : "templates/tabs-nodown.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/tab-search.html',
          controller: 'SearchCtrl'
        }
      }
    })
.state('tab.player', {
      url: '/player',
      views: {
        'tab-player': {
          templateUrl: 'templates/tab-player.html',
          controller: 'PlayerCtrl'
        }
      }
    })
    

    .state('tab.sync', {
      url: '/sync',
      views: {
        'tab-sync': {
          templateUrl: 'templates/tab-sync.html',
          controller: 'SyncCtrl'
        }
      }
    })
    
    
    if(downloader){
    $stateProvider.state('tab.down', {
      url: '/down',
      views: {
        'tab-down': {
          templateUrl: 'templates/tab-down.html',
          controller: 'DownCtrl'
        }
      }
    })
  }

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/search');

});

app.config(['$translateProvider', function ($translateProvider) {
  $translateProvider.translations('en', { });
 
  $translateProvider.translations('it',(typeof(italiano)!="undefined") ? italiano :  {} );
  
  $translateProvider.translations('es',(typeof(spagnolo)!="undefined") ? spagnolo :  {} );
  
  $translateProvider.translations('fr',(typeof(francese)!="undefined") ? francese :  {} );
  
  $translateProvider.translations('de',(typeof(tedesco)!="undefined") ? tedesco :  {} );

  if(window.localStorage.getItem("lingua")){
      $translateProvider.preferredLanguage( window.localStorage.getItem("lingua"));
  }else{
      $translateProvider.preferredLanguage(lingue[0].code);
  }
  
}]);

app.filter('capitalize', function() {
 return function(input, scope) {
 if (input!=null)
 input = input.toLowerCase();
 return input.substring(0,1).toUpperCase()+input.substring(1);
 }
});

function resize_video() {

    $('#video').height($(window).height() - 144);
    $('#video').width($(window).width());
}
$(window).resize(function () {
    resize_video()
});

