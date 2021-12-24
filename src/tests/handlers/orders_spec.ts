import supertest from 'supertest';
import app from '../..';
import { Order } from '../../models/order';
import { User } from '../../models/user';
import { Product } from '../../models/product';
import {
  mockOrder,
  mockUpdatedOrderStatus,
  mockOrderProduct
} from '../../mocks/order';
import { mockProduct } from '../../mocks/product';
import { mockPassword, mockUser } from '../../mocks/user';
import { TIMEOUT_INTERVAL } from '../../utils/common-utils';

const request = supertest(app);

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let token: string;
let order: Order;
let product: Product;
let user: User;

describe('Tests for Order endpoints', () => {
  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;
    const response = await request
      .post('/authenticate')
      .send({ username: mockUser.username, password: mockPassword });
    token = response.body;

    const createUserResponse = await request
      .post('/users')
      .send(mockUser)
      .set('Authorization', `Bearer ${token}`);
    user = createUserResponse.body;

    const createProductResponse = await request
      .post('/products')
      .send(mockProduct)
      .set('Authorization', `Bearer ${token}`);
    product = createProductResponse.body;

    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
  });

  describe('POST /orders', () => {
    it('should respond with 200 status and json containing the correct order', async () => {
      const response = await request
        .post('/orders')
        .send({
          ...mockOrder,
          userId: user.id!
        })
        .set('Authorization', `Bearer ${token}`);
      order = response.body;

      expect(response.status).toBe(200);
      expect(order).toBeDefined();
      expect(Number(order.userId)).toEqual(user.id!);
      expect(order.status).toEqual(mockOrder.status);
    });
  });

  describe('GET /orders', () => {
    it('should respond with 200 status and json containing a list of orders', async () => {
      const response = await request
        .get('/orders')
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(Number(result[0].userId)).toEqual(user.id!);
      expect(result[0].status).toEqual(mockOrder.status);
    });
  });

  describe('GET /orders/:id', () => {
    it('should respond with 200 status and json containing the correct order', async () => {
      const response = await request
        .get(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(Number(result.userId)).toEqual(user.id!);
      expect(result.status).toEqual(mockOrder.status);
    });
  });

  describe('PUT /orders', () => {
    it('should respond with 200 status and json containing the correct order', async () => {
      const response = await request
        .put(`/orders/${order.id}`)
        .send({
          userId: user.id!,
          status: mockUpdatedOrderStatus
        })
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(Number(result.userId)).toEqual(user.id!);
      expect(result.status).toEqual(mockUpdatedOrderStatus);
    });
  });

  describe('POST /orders/:id/products', () => {
    it('should respond with 200 status and json containing the correct order product', async () => {
      const response = await request
        .post(`/orders/${order.id}/products`)
        .send({
          ...mockOrderProduct,
          productId: product.id!
        })
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(order).toBeDefined();
      expect(result.quantity).toEqual(mockOrderProduct.quantity);
      expect(Number(result.orderId)).toEqual(order.id!);
      expect(Number(result.productId)).toEqual(product.id!);
    });
  });

  describe('DELETE /orders/:id/products/:productId', () => {
    it('should respond with 200 status and json containing the correct order', async () => {
      const response = await request
        .delete(`/orders/${order.id}/products/${product.id!}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(result.orderId).toEqual(String(order.id));
      expect(result.productId).toEqual(String(product.id!));
    });
  });

  describe('DELETE /orders/:id', () => {
    it('should respond with 200 status and json containing the correct order', async () => {
      const response = await request
        .delete(`/orders/${order.id}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(result.id).toEqual(order.id);
    });
  });

  afterAll(async () => {
    await request
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    await request
      .delete(`/products/${product.id}`)
      .set('Authorization', `Bearer ${token}`);
  });
});
