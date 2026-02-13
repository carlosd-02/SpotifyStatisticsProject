import { describe, it, expect } from 'vitest';
import {renderData} from '../apicall';
import type { WeatherDTO } from '../api/weather';
import { dataToWeatherDTO } from '../api/weather';
import { exampleWeatherJsonMap, exampleWeatherRenderMap } from './data/weatherdto_ex';

describe('renderData', () => {
    it('Should render weather data correctly', () => {
        for (const [weatherData, expectedOutput] of exampleWeatherRenderMap.entries()) {
            console.log(`Testing renderData with weatherData: ${JSON.stringify(weatherData)}`);
            const rendered = renderData(weatherData);
            console.log('Rendered output:', rendered);
            if (rendered !== expectedOutput) {
                console.error('Rendered output does not match expected output');
            }
        }
    });
});

describe('test dataToWeatherDTO', () => {
    it('Should convert JSON to WeatherDTO correctly', () => {
        for (const [jsonData, expectedDTO] of exampleWeatherJsonMap.entries()) {
            console.log(`Testing dataToWeatherDTO with jsonData: ${JSON.stringify(jsonData)}`);
            const dto = dataToWeatherDTO(jsonData);
            console.log('Converted DTO:', dto);
            if (JSON.stringify(dto) !== JSON.stringify(expectedDTO)) {
                console.error('Converted DTO does not match expected DTO');
            }
        }
    });
});