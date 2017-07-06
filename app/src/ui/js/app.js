(function () {
  'use strict';

  angular.module('Restaurant', [])
    .controller('PlaceOrderController', PlaceOrderController);

  PlaceOrderController.$inject = ['$scope']
  function PlaceOrderController($scope) {
    $scope.name = '';
    $scope.phone = '';
    $scope.address = '';
    $scope.dish = '';
    $scope.quantity = '';
    $scope.placeOrder = function () {
      console.log($scope.name);
      console.log($scope.phone);
      console.log($scope.address);
      console.log($scope.dish);
      console.log($scope.quantity);
    }
  }

})();
