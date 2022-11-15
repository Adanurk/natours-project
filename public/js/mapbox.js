export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiYWRhbnVyayIsImEiOiJjbGFoYmd0eDcwNnUxM3VueXV2cGoyd3V0In0.WjdfQXZW6I4SykjLM6t8YA';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/adanurk/clai7l4w2001t14nzv4hxqw1t',
    scrollZoom: false,
    // center: [-118.113491, 34.111745], // starting position [lng, lat]
    // zoom: 10,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
