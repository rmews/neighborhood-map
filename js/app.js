//////////////////// Model ////////////////////

// These are winery locations.
// Normally these would be loaded from a server-side code.
// the id is a Foursquare id for use in showing Foursquare venue info
var wineries = [
    {
        id: '4b1e9c1ef964a520841c24e3',
        name: 'Cakebread Cellars',
        address: '8300 St. Helena Hwy, Rutherford, CA 94573',
        location: {
            lat: 38.447749,
            lng: -122.411996
        }
    },
    {
        id: '4bd226a0046076b0505d7371',
        name: 'Schweiger Vineyards',
        address: '4015 Spring Mountain Rd, Saint Helena, CA 94574',
        location: {
            lat: 38.526677,
            lng: -122.544967
        }
    },
    {
        id: '4b7f516cf964a520322730e3',
        name: 'VIADER Vineyards & Winery',
        address: '1120 Deer Park Rd, Deer Park, CA 94576',
        location: {
            lat: 38.559242,
            lng: -122.473520
        }
    },
    {
        id: '4ad648b5f964a520510621e3',
        name: 'Ledson Winery and Vineyards',
        address: '7335 Sonoma Hwy, Kenwood, CA 95409',
        location: {
            lat: 38.441556,
            lng: -122.586264
        }
    },
    {
        id: '4bfeee674e5d0f4754627d1f',
        name: 'Hanzell Vineyards',
        address: 'Sonoma, CA 95476',
        location: {
            lat: 38.313342,
            lng: -122.462341
        }
    },
    {
        id: '4a342dd7f964a520da9b1fe3',
        name: 'Inglenook Vineyards',
        address: '1991 St. Helena Hwy., Rutherford, CA 94558',
        location: {
            lat: 38.4554656,
            lng: -122.4327571
        }
    },
    {
        id: '4a624a05f964a520a9c31fe3',
        name: 'Simi Winery',
        address: '16275 Healdsburg Ave, Healdsburg, CA 95448',
        location: {
            lat: 38.6401875,
            lng: -122.8580496
        }
    },
    {
        id: '4bef8b3eada6b713f7562206',
        name: 'Bravante Vineyards',
        address: '300 Stone Ridge Rd, Angwin, CA 94508',
        location: {
            lat: 38.568529,
            lng: -122.462370
        }
    },
    {
        id: '4afdb7faf964a520242a22e3',
        name: 'Beringer Vineyards',
        address: '2000 Main St, Saint Helena, CA 94574',
        location: {
            lat: 38.510173,
            lng: -122.479886
        }
    }
];


//////////////////// Google Maps API ///////////////////

// global map variable to use outside our intialize map function.
var map;

// global markers array to use outside initialize map function.
// used primaryly for extending the map bounds.
// It is empty now, but we will loop through our model to populate the markers.
var markers = [];

// initialize the map canvas.
function initMap() {
    // Constructor creates a new map.
    map = new google.maps.Map(document.getElementById('map'), {
        // center the map.
        center: {
            lat: 38.297539,
            lng: -122.286865
        },
        // set zoom level for map.
        zoom: 10
    });

    // initialize boundry method for map.
    var bounds = new google.maps.LatLngBounds();

    // initialize info window for markers.
    var infowindow = new google.maps.InfoWindow();

    // loop through locations and set marker properties.
    for (var i = 0; i < wineries.length; i++) {
        var location = wineries[i].location;
        var name = wineries[i].name;
        var address = wineries[i].address;
        var id = wineries[i].id;

        // Create a marker object per location.
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            title: name,
            address: address,
            id: id,
            animation: google.maps.Animation.DROP
          });

        // Add marker property to winery object.
        wineries[i].marker = marker;

        // Push the marker to the array of markers.
        markers.push(marker);

        // extend boundries of map for each marker.
        bounds.extend(markers[i].position);
        // bounds.extend(marker.position);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            markerBounce(this, marker);
            populateInfoWindow(this, infowindow);
        });
    }

    // Extend the boundaries of the map for each marker.
    map.fitBounds(bounds);

    // call the view model once map has been and markers have been initialized.
    ko.applyBindings(new ViewModel());
}


// This function populates the infowindow when the marker is clicked.
// Populate info based on the markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // set infowindow to marker being called
        infowindow.marker = marker;

        // Foursquare API
        var clientID = '4CL4BEGBPOTRVNIWQWBBAD13SHIVJXM3OBBTIUMHGFGZY3FW';
        var clientSecret = 'QQZNO4MRVWQZVCMPBZGHPZ51SUASOJBZD1WWNYVZW41GTJND';
        var version = '20170801';
        var id = marker.id;
        var url = 'https://api.foursquare.com/v2/venues/';
        url += id;
        url += '?' + $.param({
            'client_id': clientID,
            'client_secret': clientSecret,
            'v': version
        });

        // Parse Foursquare JSON data
        $.ajax({
            url: url,
            success: function(data) {
                // get foursquare rating
                marker.rating = data.response.venue.rating;
                // construct url for image
                marker.photo = data.response.venue.bestPhoto.prefix + '80x80' + data.response.venue.bestPhoto.suffix;
                infowindow.setContent('<div class="container">' +
                                        '<div class="row">' +
                                            '<h5>' + marker.title + '</h5>' +
                                        '</div>' +
                                        '<div class="row">' +
                                            '<p>' + marker.address + '</p>' +
                                        '</div>' +
                                        '<div class="row">' + (typeof marker.rating !== 'undefined' ?
                                            '<p>Foursquare Rating: ' + marker.rating + '</p>' :
                                            '<p>Foursquare Rating: no ratings</p>') +
                                        '</div>' +
                                        '<div class="row">' +
                                            '<img src="' + marker.photo + '" class="img-thumbnail">' +
                                        '</div>' +
                                    '</div>');
                infowindow.open(map, marker);
            },
            // handle error with calling Foursquare API.
            // we still display the title and address, but display error message.
            error: function(error) {
                infowindow.setContent('<div class="container">' +
                                        '<div class="row">' +
                                            '<h5>' + marker.title + '</h5>' +
                                        '</div>' +
                                        '<div class="row">' +
                                            '<p>' + marker.address + '</p>' +
                                        '</div>' +
                                        '<div class="row">' +
                                            '<p>Foursquare Rating: Sorry...Foursquare cannot be reached right now</p>' +
                                        '</div>' +
                                    '</div>');
                infowindow.open(map, marker);
            }
        });

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}

// This function makes the marker bounce when called.
function markerBounce(marker) {
    if (marker.getAnimation() === null) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1500);
    } else {
        marker.setAnimation(google.maps.Animation.NULL);
    }
}

// Our winery object.
var Winery = function(data) {
    // make name observable for query.
    this.name = ko.observable(data.name);
    this.address = data.address;
    this.location = data.location;
    this.marker = data.marker;
};

//////////////////// View Model ////////////////////

var ViewModel = function() {
    var self = this;

    // set empty observable array on our wine locations.
    this.wineryList = ko.observableArray([]);

    // call on the locations and push to observable array.
    wineries.forEach(function(winery) {
        self.wineryList.push(new Winery(winery));
    });

    // currently selected winery
    this.currentWinery = ko.observable(this.wineryList()[0]);

    // function to listen for click event
    this.setWinery = function(clickedWinery) {
        self.currentWinery(clickedWinery);
    };

    // display marker based on selected wine location.
    this.showMarker = function(location) {
        google.maps.event.trigger(location.marker, 'click');
    };

    // set empty observable to wait for search query.
    this.query = ko.observable('');

    // filter the winery list based on observable name from input box
    // credit for filter function: https://stackoverflow.com/questions/47741328/filtering-list-with-knockout.
    // credit for sort based on alpha ordering credit: https://stackoverflow.com/questions/12718699/sorting-an-observable-array-in-knockout
    this.filteredLocations = ko.computed(function() {
        if (!self.query()) {
            return self.wineryList().sort(function(l, r) {
                return l.name() > r.name() ? 1 : -1;
            });
        } else {
            return self.wineryList().filter(location => location.name().toLowerCase().indexOf(self.query().toLowerCase()) > -1).sort(function(l, r) {
                return l.name() > r.name() ? 1 : -1;
            });
        }
    });
};