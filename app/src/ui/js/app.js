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
    .service('FavouriteItemService', FavouriteItemService)
    .service('CookieService', CookieService)
    .service('GetNameService', GetNameService);


  function CookieService(){
    var service = this;

    service.display = function () {
      var decide = checkCookie();
      return decide;
    };

    service.getCookieValue = function(cname){
      return getCookie(cname);
    };

    var getCookie = function (cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length, c.length);
          }
      }
      return "";
    }

    var checkCookie = function(){
      var auth_token = getCookie("auth_token");
      var user_id = getCookie("user_id");
      if (auth_token != "" && user_id != "") {
        // $scope.auth_token = auth_token;
        // $scope.user_id = user_id;
        return true;
      } else {
          return false
      }
    }

  }

  FavouriteItemsController.$inject = ['$scope', 'FavouriteItemService', 'CookieService', 'GetNameService'];
  function FavouriteItemsController($scope, FavouriteItemService, CookieService, GetNameService) {

    $scope.getFavouriteItems = function(){
      var decision = CookieService.display();
      console.log('Decision :' + decision);
      if( decision === true){
        $scope.display = function(){
          return true;
        }

        $scope.auth_token = CookieService.getCookieValue("auth_token");
        $scope.user_id = CookieService.getCookieValue("user_id");

        $scope.name($scope.auth_token, $scope.user_id);

        var promise = FavouriteItemService.getItems($scope.auth_token);
        promise.then(function(response){
          $scope.responseData = response;
        })
        .catch(function(err){
          alert('Something went wrong! Check the console for Details');
        });
      }else {
        $scope.fullName = 'Please Login/SignUp to see your Favourite Dishes !';
      }
    }

    $scope.name = function(auth_token, user_id){
      var promise = GetNameService.getName(auth_token, user_id);
      promise.then(function(response){
        $scope.fullName = response.data[0].name;
      })
      .catch(function(err){
        alert('Something went wrong! Check the console for Details');
      });
    }
  }

  GetNameService.$inject = ['$http'];
  function GetNameService($http){
    var service = this;

    service.getName = function(auth_token_data, user_id_data){
      return $http({
        method : 'POST',
        url : 'http://data.khana-plaza.hasura.me/v1/query',
        headers: {
          'Content-Type': 'application/json',
          'Authorization' : 'Bearer ' + auth_token_data
        },
        data : {
          type : "select",
          args : {
            table : "Profile",
            columns : ["*"],
            where: {
              user_id : user_id_data
            }
          }
        }
      });
    }
  }

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
        url : 'http://data.khana-plaza.hasura.me/v1/query',
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

  PlaceOrderController.$inject = ['$scope', 'PlaceOrderService', 'CookieService'];
  function PlaceOrderController($scope, PlaceOrderService, CookieService) {
    var auth_token = CookieService.getCookieValue("auth_token");
    var user_id = CookieService.getCookieValue("user_id");
    $scope.name = '';
    $scope.phone = '';
    $scope.address = '';
    $scope.dish = '';
    $scope.quantity = '';
    $scope.placeOrder = function(){
      var promise = PlaceOrderService.order($scope.name, $scope.phone, $scope.address, $scope.dish, $scope.quantity, user_id);
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

  PreviousOrderController.$inject = ['$scope', 'PreviousOrderService', 'CookieService'];
  function PreviousOrderController($scope, PreviousOrderService, CookieService) {
    var auth_token = CookieService.getCookieValue("auth_token");
    var user_id = CookieService.getCookieValue("user_id");
    $scope.lastOrder = function(){
      var promise = PreviousOrderService.lastOrder(auth_token);
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
    service.getItems = function(auth_token_data){
      return $http({
        method : 'POST',
        url : 'http://data.khana-plaza.hasura.me/v1/query',
        headers : {
          'Content-Type' : 'application/json',
          'Authorization' : 'Bearer ' + auth_token_data
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
            url : 'http://data.khana-plaza.hasura.me/v1/query',
            headers : {
              'Content-Type' : 'application/json',
              'Authorization' : 'Bearer ' + auth_token_data
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

      service.lastOrder = function(auth_token_data){
        return $http({
          method : 'POST',
          url : 'http://data.khana-plaza.hasura.me/v1/query',
          headers : {
            'Content-Type' : 'application/json',
            'Authorization' : 'Bearer ' + auth_token_data
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

    service.order = function(user_name, user_phone, user_address, user_dish, user_quantity, user_id_data){
      return $http({
				method : 'POST',
				url : 'http://data.khana-plaza.hasura.me/v1/query',
        headers : {
          'Content-Type': 'application/json'
        },
        data : {
          type : "insert",
          args : {
            table : "Order",
            objects : [{
              user_id : user_id_data,
              name : user_name,
              address : user_address,
              phone : user_phone,
              ordered_dish : user_dish,
              quantity : user_quantity
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
