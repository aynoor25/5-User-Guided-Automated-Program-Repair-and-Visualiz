// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'partials/home',
        controller: PageCtrl
      }).
      when('/about', {
        templateUrl: 'partials/about',
        controller: PageCtrl
      }).
      when('/use', {
        templateUrl: 'partials/use',
        controller: PageCtrl
      }).
      when('/tool', {
        templateUrl: 'partials/tool',
        controller: ToolCtrl
      }).
      when('/feedback', {
        templateUrl: 'partials/feedback',
        controller: PageCtrl
      }).
      when('/median_sample', {
        templateUrl: 'partials/median_sample',
        controller: MedSampleCtrl
      }).
      when('/greater_root_sample', {
        templateUrl: 'partials/greater_root_sample',
        controller: GreaterRootSampleCtrl
      }).
      when('/swap_sample', {
        templateUrl: 'partials/swap_sample',
        controller: SwapSampleCtrl
      }).
      when('/fibonacci_sample', {
        templateUrl: 'partials/fibonacci_sample',
        controller: FibSampleCtrl
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]);