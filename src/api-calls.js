import { countryToAlpha2 } from 'country-to-iso';
import { events } from './events';

const apiKey = '735aaf0c36a7f88b0964d5592785c2c9';

const getLocations = async (cityName, countryName) => {
  const countryISOCode = countryName ? countryToAlpha2(countryName) : null;

  const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}${
    countryISOCode ? ',' + countryISOCode : ''
  }&appid=${apiKey}`;

  const response = await fetch(URL, { mode: 'cors' });
  const locations = await response.json();
  return locations;
};

const getCurrentWeather = async ({ lat, lon }) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

  const response = await fetch(URL, { mode: 'cors' });
  const data = await response.json();
  return data;
};

const processData = (data) => {
  const {
    weather: [{ main, description, icon }],
    main: { temp, feels_like, humidity },
    sys: { country },
    name,
  } = data;

  return { main, description, icon, temp, feels_like, humidity, name, country };
};

const getWeatherData = async ({ cityName, countryName }) => {
  let location = await getLocations(cityName, countryName);
  location = location[0];
  const coords = { lat: location.lat, lon: location.lon };
  const curretWeather = await getCurrentWeather(coords);
  events.emit('weatherDataReady', processData(curretWeather));
};

events.on('userWeatherRequest', getWeatherData);
