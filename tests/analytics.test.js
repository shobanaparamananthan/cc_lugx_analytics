const request = require('supertest');
const app = require('../app');  // Uses the express app from app.js

describe('Analytics Service Integration Tests', () => {
  
  it('GET /health should return service status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('POST /events should store an event', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        event_type: 'click',
        page_url: '/home',
        session_id: 'test-session-123',
        depth: 75
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Event stored successfully');
  });

  it('POST /events should fail with missing fields', async () => {
    const res = await request(app)
      .post('/events')
      .send({
        page_url: '/missing-event-type'
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('GET /events should return list of events', async () => {
    const res = await request(app).get('/events');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

});
