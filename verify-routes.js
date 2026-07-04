const request = require('supertest');
const app = require('./src/server');

(async () => {
    const createResponse = await request(app)
        .post('/api/urls')
        .send({ originalUrl: 'https://example.com/verify' });
    console.log('create', createResponse.status, createResponse.body);

    const listResponse = await request(app).get('/api/urls/');
    console.log('list', listResponse.status, Array.isArray(listResponse.body));

    const rootResponse = await request(app).get('/');
    console.log('root', rootResponse.status, rootResponse.body);
})();
