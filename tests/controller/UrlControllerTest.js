const request = require('supertest');
const app = require('../../src/server');

describe('URL shortener API', () => {
    it('creates a short URL with a 201 response', async () => {
        const response = await request(app)
            .post('/api/urls')
            .send({ originalUrl: 'https://example.com/very/long/path' });

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                shortCode: expect.any(String),
                shortUrl: expect.stringContaining('short.ly/'),
                originalUrl: 'https://example.com/very/long/path',
                clickCount: 0,
                createdAt: expect.any(String),
            })
        );
    });

    it('resolves a short code and increments the click count', async () => {
        const createResponse = await request(app)
            .post('/api/urls')
            .send({ originalUrl: 'https://example.com/another/path' });

        const shortCode = createResponse.body.shortCode;
        const resolveResponse = await request(app).get(`/${shortCode}`);
        const secondResolveResponse = await request(app).get(`/${shortCode}`);

        expect(resolveResponse.status).toBe(200);
        expect(resolveResponse.body).toEqual({
            originalUrl: 'https://example.com/another/path',
            clickCount: 1,
        });
        expect(secondResolveResponse.body.clickCount).toBe(2);
    });

    it('supports trailing-slash requests for the listing endpoint', async () => {
        const response = await request(app).get('/api/urls/');

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });

    it('returns 404 for an unknown short code', async () => {
        const response = await request(app).get('/missing');
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Short code not found' });
    });

    it('returns 400 for an invalid URL', async () => {
        const response = await request(app)
            .post('/api/urls')
            .send({ originalUrl: 'not-a-valid-url' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid or missing URL' });
    });
});
