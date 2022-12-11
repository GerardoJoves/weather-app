import { html } from 'lit-html';
import format from 'date-fns/format';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const curretWeatherTemplate = (data) => {
  const template = html`<div>
    <div class="location">
      <div class="city">${data.name}</div>
      <div class="country">${regionNames.of(data.country)}</div>
    </div>
    <div class="weather">${data.description}</div>
    <img 
      class="icon"
      src="http://openweathermap.org/img/wn/${data.icon}@2x.png" 
      alt="weather icon"></img>
    <div class="temp">${Math.round(data.temp)}°</div>
  </div>`;

  return template;
};

const cardTemplate = (data) => {
  const date = new Date(data.dt_txt + ' UTC');
  const card = html`<div class="card">
    <div class="time">${format(date, 'do hh aa')}</div>
    <img
      class="icon"
      src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
      alt="weather icon"
    />
    <div class="temp">${Math.round(data.main.temp)}°</div>
  </div>`;

  return card;
};

export const fiveDayForecastTemplate = (data) => {
  const template = html`<div class="cards-container">
    ${data.map((item) => cardTemplate(item))}
  </div>`;

  return template;
};
