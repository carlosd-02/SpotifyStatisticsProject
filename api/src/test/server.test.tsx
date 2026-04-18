import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";

import { createApp } from "../app";

describe("GET /api/health", () => {
  it("returns ok true", async () => {
    const app = createApp();
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

    it("returns data when upstream succeeds (fetch mocked)", async () => {
        const fakePayload = {
        name: "Irvine",
        sys: { country: "US" },
        main: { temp: 21, feels_like: 20, humidity: 30 },
        weather: [{ description: "few clouds" }],
        };

        vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: true,
            status: 200,
            json: async () => fakePayload,
        })) as any
        );

        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather?city=Irvine&country=US&units=metric");

        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(200);
        // adapt these assertions to your DTO shape
        expect(res.body.location).toContain("Irvine");
        expect(res.body.temp).toBe(21);
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

    // The next plan is to make new test cases that call the API, it SHOULD fail and have the correct error message

    // Another case will have an incorrect name for a city and have a specific error message from the API, and we will check that it is correctly propagated to the client
    // It should give the message "city not found Consider checking inputs, API key, and README."
    it("returns error for invalid city name", async () => {
        const fakeErrorResponse = {
            cod: "404",
            message: "city not found",
        };
        vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: false,
            status: 404,
            json: async () => fakeErrorResponse,
        })) as any
        );
        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather").query({city: "invalid_city", country: "US"});
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({message: "city not found"});
    });

    it("returns error for invalid country name", async () => {
        const fakeErrorResponse = {
            cod: "404",
            message: "country not found",
        };
        vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: false,
            status: 404,
            json: async () => fakeErrorResponse,
        })) as any
        );
        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather").query({city: "London", country: "NOT"});
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(404);
        expect(res.body).toEqual({message: "country not found"});
    });

    it("returns error if city is whitespace only", async () => {
        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather").query({ city: "   ", country: "US", units: "metric" });
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Query params 'city' and 'country' are required" });
    });

    it("returns error if country is whitespace only", async () => {
        vi.stubEnv("OPENWEATHER_API_KEY", "fake_api_key");
        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather").query({ city: "Irvine", country: "   ", units: "metric" });
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Query params 'city' and 'country' are required" });
    });


    it("returns error for missing API key", async () => {
        // Temporarily remove API key
        const app = createApp({ openWeatherKey: undefined });
        const res = await request(app)            .get("/api/weather")
            .query({ country: "US", city: "New York", units: "metric" });
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'API key is missing. Please check your .env file. See README for more details.' });
    });

    it("returns error for missing required params", async () => {
        const app = createApp();
        const res = await request(app).get("/api/weather");
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Query params 'city' and 'country' are required" });
    });

    it("resolves to metric units when invalid units provided", async () => {
        const fakePayload = {
        name: "Irvine",
        sys: { country: "US" },
        main: { temp: 21, feels_like: 20, humidity: 30 },
        weather: [{ description: "few clouds" }],
        };

        vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: true,
            status: 200,
            json: async () => fakePayload,
        })) as any
        );
        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather?city=Irvine&country=US&units=invalid_unit");
        expect(res.status).toBe(200);
        expect(res.body.units).toBe("metric");
    });

    it("should succeed with special characters in city name", async () => {
        const fakePayload = {
        name: "São Paulo",
        sys: { country: "BR" },
        main: { temp: 25, feels_like: 27, humidity: 80 },
        weather: [{ description: "clear sky" }],
        };
        vi.stubGlobal(
        "fetch",
        vi.fn(async () => ({
            ok: true,
            status: 200,
            json: async () => fakePayload,
        })) as any
        );
        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather?city=São Paulo&country=BR&units=metric");
        expect(res.status).toBe(200);
    });

    it("should properly handle network errors gracefully", async () => {
        vi.stubGlobal(
        "fetch",
        vi.fn(async () => {
            throw new Error("Network error");
        }) as any
        );
        const app = createApp({ openWeatherKey: "fake" });
        const res = await request(app).get("/api/weather?city=Irvine&country=US&units=metric");
        expect(res.headers["content-type"]).toMatch("application\/json; charset=utf-8");
        expect(res.status).toBe(502);
        expect(res.body).toEqual({ message: "Failed to reach OpenWeather. Please try again later." });
    });
});