import supertest from 'supertest';
import app from '../..';
import { mockProduct, mockUpdatedProductName } from '../../mocks/product';
import { Product } from '../../models/product';
import { mockPassword, mockUser } from '../../mocks/user';
import { TIMEOUT_INTERVAL } from '../../utils/common-utils';

const request = supertest(app);

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let token: string;
let product: Product;

describe('Tests for Product endpoints', () => {
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

  describe('POST /products', () => {
    it('should respond with 200 status and json containing the correct product', async () => {
      const response = await request
        .post('/products')
        .send(mockProduct)
        .set('Authorization', `Bearer ${token}`);
      product = response.body;

      expect(response.status).toBe(200);
      expect(product).toBeDefined();
      expect(product.name).toEqual(mockProduct.name);
      expect(Number(product.price)).toEqual(mockProduct.price);
      expect(product.category).toEqual(mockProduct.category);
    });
  });

  describe('GET /products', () => {
    it('should respond with 200 status and json containing a list of products', async () => {
      const response = await request
        .get('/products')
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].name).toEqual(mockProduct.name);
      expect(Number(result[0].price)).toEqual(mockProduct.price);
      expect(result[0].category).toEqual(mockProduct.category);
    });
  });

  describe('GET /products/:id', () => {
    it('should respond with 200 status and json containing the correct product', async () => {
      const response = await request
        .get(`/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(result.name).toEqual(mockProduct.name);
      expect(Number(result.price)).toEqual(mockProduct.price);
      expect(result.category).toEqual(mockProduct.category);
    });
  });

  describe('PUT /products', () => {
    it('should respond with 200 status and json containing the correct product', async () => {
      const response = await request
        .put(`/products/${product.id}`)
        .send({
          ...mockProduct,
          name: mockUpdatedProductName
        })
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.name).toEqual(mockUpdatedProductName);
      expect(Number(result.price)).toEqual(mockProduct.price);
      expect(result.category).toEqual(mockProduct.category);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should respond with 200 status and json containing the correct product', async () => {
      const response = await request
        .delete(`/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(result.id).toEqual(product.id);
    });
  });
});
