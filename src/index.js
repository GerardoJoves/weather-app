import { events } from './events';
import './style.css';
import './api-calls.js';
import {
  curretWeatherTemplate,
  fiveDayForecastTemplate,
  weatherDetailsTemplate,
} from './templates';
import { render } from 'lit-html';

const inputEl = document.querySelector('header input');
const searchBtn = document.querySelector('header .search-btn');
const switchUnitsBtn = document.querySelector('header .units-switcher');
const switchUnitsBtnCelsius = switchUnitsBtn.querySelector('.celsius');
const switchUnitsBtnFahrenheit = switchUnitsBtn.querySelector('.fahrenheit');
const curretWeatherContainer = document.querySelector('#current-weather');
const fiveDayForecastContainer = document.querySelector('#five-day-forecast');
const detailsContainer = document.querySelector('#details-container');
const loaders = Array.from(document.querySelectorAll('.loader-container'));

const finishLoading = () => {
  loaders.forEach((loader) => loader.classList.remove('active'));
};

const startLoading = () => {
  loaders.forEach((loader) => loader.classList.add('active'));
};

const requestWeather = () => {
  const location = inputEl.value;
  if (location === '') return;

  let [cityName, countryName] = location.split(',');
  cityName = cityName.trim();
  if (countryName) countryName = countryName.trim();

  events.emit('userWeatherRequest', { cityName, countryName });
  startLoading();
};

const switchUnits = () => {
  events.emit('switchUnits');
  startLoading();
};

searchBtn.addEventListener('click', requestWeather);
switchUnitsBtn.addEventListener('click', switchUnits);

events.on('weatherDataReady', ({ currentWeather, fiveDayForecast }) => {
  render(curretWeatherTemplate(currentWeather), curretWeatherContainer);
  render(fiveDayForecastTemplate(fiveDayForecast), fiveDayForecastContainer);
  render(weatherDetailsTemplate(currentWeather), detailsContainer);
  finishLoading();
});

events.on('unitsSwitched', (units) => {
  if (units === 'metric') {
    switchUnitsBtnCelsius.classList.add('active');
    switchUnitsBtnFahrenheit.classList.remove('active');
  } else {
    switchUnitsBtnCelsius.classList.remove('active');
    switchUnitsBtnFahrenheit.classList.add('active');
  }

  finishLoading();
});

events.on('error', () => {
  loaders.forEach((loader) => loader.classList.remove('active'));
});

events.on('loading');

events.emit('userWeatherRequest', { cityName: 'london' });
