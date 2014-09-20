(function() {
	var app = angular.module('transmission', [ ]);
	
	app.controller('TransController', function(){
		this.product = gem;
	});

	var gem = {
		name: 'dodecahedron',
		price: 2.95,
		description: '...',
	}

	console.log("app js is loading")


})();

 
