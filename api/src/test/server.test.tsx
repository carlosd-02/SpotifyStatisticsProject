import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";

import { createApp } from "../app";
import { ERROR_MESSAGES } from "../constants/weather";
import { loadConfig } from "../config";
const TEST_CONFIG = loadConfig();

describe("GET /api/health", () => {
  it("returns ok true", async () => {
    const app = createApp(TEST_CONFIG);
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe("GET /api/weather", () => {
    beforeEach(() => {
        vi.unstubAllGlobals();
        vi.unstubAllEnvs();
        vi.restoreAllMocks();
    });

    it("returns data when geocoder + weather client succeed", async () => {
    const fakeCoordsPayload = {
        lat: 33.6846,
        lon: -117.8265,
        label: "Irvine, CA, US",
    };

    const fakeWeatherDTO = {
        location: "Irvine, CA, US",
        temp: 21,
        feelsLike: 20,
        humidity: 30,
        description: "few clouds",
        units: "metric",
        fetchedAt: new Date().toISOString(),
    };

    const testDeps = {
        geocoder: { geocode: vi.fn().mockResolvedValue(fakeCoordsPayload) },
        weather: { current: vi.fn().mockResolvedValue(fakeWeatherDTO) },
    };

    const app = createApp(TEST_CONFIG, testDeps);
    const res = await request(app).get("/api/weather?city=Irvine&country=US&units=metric");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/application\/json/);
    expect(res.body).toMatchObject({
        location: expect.any(String),
        temp: expect.any(Number),
        feelsLike: expect.any(Number),
        humidity: expect.any(Number),
        description: expect.any(String),
        units: "metric",
        fetchedAt: expect.any(String),
    });

    expect(testDeps.geocoder.geocode).toHaveBeenCalledOnce();
    expect(testDeps.weather.current).toHaveBeenCalledOnce();
    });

    // The next plan is to make new test cases that call the API, to fail at the geocoder level, 
    // and then to mock the geocoder to return specific lat/lon for testing the weather API error 
    // handling and response parsing.
    it("returns error for invalid city name", async () => {
        const fakeErrorResponse = {
            cod: "404",
            message: ERROR_MESSAGES.GEOCODING_ERROR,
        };
        const testDeps = {
            geocoder: {
                geocode: vi.fn().mockResolvedValue(null) // Simulate city not found
            },
            weatherClient: {
                current: vi.fn().mockResolvedValue(null)
            }
        };
        const app = createApp(TEST_CONFIG, testDeps);
        const res = await request(app).get("/api/weather").query({city: "NOT_A_REAL_CITY", country: "US"});
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({message: ERROR_MESSAGES.GEOCODING_ERROR });
    });

    it("returns error for invalid country name", async () => {
        const fakeErrorResponse = {
            cod: "404",
            message: ERROR_MESSAGES.GEOCODING_ERROR,
        };
        const testDeps = {
            geocoder: {
                geocode: vi.fn().mockResolvedValue(null) // Simulate country not found
            },
            weatherClient: {
                current: vi.fn().mockResolvedValue(null)
            }
        };
        vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: false,
            status: 404,
            json: async () => fakeErrorResponse,
        })) as any
        );
        const app = createApp(TEST_CONFIG, testDeps);
        const res = await request(app).get("/api/weather").query({city: "London", country: "NOT"});
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({message: ERROR_MESSAGES.GEOCODING_ERROR });
    });

    it("returns error if city is whitespace only", async () => {
        const app = createApp(TEST_CONFIG);
        const res = await request(app).get("/api/weather").query({ city: "   ", country: "US", units: "metric" });
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR_MESSAGES.MISSING_PARAMS });
    });

    it("returns error if country is whitespace only", async () => {
        vi.stubEnv("OPENWEATHER_API_KEY", "fake_api_key");
        const app = createApp(TEST_CONFIG);
        const res = await request(app).get("/api/weather").query({ city: "Irvine", country: "   ", units: "metric" });
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR_MESSAGES.MISSING_PARAMS });
    });

    it("returns error for missing required params", async () => {
        const app = createApp(TEST_CONFIG);
        const res = await request(app).get("/api/weather");
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: ERROR_MESSAGES.MISSING_PARAMS });
    });

    it("resolves to metric units when invalid units provided", async () => {
        const fakeCoordsPayload = {
            lat: 33.6846,
            lon: -117.8265,
            label: "Irvine, CA, US",
        };
        const fakeWeatherDTO = {
            location: "Irvine, CA, US",
            temp: 21,
            feelsLike: 20,
            humidity: 30,
            description: "few clouds",
            units: "metric",
            fetchedAt: new Date().toISOString(),
        };

        const testDeps = {
        geocoder: { geocode: vi.fn().mockResolvedValue(fakeCoordsPayload) },
        weather: { current: vi.fn().mockResolvedValue(fakeWeatherDTO) },
        };
        
        const app = createApp(TEST_CONFIG, testDeps);
        const res = await request(app).get("/api/weather?city=Irvine&country=US&units=invalid_unit");
        expect(res.status).toBe(200);
        expect(res.body.units).toBe("metric");
        expect(res.headers["content-type"]).toMatch(/application\/json/);
        expect(res.body).toMatchObject({
            location: expect.any(String),
            temp: expect.any(Number),
            feelsLike: expect.any(Number),
            humidity: expect.any(Number),
            description: expect.any(String),
            units: "metric",
            fetchedAt: expect.any(String),
        });
    });

    // it("should succeed with special characters in city name", async () => {
    //     const fakePayload = {
    //     name: "São Paulo",
    //     sys: { country: "BR" },
    //     main: { temp: 25, feels_like: 27, humidity: 80 },
    //     weather: [{ description: "clear sky" }],
    //     };
    //     vi.stubGlobal(
    //     "fetch",
    //     vi.fn(async () => ({
    //         ok: true,
    //         status: 200,
    //         json: async () => fakePayload,
    //     })) as any
    //     );
    //     const app = createApp(TEST_CONFIG);
    //     const res = await request(app).get("/api/weather?city=São Paulo&country=BR&units=metric");
    //     expect(res.status).toBe(200);
    // });

    it("should properly handle network errors gracefully", async () => {
        vi.stubGlobal(
        "fetch",
        vi.fn(async () => {
            throw new Error(ERROR_MESSAGES.NETWORK_ERROR);  
        }) as any
        );
        const app = createApp(TEST_CONFIG);
        const res = await request(app).get("/api/weather?city=Irvine&country=US&units=metric");
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(502);
        expect(res.body).toEqual({ message: ERROR_MESSAGES.NETWORK_ERROR });
    });
});