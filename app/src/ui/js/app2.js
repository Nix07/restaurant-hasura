(function(){
  'use strict';

  angular.module('Category', [])
    .controller('CategoryController', CategoryController)
    .service('MenuCategoryService', MenuCategoryService);

  CategoryController.$inject = ['$scope', 'MenuCategoryService'];
  function CategoryController($scope, MenuCategoryService){
    $scope.getCategory = function(){
      var promise = MenuCategoryService.getItems();
      promise.then(function(response){
        $scope.responseData = response.data;
      })
      .catch(function(err){
        alert('Something went wrong!');
      });
    }
  }

  MenuCategoryService.$inject = ['$http'];
  function MenuCategoryService($http){
    var service = this;

    service.getItems = function(){
      return $http({
        method : 'POST',
        url : 'http://data.c100.hasura.me/v1/query',
        headers: {
          'Content-Type': 'application/json'
        },
        data : {
          type: "select",
          args: {
            table: "Category_list",
            columns: ["*"],
            order_by: "+name"
          }
        }
      });
    }
  }
})()
