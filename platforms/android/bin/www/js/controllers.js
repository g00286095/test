//GET LOCATION PERMISSIONS

var app = angular.module('starter.controllers', ['ionic'])

.constant('FORECASTIO_KEY', 'cb96da74b9956b890a4e4a1b47ee2d9e')
.controller('HomeCtrl', function($scope,$state,Weather,DataStore) {
	//read default settings into scope
	console.log('inside home');
	$scope.city  = DataStore.city;
	var latitude  =  DataStore.latitude;
	var longitude = DataStore.longitude;
		
	//call getCurrentWeather method in factory â€˜Weatherâ€™
	Weather.getCurrentWeather(latitude,longitude).then(function(resp) {
	$scope.current = resp.data;
	  
	//convert to celcius
	var temp = resp.data.currently.temperature;
	temp = ((temp-32)*5/9);
	$scope.temp = Math.round(temp * 1) / 1;
	console.log('GOT CURRENT', $scope.current);
	//debugger;
	  
    }, function(error) {
      alert('Unable to get current conditions');
      console.error(error);
    });
	
	$scope.test = "WALKS";

})

.controller('GuideCtrl', function($scope,$state) {
   $scope.popUpLayer ="display_none";
   $scope.popUpWalk1 ="invisible";
   $scope.popUpWalk2 ="invisible";
   $scope.popUpWalk3 ="invisible";
   
   //start walk buttons
   //WALK 1
    $scope.startWalk1 = function() {
		$scope.popUpLayer ="display";
		$scope.popUpWalk1 ="visible";
		$scope.popUpWalk2 ="invisible";
		$scope.popUpWalk3 ="invisible";
	};
	
	//WALK 2
    $scope.startWalk2 = function() {
		$scope.popUpLayer ="display";
		$scope.popUpWalk2 ="visible";
		$scope.popUpWalk1 ="invisible";
		$scope.popUpWalk3 ="invisible";
	};
	
	//WALK 3
    $scope.startWalk3 = function() {
		$scope.popUpLayer ="display";
		$scope.popUpWalk3 ="visible";
		$scope.popUpWalk2 ="invisible";
		$scope.popUpWalk1 ="invisible";
	};
	
	//back to map button
	$scope.backToMap = function() {
		$scope.popUpWalk1 ="invisible";
		$scope.popUpWalk2 ="invisible";
		$scope.popUpWalk3 ="invisible";
		$scope.popUpLayer ="display_none";
	};
})

.controller('LandmarksCtrl', function($scope,$state) {

})

.controller('MapCtrl', function($scope, $state, $ionicLoading, $ionicSideMenuDelegate, $rootScope, $ionicPopup) {
	
   $rootScope.cancel = $ionicLoading.hide;
   $scope.hidden ="display_none";
   $scope.hidden_refresh ="display_none";
   $scope.imagewalk ="walkblack";
   $scope.number = "Choose Walk";
   $scope.totalDistance = "Select from the tabs above";
   $scope.distance = "Press refresh button on the left";
   $scope.refresh_button_class="refresh-green2";
   $scope.popUpLayer ="display_none";
   $scope.popUpWalk1 ="invisible";
   $scope.popUpWalk2 ="invisible";
   $scope.popUpWalk3 ="invisible";
   //start walk buttons
   $scope.startWalk1Button = "display_none";
   $scope.startWalk2Button = "display_none";
   $scope.startWalk3Button = "display_none";
   
   //GLOBAL VARIABLES
	var infoWindow;
    var watchID;
    var myLocation;
  	var startOfWalk;	//starting point of walks - direction to this point
	var start;			//current position
	var end;
	var directionsServiceToStart;
	
	//MARKER ARRAYS
	var pointMarker = new Array();//array of markers
	var infoWindows = new Array(); //array of infoWindows
	var infoMarkers = new Array(); //array of locations
	var markerTitles = new Array(); //array of titles
	var markerContent = new Array(); //array of marker content

   $scope.mapCreated = function(map) {
	   
	   //create map
		$scope.map = map;
		
		//end of walk marker
		marker2 = new google.maps.Marker({
			map: $scope.map,
			icon: 'img/end2.png'
		});
		
		//start of walk marker
		marker1 = new google.maps.Marker({
			map: $scope.map,
			icon: 'img/start2.png'
		});
		
		//current position marker
		hereMarker = new google.maps.Marker({
			map: $scope.map,
			icon: 'img/here2.png'
		});
		
		hereMarker.setMap(null);
		directionsDisplay = new google.maps.DirectionsRenderer({ //direction to starting point of walk
			suppressMarkers: true,
			polylineOptions: {
				strokeWeight: 6,
				strokeOpacity: 0.6,
				Zindex: 999
			}
		}); 
		
		/*INFO MARKERS*/
		infoMarkers[0] = new google.maps.LatLng(53.269774, -9.053511);
		infoMarkers[1] = new google.maps.LatLng(53.270152, -9.055572);
		infoMarkers[2] = new google.maps.LatLng(53.270212, -9.055938);
		infoMarkers[3] = new google.maps.LatLng(53.271781, -9.055738);
		infoMarkers[4] = new google.maps.LatLng(53.273190, -9.054502);
		infoMarkers[5] = new google.maps.LatLng(53.274922, -9.055221);
		infoMarkers[6] = new google.maps.LatLng(53.275581, -9.056103);
		infoMarkers[7] = new google.maps.LatLng(53.275166, -9.057543);
		infoMarkers[8] = new google.maps.LatLng(53.269774, -9.058511);
		infoMarkers[9] = new google.maps.LatLng(53.271538, -9.059155);
		infoMarkers[10] = new google.maps.LatLng(53.271555, -9.056464);
		infoMarkers[11] = new google.maps.LatLng(53.270221, -9.057646);
		infoMarkers[12] = new google.maps.LatLng(53.273912, -9.057553);
		
		markerTitles[0] = 'Galway Museum';
		markerTitles[1] = 'Wolfe Tone Bridge';
		markerTitles[2] = 'Fisheries Tower';	
		markerTitles[3] = 'OBriens Bridge';
		markerTitles[4] = 'Nora Barnacle House';
		markerTitles[5] = 'Kings Gap';
		markerTitles[6] = 'Salmon Weir Bridge';
		markerTitles[7] = 'Galway Cathederal';
		markerTitles[8] = 'Poor Clares Convent';
		markerTitles[9] = 'Parkavara';
		markerTitles[10] = 'Bridge Mills';
		markerTitles[11] = 'Ballsbridge';
		markerTitles[12] = 'Island House';
		
		markerContent[0] = "<h5>Galway Museum</h5>The Galway City Museum is a museum in Galway City, County Galway, Ireland. It was founded on 29 July 2006, and is located beside the Spanish Arch. The official website for the museum was launched on 27 November 2008.";
		markerContent[1] = "<h5>Wolfe Tone Bridge</h5>The Wolfe Tone bridge is the second oldest bridge over the river. It links the Docks area on the eastern side of town to the Claddagh and Salthill on the west.";
		markerContent[2] = "<h5>Fisheries Tower</h5>The iconic tower located beside the Fishermans Wharf. Built in 1852 the Fishery Tower was originally a draft netting station and a look out tower. Recently it was used as a museum/exhibition space until the bridge became unsafe";	
		markerContent[3] = "<h5>OBriens Bridge</h5>The oldest of the bridges is The William OBrien Bridge, which is commonly known as OBriens Bridge. It links the city centre on the east side to the quieter western end.";
		markerContent[4] = "<h5>Nora Barnacle House</h5>The house was derelict for much of the past two decades, until in 1987 it was purchased by Mary and Sheila Gallagher who restored it to its turn of the century condition and opened it to the public.";
		markerContent[5] = "<h5>Kings Gap</h5>River Corrib (Galway River) at King's Gap Looking upstream towards Galway Cathedral (Cathedral of Our Lady Assumed into Heaven and St Nicholas). The landing stage at this location is mostly submerged by the very high river.";
		markerContent[6] = "<h5>Salmon Weir Bridge</h5>The Salmon Weir Bridge is a newer bridge that the two discussed above. It was built in 1818. At that time there was a gaol on the western side of the river where Galway Cathedral now stands.";
		markerContent[7] = "<h5>Galway Cathederal</h5>The Cathedral of Our Lady Assumed into Heaven and St Nicholas, commonly known as Galway Cathedral, is a Roman Catholic cathedral in Galway, Ireland, and is one of the largest and most impressive buildings in the city.";
		markerContent[8] = "<h5>Poor Clares Convent</h5>";
		markerContent[9] = "<h5>Parkavara</h5>";
		markerContent[10] = "<h5>Bridge Mills</h5>The Bridge Mills is situated just past O'Brien's Bridge, on the banks of the river Corrib. The sight of this picturesque building, with its cut-stone facade (which has been beautifully restored) is truly remarkable.";
		markerContent[11] = "<h5>Ballsbridge</h5>";
		markerContent[12] = "<h5>Island House</h5>Located beside the Galway theater.";
		
		//create number of markers based on infoMarkers.length
		for(var i=0; i<infoMarkers.length; i++){
			pointMarker[i] = new google.maps.Marker({
				icon: 'img/infoicon.png',
				title: markerTitles[i],
				position: infoMarkers[i]
			});
				
			infoWindows[i] = new google.maps.InfoWindow({
				content: markerContent[i]
			});
			
			infoWindow = new google.maps.InfoWindow;
			
			//adds info windows, with content
			google.maps.event.addListener(pointMarker[i], 'click', (function(i) {
				return function(){
					infoWindow.close();
					infoWindow = infoWindows[i];
					infoWindow.open(map,pointMarker[i]);
				}
			})(i));
		}
    };

    
   /***************************/
   
	//TABS
	//1.Green Tab
	$scope.showRoute1 = function() {
		//set start/end markers
		startOfWalk = new google.maps.LatLng(53.2697578, -9.0535053);
		end = new google.maps.LatLng(53.270013, -9.055799);	
		marker1.setPosition(startOfWalk);
		marker2.setPosition(end);
		//display route
		directionsDisplayRoute2.setMap(null);
		directionsDisplayRoute3.setMap(null);
        directionsDisplayRoute1.setMap($scope.map);
		//get distance from start
		$scope.distance = "Press refresh button on the left";
		$scope.distanceFromMe();
		//display details
		$scope.number = "Walk 1";
		$scope.imagewalk ="walkgreen";
		$scope.totalDistance = "Total Distance: 3.5km";
		//display buttons
		$scope.hidden ="display";
		//change colours of buttons
		$scope.button_class="button-green2";
		$scope.refresh_button_class="refresh-green2";
		//display start walk button
		$scope.startWalk1Button = "display";
		$scope.startWalk2Button = "display_none";
		$scope.startWalk3Button = "display_none";
    };
	
	//2.Red Tab
	$scope.showRoute2 = function() {
		//set start/end markers
		startOfWalk = new google.maps.LatLng(53.271781, -9.055724);
		end = new google.maps.LatLng(53.271647, -9.056333);	;	
		marker1.setPosition(startOfWalk);
		marker2.setPosition(end);
		//display route
		directionsDisplayRoute1.setMap(null);
		directionsDisplayRoute3.setMap(null);
        directionsDisplayRoute2.setMap($scope.map);
		//get distance from start
		$scope.distance = "Press refresh button on the left";
		$scope.distanceFromMe();
		//display details
		$scope.number = "Walk 2";
		$scope.imagewalk ="walkred";
		$scope.totalDistance = "Total Distance: 0.75km";
		//display buttons
		$scope.hidden ="display";
		//change colours of buttons
		$scope.button_class="button-red2";
		$scope.refresh_button_class="refresh-red2";
		//display start walk button
		$scope.startWalk2Button = "display";
		$scope.startWalk1Button = "display_none";
		$scope.startWalk3Button = "display_none";
    };
	
	//3.Blue Tab
	$scope.showRoute3 = function() {
		//set start/end markers
		startOfWalk = new google.maps.LatLng(53.275410, -9.056859);
		end = new google.maps.LatLng(53.275305, -9.056818);
		marker1.setPosition(startOfWalk);
		marker2.setPosition(end);
		//display route
		directionsDisplayRoute2.setMap(null);
		directionsDisplayRoute1.setMap(null);
        directionsDisplayRoute3.setMap($scope.map);
		//get distance from start
		$scope.distance = "Press refresh button on the left";
		$scope.distanceFromMe();
		//display details
		$scope.number = "Walk 3";
		$scope.imagewalk ="walkblue";
		$scope.totalDistance = "Total Distance: 0.6km";
		//display buttons
		$scope.hidden ="display";
		//change colours of buttons
		$scope.button_class="button-blue2";
		$scope.refresh_button_class="refresh-blue2";
		//display start walk button
		$scope.startWalk3Button = "display";
		$scope.startWalk2Button = "display_none";
		$scope.startWalk1Button = "display_none";
    };
	
  $scope.toggleLeft = function(){
	 $ionicSideMenuDelegate.toggleLeft();
  }
  
  
  /*****************************/
  
 //BUTTONS
 
   //start walk buttons
   //WALK 1
    $scope.startWalk1 = function() {
		$scope.popUpLayer ="display";
		$scope.popUpWalk1 ="visible";
		$scope.popUpWalk2 ="invisible";
		$scope.popUpWalk3 ="invisible";
	};
	
	//WALK 2
    $scope.startWalk2 = function() {
		$scope.popUpLayer ="display";
		$scope.popUpWalk2 ="visible";
		$scope.popUpWalk1 ="invisible";
		$scope.popUpWalk3 ="invisible";
	};
	
	//WALK 3
    $scope.startWalk3 = function() {
		$scope.popUpLayer ="display";
		$scope.popUpWalk3 ="visible";
		$scope.popUpWalk2 ="invisible";
		$scope.popUpWalk1 ="invisible";
	};

	//back to map button
	$scope.backToMap = function() {
		$scope.popUpWalk1 ="invisible";
		$scope.popUpWalk2 ="invisible";
		$scope.popUpWalk3 ="invisible";
		$scope.popUpLayer ="display_none";
	};
 
  //1.ShowLocationToggle - 1.Display refresh button, 2.get loctation, 3.display marker, 4.Set current location as center/ 1.hide marker, 2.hide refresh button
  $scope.showLocation = { checked: false };
  $scope.showLocationToggle = function() {
    if($scope.showLocation.checked==false){
		$scope.hidden_refresh = "display"
		$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.map.setCenter(myLocation);
	}
	if($scope.showLocation.checked==true && $scope.direcctionsToStart.checked==false){
		$scope.hidden_refresh="display_none";
		hereMarker.setMap(null);
        var mapOptions = {
			center: startOfWalk,
			zoom: 17
		};
		$scope.map.setOptions(mapOptions);
	}
  }; // end of ToggleShowMyLocation
  
  
  
  //2.refresh button - 1.gets position, 2.refreshes "you are here" marker, 3.sets current location as center of map
  $scope.refreshButton = function(){
	  	$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.map.setCenter(myLocation);
		
		//if "show direction to start" is on, then refresh directions.
		if($scope.direcctionsToStart.checked==true){
			$scope.getDirectionsToStart();
		}
  }//end of refreshButton
  
  //3.DistanceFromMe button - gets distance from current location
  $scope.distanceFromMe = function () { 
	//if "show my location" is turned on - center on current location
	if($scope.showLocation.checked==true && $scope.direcctionsToStart.checked==false){ 
		$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.map.setCenter(myLocation);
	}
	  
    console.log("Centering");
    if (!$scope.map) {
      return;
    }		
    $scope.loading = $ionicLoading.show({
    template: '<button class="button icon-left button button-clear ion-close-circled" ng-click="$root.cancel();">Getting Current Loocation...</button>' });
	navigator.geolocation.getCurrentPosition(function (pos){
      console.log('Got pos', pos);
	  directionsServiceToStart = new google.maps.DirectionsService();
	  myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	  start = myLocation;
		var request = {
			origin: start,
			destination: startOfWalk,
			travelMode: google.maps.DirectionsTravelMode.WALKING
		};
		directionsServiceToStart.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
				var dist = response.routes[0].legs[0].distance.value / 1000 + "km";
				$scope.distance = dist;
			}
				
			else{
				$scope.distance = "Couldnt get distance";
			}
		});
       $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  };//end of DistanceFromMe 
  //loading cancel
  
  
  
  //4. DirecctionsToStartToggle - 1.show refresh button, 2.get location, 3. show "you are here" marker, 4.Show directions to starting point 
  $scope.direcctionsToStart = { checked: false };
  $scope.direcctionsToStartToggle = function() {
    if($scope.direcctionsToStart.checked==false){
		$scope.hidden_refresh = "display"
		$scope.getDirectionsToStart();
	}
	//if "show my location" is false, set center of map to start of walk
	if($scope.direcctionsToStart.checked==true && $scope.showLocation.checked==false){
		$scope.hidden_refresh="display_none";
		hereMarker.setMap(null);
		directionsDisplay.setMap(null);
		var mapOptions = {
			center: startOfWalk,
			zoom: 17
		};
		$scope.map.setOptions(mapOptions);
	}
	//if "show my location" is true, set center of map to myLocation
	if($scope.direcctionsToStart.checked==true && $scope.showLocation.checked==true){
		directionsDisplay.setMap(null);
		var mapOptions = {
			center: myLocation,
			zoom: 15
		};
		$scope.map.setOptions(mapOptions);
	}
  }; // end of DirecctionsToStartToggle
  $scope.getDirectionsToStart = function() {
		$scope.getPos();
		hereMarker.setMap($scope.map);
		$scope.distanceFromMe();
		directionsDisplay.setMap($scope.map);
  }; // end of DirecctionsToStart
  
  
  
  //5.ShowLandmarksToggle - show/hide landmarks icons
  $scope.showLandmarks = { checked: false };
  $scope.showLandmarksToggle = function() {
	//show landmarks
    if($scope.showLandmarks.checked==false){
		for(var i=0; i<infoMarkers.length; i++){	
			pointMarker[i].setMap($scope.map);
		}
	}
	//hide landmarks
	if($scope.showLandmarks.checked==true){
		for(var i=0; i<infoMarkers.length; i++){	
			pointMarker[i].setMap(null);
		}
	}
  }; // end of ToggleShowMyLocation



  //GET CURRENT LOCATION - REFRESHES EVERY 10 SECONDS
  $scope.getPos = function () {
    console.log("Centering");
    if (!$scope.map) {
      return;
    }
    $scope.loading = $ionicLoading.show({
    template: '<button class="button icon-left button button-clear ion-close-circled" ng-click="$root.cancel();">Getting Current Loocation...</button>' });


      navigator.geolocation.getCurrentPosition(function (pos) {
      console.log('Got pos', pos);
	   myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
	   hereMarker.setPosition(myLocation); 
		  
	  //refresh every 10 seconds
	  setInterval(function(){ 
		  myLocation = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
		  hereMarker.setPosition(myLocation);
		},10000);
	  
	  
	  $scope.map.setCenter(myLocation);
      $scope.loading.hide();
    }, function (error) {
      alert('Unable to get location: ' + error.message);
    });
  }; 
});

/**********************************************/

//DIRECTIVES
app.directive('map', function() {
  return {
    restrict: 'E',
    scope: {
      onCreate: '&'
    },
    link: function ($scope, $element, $attr) {
		
	var directionsService = new google.maps.DirectionsService({
		 
	});     //Create a DirectionsService object which is required to communicate with the Google Maps API Direction Service
	var map;
	
	var route1 = [
		new google.maps.LatLng(53.277121, -9.053788),
		new google.maps.LatLng(53.275740, -9.058380),
		new google.maps.LatLng(53.274668, -9.061309),
		new google.maps.LatLng(53.271493, -9.059161),
		new google.maps.LatLng(53.271932, -9.058191),
		new google.maps.LatLng(53.271533, -9.056798),
		new google.maps.LatLng(53.270590, -9.057333)
	];
	
	var route2 = [
		new google.maps.LatLng(53.271542, -9.056760),
		new google.maps.LatLng(53.270349, -9.058045),
		new google.maps.LatLng(53.271972, -9.060620),
		new google.maps.LatLng(53.272030, -9.058323)
	];
	
	var route3 = [
		new google.maps.LatLng(53.275771, -9.058126),
		new google.maps.LatLng(53.273788, -9.057207)
	];
	
      function initialize() {
		var galway = new google.maps.LatLng(53.273361, -9.057331);
        var mapOptions = {
			center: galway,
			zoom: 15
		};
	
		map = new google.maps.Map($element[0], mapOptions);
		
	
		//Create a DirectionsRenderer object to render the directions results
		directionsDisplayRoute1= new google.maps.DirectionsRenderer({
			//preserveViewport: true,
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "#00cc00",
				strokeWeight: 6,
				strokeOpacity: 0.7,
				Zindex: 1,
			}
		});  
		
		directionsDisplayRoute2 = new google.maps.DirectionsRenderer({
			//preserveViewport: true,
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "red",
				strokeWeight: 6,
				strokeOpacity: 0.6,
				Zindex: 1
				
			}
		}); 
		
		
		directionsDisplayRoute3 = new google.maps.DirectionsRenderer({
			//preserveViewport: true,
			suppressMarkers: true,
			polylineOptions: {
				strokeColor: "blue",
				strokeWeight: 6,
				strokeOpacity: 0.6,
				Zindex: 1
			}
		}); 
			
		var waypointsRoute1 = [];
		for (var i = 0; i < route1.length; i++) {
			var address = route1[i];
			if (address !== "") {
				waypointsRoute1.push({
					location: address,
					stopover: false
				});
			}
		}
		
		var waypointsRoute2 = [];
		for (var i = 0; i < route2.length; i++) {
			var address = route2[i];
			if (address !== "") {
				waypointsRoute2.push({
					location: address,
					stopover: false
				});
			}
		}
		
		var waypointsRoute3 = [];
		for (var i = 0; i < route3.length; i++) {
			var address = route3[i];
			if (address !== "") {
				waypointsRoute3.push({
					location: address,
					stopover: false
				});
			}
		}
		
		
		
		var startRoute1 = new google.maps.LatLng(53.269840, -9.053495);     //Set the source/ origin
		var endRoute1 = new google.maps.LatLng(53.270013, -9.055799);  //Set the destination
		
		var startRoute2 = new google.maps.LatLng(53.271781, -9.055724);     //Set the source/ origin
		var endRoute2 = new google.maps.LatLng(53.271647, -9.056333);  //Set the destination
		
		var startRoute3 = new google.maps.LatLng(53.275410, -9.056859);     //Set the source/ origin
		var endRoute3 = new google.maps.LatLng(53.275305, -9.056818);  //Set the destination
		
		var requestRoute1 =
		{
            origin:startRoute1,
            destination:endRoute1,
			waypoints: waypointsRoute1, //an array of waypoints
            optimizeWaypoints: false, //set to true if you want google to determine the shortest route or false to use the order specified.
            travelMode: google.maps.DirectionsTravelMode.WALKING //Default travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.

		};
		
		var requestRoute2 =
		{
            origin:startRoute2,
            destination:endRoute2,
			waypoints: waypointsRoute2, //an array of waypoints
            optimizeWaypoints: false, //set to true if you want google to determine the shortest route or false to use the order specified.
            travelMode: google.maps.DirectionsTravelMode.WALKING          //Default travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
		};
		
		var requestRoute3 =
		{
            origin:startRoute3,
            destination:endRoute3,
			waypoints: waypointsRoute3, //an array of waypoints
            optimizeWaypoints: false, //set to true if you want google to determine the shortest route or false to use the order specified.
            travelMode: google.maps.DirectionsTravelMode.WALKING          //Default travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
		};
		
		directionsService.route(requestRoute1, function(response, status)
		{
            if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
            {
            directionsDisplayRoute1.setDirections(response);         //Display the directions result
            }
		});
		
		directionsService.route(requestRoute2, function(response, status)
		{
            if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
            {
            directionsDisplayRoute2.setDirections(response);         //Display the directions result
            }
		});
		
		directionsService.route(requestRoute3, function(response, status)
		{
            if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
            {
            directionsDisplayRoute3.setDirections(response);         //Display the directions result
            }
		});

        $scope.onCreate({map: map});

        // Stop the side bar from dragging when mousedown/tapdown on the map
        google.maps.event.addDomListener($element[0], 'mousedown', function (e) {
          e.preventDefault();
          return false;
        });
		
		//directionsDisplayRoute1.setMap(map);	
	}
	
      if (document.readyState === "complete") {
        initialize();
      } else {
        google.maps.event.addDomListener(window, 'load', initialize);
      }
	  
    }
  }
});
