(function () {
  'use strict';

  angular
    .module('datacubes')
    .controller('DatacubesListController', DatacubesListController);

  DatacubesListController.$inject = ['DatacubesService', '$http'];

  function DatacubesListController(DatacubesService, $http) {
    var vm = this;
    //alert('12');
    $http({
	  method: 'GET',
	  url: 'sales.json'
	}).then(function successCallback(response) {
	    // this callback will be called asynchronously
	    // when the response is available
	    // response.data
	    ps.Cube.transforms.dateLocal(response.data);
		var cube	
		= ps.Cube.deserialize(response.data, ['rentals', 'sales', 'revenue'])
		// run some interesting queries
		alert('Total Rentals'+ cube.sum().rentals);
		alert('Total Sales from Rentals'+cube.sum().sales);
		alert('Total Revenue' + '$' + cube.sum().revenue);
		alert('Revenue at 6pm' + '$' + cube.slice({hour: 18}).sum().revenue);
		//alert('Revenue at 6pm for Nintendo games', '$' + cube.slice({hour: 18, platform: 'Nintendo'}).sum(2).revenue);
		//alert('Revenue at 6pm for Super Nintendo games', '$' + cube.slice({hour: 18, platform: 'Super Nintendo'}).sum(2).revenue);
		//alert('Avg rentals per hour for games staring Mario', cube.slice({staring: 'Mario'}).avg(24, 2).rentals + ' units');
		//alert('Avg rentals per hour for games staring Link', cube.slice({staring: 'Link'}).avg(24, 2).rentals + ' units');
		//alert('Avg rentals per hour for games staring Samus', cube.slice({staring: 'Samus'}).avg(24, 2).rentals + ' units');
	    
        
	}, function errorCallback(response) {
		alert("err");
	// called asynchronously if an error occurs
	// or server returns response with an error status.
	});
    
  }
}());
