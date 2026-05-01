import { useEffect, useState } from "react";
export default function useGeolocation() {
  const [position, setPosition] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      pos => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);
  return position;
}
