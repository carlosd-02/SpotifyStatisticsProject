import React from 'react';
import { fetchWeatherData, type WeatherDTO } from './api/weather';

export default async function retrieveData(country: string, city: string, unit: string, state?: string) {
    console.log(`Fetching weather data for ${city}, ${state ? state + ', ' : ''}${country} with units: ${unit}`);
    const weatherData = await fetchWeatherData({ country, city, units: unit, state });
    console.log('Received weather data:', weatherData);

    return renderData(weatherData);
}

export function renderData(weatherData: WeatherDTO | { error: string }) {
    console.log('Rendering weather data:', weatherData);
    return (
        <div>
            {!weatherData? (
                <p color='red'>Error retrieving weather data.</p>
            ) : 'error' in weatherData ? (
                <p color='red'>weatherData Error: {weatherData.error}</p>
            ) : (
                <div>
                    <h2>Weather in {weatherData.location}</h2>
                    <p>Temperature: {weatherData.temp}°{weatherData.units === 'metric' ? 'C' : weatherData.units === 'imperial' ? 'F' : 'K'}</p>
                    <p>Feels Like: {weatherData.feelsLike}°{weatherData.units === 'metric' ? 'C' : weatherData.units === 'imperial' ? 'F' : 'K'}</p>
                    <p>Humidity: {weatherData.humidity}%</p>
                    <p>Description: {weatherData.description}</p>
                    <p>Last Updated: {new Date(weatherData.fetchedAt).toLocaleString()}</p>
                </div>
            )}
        </div>
    );
}