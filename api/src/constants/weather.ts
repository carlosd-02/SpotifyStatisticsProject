import dotenv from 'dotenv';
dotenv.config();

export const SEARCH_URL = 'https://geocoding-api.open-meteo.com/v1/search';
export const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
export const API_KEY = process.env.OPENWEATHER_API_KEY;

export const ALLOWED_UNITS = new Set(['metric', 'imperial']); // standard removed due to constraints of OpenMeteo
export const DEFAULT_UNIT = 'metric';

// Error Messages
export const ERROR_MESSAGES = {
    MISSING_PARAMS: 'Missing required query parameters: city and country are required.',
    INVALID_UNITS: `Invalid units parameter. Allowed values are: ${Array.from(ALLOWED_UNITS).join(', ')}.`,
    GEOCODING_ERROR: 'Failed to geocode the specified location. Please check the city, country, and state parameters.',
    FETCH_ERROR: 'Failed to fetch weather data. Please consider checking inputs, API key, and README.',
    PARSE_ERROR: 'Failed to parse weather data from OpenMeteo.',
    NETWORK_ERROR: 'Failed to reach OpenMeteo. Please try again later.'
};

export const WEATHER_CODE_MESSAGES: Record<string, string> = {
    '0': 'Clear sky',
    '1': 'Mainly clear',
    '2': 'Partly cloudy',
    '3': 'Overcast',
    '45': 'Fog',
    '48': 'Depositing rime fog',
    '51': 'Drizzle: Light',
    '53': 'Drizzle: Moderate',
    '55': 'Drizzle: Dense',
    '56': 'Freezing Drizzle: Light',
    '57': 'Freezing Drizzle: Dense',
    '61': 'Rain: Slight',
    '63': 'Rain: Moderate',
    '65': 'Rain: Heavy',
    '66': 'Freezing Rain: Light',
    '67': 'Freezing Rain: Heavy',
    '71': 'Snow fall: Slight',
    '73': 'Snow fall: Moderate',
    '75': 'Snow fall: Heavy',
    '77': 'Snow grains',
    '80': 'Rain showers: Slight',
    '81': 'Rain showers: Moderate',
    '82': 'Rain showers: Violent',
    '85': 'Snow showers slight',
    '86': 'Snow showers heavy',
    '95': 'Thunderstorm: Slight or moderate',
    '96': 'Thunderstorm with slight hail',
    '97': 'Thunderstorm with heavy hail',
    '99': 'Thunderstorm with heavy hail'
};