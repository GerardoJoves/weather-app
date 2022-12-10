import { events } from './events';
import './style.css';
import './api-calls.js';

const input = document.querySelector('header input');
const button = document.querySelector('header .search-btn');

const requestWeather = () => {
  const location = input.value;
  if (location === '') return;

  let [cityName, countryName] = location.split(',');
  cityName = cityName.trim();
  if (countryName) countryName = countryName.trim();

  events.emit('userWeatherRequest', { cityName, countryName });
};

button.addEventListener('click', requestWeather);

events.on('weatherDataReady', console.log);
