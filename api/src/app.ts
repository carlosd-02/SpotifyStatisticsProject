import express, { NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { WeatherDTO } from './types';

function isRecord(value: any): value is Record<string, any> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getNum(obj: Record<string, any>, key: string): number | undefined {
    const value = obj[key];
    return typeof value === 'number' ? value : undefined;
}

function getStr(obj: Record<string, any>, key: string): string | undefined {
    const value = obj[key];
    return typeof value === 'string' ? value : undefined;
}

function getWeatherDTO(data: any, units: string): WeatherDTO | null {
    if (!isRecord(data)) {
        console.error("Invalid data format");
        return null;
    }

    let location = getStr(data, 'name');
    const main = data['main'];
    const weatherArr = data['weather'];

    if (!location || !isRecord(main) || !Array.isArray(weatherArr) || weatherArr.length === 0 || !isRecord(weatherArr[0])) {
        console.error("Missing required fields in data");
        return null;
    }

    const temp = getNum(main, 'temp');
    const feelsLike = getNum(main, 'feels_like');
    const humidity = getNum(main, 'humidity');
    
    let description: string | undefined;
    if (Array.isArray(weatherArr) && weatherArr.length > 0 && isRecord(weatherArr[0])) {
        description = getStr(weatherArr[0], "description");
    }
    
    let country = getStr(data['sys'], 'country');
    if (country) {
        location += `, ${country}`;
    }

    return {
        location,
        temp: temp,
        feelsLike: feelsLike,
        humidity: humidity,
        description: description,
        units,
        fetchedAt: new Date().toISOString(),
    };
}

dotenv.config();

export function createApp() {
    const app = express();
    app.use(express.json());
    app.use(cors());

    const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    console.log("API Key loaded:", API_KEY ? "Yes" : "No");
    const ALLOWED_UNITS = new Set(['standard', 'metric', 'imperial']);


    app.get('/api/health', (req, res) => {
        res.status(200).json({ status: 'ok' });
    });

    app.get('/api/weather', async (req, res) => {
        try {
        console.log("Received request with query:", req.query);

        if (!API_KEY) {
            return res.status(500).json({ message: 'API key is missing. Please check your .env file. See README for more details.' });
        }

        const city = String(req.query.city ?? "").trim();
        const country = String(req.query.country ?? "").trim();
        const state = String(req.query.state ?? "").trim();
        const units = ALLOWED_UNITS.has(String(req.query.units ?? "metric")) ? 
            String(req.query.units) : "metric";

        if (!city || !country) {
            return res.status(400).json({ message: "Query params 'city' and 'country' are required" });
        }

        const q = state ? `${city},${state},${country}` : `${city},${country}`;
        const url = new URL(BASE_URL);
        url.searchParams.append('q', q);
        url.searchParams.append('appid', API_KEY);
        url.searchParams.append('units', units);

        console.log("Parsed query:", { city, state, country, units });
        console.log("OpenWeather URL:", url.toString());
        const weatherResponse = await fetch(url);
        const weatherData = await weatherResponse.json();

        console.log("Raw weather data:", weatherData);

        if (!weatherResponse.ok) {
            console.error('Error response from OpenWeather:', weatherData);
            console.log('message: ', weatherData.message);
            return res.status(weatherResponse.status).json( weatherData.message.isEmpty ? 
                { message: 'Failed to fetch weather data. Please consider checking inputs, API key, and README.' } : { message: weatherData.message });
        }

        const weatherDTO = getWeatherDTO(weatherData, units);
        if (!weatherDTO) {
            return res.status(502).json({ 
                status: 502,
                error: 'Failed to parse weather data',
                response: weatherData
            });
        }

        return res.status(200).json(weatherDTO);
        } catch (error) {
        console.error("Error creating app:", error);
        console.error("Network error calling OpenWeather:", error);
        return res.status(502).json({ message: "Failed to reach OpenWeather. Please try again later." });
        }
    });

    return app;
}