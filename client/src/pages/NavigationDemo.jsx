import React, { useState } from "react";
import useGeolocation from "../hooks/useGeolocation";
import MapView from "../components/MapView";
import SearchBar from "../components/SearchBar";
import NavigationPanel from "../components/NavigationPanel";
import { getRoute } from "../api/osrm";

export default function NavigationDemo() {
  const userLoc = useGeolocation();
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState(null);
  const [steps, setSteps] = useState([]);
  const [mode, setMode] = useState("car");

  const handleRoute = async () => {
    if (!origin || !destination) {
      alert("Choose start and destination");
      return;
    }
    const r = await getRoute(origin, destination, mode);
    setRoute(r);
    setSteps(r.legs[0].steps);
  };

  return (
    <div style={{padding:24,maxWidth:900,margin:'auto'}}>
      <h2>Navigation Demo (Free/Open Source APIs)</h2>
      <div style={{display:'flex',gap:12}}>
        <div style={{flex:1,minWidth:260}}>
          <SearchBar onSelect={setOrigin} placeholder="Choose starting location" />
          <SearchBar onSelect={setDestination} placeholder="Choose destination" />
          <label>Mode: </label>
          <select value={mode} onChange={e=>setMode(e.target.value)}>
            <option value="car">Car</option>
            <option value="bike">Bike</option>
            <option value="foot">Foot</option>
          </select>
          <button style={{marginTop:12}} onClick={handleRoute}>Get Directions</button>
          <NavigationPanel steps={steps} />
        </div>
        <div style={{flex:2}}>
          <MapView userLoc={userLoc} origin={origin} destination={destination} routeGeoJson={route} setOrigin={setOrigin} setDestination={setDestination}/>
        </div>
      </div>
    </div>
  );
}
