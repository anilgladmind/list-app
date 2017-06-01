/* Config files */
var userApp =  angular.module('usersApp', []);

userApp.controller('ListController', function($scope,$http, $timeout){
	
	$scope.global_alert = {
		isDer: false,
		type: 'Success!',
		class: 'alert-danger',
		message: 'Hellow'
	};
	var fn = function(){
		$scope.global_alert.isDer = false;
	};
	
	
	var successCallback = function(res){
		console.log(res.data.data);
		$scope.users = res.data.data;
	};
	var errorCallback = function(err){
		console.log(err);
	};
	
	$http.get('/api/users').then(successCallback, errorCallback);
	
	
	
	$scope.submitForm = function(){
		var formData = $scope.userForm;		
		$http({
			url: '/api/user',
			data: JSON.stringify(formData),
			method: 'POST',
			headers : {'Content-Type':'application/json'}
		}).then(function(result){
			console.log(result);
			// $scope.users.push(result.data);
			$scope.users = result.data.data;
			$scope.userForm = {};
			
			$scope.global_alert.isDer = true;
			$scope.global_alert.type = 'Success!';
			$scope.global_alert.message = 'User has been created.';
			$scope.global_alert.class = 'alert-success';
			$timeout(fn,3000);
			
		},function(err){
			console.log(err);
		})
	}
	
	$scope.editMode = false;
	// $scope.editForm = {};
	$scope.editUser = function(user){
		var data = $('form[name="editForm_'+user._id+'"]').serializeObject();
		console.log(data);
		
		$http.put('/api/user/'+user._id, JSON.stringify(data)).then(function (result) {
			$scope.editMode = false;
			$scope.users = result.data.data;
			
			$scope.global_alert.isDer = true;
			$scope.global_alert.type = 'Success!';
			$scope.global_alert.message = user.name+' has been updated.';
			$scope.global_alert.class = 'alert-success';
			$timeout(fn,3000);
			
		},function(err){
			console.log(err)
		});
		
	}
	
	
	$scope.deleteUser = function(user){
		var _id = "#user_"+user._id;
		if(confirm("Are you sure ?")){
			$http.delete('/api/user/'+user._id).then(function(result){
				console.log(result.data);
				if(result.data.isDel){
					$(_id).remove();
					$scope.global_alert.isDer = true;
					$scope.global_alert.type = 'Alert!';
					$scope.global_alert.message = 'You have deleted '+user.name;
					$scope.global_alert.class = 'alert-warning';
				}else{
					alert("You Can't remove user.");
					$scope.global_alert.isDer = true;
					$scope.global_alert.type = 'Failure!';
					$scope.global_alert.message = 'You can\'t delete '+user.name;
					$scope.global_alert.class = 'alert-danger';
				}
				$timeout(fn,3000);
			})
		}else{
			return false;
		}
		
	}
	
	
});