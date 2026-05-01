import React, { useEffect, useState } from "react";
import axios from "axios";
import PlaceList from "../components/Map/PlaceList";
import NavigationMap from "../components/Map/NavigationMap";

const ORS_API_KEY = "YOUR_OPENROUTESERVICE_KEY"; // Replace this with your own key

const Navigation = () => {
  const [places, setPlaces] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [startLoc, setStartLoc] = useState(null);
  const [mode, setMode] = useState("driving-car");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [route, setRoute] = useState(null);
  const [manualSource, setManualSource] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/api/places")
      .then(res => setPlaces(res.data))
      .catch(() => setPlaces([]));
  }, []);

  const handlePlaceClick = place => {
    setSelectedPlace(place);
    setRoute(null);
  };
  const autoDetectLocation = () => {
    navigator.geolocation.getCurrentPosition(
      pos => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
      () => alert("Unable to detect location! Please enter manually.")
    );
  };
  const handleManualSource = () => {
    const parts = manualSource.split(",");
    if (parts.length === 2) {
      setStartLoc([parseFloat(parts[0]), parseFloat(parts[1])]);
      setUserLoc(null);
    } else {
      alert("Please enter as: latitude,longitude");
    }
  };
  const fetchRoute = async () => {
    if (!(userLoc || startLoc) || !selectedPlace) return;
    const from = startLoc || userLoc;
    try {
      const url = `https://api.openrouteservice.org/v2/directions/${mode}`;
      const resp = await axios.post(url, {
        coordinates: [ [from[1], from[0]], [selectedPlace.longitude, selectedPlace.latitude] ]
      }, {
        headers: {
          Authorization: ORS_API_KEY,
          "Content-Type": "application/json"
        }
      });
      setRoute(resp.data);
    } catch (err) {
      alert("Direction fetch error");
    }
  };

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden'}}>
      <div style={{width:'340px',padding:'12px',background:'#f7fafc',overflowY:'scroll'}}>
        <h2>Nearby Facilities</h2>
        <button onClick={autoDetectLocation} style={{margin:'8px 0'}}>Use My Location</button><br/>
        <input type="text" placeholder="Lat,Lng (manual)" value={manualSource} onChange={e=>setManualSource(e.target.value)} style={{width:'85%',marginRight:'8px'}} />
        <button onClick={handleManualSource}>Set Manual Source</button>
        <div style={{margin:'10px 0'}}>
          <label>Mode:&nbsp;</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="driving-car">Driving</option>
            <option value="foot-walking">Walking</option>
            <option value="cycling-regular">Cycling</option>
          </select>
        </div>
        <button onClick={fetchRoute} style={{width:'100%',margin:'8px 0'}} disabled={!selectedPlace || !(userLoc || startLoc)}>Start Navigation</button>
        <div style={{margin:'16px 0'}}>
          <PlaceList places={places} onPlaceClick={handlePlaceClick} selectedId={selectedPlace?._id}/>
        </div>
      </div>
      <div style={{flex:1}}>
        <NavigationMap places={places} userLoc={startLoc || userLoc} selectedPlace={selectedPlace} routeGeoJSON={route} onMarkerClick={handlePlaceClick} zoom={selectedPlace ? 16 : 13} />
      </div>
    </div>
  );
};

export default Navigation;
