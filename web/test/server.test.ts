import { describe, it, expect } from 'vitest';

describe('Server API Tests', () => {
    it('should return a 200 status for the root endpoint', async () => {
        const response = await fetch('/api');
        expect(response.status).toBe(200);
    });

    it('should return the expected data from the /data endpoint', async () => {
        const response = await fetch('/api/data');
        const data = await response.json();
        expect(data).toEqual({ key: 'value' });
    });
});