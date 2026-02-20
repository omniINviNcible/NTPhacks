from flask import Flask, jsonify, render_template



import random
import threading
import time

app = Flask(__name__)

# --------- ROUTE + BUS DATA ---------

routes = [
    {
        "route_id": 1,
        "route_name": "Route 1 - Delhi Central",
        "buses": [
            {"id": "D101", "lat": 28.6139, "lng": 77.2090},
            {"id": "D102", "lat": 28.6200, "lng": 77.2200}
        ]
    },
    {
        "route_id": 2,
        "route_name": "Route 2 - Mumbai West",
        "buses": [
            {"id": "M201", "lat": 19.0760, "lng": 72.8777}
        ]
    },
    {
        "route_id": 3,
        "route_name": "Route 3 - Bangalore Tech",
        "buses": [
            {"id": "B301", "lat": 12.9716, "lng": 77.5946}
        ]
    }
]

# --------- SIMULATE BUS MOVEMENT ---------

def move_buses():
    while True:
        for route in routes:
            for bus in route["buses"]:
                bus["lat"] += random.uniform(-0.01, 0.01)
                bus["lng"] += random.uniform(-0.01, 0.01)
        time.sleep(3)

thread = threading.Thread(target=move_buses)
thread.daemon = True
thread.start()

# --------- ROUTES ---------

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/routes")
def get_routes():
    return jsonify(routes)

if __name__ == "__main__":
    app.run(debug=True)