// Initialize Map
const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// 1. Create a custom Bus Logo Icon
const busIcon = L.divIcon({
    html: `<span>🚌</span>`, // You can replace this with an <img> tag for a specific logo
    className: 'custom-bus-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

const transportData = {
    "Delhi": { buses: 142, routes: 12, time: "6 mins", lat: 28.6139, lng: 77.2090 },
    "Mumbai": { buses: 98, routes: 8, time: "12 mins", lat: 19.0760, lng: 72.8777 },
    "Bangalore": { buses: 75, routes: 15, time: "10 mins", lat: 12.9716, lng: 77.5946 }
};

let busLayer = L.layerGroup().addTo(map);

// Function to spawn buses with the Bus Logo
function spawnBuses(lat, lng) {
    busLayer.clearLayers();
    for(let i = 1; i <= 3; i++) {
        let randomLat = lat + (Math.random() - 0.5) * 0.015;
        let randomLng = lng + (Math.random() - 0.5) * 0.015;
        
        let marker = L.marker([randomLat, randomLng], { icon: busIcon }).addTo(busLayer);
        
        marker.bindTooltip(`Bus #${100+i} | Route ${i}`, {
            permanent: true,
            direction: 'top',
            className: 'bus-label'
        });
    }
}

// Handle City Selection
document.getElementById('city').addEventListener('change', (e) => {
    const city = e.target.value;
    if (transportData[city]) {
        const d = transportData[city];
        document.getElementById('buses').innerText = d.buses;
        document.getElementById('activeRoute').innerText = d.routes;
        document.getElementById('arrivalTime').innerText = d.time;
        
        map.flyTo([d.lat, d.lng], 14);
        spawnBuses(d.lat, d.lng);
        document.getElementById('location').innerText = `📍 Current Location: ${city}`;
    }
});

// 2. Locate Me using the default pointer
document.getElementById('locateMe').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            const { latitude, longitude } = pos.coords;
            map.flyTo([latitude, longitude], 15);
            
            // Standard Leaflet Pointer (Default)
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup("<b>Your Current Location</b>")
                .openPopup();
            
            spawnBuses(latitude, longitude);
            document.getElementById('location').innerText = `📍 Current Location: My Device`;
        });
    }
});

// Theme Toggle
document.getElementById('genderToggle').addEventListener('click', function() {
    this.classList.toggle('female');
    document.body.classList.toggle('light');
});
