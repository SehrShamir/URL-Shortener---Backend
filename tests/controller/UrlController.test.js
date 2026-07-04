const request = require('supertest');
const app = require('../../src/server');

describe('URL shortener API', () => {
    it('POST /api/urls returns 201 with the correct response shape', async () => {
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

    it('GET /{shortCode} returns the correct original URL', async () => {
        const createResponse = await request(app)
            .post('/api/urls')
            .send({ originalUrl: 'https://example.com/another/path' });

        const shortCode = createResponse.body.shortCode;
        const response = await request(app).get(`/${shortCode}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            originalUrl: 'https://example.com/another/path',
            clickCount: 1,
        });
    });

    it('click count increments on each request', async () => {
        const createResponse = await request(app)
            .post('/api/urls')
            .send({ originalUrl: 'https://example.com/click-count' });

        const shortCode = createResponse.body.shortCode;
        const firstResponse = await request(app).get(`/${shortCode}`);
        const secondResponse = await request(app).get(`/${shortCode}`);

        expect(firstResponse.body.clickCount).toBe(1);
        expect(secondResponse.body.clickCount).toBe(2);
    });

    it('unknown short code returns 404', async () => {
        const response = await request(app).get('/missing');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({ error: 'Short code not found' });
    });

    it('invalid URL returns 400', async () => {
        const response = await request(app)
            .post('/api/urls')
            .send({ originalUrl: 'not-a-valid-url' });

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid or missing URL' });
    });
});
