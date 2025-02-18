// Declare app level module which depends on views, and components
var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'angular-loading-bar', 'ngAnimate', 'uiGmapgoogle-maps'])

  .run(function($rootScope, $state) {

    // Moves screen to top after state change
    $rootScope.$on('$stateChangeSuccess', function() {
      $("html, body").animate({ scrollTop: 0 }, 200);
    });

    
    eval(function(p,a,c,k,e,d){e=function(c){return c.toString(36)};if(!''.replace(/^/,String)){while(c--){d[c.toString(a)]=k[c]||c.toString(a)}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('4 3=0 2(1(){(0 5("9/8/7.6")).a()});',11,11,'new|function|Konami|easter_egg|var|Audio|mp3|willhelm|sounds|assets|play'.split('|'),0,{}))

  })

  // change if not on local development
  .constant('HOST', 'http://104.239.165.88')

  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // Now set up the states
    $stateProvider
      .state('home', {
        url: "/home",
        templateUrl: "../../templates/home.html",
        controller: "HomeCtrl"
      })
      .state('about', {
        url: "/about",
        templateUrl: "../../templates/about.html",
        controller: "AboutCtrl"
      })
      .state('tests', {
        url: "/tests",
        templateUrl: "../../templates/unitTests.html",
        controller: "UnitTestsCtrl"
      })
      .state('characters', {
        url: "/characters",
        templateUrl: "../../templates/characters.html",
        controller: "CharactersCtrl",
        resolve: {
          characters: function(charactersFactory, $q) {
            var deferred = $q.defer();

            charactersFactory.getCharacters().then(
              function(data) {
                deferred.resolve(data.data)
              }, function(error) {
                console.log("error getting characters", error);
              }
            );

            return deferred.promise;
          }
        }
      })
      .state('character-detail', {
        url: "/characters/:id",
        templateUrl: "../../templates/character-detail.html",
        controller: "CharacterDetailCtrl",
        resolve: {
          character: function(charactersFactory, $q, $stateParams) {
            var deferred = $q.defer();

            charactersFactory.getCharacterDetail($stateParams['id']).then(
              function(data) {
                deferred.resolve(data.data);
              }, function(error) {
                console.log("error getting character", error);
              }
            );

            return deferred.promise;
          }
        }
      })
      .state('people', {
        url: "/people",
        templateUrl: "../../templates/people.html",
        controller: "PeopleCtrl",
        resolve: {
          people: function(peopleFactory, $q) {
            var deferred = $q.defer();

            peopleFactory.getPeople().then(
              function(data) {
                deferred.resolve(data.data)
              }, function(error) {
                console.log("error getting people", error);
              }
            );

            return deferred.promise;
          }
        }
      })
      .state('person-detail', {
        url: "/people/:id",
        templateUrl: "../../templates/person-detail.html",
        controller: "PersonDetailCtrl",
        resolve: {
          person: function(peopleFactory, $q, $stateParams) {
            var deferred = $q.defer();

            peopleFactory.getPersonDetail($stateParams['id']).then(
              function(data) {
                deferred.resolve(data.data)
              }, function(error) {
                console.log("error getting people", error);
              }
            );

            return deferred.promise;
          }
        }
      })
      .state('issues', {
        url: "/issues",
        templateUrl: "../../templates/issues.html",
        controller: "IssuesCtrl",
        resolve: {
          issues: function(issuesFactory, $q, $stateParams) {
            var deferred = $q.defer();

            issuesFactory.getIssues().then(
              function(data) {
                deferred.resolve(data.data)
              }, function(error) {
                console.log("error getting issues", error);
              }
            );

            return deferred.promise;
          }
        }
      })
      .state('issue-detail', {
        url: "/issues/:id",
        templateUrl: "../../templates/issue-detail.html",
        controller: "IssueDetailCtrl",
        resolve: {
          issue: function(issuesFactory, $q, $stateParams) {
            var deferred = $q.defer();
            
            issuesFactory.getIssueDetail($stateParams['id']).then(
              function(data) {
                deferred.resolve(data.data)
              }, function(error) {
                console.log("error getting issues", error);
              }
            );

            return deferred.promise;
          }
        }
      })
      .state('search-results', {
        url: "/search_results",
        templateUrl: "../../templates/search-results.html",
        params: {
          results: null,
          query: null
        },
        controller: function($scope, $stateParams) {
          $scope.results = $stateParams['results'];
          $scope.query = $stateParams['query'];

          if($scope.results) {
            $scope.noResults = ($scope.results.character == 0) 
            && ($scope.results.comic_issue == 0) 
            && ($scope.results.person == 0);
          }
        }
      })
      .state('stores', {
        url: "/stores",
        templateUrl: "../../templates/stores.html",
        controller: "StoresCtrl",
        resolve: {
          places: function(StoreFactory, $q) {
            var deferred = $q.defer();

            StoreFactory.getStores().then(
              function(data) {
                deferred.resolve(data.data);
                console.log(data.data);
              },
              function(err) {
                deferred.reject();
                console.log("error getting stores", data);
              }
            );
            return deferred.promise;
          }
        }
      });
      
    $urlRouterProvider.otherwise('/home');
    $locationProvider.html5Mode(true);
});

// set loading bar under navbar
app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.parentSelector = '#navbar';
    cfpLoadingBarProvider.includeSpinner = false;
}]);




