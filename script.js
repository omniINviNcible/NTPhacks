const map = L.map('map').setView([20.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 1. DATA: Defined paths for the routes (Ola style)
const routePaths = {
    "route1": [
        [28.6139, 77.2090], [28.6200, 77.2150], [28.6300, 77.2200], [28.6400, 77.2300]
    ],
    "route2": [
        [28.6139, 77.2090], [28.6000, 77.2000], [28.5800, 77.1800], [28.5600, 77.1600]
    ]
};

let currentRouteLine = L.polyline([], {color: '#3a6ff7', weight: 6}).addTo(map);
let busLayer = L.layerGroup().addTo(map);

// 2. Function to draw the route and zoom (Ola Style)
function drawFullRoute(routeName) {
    const path = routePaths[routeName];
    if (path) {
        currentRouteLine.setLatLngs(path);
        
        // Auto-zoom to fit the whole route
        map.fitBounds(currentRouteLine.getBounds(), {padding: [50, 50]});
        
        // Add a bus marker at the end of the path
        spawnBusAt(path[path.length - 1], "TX-99", "Electric AC", routeName);
    }
}

function spawnBusAt(coords, id, type, route) {
    busLayer.clearLayers();
    const marker = L.marker(coords).addTo(busLayer);
    
    marker.on('click', () => {
        document.getElementById('detBusNo').innerText = id;
        document.getElementById('detType').innerText = type;
        document.getElementById('detRoute').innerText = route;
        
        document.getElementById('mapWrapper').classList.add('active');
        setTimeout(() => map.invalidateSize(), 400);
    });
}

// 3. LISTENERS
document.getElementById('routeSelect').addEventListener('change', (e) => {
    if (e.target.value) drawFullRoute(e.target.value);
});

document.getElementById('city').addEventListener('change', (e) => {
    const cities = {"Delhi": [28.6139, 77.2090], "Mumbai": [19.0760, 72.8777], "Bangalore": [12.9716, 77.5946]};
    if (cities[e.target.value]) {
        map.flyTo(cities[e.target.value], 12);
        document.getElementById('buses').innerText = "24";
        document.getElementById('arrivalTime').innerText = "8 mins";
        document.getElementById('location').innerText = `📍 Status: Viewing ${e.target.value}`;
    }
});

document.getElementById('closeDetails').addEventListener('click', () => {
    document.getElementById('mapWrapper').classList.remove('active');
    setTimeout(() => map.invalidateSize(), 400);
});

document.getElementById('genderToggle').addEventListener('click', function() {
    this.classList.toggle('female');
    document.body.classList.toggle('light');
});
