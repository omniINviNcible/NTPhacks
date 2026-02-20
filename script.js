const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

const busIcon = L.divIcon({
    html: `<div style="font-size: 24px;">🚌</div>`,
    className: 'custom-bus-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

// Expanded Data: City-specific routes
const transportData = {
    "Delhi": {
        lat: 28.6139, lng: 77.2090, buses: 142, routes: 8, arrival: "6 mins",
        paths: {
            "R1": [[28.6139, 77.2090], [28.6250, 77.2200], [28.6350, 77.2350]],
            "R2": [[28.6139, 77.2090], [28.6000, 77.1900], [28.5850, 77.1750]],
            "R3": [[28.6139, 77.2090], [28.6300, 77.2100], [28.6500, 77.2200]],
            "R4": [[28.6139, 77.2090], [28.6100, 77.2300], [28.6150, 77.2500]]
        }
    },
    "Mumbai": {
        lat: 19.0760, lng: 72.8777, buses: 98, routes: 5, arrival: "12 mins",
        paths: {
            "M1": [[19.0760, 72.8777], [19.0850, 72.8850], [19.0950, 72.8950]],
            "M2": [[19.0760, 72.8777], [19.0650, 72.8650], [19.0550, 72.8550]]
        }
    }
    ,
    "Bangalore": {
        lat: 12.9716,
        lng: 77.5946,
        buses: 110,
        routes: 4,
        arrival: "9 mins",
        paths: {
            "B1": [
                [12.9716, 77.5946],
                [12.9800, 77.6000],
                [12.9900, 77.6100]
            ],
            "B2": [
                [12.9716, 77.5946],
                [12.9600, 77.5850],
                [12.9500, 77.5750]
            ],
            "B3": [
                [12.9716, 77.5946],
                [12.9750, 77.5800],
                [12.9850, 77.5700]
            ],
            "B4": [
                [12.9716, 77.5946],
                [12.9900, 77.6200],
                [13.0000, 77.6300]
            ]
        }
    }
};


let busLayer = L.layerGroup().addTo(map);
let userMarker = null;

function spawnNearbyBuses(centerLat, centerLng, cityName) {
    busLayer.clearLayers();
    for (let i = 1; i <= 4; i++) {
        let bLat = centerLat + (Math.random() - 0.5) * 0.02;
        let bLng = centerLng + (Math.random() - 0.5) * 0.02;
        let busNo = "TX-" + (400 + i);
        let type = i % 2 === 0 ? "Electric AC" : "CNG Standard";

        let marker = L.marker([bLat, bLng], { icon: busIcon }).addTo(busLayer);

        marker.on('click', () => {
            document.getElementById('detBusNo').innerText = busNo;
            document.getElementById('detType').innerText = type;
            document.getElementById('detRoute').innerText = "Live Route " + i;
            document.getElementById('mapWrapper').classList.add('active');
            map.panTo([bLat, bLng]);
            setTimeout(() => map.invalidateSize(), 400);
        });
        marker.bindTooltip(busNo, { direction: 'top', className: 'bus-label' });
    }
}

// FIX: Dynamically update Route Dropdown based on city selection
document.getElementById('city').addEventListener('change', (e) => {
    const city = e.target.value;
    const routeSelect = document.getElementById('routeSelect');

    // Clear existing routes
    routeSelect.innerHTML = '<option value="">Select Route</option>';

    if (transportData[city]) {
        const d = transportData[city];
        document.getElementById('buses').innerText = d.buses;
        document.getElementById('activeRoutes').innerText = d.routes;
        document.getElementById('arrivalTime').innerText = d.arrival;

        map.flyTo([d.lat, d.lng], 13);
        spawnNearbyBuses(d.lat, d.lng, city);

        // Add specific routes to the dropdown
        Object.keys(d.paths).forEach(key => {
            let opt = document.createElement('option');
            opt.value = key;
            opt.innerHTML = `Route ${key} (${city})`;
            routeSelect.appendChild(opt);
        });

        document.getElementById('location').innerText = `📍 Status: Viewing ${city}`;
    }
});

document.getElementById('routeSelect').addEventListener('change', (e) => {

    const selectedCity = document.getElementById('city').value;
    const routeId = e.target.value;

    if (!transportData[selectedCity] ||
        !transportData[selectedCity].paths[routeId]) return;

    const path = transportData[selectedCity].paths[routeId];

    // Remove previous route
    if (window.routeControl) {
        map.removeControl(window.routeControl);
    }

    // Create new route
    window.routeControl = L.Routing.control({
        waypoints: path.map(p => L.latLng(p[0], p[1])),
        routeWhileDragging: false,
        show: false,
        addWaypoints: false,
        draggableWaypoints: false,
        createMarker: function () { return null; },
        lineOptions: {
            styles: [{ color: 'red', weight: 5 }]
        }
    }).addTo(map);

});
document.getElementById('locateMe').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            map.flyTo([latitude, longitude], 15);
            if (userMarker) map.removeLayer(userMarker);
            userMarker = L.marker([latitude, longitude]).addTo(map).bindPopup("You").openPopup();
            spawnNearbyBuses(latitude, longitude, "Local");
        });
    }
});

document.getElementById('closeDetails').addEventListener('click', () => {
    document.getElementById('mapWrapper').classList.remove('active');
    setTimeout(() => map.invalidateSize(), 400);
});

document.getElementById('genderToggle').addEventListener('click', function () {
    this.classList.toggle('female');
    document.body.classList.toggle('light');
});






