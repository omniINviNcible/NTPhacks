// Initialize Map
const map = L.map('map').setView([20.5937, 78.9629], 5); 

// Changed to Standard Light Tiles (White Background)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

const transportData = {
    "Delhi": { buses: 142, routes: 12, time: "6 mins", lat: 28.6139, lng: 77.2090 },
    "Mumbai": { buses: 98, routes: 8, time: "12 mins", lat: 19.0760, lng: 72.8777 },
    "Bangalore": { buses: 75, routes: 15, time: "10 mins", lat: 12.9716, lng: 77.5946 }
};

const busMarker = L.marker([20.5937, 78.9629]).addTo(map);

const citySelect = document.getElementById('city');
const busSpan = document.getElementById('buses');
const routeSpan = document.getElementById('activeRoute');
const timeSpan = document.getElementById('arrivalTime');
const locationDiv = document.getElementById('location');

citySelect.addEventListener('change', (e) => {
    const selectedCity = e.target.value;

    if (transportData[selectedCity]) {
        const data = transportData[selectedCity];
        busSpan.innerText = data.buses;
        routeSpan.innerText = data.routes;
        timeSpan.innerText = data.time;
        
        map.flyTo([data.lat, data.lng], 12);
        busMarker.setLatLng([data.lat, data.lng])
                 .bindPopup(`Live Tracking in ${selectedCity}`)
                 .openPopup();
        
        locationDiv.innerText = `📍 Current Location: ${selectedCity}`;
    } else {
        busSpan.innerText = "--";
        routeSpan.innerText = "--";
        timeSpan.innerText = "--";
        locationDiv.innerText = "📍 Current Location: Not Selected";
        map.flyTo([20.5937, 78.9629], 5);
    }
});

// Gender Toggle stays functional
const genderToggle = document.getElementById('genderToggle');
genderToggle.addEventListener('click', () => {
    genderToggle.classList.toggle('female');

});
