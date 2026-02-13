import React from 'react';
import { JSX } from 'react';
import type { WeatherDTO } from '../../api/weather';



const exampleWeatherData_1: WeatherDTO = {
    location: "New York, US",
    temp: 22.5,
    feelsLike: 21.0,
    humidity: 60,
    description: "clear sky",
    units: "metric",
    fetchedAt: new Date().toISOString()
};

const exampleWeatherData_ans1 = (
    <div>
        <h2>Weather in {exampleWeatherData_1.location}</h2>
        <p>Temperature: {exampleWeatherData_1.temp}°{exampleWeatherData_1.units === 'metric' ? 'C' : exampleWeatherData_1.units === 'imperial' ? 'F' : 'K'}</p>
        <p>Feels Like: {exampleWeatherData_1.feelsLike}°{exampleWeatherData_1.units === 'metric' ? 'C' : exampleWeatherData_1.units === 'imperial' ? 'F' : 'K'}</p>
        <p>Humidity: {exampleWeatherData_1.humidity}%</p>
        <p>Description: {exampleWeatherData_1.description}</p>
        <p>Last Updated: {new Date(exampleWeatherData_1.fetchedAt).toLocaleString()}</p>
    </div>
);

const exampleWeatherJson_1 = {
  coord: { lon: -73.9866, lat: 40.7306 },
  weather: [ { id: 800, main: 'Clear', description: 'clear sky', icon: '01n' } ],
  base: 'stations',
  main: {
    temp: -13.94,
    feels_like: -20.94,
    temp_min: -15.24,
    temp_max: -13.21,
    pressure: 1018,
    humidity: 53,
    sea_level: 1018,
    grnd_level: 1016
  },
  visibility: 10000,
  wind: { speed: 9.26, deg: 320, gust: 17.49 },
  clouds: { all: 0 },
  dt: 1770525209,
  sys: {
    type: 2,
    id: 2083229,
    country: 'US',
    sunrise: 1770465589,
    sunset: 1770502825
  },
  timezone: -18000,
  id: 5128581,
  name: 'New York',
  cod: 200
};

const exampleWeatherJson_2 =  {
  coord: { lon: 3.042, lat: 36.7525 },
  weather: [
    {
      id: 803,
      main: 'Clouds',
      description: 'broken clouds',
      icon: '04n'
    }
  ],
  base: 'stations',
  main: {
    temp: 14.9,
    feels_like: 13.59,
    temp_min: 14.9,
    temp_max: 14.9,
    pressure: 1009,
    humidity: 44,
    sea_level: 1009,
    grnd_level: 1003
  },
  visibility: 10000,
  wind: { speed: 6.69, deg: 260, gust: 11.83 },
  clouds: { all: 75 },
  dt: 1770523557,
  sys: {
    type: 1,
    id: 1060,
    country: 'DZ',
    sunrise: 1770533034,
    sunset: 1770571211
  },
  timezone: 3600,
  id: 2507480,
  name: 'Algiers',
  cod: 200
};

const exampleWeatherData_2: WeatherDTO = {
    location: "Algiers, DZ",
    temp: 14.9,
    feelsLike: 13.59,
    humidity: 44,
    description: "broken clouds",
    units: "metric",
    fetchedAt: new Date().toISOString()
};

const exampleWeatherData_ans2 = (
    <div>
        <h2>Weather in {exampleWeatherData_2.location}</h2>
        <p>Temperature: {exampleWeatherData_2.temp}°{exampleWeatherData_2.units === 'metric' ? 'C' : exampleWeatherData_2.units === 'imperial' ? 'F' : 'K'}</p>
        <p>Feels Like: {exampleWeatherData_2.feelsLike}°{exampleWeatherData_2.units === 'metric' ? 'C' : exampleWeatherData_2.units === 'imperial' ? 'F' : 'K'}</p>
        <p>Humidity: {exampleWeatherData_2.humidity}%</p>
        <p>Description: {exampleWeatherData_2.description}</p>
        <p>Last Updated: {new Date(exampleWeatherData_2.fetchedAt).toLocaleString()}</p>
    </div>
);

const exampleWeatherData_Error = {
    error: "City not found"
};

const exampleWeatherData_ansError = (
    <div>
        <p color='red'>weatherData Error: {exampleWeatherData_Error.error}</p>
    </div>
);

const exampleWeatherData_empty = {} as WeatherDTO;

const exampleWeatherData_ansEmpty = (
    <div>
        <p color='red'>Error retrieving weather data.</p>
    </div>
);

export const exampleWeatherRenderMap = new Map<WeatherDTO | { error: string }, JSX.Element>([
    [exampleWeatherData_1, exampleWeatherData_ans1],
    [exampleWeatherData_2, exampleWeatherData_ans2],
    [exampleWeatherData_Error, exampleWeatherData_ansError],
    [exampleWeatherData_empty, exampleWeatherData_ansEmpty]
]);

export const exampleWeatherJsonMap = new Map<any, WeatherDTO>([
    [exampleWeatherJson_1, exampleWeatherData_1],
    [exampleWeatherJson_2, exampleWeatherData_2]
]);