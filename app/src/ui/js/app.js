(function () {
  'use strict';

  angular.module('Restaurant', [])
    .controller('PlaceOrderController', PlaceOrderController)
    .controller('PreviousOrderController', PreviousOrderController)
    .service('PlaceOrderService', PlaceOrderService)
    .service('PreviousOrderService', PreviousOrderService);

  PlaceOrderController.$inject = ['$scope', 'PlaceOrderService']
  function PlaceOrderController($scope, PlaceOrderService) {
    $scope.name = '';
    $scope.phone = '';
    $scope.address = '';
    $scope.dish = '';
    $scope.quantity = '';
    $scope.placeOrder = function(){
      var promise = PlaceOrderService.order($scope.name, $scope.phone, $scope.address, $scope.dish, $scope.quantity);
      promise.then(function(response){
        if(response.status == 200){
          alert('Order Placed. Thank You!');
        }
      })
      .catch(function(err){
        alert('Something went wrong!');
      })
    }
  }

  PreviousOrderController.$inject = ['$scope', 'PreviousOrderService'];
  function PreviousOrderController($scope, PreviousOrderService) {
    $scope.lastOrder = function(){
      var promise = PreviousOrderService.lastOrder();
      promise.then(function(response){
        $scope.name = response.name;
        $scope.address = response.address;
        $scope.phone = response.phone;
        $scope.ordered_dish = response.ordered_dish;
        $scope.quantity = response.quantity;
        $scope.time = response.ordered_time;
      })
      .catch(function(err){
        alert('Something went wrong!');
      })
    }
  }

  PreviousOrderService.$inject = ['$http'];
  function PreviousOrderService($http) {
      var service = this;

      service.lastOrder = function(){
        return $http({
          method : 'POST',
          url : 'http://data.c100.hasura.me/v1/query',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dm3yn9oayzx5vka3y1u4wh934dfvqvwb'
          },
          data : {
            type: "select",
            args: {
              table: "Order",
              columns: ["*"],
              order_by: "-id"
            }
          }
        })
        .then(function(response){
            return response.data[0];
        });
      }
  }

  PlaceOrderService.$inject = ['$http'];
  function PlaceOrderService($http){
    var service = this;

    service.order = function(user_name, user_phone, user_address, user_dish, user_quantity){
      return $http({
				method: 'POST',
				url: 'http://data.c100.hasura.me/v1/query',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          type: "insert",
          args: {
            table: "Order",
            objects: [{
              user_id: 3,
              name: user_name,
              address: user_address,
              phone: user_phone,
              ordered_dish: user_dish,
              quantity: user_quantity
            }]
          }
        }
			})
      .then(function(response){
        return response;
      });
    }
  }

})();
