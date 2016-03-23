/* =====================
Lab 1: Turf.js

"Our maps have only interpreted data in various ways; the point is to change it."


In the coming weeks, we'll be looking at ways to explore, analyze, and create data.
This will require us to build upon concepts that we've already mastered. Turf.js is a
javascript library which provides some excellent utilities for fast, in-browser
spatial analysis.

Recall that GeoJSON is a format for representing spatial objects in JSON. It encodes
not only the geometric entities themselves (Points, Lines, Polygons) but also associated
properties (these are the properties of Features) and collections thereof (FeatureGroups).

This is useful for sending spatial data over the wire (we can present these objects in text
since they are JSON). But the predictable structure of a geojson object (there are
infinitely many possible geojson objects, though they all meet the criteria specified
here: http://geojson.org/) also benefits us by offering a structure which our code can
expect.

Consider the functions you've written before: their input has depended on the type
of data they receive. If you write a function which expects an object that has an 'x' and
a 'y' property, you can access those within your function body:

function exampleFunction(someObject) {
  return someObject.x + someObject.y;
}
exampleFunction({x: 1, y: 22}) === 23

Turf leans on the predictable structure of geojson to provide its analytic functions.
Here, Turf lays out the types you can expect to find throughout its documentation:
http://turfjs.org/static/docs/global.html

Let's look to a turf function's docs: http://turfjs.org/static/docs/module-turf_average.html
==================================================================================================
name              - Type                        - Description
==================================================================================================
polygons          - FeatureCollection.<Polygon> - polygons with values on which to average
points            - FeatureCollection.<Point>   - points from which to calculate they average
field             - String                      - the field in the points features from which to
                                                  pull values to average
outputField       - String                      - the field in polygons to put results of the averages
==================================================================================================
Returns           - FeatureCollection.<Polygon> - polygons with the value of outField set to
                                                  the calculated averages
==================================================================================================

What this tells us is that turf.average takes four arguments. The first
argument is a FeatureCollection of Polygons, the second, is a FeatureCollection
of Points, the third and fourth is a bit of text.

With those inputs, a FeatureCollection of polygons is produced which has the average value
of "field" from the points (captured within a spatial join) stored on its properties' field
"outputField".

All of the functionality within turf can be similarly understood by looking to its documentation.
Turf documentation: http://turfjs.org/static/docs/
Turf examples: http://turfjs.org/examples.html


Each exercise in this lab involves the creation of GeoJSON (feel free to use geojson.io) and
the use of that GeoJSON in some turf functions.

NOTE: you can use geojson.io's table view to attach properties to your geometries!

Exercise 1: Finding the nearest point
Take a look at http://turfjs.org/static/docs/module-turf_nearest.html
Produce a Feature and a FeatureCollection (look to the in-documentation examples if this is
unclear) such that the single Point Feature is in Philadelphia and the nearest point in the
FeatureCollection (there should be at least two other points in this collection) happens
to be in New York City. Plot the NYC point and no others with the use of turf.nearest.
*/
var phillyPoint={"type":"Feature","properties":{"marker-color":"#0f0"},"geometry":{"type":"Point","coordinates":[-75.179443359375,39.9602803542957]}};
var nyPoints = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-73.9215087890625,40.81796653313175]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-72.9876708984375,41.701627343789184]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-72.2625732421875,40.967455873296714]}}]};

var nearest = turf.nearest(phillyPoint, nyPoints);
var long = nearest.geometry.coordinates[0];
var lat = nearest.geometry.coordinates[1];
L.marker([lat,long]).addTo(map);

/*
Exercise 2: Finding the average point value (a form of spatial join)
Docs here: http://turfjs.org/static/docs/module-turf_average.html
Produce one FeatureCollection of points (at least 5) and one of polygons (at least 2)
such that, by applying turf.average, you generate a new set of polygons in which one of
the polygons has the property "averageValue" with a value of 100.
*/

var nyPolygons = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"stroke":"#555555","stroke-width":2,"stroke-opacity":1,"fill":"#555555","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-74.0203857421875,40.70979201243498],[-74.1522216796875,41.47154438707647],[-73.3172607421875,41.45919537950706],[-72.9437255859375,40.74309523218185],[-74.0203857421875,40.70979201243498]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-74.14672851562499,41.46742831254425],[-73.6798095703125,41.80817277478235],[-73.114013671875,41.81636125072054],[-73.3172607421875,41.44272637767212],[-74.14672851562499,41.46742831254425]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[-73.125,41.79998325207397],[-72.257080078125,41.12074559016745],[-72.894287109375,40.75557964275591],[-73.125,41.79998325207397]]]}}]};
var nyPoints2 = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"income":150},"geometry":{"type":"Point","coordinates":[-73.7896728515625,41.22411753058293]}},{"type":"Feature","properties":{"income":20},"geometry":{"type":"Point","coordinates":[-73.4600830078125,41.32732632036622]}},{"type":"Feature","properties":{"income":100},"geometry":{"type":"Point","coordinates":[-72.850341796875,41.44272637767212]}},{"type":"Feature","properties":{"income":500},"geometry":{"type":"Point","coordinates":[-73.685302734375,41.57436130598913]}},{"type":"Feature","properties":{"income":400},"geometry":{"type":"Point","coordinates":[-73.289794921875,40.88029480552824]}},{"type":"Feature","properties":{"income":300},"geometry":{"type":"Point","coordinates":[-73.7347412109375,40.82212357516945]}}]};
var averaged = turf.average(nyPolygons, nyPoints2, 'income', 'inc_avg');
L.geoJson(averaged).addTo(map);


/*
Exercise 3: Tagging points according to their locations
http://turfjs.org/static/docs/module-turf_tag.html
It can be quite useful to 'tag' points in terms of their being within this or that
polygon. You might, for instance, want to color markers which represent dumpsters
according to the day that trash is picked up in that area. Create three polygons
and use properties on those polygons to color 5 points.
*/
var baltimorebox = [-76.9317626953125, 39.0831721934762,-76.431884765625,39.38101803294523];
//make polygons in box which have property fill:
var baltimorePoly = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"fill":["#755","south"]},"geometry":{"type":"Polygon","coordinates":[[[-76.904296875,39.0533181067413],[-76.904296875,39.16839998800286],[-76.2945556640625,39.16839998800286],[-76.2945556640625,39.0533181067413],[-76.904296875,39.0533181067413]]]}},{"type":"Feature","properties":{"fill":["#855","west"]},"geometry":{"type":"Polygon","coordinates":[[[-76.89880371093749,39.172658670429946],[-76.89880371093749,39.457402514270825],[-76.6021728515625,39.457402514270825],[-76.6021728515625,39.172658670429946],[-76.89880371093749,39.172658670429946]]]}},{"type":"Feature","properties":{"fill":["#585","east"]},"geometry":{"type":"Polygon","coordinates":[[[-76.5911865234375,39.172658670429946],[-76.5911865234375,39.44891948347229],[-76.300048828125,39.44891948347229],[-76.300048828125,39.172658670429946],[-76.5911865234375,39.172658670429946]]]}}]};

var randomPoints = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-76.75048828125,39.32579941789298]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-76.453857421875,39.26628442213066]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-76.6680908203125,39.20671884491848]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-76.5362548828125,39.11727568585595]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-76.83837890625,39.091699613104595]}}]};
var tagged = turf.tag(randomPoints, baltimorePoly,'fill', 'markercolor');

var oblist = tagged.features;
var myMarkers =[];

//this function was adapted from my midterm
var mapfunc = function(fd){_.each (fd, function(ob){
    var lat = ob.geometry.coordinates[1];
    var long = ob.geometry.coordinates[0];
    var fillC = ob.properties.markercolor[0];
    var locName = ob.properties.markercolor[1];
    myMarkers.push(L.circleMarker([lat,long],{opacity:1,fillColor:fillC,color: fillC, title:locName}).setRadius(5));
  });
  _.each(myMarkers, function(mark){
    mark.addTo(map).bindPopup(mark.options.title);
  });
};

mapfunc(oblist);


/*
*STRETCH GOAL*
Exercise 4: Calculating a destination
A species of bird we're studying is said to travel in a straight line for 500km
during a migration before needing to rest. One bird in a flock we want to track
has a GPS tag which seems to be on the fritz. We know for a fact that it started
flying from [-87.4072265625, 38.376115424036016] and that its last known coordinate
was [-87.5830078125, 38.23818011979866]. Given this information, see if you can
determine where we can expect this flock of birds to rest.
===================== */
