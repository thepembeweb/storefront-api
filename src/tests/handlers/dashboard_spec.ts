import supertest from 'supertest';
import app from '../..';
import { Product } from '../../models/product';
import { Order, OrderProduct } from '../../models/order';
import { User } from '../../models/user';

import {
  mockProduct,
  mockProducts,
  mockProductCategory
} from '../../mocks/product';
import { mockOrder, mockOrderProducts } from '../../mocks/order';
import { mockPassword, mockUser } from '../../mocks/user';
import { OrderStatus, TIMEOUT_INTERVAL } from '../../utils/common-utils';

const request = supertest(app);

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let token: string;
let order: Order;
let completedOrder: Order;
let user: User;

const products: Product[] = [];
const orderProducts: OrderProduct[] = [];

describe('Tests for Dashboard endpoints', () => {
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

    const createOrderResponse = await request
      .post('/orders')
      .send({
        ...mockOrder,
        userId: user.id!
      })
      .set('Authorization', `Bearer ${token}`);
    order = createOrderResponse.body;

    const createCompleteOrderResponse = await request
      .post('/orders')
      .send({
        ...mockOrder,
        userId: user.id!,
        status: OrderStatus.COMPLETE
      })
      .set('Authorization', `Bearer ${token}`);
    completedOrder = createCompleteOrderResponse.body;

    for (const mockProduct of mockProducts) {
      const createProductResponse = await request
        .post('/products')
        .send(mockProduct)
        .set('Authorization', `Bearer ${token}`);
      const product = createProductResponse.body;

      products.push(product);
    }

    for (const [index, mockOrderProduct] of mockOrderProducts.entries()) {
      const createOrderProductResponse = await request
        .post(`/orders/${order.id}/products`)
        .send({
          productId: products[index].id!,
          quantity: mockOrderProduct.quantity
        })
        .set('Authorization', `Bearer ${token}`);
      const orderProduct = createOrderProductResponse.body;

      orderProducts.push(orderProduct);
    }
  });

  afterAll(async () => {
    for (const orderProduct of orderProducts) {
      await request
        .delete(
          `/orders/${orderProduct.orderId}/products/${orderProduct.productId!}`
        )
        .set('Authorization', `Bearer ${token}`);
    }

    for (const product of products) {
      await request
        .delete(`/products/${product.id}`)
        .set('Authorization', `Bearer ${token}`);
    }

    await request
      .delete(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${token}`);
    await request
      .delete(`/orders/${completedOrder.id}`)
      .set('Authorization', `Bearer ${token}`);

    await request
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
  });

  describe('GET /products/category/:category', () => {
    it('should respond with 200 status and json containing a list of products by category', async () => {
      const response = await request
        .get(`/products/category/${mockProductCategory}`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.length).toEqual(2);
      expect(result[0].name).toEqual(mockProduct.name);
      expect(Number(result[0].price)).toEqual(mockProduct.price);
      expect(result[0].category).toEqual(mockProduct.category);
    });
  });

  describe('GET /top-five-products', () => {
    it('should respond with 200 status and json containing a list of the top 5 most popular products', async () => {
      const response = await request
        .get('/top-five-products')
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.length).toEqual(5);
      expect(result[0].name).toEqual(mockProducts[1].name);
      expect(result[1].name).toEqual(mockProducts[5].name);
      expect(result[2].name).toEqual(mockProducts[3].name);
      expect(result[3].name).toEqual(mockProducts[0].name);
      expect(result[4].name).toEqual(mockProducts[2].name);
    });
  });

  describe('GET /users/:id/orders/active', () => {
    it('should respond with 200 status and json containing a list of current orders by user', async () => {
      const response = await request
        .get(`/users/${user.id}/orders/active`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.length).toEqual(2);
      expect(Number(result[0].userId)).toEqual(user.id!);
      expect(result[0].status).toEqual(mockOrder.status);
    });
  });

  describe('GET /users/:id/orders/complete', () => {
    it('should respond with 200 status and json containing a list of completed orders by user', async () => {
      const response = await request
        .get(`/users/${user.id}/orders/complete`)
        .set('Authorization', `Bearer ${token}`);
      const result = response.body;

      expect(response.status).toBe(200);
      expect(result).toBeDefined();
      expect(result.length).toEqual(1);
      expect(result[0].userId).toEqual(completedOrder.userId);
      expect(result[0].status).toEqual(OrderStatus.COMPLETE);
    });
  });
});
