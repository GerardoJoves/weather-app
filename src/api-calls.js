import { countryToAlpha2 } from 'country-to-iso';

const apiKey = '735aaf0c36a7f88b0964d5592785c2c9';

const getLocationsCoords = async (cityName, countryName) => {
  const countryISOCode = countryName ? countryToAlpha2(countryName) : null;

  const URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}${
    countryISOCode ? ',' + countryISOCode : ''
  }&limit=5&appid=${apiKey}`;

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
    name,
  } = data;

  return { main, description, icon, temp, feels_like, humidity, name };
};

export { processData, getCurrentWeather, getLocationsCoords };
