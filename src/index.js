import {
  getLocationsCoords,
  getCurrentWeather,
  processData,
} from './api-calls';

getLocationsCoords('london')
  .then((locations) =>
    getCurrentWeather({
      lat: locations[0].lat,
      lon: locations[0].lon,
    })
  )
  .then((data) => console.log(processData(data)));
