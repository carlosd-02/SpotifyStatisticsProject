import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
export const API_KEY = process.env.OPENWEATHER_API_KEY;

export const ALLOWED_UNITS = new Set(['standard', 'metric', 'imperial']);
export const DEFAULT_UNIT = 'metric';

// Error Messages
export const ERROR_MESSAGES = {
    MISSING_PARAMS: 'Missing required query parameters: city and country are required.',
    INVALID_UNITS: `Invalid units parameter. Allowed values are: ${Array.from(ALLOWED_UNITS).join(', ')}.`,
    FETCH_ERROR: 'Failed to fetch weather data. Please consider checking inputs, API key, and README.',
    PARSE_ERROR: 'Failed to parse weather data from OpenWeather.',
    NETWORK_ERROR: 'Failed to reach OpenWeather. Please try again later.'
};