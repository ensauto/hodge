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
	    var DataSample = [
		    ["Apple","US",2,3],
		    ["Orange","Canada",4,4],
		    ["Apple","UK",9,13.5],
		    ["Kiwi","Canada",3,6],
		    ["Orange","UK",5,5],
		    ["Orange","US",4,4],
		    ["Kiwi","US",3,6],
		    ["Banana","US",2,2],
		    ["Kiwi","UK",2,4],
		    ["Apple","US",7,10.5],
		    ["Apple","UK",4,6],
		    ["Kiwi","Canada",2,4],
		    ["Kiwi","US",6,12],
		    ["Banana","Canada",5,5],
		    ["Banana","US",4,4],
		    ["Mango","UK",3,7.5],
		    ["Mango","Canada",7,17.5],
		    ["Mango","Canada",9,22.5],
		    ["Banana","US",7,7],
		    ["Banana","UK",8,8]
		];
 
//Need to construct cube first 

	var MyCube =  new Cube8(response.data) //Instantiate Cube 
	.Dim(function (d) { 
		return d[1]
	}, "Country")  // Create a dimension named Country and an accessor of how to get the fact 
	.Dim(function (d) {
	    return d[0];
	}, "Fruit")    // Create a dimension named Fruit and an accessor of how to get the fact               
	.SetMeasureFx(function (d) {
	     return {
	         "Sales": d[3],
	         "Quantity": d[2],
	         "RecordCount":1
	     }
	 }) // Specify the accessor function on how to extract measure/aggregates 
	.SetRollupFx(function (a, b) {
	    if (a && b) {
	        return {
	            "Sales": a.Sales + b.Sales,
	            "Quantity": a.Quantity + b.Quantity,
	            "RecordCount":a.RecordCount + b.RecordCount
	        }
	    }
	    return a ? a : b;
	}) // Specify how the cube would rollup our aggregates. In this case, our rollup function perform summation. 
	 
	//Now it is time to get some useful data. 
	if (MyCube) { alert("Cube"); }
	var Total = MyCube.One() //Get total of everything 
	var ForUS = MyCube.GetMeasure({"Country":"US"}); // Get Measure for US country 
	var ByFruitThenCountry = MyCube.NestDim(["Fruit","Country"],1); //Create TreeGroup by nesting 2 dimensions 
	var Table = MyCube.Drill(["Country"],["Fruit"]);
	//alert(Table);
 	// 2 Dimension tabular table with Countr as column and Fruit as row
		
        
	}, function errorCallback(response) {
	// called asynchronously if an error occurs
	// or server returns response with an error status.
	});
    
  }
}());
