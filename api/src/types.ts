export type WeatherDTO = {
    location: string;
    temp: number | undefined;
    feelsLike: number | undefined;
    humidity: number | undefined;
    description: string | undefined;
    units: string;
    fetchedAt: string; // ISO string
};

export type WeatherClient = {
  current: (args: {
    lat: number;
    lon: number;
    units: string;
    // locationLabel lets you keep the route simple:
    // route builds "Irvine, CA, US" from geocoder and passes it in
    locationLabel: string;
  }) => Promise<WeatherDTO>;
};

export type GeocodeArgs = {
  city: string;
  country: string;
  state?: string;
};

export type GeocodeResult = {
  lat: number;
  lon: number;
  label: string; // e.g., "Irvine, CA, US"
};

export type Geocoder = {
  geocode: (args: GeocodeArgs) => Promise<GeocodeResult | null>;
};

export type OpenMeteoGeocodeResult = {
  latitude: number;
  longitude: number;
  name: string;
  country_code?: string;
  admin1?: string; // often the state/region name
};

export type OpenMeteoGeocodeResponse = {
  results?: OpenMeteoGeocodeResult[];
};