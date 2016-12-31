
var app = angular.module('angularTable', ['angularUtils.directives.dirPagination']);
app.controller('listData',function($scope,$http){

    var refresh = function(){
    $http.get('/userslist').then(function(response){
        $scope.userslist = response.data;
        $scope.user=null;
    });
    };
    refresh();
    $scope.sort = function(keyName){
        $scope.sortKey = keyName;
        $scope.reverse = !$scope.reverse;
    }

    $scope.addUser = function(isValid) {
        if (isValid) {
            $http.post('/userslist', $scope.user).then(function(response) {
                refresh();
           });
        }
            
    };
    
    $scope.remove = function(id) {
        $http.delete('/deleteUser/'+id).then(function(response){
           refresh();
        });
    };

    $scope.edit = function(id) {
    
        $http.get('/userslist/'+ id).then(function(response) {
            $scope.user = response.data;
        
        });
    };  

    $scope.update = function(isValid) {
        if (isValid) {
        $http.put('/userslist/' + $scope.user._id, $scope.user).then(function(response) {
        refresh();
      })
    }
    };
});


