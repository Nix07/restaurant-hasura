(function(){
  'use strict';

  angular.module('Menu', [])
    .controller('MenuListController', MenuListController)
    .service('MenuListService', MenuListService);

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

})()
