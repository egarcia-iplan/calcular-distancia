const address1 = document.querySelector('#inputAddress1')
const address2 = document.querySelector('#inputAddress2')
const mapOutput = document.querySelector('#map')

async function getDistance(apiKey, origin, destination) {
    const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
  
      if (data.routes.length > 0 && data.routes[0].legs.length > 0) {
        const distance = data.routes[0].legs[0].distance.text;
        return distance;
      } else {
        throw new Error('No se pudo obtener la distancia entre las direcciones.');
      }
    } catch (error) {
      console.error('Error al obtener la distancia:', error.message);
    }
  }

  async function main() {
    const apiKey ='AIzaSyDu7xVsO5y4PG2RmqkMJH-Y1kbugoDH5L0'
    const address1Value = address1.value
    console.log(address1Value)
    const address2Value = address2.value
    console.log(address2Value)
  
    const distance = await getDistance(apiKey, address1Value, address2Value);
  
    if (distance) {
        mapOutput.innerHTML = `La distancia entre las direcciones es: ${distance}`
      console.log(`La distancia entre las direcciones es: ${distance}`);
    }
  }
  