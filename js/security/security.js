/* 
* Generated by
* 
*      _____ _          __  __      _     _
*     / ____| |        / _|/ _|    | |   | |
*    | (___ | | ____ _| |_| |_ ___ | | __| | ___ _ __
*     \___ \| |/ / _` |  _|  _/ _ \| |/ _` |/ _ \ '__|
*     ____) |   < (_| | | | || (_) | | (_| |  __/ |
*    |_____/|_|\_\__,_|_| |_| \___/|_|\__,_|\___|_|
*
* The code generator that works in many programming languages
*
*			https://www.skaffolder.com
*
*
* You can generate the code from the command-line
*       https://npmjs.com/package/skaffolder-cli
*
*       npm install -g skaffodler-cli
*
*   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *
*
* To remove this comment please upgrade your plan here: 
*      https://app.skaffolder.com/#!/upgrade
*
* Or get up to 70% discount sharing your unique link:
*       https://app.skaffolder.com/#!/register?friend=5e99eb2782f82d390e776d41
*
* You will get 10% discount for each one of your friends
* 
*/
/**
 * Run Angular JS
 */
app.run(['$location', '$rootScope', '$injector', function($location, $rootScope, $injector ) {
	$rootScope.properties = properties;
	$rootScope.baseUrl = $rootScope.properties.endpoint;
    var AuthenticationService = $injector.get('AuthenticationService');    
	
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
    	try{
    		$rootScope.title = current.$$route.originalPath;
    	}
    	catch(e){}
    });
    
	$rootScope.dateFilter = function(date) {
		if (date)
			return date.toISOString()
	}
	
	// Security redirect on login error
	$rootScope.$on("$routeChangeError", function(event, current, previous, rejection) {
		if (rejection == AuthenticationService.UNAUTHORIZED) {
			$location.path("/login");
		}
	});

} ]);


/**
 * Login Controller
 */
app.controller('LoginController', [
		'$scope',
		'$rootScope',
		'$http',
		'$location',
		'AuthenticationService',
function($scope, $rootScope, $http, $location, AuthenticationService) {

	$scope.login = function() {
		var hash = sha3_512($scope.password);

		// Call login service
		AuthenticationService.login($scope.user, hash.toString(), $scope.remember, function (user) {
			if(user) {
				// If login is OK
				$location.path('/');
			} else {
				// Show login error
				if ($scope.showError) {
					$scope.closeError();
					window.setTimeout(function () {
						$scope.showError = true; 
						$scope.$apply();
				   }, 100);
				} else {
					$scope.showError = true; 
				}
			}

		})
	};

	$scope.closeError = function() {
		$scope.showError = false;
	};


} ]);


/**
 * Logout Controller
 */
app.controller('LogoutController', [ '$scope',  'AuthenticationService', '$location', 
function($scope, AuthenticationService, $location) {
	
	AuthenticationService.logout();
	$location.path("/login");

} ]);


/**
 * Menu Controller
 */
app.controller('MenuController', [ '$scope', 'AuthenticationService', '$rootScope',
 function($scope, AuthenticationService, $rootScope) {
	
	var init = function() {
		AuthenticationService.getUser().then(function(user){
			$scope.user = user;
		});
	}

	init();
	$rootScope.$on('refreshUser', init);

} ]);
