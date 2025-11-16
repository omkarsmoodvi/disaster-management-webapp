import React, { useEffect, useState, useRef } from "react";
import "../../assets/CSS/Medicals.css";
import NavigationMap from "../../components/Map/NavigationMap";
import axios from "axios";

function haversineDistance(lat1, lon1, lat2, lon2) {
  function toRad(x) { return x * Math.PI / 180; }
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImUzMTRjNjE2ODg5MzQyMmE5ZTA4MGYxZjdjYzYzNDNkIiwiaCI6Im11cm11cjY0In0=";

export function Medicals() {
  const [medicals, setMedicals] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [mode, setMode] = useState("driving-car");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [routeGeoJSON, setRouteGeoJSON] = useState(null);
  const [search, setSearch] = useState("");
  const [geocodeResults, setGeocodeResults] = useState([]);
  const [error, setError] = useState("");
  const [following, setFollowing] = useState(false);
  const geoWatchId = useRef(null);

  // Fetch places from backend
  useEffect(() => {
    axios.get("http://localhost:5000/api/places")
      .then(res => setMedicals(res.data))
      .catch(() => setError("Unable to load locations from server."));
  }, []);

  // Safer address search (Nominatim)
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setGeocodeResults([]);
    if (!search.trim()) return;
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("Geocoder unreachable.");
      const data = await response.json();
      if (data && data.length) {
        setGeocodeResults(data.slice(0, 5));
      } else {
        setError("Location not found. Try another place.");
      }
    } catch(e) {
      setError("Unable to search for this location. Check your internet connection, or wait and try again.");
    }
  };

  const onSelectGeocode = (result) => {
    setUserLoc([parseFloat(result.lat), parseFloat(result.lon)]);
    setGeocodeResults([]);
  };

  // Live follow-user mode
  useEffect(() => {
    if (following) {
      if (geoWatchId.current) navigator.geolocation.clearWatch(geoWatchId.current);
      geoWatchId.current = navigator.geolocation.watchPosition(
        pos => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
        err => setError("Unable to track your device location in follow mode")
      );
      return () => {
        if (geoWatchId.current)
          navigator.geolocation.clearWatch(geoWatchId.current);
      };
    }
  }, [following]);

  // Sort by proximity
  let nearest = [];
  if (userLoc && medicals.length) {
    nearest = [...medicals];
    nearest.forEach(m => {
      m.dist = haversineDistance(userLoc[0], userLoc[1], m.latitude, m.longitude);
    });
    nearest.sort((a, b) => a.dist - b.dist);
  }

  // Directions lookup
  const fetchRoute = async (place) => {
    setRouteGeoJSON(null);
    if (!userLoc || !place) return;
    try {
      const url = `https://api.openrouteservice.org/v2/directions/${mode}`;
      const response = await axios.post(url, {
        coordinates: [[userLoc[1], userLoc[0]], [place.longitude, place.latitude]]
      }, {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json"
        }
      });
      setRouteGeoJSON(response.data);
    } catch (error) {
      setRouteGeoJSON(null);
      setError("Could not retrieve directions. Try again later.");
    }
  };

  // Table click
  const handlePlaceClick = (place) => {
    setSelectedPlace(place);
    setRouteGeoJSON(null);
    setFollowing(false);
    fetchRoute(place);
  };

  // Start nav mode
  const startNavigation = () => {
    setFollowing(true);
    if (selectedPlace) fetchRoute(selectedPlace);
  };

  return (
    <div className="medical-listing">
      <h1>Nearest Government Hospitals & Shelters</h1>
      <form onSubmit={handleSearch} style={{marginBottom:'12px'}}>
        <input
          type="text"
          placeholder="Search for address/city/area..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{width:"300px",padding:'8px',marginRight:'10px'}}
        />
        <button>Search</button>
      </form>
      {geocodeResults.length > 0 && (
        <ul className="autocomplete-results" style={{
          listStyle:"none",padding:0,margin:0,maxWidth:300,background:"#fff",border:"1px solid #444"
        }}>
          {geocodeResults.map(g=>
            <li key={g.place_id}
                style={{padding:'5px',cursor:'pointer'}}
                onClick={()=>onSelectGeocode(g)}>
              {g.display_name}
            </li>
          )}
        </ul>
      )}
      {error && <div style={{color:'red',margin:'6px 0'}}>{error}</div>}
      <table className="med-table">
        <thead>
          <tr>
            <th>#</th><th>Name</th><th>Address</th>
            <th>Hotline</th><th>Email</th><th>Type</th><th>Seats</th><th>Distance (km)</th>
          </tr>
        </thead>
        <tbody>
          {nearest.slice(0,6).map((m, idx) => (
            <tr key={m._id} onClick={()=>handlePlaceClick(m)}
                style={{cursor:"pointer",background:selectedPlace && m._id === selectedPlace._id ? "#eaf6fb":""}}>
              <td>{idx+1}</td>
              <td>{m.name}</td>
              <td>{m.address}</td>
              <td>{m.hotline}</td>
              <td>{m.email}</td>
              <td>{m.type}</td>
              <td>{m.seats}</td>
              <td>{m.dist.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {nearest.length === 0 && <p>No hospitals or shelters in your area right now.</p>}
      <div style={{marginTop:'12px',marginBottom:'2px'}}>
        <label>Mode: </label>
        <select value={mode} onChange={e=>setMode(e.target.value)}>
          <option value="driving-car">Driving</option>
          <option value="foot-walking">Walking</option>
          <option value="cycling-regular">Cycling</option>
        </select>
        {" "}
        <button style={{marginLeft:'16px'}} disabled={!selectedPlace} onClick={startNavigation}>
          Start Navigation
        </button>
        {following && <span style={{color:"green",marginLeft:"10px"}}>LIVE: Following you (move with phone to test)</span>}
      </div>
      <NavigationMap
        userLoc={userLoc}
        places={nearest}
        selectedPlace={selectedPlace}
        onMarkerClick={handlePlaceClick}
        routeGeoJSON={routeGeoJSON}
        zoom={selectedPlace ? 15 : 13}
        follow={following}
      />
    </div>
  );
}
