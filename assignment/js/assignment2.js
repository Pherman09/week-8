/* =====================
# Week 8, Assignment

Create an interactive application using Leaflet Draw and Turf.js. The
application should meet either sets of the requirements below. You should work
with the following dataset: [Cambridge Public Art locations](https://github.com/cambridgegis/cambridgegis_data/blob/master/Landmark/Public_Art/LANDMARK_PublicArt.geojson).

## Variation Two:

- The user adds a marker on the map
- The five closest points should be represented as separate elements in the sidebar
- When the user clicks on an element in the sidebar, the corresponding point on
the map should become highlighted
===================== */

// Global Variables
var myPoints = [];
cambridgejs.features = _.filter(cambridgejs.features, function(f) { return f.geometry; });
var turfFilter = cambridgejs.features;
var turfFeat = turf.featurecollection(turfFilter);
var pointsOfInterest = [];

// Initialize Leaflet Draw
var drawControl = new L.Control.Draw({
  draw: {
    polyline: false,
    polygon: false,
    circle: false,
    marker: true,
    rectangle: false,
  }
});

map.addControl(drawControl);
selectMarkers =[];

//Add all markers to map
var mapfunc = function(fd,colorM){_.each (fd, function(ob){
  lat = ob.geometry.coordinates[1];
  long = ob.geometry.coordinates[0];
  titleArt = ob.properties.Title;
  selectMarkers.push(L.circleMarker([lat,long],{opacity:1,title:titleArt, color:colorM,fillColor:colorM}).setRadius(5));
  });
  _.each(selectMarkers, function(mark){
    mark.addTo(map).bindPopup(mark.options.title);
  });
};

mapfunc(turfFilter,"#90C3D4");


var helperNearFunc = function(drawnpoint,collectionOfPoints){
  var nearest1 = turf.nearest(drawnpoint,collectionOfPoints);
  nearid = nearest1.id;
  var featuresList = collectionOfPoints.features;
  pointsOfInterest.push(nearest1);
  featuresList = _.filter(featuresList,function(ob) { return ob.id != nearid;});
  return turf.featurecollection(featuresList);
};

//Find the five closest points, and make a new feature collection out of them
var nearestFive = function(drawnpoint,collectionOfPoints){
  var collection1 = helperNearFunc(drawnpoint,collectionOfPoints);
  var collection2 = helperNearFunc(drawnpoint,collection1);
  var collection3 = helperNearFunc(drawnpoint,collection2);
  var collection4 = helperNearFunc(drawnpoint,collection3);
  var collection5 = helperNearFunc(drawnpoint,collection4);
  return pointsOfInterest;
};


//function that builds html in sidebar
var sidebarFunc = function(geojsonList){
  _.each(geojsonList,function(p){
    var neartitle = p.properties.Title;
    var neardId = "'" + p.id  + "'";
    var htmlstring = '<div class="shape" id=' + neardId  + '><h1>'+ neartitle + '</h1></div>';
    $("#shapes").append(htmlstring);
    var querycall = "#"+p.id.toString();
    $(querycall).click(function() {
      console.log(p.id);
      var pointOfInterest =_.filter(pointsOfInterest,function(ob) { return ob.id === p.id;});
      mapfunc(pointOfInterest,"#ED00F5");//Marker with id matching nearID changes color to pink
    });
  });
};

// Run every time Leaflet draw creates a new layer
map.on('draw:created', function (e) {
    var type = e.layerType; // The type of shape
    var layer = e.layer; // The Leaflet layer for the shape
    var id = L.stamp(layer); // The unique Leaflet ID for the layer
    myPoints.unshift(layer);
    map.addLayer(myPoints[0]);
    $("#shapes").empty();
    if(myPoints.length > 1){
      map.removeLayer(myPoints[1]);
      myPoints = myPoints.slice(0,1);
    }
    var lat = myPoints[0]._latlng.lat;
    var lng = myPoints[0]._latlng.lng;
    var turfPoint = turf.point([lng, lat]);
    pointsOfInterest = [];
    nearestFive(turfPoint,turfFeat);
    sidebarFunc(pointsOfInterest);
});
