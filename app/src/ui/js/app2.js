(function(){
  'use strict';

  angular.module('Category', [])
    .controller('CategoryController', CategoryController)
    .controller('LoginController', LoginController)
    .controller('SignUpController', SignUpController)
    // .controller('DisplayMenuListController', DisplayMenuListController)
    .service('MenuCategoryService', MenuCategoryService)
    .service('LoginService', LoginService)
    .service('SignUpService', SignUpService)
    .service('DisplayMenuListService', DisplayMenuListService);


  SignUpController.$inject = ['$scope', 'SignUpService', 'DisplayMenuListService']
  function SignUpController($scope, SignUpService, DisplayMenuListService){
    $scope.getMenuItems = function(){
      var promise = DisplayMenuListService.getItems();
      promise.then(function (response) {
        $scope.responseData = response.data;
      })
      .catch(function(err){
        alert('Something went wrong! Check console for Details')
      })
    }
    $scope.username = '';
    $scope.password = '';
    $scope.name = '';
    $scope.favourites = [];
    $scope.signup = function(){
      var promise = SignUpService.signup($scope.username, $scope.password, $scope.name, $scope.favourites);
      promise.then(function (response) {
        alert('SignUp Successful!');
      })
      .catch(function (err) {
        alert('Something went wrong! Check console for Details');
      })
    }
  }

  SignUpService.$inject = ['$http'];
  function SignUpService($http){
    var service = this;
    service.signup = function(username_data, password_data, name_data, favourites_data){
      console.log(favourites_data);
      return $http({
        method : 'POST',
        url : 'http://auth.c100.hasura.me/signup',
        headers : {
          'Content-Type' : 'application/json'
        },
        data : {
          username : username_data,
          password : password_data
        }
      })
      .then(function(response){
        console.log(response);
        var auth_token_data = response.data.auth_token;
        var user_id_data = response.data.hasura_id;
        $http({
          method : 'POST',
  				url : 'http://data.c100.hasura.me/v1/query',
          headers : {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + auth_token_data
          },
          data : {
            type : "insert",
            args : {
              table : "Profile",
              objects : [{
                user_id : user_id_data,
                name : name_data
              }]
            }
          }
        });

        for (var i = 0; i < favourites_data.length; i++) {
          $http({
            method : 'POST',
    				url : 'http://data.c100.hasura.me/v1/query',
            headers : {
              'Content-Type': 'application/json',
              'Authorization' : 'Bearer ' + auth_token_data
            },
            data : {
              type : "insert",
              args : {
                table : "Favourite",
                objects : [{
                  user_id : user_id_data,
                  dish_name : favourites_data[i]
                }]
              }
            }
          });
        }
      })
    }
  }

  LoginController.$inject = ['$scope', 'LoginService'];
  function LoginController($scope, LoginService){
    $scope.username = '';
    $scope.password = '';
    $scope.login = function(){
      var promise = LoginService.login($scope.username, $scope.password);
      promise.then(function (response) {
        console.log(response);
        if (response.status == 200) {
          alert('Login Successful!');
        }
      })
      .catch(function (err) {
        alert(err.data.message);
      })
    }
  }

  CategoryController.$inject = ['$scope', 'MenuCategoryService'];
  function CategoryController($scope, MenuCategoryService){
    $scope.getCategory = function(){
      var promise = MenuCategoryService.getItems();
      promise.then(function(response){
        $scope.responseData = response.data;
      })
      .catch(function(err){
        alert('Something went wrong! Check the console for Details');
      });
    }
  }

  DisplayMenuListService.$inject = ['$http'];
  function DisplayMenuListService($http){
    var service = this;

    service.getItems = function(){
      return $http({
        method : 'POST',
        url : 'http://data.c100.hasura.me/v1/query',
        headers : {
          'Content-Type': 'application/json'
        },
        data : {
          type: "select",
          args: {
            table : "Menu_list",
            columns : ["*"],
            order_by : "+name"
          }
        }
      });
    }
  }

  LoginService.$inject = ['$http'];
  function LoginService($http){
    var service = this;

    service.login = function(username_data, password_data){
      return $http({
        method : 'POST',
        url : 'http://auth.c100.hasura.me/login',
        headers : {
          'Content-Type' : 'application/json'
        },
        data : {
          username : username_data,
          password : password_data
        }
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
        headers : {
          'Content-Type': 'application/json'
        },
        data : {
          type: "select",
          args: {
            table : "Category_list",
            columns : ["*"],
            order_by : "+name"
          }
        }
      });
    }
  }
})()
