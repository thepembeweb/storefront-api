import { Order, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';
import {
  mockOrder,
  mockUpdatedOrderStatus,
  mockOrderProduct
} from '../../mocks/order';
import { mockProduct } from '../../mocks/product';
import { mockPassword, mockUser } from '../../mocks/user';
import { TIMEOUT_INTERVAL } from '../../utils/common-utils';

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let order: Order;
let product: Product;
let user: User;

const orderStore = new OrderStore();
const productStore = new ProductStore();
const userStore = new UserStore();

describe('Tests for Order Model', () => {
  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;

    user = await userStore.create({
      username: mockUser.username,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      password: mockPassword
    });

    product = await productStore.create({
      name: mockProduct.name,
      price: mockProduct.price,
      category: mockProduct.category
    });
  });

  afterAll(async () => {
    await productStore.delete(String(product.id));
    await userStore.delete(String(user.id));

    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
  });

  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('should have a update method', () => {
    expect(orderStore.update).toBeDefined();
  });

  it('should have a delete method', () => {
    expect(orderStore.delete).toBeDefined();
  });

  it('should have a addProduct method', () => {
    expect(orderStore.addProduct).toBeDefined();
  });

  it('should have a deleteProduct method', () => {
    expect(orderStore.deleteProduct).toBeDefined();
  });

  it('create method should add a order', async () => {
    order = await orderStore.create({
      userId: user.id!,
      status: mockOrder.status
    });

    expect(order).toBeDefined();
    expect(Number(order.userId)).toEqual(user.id!);
    expect(order.status).toEqual(mockOrder.status);
  });

  it('index method should return a list of orders', async () => {
    const result = await orderStore.index();

    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(Number(result[0].userId)).toEqual(user.id!);
    expect(result[0].status).toEqual(mockOrder.status);
  });

  it('show method should return the correct order', async () => {
    const result = await orderStore.show(String(order.id));

    expect(result).toBeDefined();
    expect(Number(result.userId)).toEqual(user.id!);
    expect(result.status).toEqual(mockOrder.status);
  });

  it('update method should update an order', async () => {
    const result = await orderStore.update(String(order.id), {
      userId: user.id!,
      status: mockUpdatedOrderStatus
    });

    expect(result).toBeDefined();
    expect(Number(result.userId)).toEqual(user.id!);
    expect(result.status).toEqual(mockUpdatedOrderStatus);
  });

  it('addProduct method should add a product to an order', async () => {
    const result = await orderStore.addProduct(
      String(order.id!),
      String(product.id!),
      mockOrderProduct.quantity
    );

    expect(result).toBeDefined();
    expect(result.quantity).toEqual(mockOrderProduct.quantity);
    expect(result.orderId).toEqual(String(order.id!));
    expect(Number(result.productId)).toEqual(product.id!);
  });

  it('deleteProduct method should remove the product from the order', async () => {
    const result = await orderStore.deleteProduct(
      String(order.id),
      String(product.id!)
    );

    expect(result).toBeDefined();
    expect(result.orderId).toEqual(String(order.id));
    expect(result.productId).toEqual(String(product.id));
  });

  it('delete method should remove the order', async () => {
    const result = await orderStore.delete(String(order.id));

    expect(result).toBeDefined();
    expect(result.id).toEqual(order.id);
  });
});
