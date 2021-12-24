import supertest from 'supertest';
import app from '../..';
import { mockPassword, mockUser, mockUpdatedFirstName } from '../../mocks/user';
import { User } from '../../models/user';
import { TIMEOUT_INTERVAL } from '../../utils/common-utils';

const request = supertest(app);

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let token: string;
let user: User;

describe('Tests for User endpoints', () => {
  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;

    const response = await request
      .post('/authenticate')
      .send({ username: mockUser.username, password: mockPassword });
    token = response.body;
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
  });

  describe('POST /users', () => {
    it('should respond with 200 status and json containing the correct user', async () => {
      const response = await request.post('/users').send(mockUser);
      user = response.body;

      expect(response.status).toBe(200);
      expect(user).toBeDefined();
      expect(user.username).toEqual(mockUser.username);
      expect(user.firstName).toEqual(mockUser.firstName);
      expect(user.lastName).toEqual(mockUser.lastName);
    });
  });

  describe('POST /authenticate', () => {
    it('should respond with 200 status and the token as a string', async () => {
      const response = await request
        .post('/authenticate')
        .send({ username: user.username, password: mockPassword });
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
    });
  });

  describe('GET /users', () => {
    it('should respond with 200 status and json containing a list of users', async () => {
      const response = await request
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].username).toEqual(mockUser.username);
      expect(result[0].firstName).toEqual(mockUser.firstName);
      expect(result[0].lastName).toEqual(mockUser.lastName);
    });
  });

  describe('GET /users/:id', () => {
    it('should respond with 200 status and json containing the correct user', async () => {
      const response = await request
        .get(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(result.username).toEqual(mockUser.username);
      expect(result.firstName).toEqual(mockUser.firstName);
      expect(result.lastName).toEqual(mockUser.lastName);
    });
  });

  describe('PUT /users', () => {
    it('should respond with 200 status and json containing the correct user', async () => {
      const response = await request
        .put(`/users/${user.id}`)
        .send({
          ...mockUser,
          firstName: mockUpdatedFirstName,
          password: mockPassword
        })
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.username).toEqual(mockUser.username);
      expect(result.firstName).toEqual(mockUpdatedFirstName);
      expect(result.lastName).toEqual(mockUser.lastName);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should respond with 200 status and json containing the correct user', async () => {
      const response = await request
        .delete(`/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(result.username).toEqual(mockUser.username);
      expect(result.lastName).toEqual(mockUser.lastName);
    });
  });
});
