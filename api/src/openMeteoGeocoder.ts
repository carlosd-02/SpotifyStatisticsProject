import type { Geocoder, OpenMeteoGeocodeResponse, OpenMeteoGeocodeResult } from "./types";
import { SEARCH_URL } from "./constants/weather";

// import your existing function from wherever it lives
// import { getCityCoordinates } from "../wherever/getCityCoordinates";

export const openMeteoGeocoder: Geocoder = {
  async geocode({ city, country, state }) {
    try {
      const first = await getCityCoordinates(city, country, state);

      // Create a nice label for display/debugging
      const labelParts = [first.name];
      if (first.admin1) labelParts.push(first.admin1);
      if (first.country_code) labelParts.push(first.country_code);
      const label = labelParts.join(", ");

      return {
        lat: first.latitude,
        lon: first.longitude,
        label,
      };
    } catch (err: any) {
      // Should throw 404 if no coordinates found, but return null to allow API to respond with 404 instead of 502. Network errors or other unexpected issues should still throw and result in a 502.
      if (String(err?.message ?? "").toLowerCase().includes("no coordinates")) return null;
      throw err; // network errors should still bubble up as 502
    }
  },
};



function getCityCoordinates(city: string, country: string, state?: string): Promise<OpenMeteoGeocodeResult> {
  const params = new URLSearchParams({
    name: city,
    countryCode: country,
  });

  const response = fetch(`${SEARCH_URL}?${params.toString()}`);

  return response
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Failed to fetch coordinates: ${res.statusText}`);
      }
      return res.json() as Promise<OpenMeteoGeocodeResponse>;
    })
    .then((data) => {
      if (!data.results || data.results.length === 0) {
        throw new Error("No coordinates found for the specified location");
      }
      return data.results[0];
    });
}