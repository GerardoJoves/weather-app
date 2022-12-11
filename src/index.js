import { events } from './events';
import './style.css';
import './api-calls.js';
import { curretWeatherTemplate, fiveDayForecastTemplate } from './templates';
import { render } from 'lit-html';

const input = document.querySelector('header input');
const button = document.querySelector('header .search-btn');
const curretWeatherContainer = document.querySelector('#current-weather');
const fiveDayForecastContainer = document.querySelector('#five-day-forecast');

const requestWeather = () => {
  const location = input.value;
  if (location === '') return;

  let [cityName, countryName] = location.split(',');
  cityName = cityName.trim();
  if (countryName) countryName = countryName.trim();

  events.emit('userWeatherRequest', { cityName, countryName });
};

button.addEventListener('click', requestWeather);

events.on('weatherDataReady', ({ currentWeather, fiveDayForecast }) => {
  render(curretWeatherTemplate(currentWeather), curretWeatherContainer);
  render(fiveDayForecastTemplate(fiveDayForecast), fiveDayForecastContainer);
});
