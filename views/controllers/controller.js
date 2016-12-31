
var app = angular.module('angularTable', ['angularUtils.directives.dirPagination']);
app.controller('listData',function($scope,$http){

    var loadData = function(){
    $http.get('/userslist').then(function(response){
        $scope.userslist = response.data;
        $scope.user=null;
    });
    }
    loadData();
    $scope.sort = function(keyName){
        $scope.sortKey = keyName;
        $scope.reverse = !$scope.reverse;
    }

    $scope.addUser = function(isValid) {
        if (isValid) {
            $http.post('/addUser', $scope.user);
        }
            
    };
    
    $scope.remove = function(id) {
        $http.delete('/deleteUser/'+id).then(function(response){
           loadData();
        });
    };

    $scope.edit = function(id) {
    
        $http.get('/userslist/'+ id).then(function(response) {
            $scope.user = response.data;
        });
    };  

    $scope.update = function(isValid) {
        if (isValid) {
        $http.put('/editUser/' + $scope.user._id, $scope.user);
    }
    };
});


