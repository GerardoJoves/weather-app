import { html } from 'lit-html';

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export const curretWeatherTemplate = (data) => {
  const template = html`<div>
    <div class="location">
      <div class="city">${data.name}</div>
      <div class="country">${regionNames.of(data.country)}</div>
    </div>
    <div class="weather">${data.main}</div>
    <div class="temp">${Math.round(data.temp)}°</div>
  </div>`;

  return template;
};
