import { html } from 'lit-html';
import format from 'date-fns/format';
import { utcToZonedTime } from 'date-fns-tz';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const curretWeatherTemplate = (data) => {
  const date = new Date((data.dt + data.timezone) * 1000);
  const zonedDate = utcToZonedTime(date, 'GMT+0');

  const template = html`<div>
    <div class="location">
      <div class="city">${data.name}</div>
      <div class="country">${regionNames.of(data.country)}</div>
    </div>
    <div class="time">${format(zonedDate, 'do hh aa', {
      timeZone: 'GMT+0',
    })}</div>
    <div class="weather">${data.description}</div>
    <img 
      class="icon"
      src="http://openweathermap.org/img/wn/${data.icon}@2x.png" 
      alt="weather icon"></img>
    <div class="temp">${Math.round(data.temp)}°</div>
  </div>`;

  return template;
};

const cardTemplate = (data, timezone) => {
  const date = new Date((data.dt + timezone) * 1000);
  const zonedDate = utcToZonedTime(date, 'GMT+0');

  const card = html`<div class="card">
    <div class="time">
      ${format(zonedDate, 'do hh aa', { timeZone: 'GMT+0' })}
    </div>
    <div class="description">${data.weather[0].main}</div>
    <img
      class="icon"
      src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"
      alt="weather icon"
    />
    <div class="temp">${Math.round(data.main.temp)}°</div>
  </div>`;

  return card;
};

export const fiveDayForecastTemplate = ({ list, timezone }) => {
  const template = html`<div class="cards-container">
    ${list.map((item) => cardTemplate(item, timezone))}
  </div>`;

  return template;
};

const detailItemTemplate = (title, value) => {
  const template = html`<div>
    <div class="title">${title.replace('_', ' ')}</div>
    <div class="value">${value}</div>
  </div>`;

  return template;
};

export const weatherDetailsTemplate = (currentWeather) => {
  const {
    icon,
    main,
    description,
    temp,
    name,
    country,
    timezone,
    dt,
    ...data
  } = currentWeather;

  let sunrise = new Date((data.sunrise + timezone) * 1000);
  let sunset = new Date((data.sunset + timezone) * 1000);

  sunrise = utcToZonedTime(sunrise, 'GMT+0');
  sunset = utcToZonedTime(sunset, 'GMT+0');

  data.humidity += '%';
  data.sunset = format(sunset, "hh':'mm aa", { timeZone: 'GMT+0' });
  data.sunrise = format(sunrise, "hh':'mm aa", { timeZone: 'GMT+0' });
  data.temp_max = Math.round(data.temp_max) + '°';
  data.temp_min = Math.round(data.temp_min) + '°';
  data.feels_like = Math.round(data.feels_like) + '°';
  data.pressure = data.pressure + ' hPa';
  data.visibility = data.visibility / 1000 + 'km';

  const template = html`<div class="details">
    ${Object.entries(data).map(([title, value]) =>
      detailItemTemplate(title, value)
    )}
  </div>`;

  return template;
};
