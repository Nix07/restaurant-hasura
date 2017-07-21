(function () {
  'use strict';

  angular.module('Restaurant', [])
    .controller('PlaceOrderController', PlaceOrderController)
    .controller('PreviousOrderController', PreviousOrderController)
    .controller('FavouriteItemsController', FavouriteItemsController)
    .controller('MenuListController', MenuListController)
    .service('MenuListService', MenuListService)
    .service('PlaceOrderService', PlaceOrderService)
    .service('PreviousOrderService', PreviousOrderService)
    .service('FavouriteItemService', FavouriteItemService);

  MenuListController.$inject = ['$scope', '$location', 'MenuListService'];
  function MenuListController($scope, $location, MenuListService){
    var category_name = $location.$$hash;
    $scope.Category_name = category_name;
    $scope.getMenuList = function () {
      var promise = MenuListService.getItems(category_name);
      promise.then(function(response){
        $scope.responseData = response.data;
      })
      .catch(function(err){
        alert('Something went wrong! Check the console for Details');
      });
    }
  }

  MenuListService.$inject = ['$http'];
  function MenuListService($http){
    var service = this;

    service.getItems = function(category_name){
      return $http({
        method : 'POST',
        url : 'http://data.c100.hasura.me/v1/query',
        headers: {
          'Content-Type': 'application/json'
        },
        data : {
          type: "select",
          args: {
            table: "Menu_list",
            columns: ["*"],
            order_by: "+name",
            where: {
              category: category_name
            }
          }
        }
      });
    }
  }

  FavouriteItemsController.$inject = ['$scope', 'FavouriteItemService'];
  function FavouriteItemsController($scope, FavouriteItemService) {
    $scope.getFavouriteItems = function(){
      var promise = FavouriteItemService.getItems();
      promise.then(function(response){
        $scope.responseData = response;
      })
      .catch(function(err){
        alert('Something went wrong! Check the console for Details');
      });
    }
  }

  PlaceOrderController.$inject = ['$scope', 'PlaceOrderService'];
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
        alert(err.statusText);
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
        alert(err.statusText);
      })
    }
  }

  FavouriteItemService.$inject = ['$http'];
  function FavouriteItemService($http){
    var service = this;
    service.getItems = function(){
      return $http({
        method : 'POST',
        url : 'http://data.c100.hasura.me/v1/query',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer 1dpvg4oz41w0up1zem7t3cnys0pu2nok'
        },
        data : {
          type : "select",
          args : {
            table : "Favourite",
            columns : ["*"]
          }
        }
      })
      .then(function(response){
        var FavouriteItems = [];
        var i;
        for (i = 0; i < response.data.length; i++) {
          $http({
            method : 'POST',
            url : 'http://data.c100.hasura.me/v1/query',
            headers : {
              'Content-Type' : 'application/json',
              'Authorization' : 'Bearer 1dpvg4oz41w0up1zem7t3cnys0pu2nok'
            },
            data : {
              type : "select",
              args : {
                table : "Menu_list",
                columns : ["*"],
                where : {
                  name : response.data[i].dish_name
                }
              }
            }
          })
          .then(function(response_data){
            FavouriteItems.push(response_data.data[0]);
          });
        }
        return FavouriteItems;
      });
    }
  }

  PreviousOrderService.$inject = ['$http'];
  function PreviousOrderService($http) {
      var service = this;

      service.lastOrder = function(){
        return $http({
          method : 'POST',
          url : 'http://data.c100.hasura.me/v1/query',
          headers : {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer 1dpvg4oz41w0up1zem7t3cnys0pu2nok'
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
