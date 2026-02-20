<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAbwQH95nI90uCT0XhPcV7fEp1DHcus63s",
    authDomain: "ntphacks-b7f76.firebaseapp.com",
    projectId: "ntphacks-b7f76",
    storageBucket: "ntphacks-b7f76.firebasestorage.app",
    messagingSenderId: "747674929315",
    appId: "1:747674929315:web:d55c96281ab3eb109c9716",
    measurementId: "G-TKRL1G174R"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
</script>
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
};

let currentRouteLine = L.polyline([], {color: '#3a6ff7', weight: 6}).addTo(map);
let busLayer = L.layerGroup().addTo(map);
let userMarker = null;

function spawnNearbyBuses(centerLat, centerLng, cityName) {
    busLayer.clearLayers();
    for(let i = 1; i <= 4; i++) {
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
    
    if (transportData[selectedCity] && transportData[selectedCity].paths[routeId]) {
        const path = transportData[selectedCity].paths[routeId];
        currentRouteLine.setLatLngs(path);
        map.fitBounds(currentRouteLine.getBounds(), {padding: [50, 50]});
    }
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

document.getElementById('genderToggle').addEventListener('click', function() {
    this.classList.toggle('female');
    document.body.classList.toggle('light');
});

