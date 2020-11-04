(function () {
  const map = L.map('map', {
    maxZoom: 13,
    minZoom: 6,
  });

  addTileLayer();

  axios.get('./tracks/tracks.json')
    .then((response) => {
      const tracksLayer = createTracksLayer(response.data);
      tracksLayer.addTo(map);
      map.fitBounds(tracksLayer.getBounds());
    });

  function addTileLayer() {
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'osmmtb/ckh2av1p607ut1aoo597svfdv',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoib3NtbXRiIiwiYSI6ImNpd2t0Yzg2bzAwMHIydG8yazN1dDg4M2gifQ.vRrPm2aqdwU3KSof9Gx_Tg',
      }
    ).addTo(map);
  }

  function createTracksLayer(geojson) {
    const tracks = L.geoJson(geojson, {
      style: () => {
        return {
          color: colorGetter(),
          weight: 5,
        }
      },
      onEachFeature: (feature, layer) => {
        const backgroundHighlight = L.polyline(layer.getLatLngs(), {
          interactive: false,
          weight: 11,
          color: 'white',
          opacity: 0.7,
        });
        layer.on('mouseover', () => {
          map.addLayer(backgroundHighlight);
          layer.bringToFront();
        });
        layer.on('mouseout', () => {
          map.removeLayer(backgroundHighlight);
        });
      }
    });

    tracks.bindTooltip(
      (layer) => getTooltipContent(layer.feature),
      {
        sticky: true,
        direction: 'top',
      }
    );

    return tracks;
  }

  function getTooltipContent(feature) {
    return `
      <b>${feature.properties.name}</b>
      <br>
      ${feature.properties.date}
      <br>
      Délka: ${feature.properties.distance} km
      <br>
      Převýšení: ${feature.properties.elevation} m
    `;
  }

  const colors = [
    '#8d5a99',
    '#e5b636',
    '#a47158',
    '#ab6393',
    '#e77148',
    '#487bb6',
    '#f3a6b2',
    '#729b6f',
    '#5e96ae',
    '#e58b88',
  ];
  let colorGetterIndex = 0;
  function colorGetter() {
    const color = colors[colorGetterIndex];
    colorGetterIndex = (colorGetterIndex + 1) % colors.length;
    return color;
  }
})();
