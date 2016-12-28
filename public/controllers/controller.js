// var myApp = angular.module('myApp', []);
// myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
//     console.log("Hello World from controller");
    
// 	$http.get('/userslist').success(function(response) {
// 	console.log("I got the data I requested");    
// 	console.log(response);    
// 	$scope.userslist = response;       
//   });

// }]);



// var myApp = angular.module('myApp', []);
// myApp.controller('AppCtrl', function($scope,$http) {
//  $http.get('/userslist').then(function(response) {   
// 	console.log(response);    
// 	//$scope.userslist = response.data; 
// 	$scope.userslist=DTOptionsBuilder.newOptions().withBootstrap();      
//   });
// });

// var app = angular.module('angularTable',[]);
// app.controller('listData',function($scope,$http){});
var app = angular.module('angularTable', ['angularUtils.directives.dirPagination']);
app.controller('listData',function($scope,$http){
    $http.get('/userslist').then(function(response){
        $scope.userslist = response.data;
    })
    $scope.sort = function(keyName){
        $scope.sortKey = keyName;
        $scope.reverse = !$scope.reverse;
    }
});
