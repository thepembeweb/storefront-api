import supertest from 'supertest';
import app from '..';

const request = supertest(app);

describe('Tests for endpoint responses', () => {
  it('gets the api endpoint', async (done) => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    done();
  });
  //   it("gets the api endpoint", async (done) => {
  //     const response = await request.get("/api");
  //     expect(response.status).toBe(200);
  //     done();
  //   });

  //   it("gets 400 error response for api endpoint with invalid parameters", async () => {
  //     const response = await request.get("/api/images");
  //     expect(response.status).toBe(400);
  //   });
});
