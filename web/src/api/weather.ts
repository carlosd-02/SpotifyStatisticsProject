export type WeatherDTO = {
    location: string;
    temp: number | undefined;
    feelsLike: number | undefined;
    humidity: number | undefined;
    description: string | undefined;
    units: string;
    fetchedAt: string; // ISO string
};

export type WeatherParams = {
    city: string;
    country: string;
    state?: string;
    units?: string;
}

export async function fetchWeatherData(params: WeatherParams): Promise<WeatherDTO | { error: string }> {
    try {
    const urlParams = new URLSearchParams({
        city: params.city,
        country: params.country,
        units: params.units || "metric"
    });
    console.log(`Fetching weather data for ${params.city}, ${params.state ? params.state + ', ' : ''}${params.country} with units: ${params.units || "metric"}`);

    if (params.state) {
        urlParams.append("state", params.state);
    }

    console.log(`Constructed URL: /api/weather?${urlParams.toString()}`);
    console.log(`Making API call to /api/weather with params:`, params);
    const response = await fetch(`/api/weather?${urlParams.toString()}`);
    console.log(`Received response with status: ${response.status}`);
    const data = await response.json();
    if (!response.ok) {
        console.error('Error response from API:', data);
        return { error: data.error + '; If this is an API missing error. Consider checking your API key in your .env file. See README for more details.' || 'Unknown error' };
    }

    console.log('Parsed weather data:', data);

    return data as WeatherDTO;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return { error: 'Failed to fetch weather data or data is empty. Please check if server is running.' };
    }
}

export function dataToWeatherDTO(data: any): WeatherDTO {
    try{
        return data as WeatherDTO;
    } catch (e) {
        console.error('Error converting data to WeatherDTO:', e);
        return {} as WeatherDTO;
    }
}