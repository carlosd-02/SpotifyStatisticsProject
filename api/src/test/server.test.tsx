import { describe, it, expect } from "vitest";
import request from "supertest";

import { createApp } from "../app";
import { getStr, getNum, isRecord } from "../app";

describe("GET /api/health", () => {
  it("returns ok true", async () => {
    const app = createApp();
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe("GET /api/weather", () => {
    it("returns weather data for valid location", async () => {
        const app = createApp();
        const res = await request(app)            .get("/api/weather")
            .query({ country: "US", city: "New York", units: "metric" });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("temp");
        expect(res.body).toHaveProperty("description");
    });

    it("returns error for missing API key", async () => {
        const originalApiKey = process.env.OPENWEATHER_API_KEY;
        delete process.env.OPENWEATHER_API_KEY; // Temporarily remove API key
        const app = createApp();
        const res = await request(app)            .get("/api/weather")
            .query({ country: "US", city: "New York", units: "metric" });
        expect(res.status).toBe(500);
        expect(res.body).toEqual({ error: 'API key not configured' });
        process.env.OPENWEATHER_API_KEY = originalApiKey; // Restore API key
    });
});