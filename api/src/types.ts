export type WeatherDTO = {
    location: string;
    temp: number | undefined;
    feelsLike: number | undefined;
    humidity: number | undefined;
    description: string | undefined;
    units: string;
    fetchedAt: string; // ISO string
};