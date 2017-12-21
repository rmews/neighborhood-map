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
    this.name = ko.observable(data.name);
};

var map;

function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 38.297539,
            lng: -122.286865
        },
        zoom: 10
    });
}

var ViewModel = function() {
    var self = this;

    self.wineryList = ko.observableArray([]);

    wineries.forEach(function(winery) {
        self.wineryList.push(new Winery(winery));
    });
};

ko.applyBindings(new ViewModel());