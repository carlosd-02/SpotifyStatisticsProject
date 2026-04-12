import dotenv from 'dotenv';
dotenv.config();

export const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
export const API_KEY = process.env.OPENWEATHER_API_KEY;

export const ALLOWED_UNITS = new Set(['standard', 'metric', 'imperial']);
export const DEFAULT_UNIT = 'metric';