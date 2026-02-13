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
    const response = await fetch(`/api/weather?${urlParams.toString()}`);
    console.log(`Received response with status: ${response.status}`);
    const data = await response.json();
    if (!response.ok) {
        console.error('Error response from API:', data);
        return { error: data.message || 'Unknown error' };
    }

    console.log('Parsed weather data:', data);

    return data as WeatherDTO;
}

export function dataToWeatherDTO(data: any): WeatherDTO {
    try{
        return data as WeatherDTO;
    } catch (e) {
        console.error('Error converting data to WeatherDTO:', e);
        return {} as WeatherDTO;
    }
}