import express, { NextFunction } from 'express';
import cors from 'cors';

import { Geocoder, WeatherClient, WeatherDTO } from './types';
import { FORECAST_URL, ALLOWED_UNITS, DEFAULT_UNIT, ERROR_MESSAGES, WEATHER_CODE_MESSAGES} from './constants/weather';
import { openMeteoGeocoder } from './openMeteoGeocoder';
import { AppConfig } from './config';
import { openMeteoWeatherClient } from './weatherClient';

type Deps = {
  geocoder: Geocoder;
  weather: WeatherClient;
};

export function createApp(config: AppConfig, deps?: Partial<Deps>) {
  const app = express();
  app.use(cors());

  const geocoder = deps?.geocoder ?? openMeteoGeocoder;
  const weather = deps?.weather ?? openMeteoWeatherClient;

  app.get("/api/health", (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.get("/api/weather", async (req, res) => {
    const city = String(req.query.city ?? "").trim();
    const country = String(req.query.country ?? "").trim();
    const state = String(req.query.state ?? "").trim() || undefined;

    const unitsRaw = String(req.query.units ?? "metric");
    const unit = ALLOWED_UNITS.has(unitsRaw) ? unitsRaw : DEFAULT_UNIT;

    if (!city || !country) {
      return res.status(400).json({ message: ERROR_MESSAGES.MISSING_PARAMS });
    }

    try {
      const geo = await geocoder.geocode({ city, state, country });
      if (!geo) return res.status(404).json({ message: ERROR_MESSAGES.GEOCODING_ERROR });

      const dto = await weather.current({
        lat: geo.lat,
        lon: geo.lon,
        units: unit,
        locationLabel: geo.label, // e.g., "Irvine, CA, US"
      });

      return res.status(200).json(dto);
    } catch (err: any) {
      return res.status(502).json({ message: err?.message ?? ERROR_MESSAGES.FETCH_ERROR });
    }
  });

  return app;
}