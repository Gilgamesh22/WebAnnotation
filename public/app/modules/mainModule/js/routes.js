angular.module('App')
.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('Wiki', {
    url: "/Wiki",
    template: '<iframe src="views/wiki.html" sandbox="allow-top-navigation allow-scripts allow-forms" data-ng-init="iframeInit()" id="annotatable"></iframe>',
    data:{},
    controller: "IframeUpdate"
  })
  .state('BBC', {
    url: "/BBC",
    template: '<iframe src="views/BBC.html" sandbox="allow-top-navigation allow-scripts allow-forms"  data-ng-init="iframeInit()" id="annotatable"></iframe>',
    data:{},
    controller: "IframeUpdate"
  }).state('adrianmejia', {
    url: "/adrianmejia",
    templateUrl: "views/adrianmejia.html",
    data:{},
    controller: "IframeUpdate"
  });;

  //$urlRouterProvider.otherwise('/Wiki');
});

