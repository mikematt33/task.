const app = require('../app');
const request = require('supertest');

describe('loginCheck', () => {

    it('returns status code 200', async () => {
        const res = await request(app).post('/api/v1/auth/loginCheck').send({ "email": "user1@example.com", "password": "password1"});

        expect(res.statusCode).toEqual(200);
    })
});