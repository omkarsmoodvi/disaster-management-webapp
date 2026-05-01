export async function getRoute(from, to, profile = "car") {
  const baseUrl =
    profile === "car"
      ? "https://router.project-osrm.org/route/v1/driving/"
      : profile === "bike"
      ? "https://router.project-osrm.org/route/v1/bicycle/"
      : "https://router.project-osrm.org/route/v1/foot/";
  const url = `${baseUrl}${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson&steps=true`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.code === "Ok" && data.routes.length > 0) {
    return data.routes[0];
  }
  throw new Error("No route found");
}
