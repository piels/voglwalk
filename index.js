var barf = {
  "sites": [
    {
      "name": "Braves",
      "city": "Boston",
      "latitude": 42.353,
      "longitude": -71.119
    },
    {
      "name": "Ebbets",
      "city": "Brooklyn",
      "latitude": 40.665,
      "longitude": -73.958056
    },
    {
      "name": "Wrigley",
      "city": "Chicago",
      "latitude": 41.948056,
      "longitude": -87.655556
    },
    {
      "name": "Polo Grounds",
      "city": "New York",
      "latitude": 40.830833,
      "longitude": -73.9375
    },
    {
      "name": "City",
      "city": "Green Bay",
      "latitude": 44.5075,
      "longitude": -87.9925
    },
    {
      "name": "Universal",
      "city": "Portsmouth",
      "latitude": 38.728611,
      "longitude": -82.978333
    },
    {
      "name": "Thompson",
      "city": "Staten Island",
      "latitude": 40.6227,
      "longitude": -74.0733
    }
  ]
};

function latLonTo3d(site) {
  const x = Math.cos(site.longitude * Math.PI / 180) * 
    Math.cos(site.latitude * Math.PI / 180);
  const y = Math.sin(site.longitude * Math.PI / 180) * 
    Math.cos(site.latitude * Math.PI / 180);
  const z = Math.sin(site.latitude * Math.PI / 180);
  return {x,y,z};
}


barf.sites.forEach(site => {
  const rect = latLonTo3d(site);
  site.x = rect.x;
  site.y = rect.y;
  site.z = rect.z;
});

console.log(barf);