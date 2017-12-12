angular.module('App')
.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('Wiki', {
    url: "/Wiki",
    templateUrl: "/views/Wiki.html",
    controller: "IframeUpdate"
  })
  .state('BBC', {
    url: "/BBC",
    templateUrl: '/views/bbc.html',
    controller: "IframeUpdate"
  }).state('adrianmejia', {
    url: "/adrianmejia",
    templateUrl: '/views/adrianmejia.html',
    controller: "IframeUpdate"
  }).state('TheVerge', {
    url: "/TheVerge",
    templateUrl: "/views/TheVerge.html",
    controller: "IframeUpdate"
  });

  //$urlRouterProvider.otherwise('/Wiki');
});

