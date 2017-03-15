var app = angular.module('myapp', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	 $routeProvider

	.when('/home', {
		templateUrl: 'home.html',
		controller: 'NameCtrl'
	})
	
	.when('/register', {
		templateUrl: 'register.html',
		controller: 'RegisterCtrl'
	})

	.when('/login', {
		templateUrl: 'login.html',
		controller: 'LoginCtrl'
	})

	.when('/', {
		templateUrl: 'login.html',
		controller: 'LoginCtrl'
	})

	.when('/monitor', {
		templateUrl: 'monitor.html',
		controller: 'NameCtrl'
	})

	.when('/edit', {
		templateUrl: 'edit.html',
		controller: 'NameCtrl'
	})
	.otherwise({ 
		redirectTo: '/login' 
	});
}]);


app.controller('RegisterCtrl', ['$scope','$http', '$location', function($scope, $http, $location) {
        
       $scope.register = function() {

       		console.log($scope.user);

       		$http.post("/register", $scope.user).success(function(response) {
       			console.log("Response received");
       			$location.path("/login");
       		})
       };
       
      }]);
    
/*app.controller('LoginCtrl', ['$scope','$http', '$window','$location', function ($scope,$http,$window,$location) {

		$scope.check = function() {
		console.log($scope.user);

		$http.get("/register").success(function(response) {
		console.log("Response received");

		$scope.register = response;
		console.log(response[0].username);
		var mydata = JSON.stringify($scope.register);
		console.log(mydata[0].username);

		for (var i in $scope.register) {
			if($scope.register[i].username == $scope.user.username && $scope.register[i].password == $scope.user.password){

				$location.path("/home");
			}
			else{
				$location.path("/");
			}
		}
		})	

	}
}])*/


app.controller('NameCtrl', ['$scope','$http','$rootScope','$location','$route','$window', function ($scope, $http,$rootScope,$location,$route,$window) {

	//$scope.names = ["Javascript", "Php", "Java"];

	//$window.location.reload();
	//$route.reload();
	console.log("Hello World from Controller");

	$http.get('/class').success(function(response) {
		//$scope.names = JSON.stringify(response.class);
		console.log(response);
		$scope.names = response;
	})

	 $http.get('/isloggedin')
        .success(function (resp) {
            if(!resp){
                $location.path('/login');
            }else {
                $scope.username = resp.username;
                $scope.password = resp.password;
                $rootScope.logUser = resp;
            }
        });
	
	$scope.getAverage = function(){
    var avg = 0;
    for(var i = 0; i < $scope.stu_info.length; i++){
        var key = $scope.stu_info[i];
        total = (key.mark1 + key.mark2 + key.mark3);
    }
    avg=total/3;
    return avg;


}

	$scope.welcome = function() {
		$location.path("/home");
		$window.location.reload();
	}

	$scope.monitor = function() {
		$location.path("/monitor");
		$window.location.reload();
	}

	$scope.populate_students = function() {
		console.log("Populate students");

		var selectedclass = $scope.stu.selectedClass;
		console.log(selectedclass);
		$http.get("/studentlist/"+selectedclass).success(function(response) {
			console.log(response);
			$scope.students = response;		
		})
	}

	$scope.display_info = function() {
		console.log("Display information");

		var selstu = $scope.stu.selectedStudent.name;
		console.log(selstu);


		$http.get("/getstudent/"+selstu).success(function(response) {
			console.log(response);
			$scope.stu_info = response;		
		})
/*
		$http.post("/studentlist",{"name":selstu}).success(function(response) {
			console.log(response);
			$scope.stu_info = response;		
		})*/
	}

	/*var refresh = function() {
	$http.get("/studentlist").success(function(response) {
		console.log("Response received");

		$scope.studentlist = response;
	})	
	}
	
	refresh(); */

	$scope.saveStudent = function() {
		console.log($scope.stu.subject1);

		/*var newString = $scope.stu.subject1;
		alert(newString);*/
		$http.post("/studentlist",$scope.stu).success(function(response) {
			console.log("Data inserted client");
			console.log(response);
			//refresh();
			$scope.stu="";
		})
	}

	$scope.logout = function () {
        $http.get('/logout')
            .success(function (resp) {
                if(resp === "successful"){
                    $location.path('/login');
                }
            })
    };

    $scope.load_subject = function() {
    	var selectedclass = $scope.stu.selectedClass;
		console.log(selectedclass);
		$http.get("/subjectlist/"+selectedclass).success(function(response) {
			//console.log(response);

			//$scope.subjects = response;
			for(var i in response){
			$scope.subjects = response[i].subject[i];		
		console.log($scope.subjects);
		}
		})
    }

    $scope.edit = function(id){

    	console.log(id);
    	
    	$http.get("/edit/"+id).success(function(response) {
    		console.log(response);
    	//	$location.path("/edit");
    		$rootScope.stu = response;
    		$location.path("/edit");
    		//console.log($scope.stu.name);
    	})
    }


    $scope.updateStudent = function(){

    	$http.put('/update/'+ $scope.stu._id, $scope.stu).success(function(response) {
			console.log("Record updated");
			$location.path("/monitor");
			$window.location.reload();
			//$scope.stu = "";
		})
    }

    $scope.delete = function(id){
    	console.log(id);

    	$http.delete("/delete/"+id).success(function(response) {
    	//$location.path("/home");
    	$route.reload();
    	console.log("Record deleted");

    	})
    }

    $scope.back = function() {
    	$location.path("/monitor");
    	$window.location.reload();
    }

}])


app.controller('LoginCtrl', ['$scope','$http','$location','$rootScope', function ($scope,$http,$location,$rootScope) {

	if($rootScope.logUser == undefined){
        $scope.logoutuser = "No one";	
    }else {
        $scope.logoutuser = $rootScope.logUser.username;
    }

	$scope.check = function() {

		$http.post("login",$scope.user).success(function(response) {
			if(response == "successful"){
				$location.path("/home");
			}
			else{

				$location.path("/");
				$scope.error = true;

			}
			
		})
	}
}])