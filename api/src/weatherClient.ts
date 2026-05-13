import express from 'express';
import cors from 'cors';
import { WeatherDTO, Geocoder, WeatherClient } from './types';
import { ERROR_MESSAGES, FORECAST_URL, WEATHER_CODE_MESSAGES } from './constants/weather';
import { AppConfig } from './config';
import { fetchWeatherApi } from 'openmeteo';

export const openMeteoWeatherClient: WeatherClient = {
        async current({ lat, lon, units, locationLabel }): Promise<WeatherDTO> {
    // IMPORTANT: variable order in this string must match indices below :contentReference[oaicite:1]{index=1}
    const params: any = {
      latitude: lat,
      longitude: lon,
      current: "temperature_2m,apparent_temperature,relative_humidity_2m,weather_code",
      timezone: "auto",
    };

    // OpenMeteo defaults to Celsius, so only set temperature_unit if Fahrenheit is requested
    if (units === "imperial") {
      params.temperature_unit = "fahrenheit";
    }

    const responses = await fetchWeatherApi(FORECAST_URL, params);
    const r = responses[0];
    const current = r.current();

    if (!current) {
      throw new Error("Open-Meteo response missing current()");
    }

    // Indices must match the `current` string order above :contentReference[oaicite:2]{index=2}
    const temp = Math.round(current.variables(0)!.value());
    const feelsLike = Math.round(current.variables(1)!.value());
    const humidity = Math.round(current.variables(2)!.value());
    const weatherCode = String(current.variables(3)!.value());

    return {
      location: locationLabel,
      temp: temp,
      feelsLike: feelsLike,
      humidity: humidity,
      description: WEATHER_CODE_MESSAGES[weatherCode] ?? "Unknown weather",
      units: units,
      fetchedAt: new Date().toISOString(),
    };
  },
}
