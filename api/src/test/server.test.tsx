import { vi, describe, it, expect } from "vitest";
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
    it("returns data when upstream succeeds (fetch mocked)", async () => {
        vi.stubEnv("OPENWEATHER_API_KEY", "fake_api_key");
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

        const app = createApp();
        const res = await request(app).get("/api/weather?city=Irvine&country=US&units=metric");

        expect(res.status).toBe(200);
        // adapt these assertions to your DTO shape
        expect(res.body.location).toContain("Irvine");
        expect(res.body.temp).toBe(21);
    });

    // The next plan is to make new test cases that call the API, it SHOULD fail and have the correct error message
    // Another case will have an incorrect name for a city and have a specific error message from the API, and we will check that it is correctly propagated to the client

    it("returns error for missing API key", async () => {
        const originalApiKey = process.env.OPENWEATHER_API_KEY;
        delete process.env.OPENWEATHER_API_KEY; // Temporarily remove API key
        const app = createApp();
        const res = await request(app)            .get("/api/weather")
            .query({ country: "US", city: "New York", units: "metric" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ message: 'API key is missing. Please check your .env file. See README for more details.' });
        process.env.OPENWEATHER_API_KEY = originalApiKey; // Restore API key
    });

    it("returns error for missing required params", async () => {
        vi.stubEnv("OPENWEATHER_API_KEY", "fake_api_key");
        const app = createApp();
        const res = await request(app).get("/api/weather");
        expect(res.status).toBe(400);
        expect(res.body).toEqual({ message: "Query params 'city' and 'country' are required" });
    });
});