app.directive('orderByBtn', function(){
  return {
    scope: {
      model: '=',
    }, 
    controller: function($scope, $element, $attrs, $transclude, $filter) {
      $scope.status = {
        isopen: false
      };

      $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
      };
      
      var orderBy = $filter('orderBy');

      $scope.order = function(predicate, reverse) {
        $scope.model = orderBy($scope.model, predicate, reverse); 
        updateOrderOpt(predicate, reverse); 
      };

      $scope.orderOpt = 'None';

      function updateOrderOpt(predicate, reverse) {
        if(predicate === 'id') {
          $scope.orderOpt = 'None';
        }
        else if(predicate === 'name' && reverse === false) {
          $scope.orderOpt = 'Name Ascending';
        }
        else if(predicate === 'name' && reverse === true) {
          $scope.orderOpt = 'Name Descending';
        }
        else {
          $scope.orderOpt = '';
        }
      }

    },
    restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
    templateUrl: '../../../templates/order-by-btn.html',
    link: function($scope, iElm, iAttrs, controller) {
      
    }
  };
});