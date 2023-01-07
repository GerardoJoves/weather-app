import { countryToAlpha2 } from 'country-to-iso';
import { events } from './events';

const apiKey = '735aaf0c36a7f88b0964d5592785c2c9';
let units = 'metric';
let currentLocation = null;

const getLocations = async (cityName, countryName) => {
  const countryISOCode = countryName ? countryToAlpha2(countryName) : null;

  const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}${
    countryISOCode ? ',' + countryISOCode : ''
  }&appid=${apiKey}`;

  const response = await fetch(URL, { mode: 'cors' });
  const locations = await response.json();
  return locations;
};

const getCurrentWeather = async ({ lat, lon }) => {
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  const response = await fetch(URL, { mode: 'cors' });
  const data = await response.json();
  return data;
};

const getFiveDayForecast = async ({ lat, lon }) => {
  const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

  const response = await fetch(URL, { mode: 'cors' });
  const data = await response.json();
  return data;
};

const processCurrentWeather = (data) => {
  const {
    weather: [{ main, description, icon }],
    main: { temp, feels_like, humidity, temp_min, temp_max, pressure },
    sys: { country, sunrise, sunset },
    name,
    visibility,
    timezone,
    dt,
  } = data;

  return {
    main,
    description,
    icon,
    temp,
    feels_like,
    humidity,
    name,
    country,
    sunrise,
    sunset,
    visibility,
    temp_max,
    temp_min,
    pressure,
    timezone,
    dt,
  };
};

const processFiveDayForecast = (data) => {
  const {
    list,
    city: { timezone },
  } = data;
  return { list, timezone };
};

const getWeatherDateByCoords = async (coords) => {
  const weatherData = await Promise.all([
    getCurrentWeather(coords),
    getFiveDayForecast(coords),
  ]);

  const currentWeather = processCurrentWeather(weatherData[0]);
  const fiveDayForecast = processFiveDayForecast(weatherData[1]);

  events.emit('weatherDataReady', { currentWeather, fiveDayForecast });
};

const getWeatherDataByLocationName = async ({ cityName, countryName }) => {
  let location = await getLocations(cityName, countryName);
  location = location[0];
  const coords = {
    lat: location.lat,
    lon: location.lon,
  };

  currentLocation = coords;
  await getWeatherDateByCoords(coords);
};

const switchUnits = async () => {
  let temp = units;

  try {
    units = units === 'metric' ? 'imperial' : 'metric';
    await getWeatherDateByCoords(currentLocation);
    events.emit('unitsSwitched', units);
  } catch (err) {
    units = temp;
  }
};

const handleError = (fn) => {
  return function (...params) {
    return fn(...params).catch((err) => {
      events.emit('error', err);
    });
  };
};

events.on('userWeatherRequest', handleError(getWeatherDataByLocationName));
events.on('switchUnits', handleError(switchUnits));
