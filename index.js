let count = 0;
function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 9,
    center: { lat: -34.49254089246776, lng: -58.55607928395355 },
  });

  directionsRenderer.setMap(map);

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };

  // Configuración del autocompletado para el campo de inicio
  const startAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById("start"),
    { types: ["geocode"] }
  );
  startAutocomplete.addListener("place_changed", onChangeHandler);

  // Configuración del autocompletado para el campo de fin
  const endAutocomplete = new google.maps.places.Autocomplete(
    document.getElementById("end"),
    { types: ["geocode"] }
  );
  endAutocomplete.addListener("place_changed", onChangeHandler);
}

async function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  count= count + 1;
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  try {
    const startCoords = await geocodeAddress(start);
    const endCoords = await geocodeAddress(end);

    if (startCoords && endCoords) {
      directionsService
        .route({
          origin: { location: startCoords },
          destination: { location: endCoords },
          travelMode: google.maps.TravelMode.WALKING,
        })
        .then((response) => {
          directionsRenderer.setDirections(response);
          if (response) {
            // Obtiene la distancia desde el primer tramo (leg) de la primera ruta
            const distanceText = response.routes[0].legs[0].distance.text;
            const distanceValue = response.routes[0].legs[0].distance.value;
            const distanceOutput = document.querySelector('#distance')
            if (distanceValue <= 250){
              distanceOutput.innerHTML = `<span> La distancia entre el cliente y la CTO es de ${distanceValue} metros, se puede instalar </span>`
            } else {
              distanceOutput.innerHTML = `<span> La distancia entre el cliente y la CTO es de ${distanceValue} metros, no se puede instalar </span>`
            }
          
          } else {
            console.error('La respuesta de la API de direcciones es inválida o no contiene rutas.');
          }
        })
        .catch((e) => console.warn("La solicitud de direcciones falló debido a " + e));
    } else {
      console.warn("No se pudieron obtener las coordenadas para las direcciones.");
    }
  } catch (error) {
    console.warn("Error: " + error.message);
  }
}

async function geocodeAddress(address) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results.length > 0) {
        const location = results[0].geometry.location
        resolve({ lat: location.lat() , lng: location.lng() });
        if (count == 1){
          alert(`${location.lat()},${location.lng()}`)
        }
      } else {
        reject(new Error('No se pudieron obtener las coordenadas para la dirección. Asegúrate de que la dirección sea válida.'));
      }
    });
  });
}

window.initMap = initMap;