// Model

// These are winery locations
// Normally these would be loaded from a server-side code.
var wineries = [
    {
        name: 'Cakebread Cellars',
        location: {
            lat: 38.447749,
            lng: -122.411996
        }
    },
    {
        name: 'Schweiger Vineyards',
        location: {
            lat: 38.526677,
            lng: -122.544967
        }
    },
    {
        name: 'VIADER Vineyards & Winery',
        location: {
            lat: 38.559242,
            lng: -122.473520
        }
    },
    {
        name: 'Ledson Winery and Vineyards',
        location: {
            lat: 38.441556,
            lng: -122.586264
        }
    },
    {
        name: 'Hanzell Vineyards',
        location: {
            lat: 38.313342,
            lng: -122.462341
        }
    }
];

var Winery = function(data) {
    this.name = data.name;
};


////////// Google Maps API /////////

// global map variable
var map;

// blank array for map markers
var markers = [];

// initialize map
function initMap() {
    // Constructor creates a new map
    map = new google.maps.Map(document.getElementById('map'), {
        // center the map
        center: {
            lat: 38.297539,
            lng: -122.286865
        },
        // set zoom level for map
        zoom: 10
    });

    var bounds = new google.maps.LatLngBounds();

    // loop through locations and set markers
    for (var i = 0; i < wineries.length; i++) {
        // Get the location and name from wineries array.
        var location = wineries[i].location;
        var name = wineries[i].name;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: name,
            animation: google.maps.Animation.DROP
          });

        // Push the marker to the array of markers.
        markers.push(marker);

        // extend boundries of map for each marker
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}


////////// View Model //////////

var ViewModel = function() {
    var self = this;

    // set empty observable array
    self.wineryList = ko.observableArray([]);

    // call on the locations and push to observable array
    wineries.forEach(function(winery) {
        self.wineryList.push(new Winery(winery));
    });
};

ko.applyBindings(new ViewModel());