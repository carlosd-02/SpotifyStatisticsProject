import { WeatherDTO } from '../../types';

export const responseJson_ex1 = {
  coord: { lon: 16.3721, lat: 48.2085 },
  weather: [
    { id: 801, main: 'Clouds', description: 'few clouds', icon: '02d' }
  ],
  base: 'stations',
  main: {
    temp: 4.41,
    feels_like: 4.41,
    temp_min: 2.12,
    temp_max: 5.45,
    pressure: 1025,
    humidity: 91,
    sea_level: 1025,
    grnd_level: 997
  },
  visibility: 10000,
  wind: { speed: 0.45, deg: 2, gust: 0.89 },
  clouds: { all: 12 },
  dt: 1771999922,
  sys: {
    type: 2,
    id: 2037452,
    country: 'AT',
    sunrise: 1771998247,
    sunset: 1772037087
  },
  timezone: 3600,
  id: 2761369,
  name: 'Vienna',
  cod: 200
};

export const weatherData_ex1: WeatherDTO = {
    location: "Vienna, AT",
    temp: 4.41,
    feelsLike: 4.41,
    humidity: 91,
    description: "few clouds",
    units: "metric",
    fetchedAt: new Date().toISOString()
};