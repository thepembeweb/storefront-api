import { DashboardQueries } from '../../services/dashboard';
import { Order, OrderProduct, OrderStore } from '../../models/order';
import { User, UserStore } from '../../models/user';
import { Product, ProductStore } from '../../models/product';
import { mockOrder, mockOrderProducts } from '../../mocks/order';
import {
  mockProduct,
  mockProducts,
  mockProductCategory
} from '../../mocks/product';
import { mockPassword, mockUser } from '../../mocks/user';
import { OrderStatus, TIMEOUT_INTERVAL } from '../../utils/common-utils';

const DEFAULT_TIMEOUT_INTERVAL = jasmine.DEFAULT_TIMEOUT_INTERVAL;

let order: Order;
let completedOrder: Order;
let user: User;

const products: Product[] = [];
const orderProducts: OrderProduct[] = [];

const queries = new DashboardQueries();
const orderStore = new OrderStore();
const productStore = new ProductStore();
const userStore = new UserStore();

describe('Tests for Dashboard Service', () => {
  beforeAll(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = TIMEOUT_INTERVAL;

    user = await userStore.create({
      username: mockUser.username,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      password: mockPassword
    });

    order = await orderStore.create({
      ...mockOrder,
      userId: user.id!
    });

    completedOrder = await orderStore.create({
      ...mockOrder,
      userId: user.id!,
      status: OrderStatus.COMPLETE
    });

    for (const mockProduct of mockProducts) {
      const product = await productStore.create({
        name: mockProduct.name,
        price: mockProduct.price,
        category: mockProduct.category
      });

      products.push(product);
    }

    for (const [index, mockOrderProduct] of mockOrderProducts.entries()) {
      const orderProduct = await orderStore.addProduct(
        String(order.id),
        String(products[index].id!),
        mockOrderProduct.quantity
      );

      orderProducts.push(orderProduct);
    }
  });

  afterAll(async () => {
    for (const orderProduct of orderProducts) {
      await orderStore.deleteProduct(
        orderProduct.orderId,
        orderProduct.productId
      );
    }

    for (const product of products) {
      await productStore.delete(String(product.id));
    }

    await orderStore.delete(String(order.id));
    await orderStore.delete(String(completedOrder.id));
    await userStore.delete(String(user.id));

    jasmine.DEFAULT_TIMEOUT_INTERVAL = DEFAULT_TIMEOUT_INTERVAL;
  });

  it('should have an productsByCategory method', () => {
    expect(queries.productsByCategory).toBeDefined();
  });

  it('should have a topFiveProducts method', () => {
    expect(queries.topFiveProducts).toBeDefined();
  });

  it('should have a ordersByUser method', () => {
    expect(queries.ordersByUser).toBeDefined();
  });

  it('should have a completedOrdersByUser method', () => {
    expect(queries.completedOrdersByUser).toBeDefined();
  });

  it('productsByCategory method should return a list of products by category', async () => {
    const result = await queries.productsByCategory(mockProductCategory);

    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(result[0].name).toEqual(mockProduct.name);
    expect(Number(result[0].price)).toEqual(mockProduct.price);
    expect(result[0].category).toEqual(mockProduct.category);
  });

  it('topFiveProducts method should return a list of products by category', async () => {
    const result = await queries.topFiveProducts();

    expect(result).toBeDefined();
    expect(result.length).toEqual(5);
    expect(result[0].name).toEqual(mockProducts[1].name);
    expect(result[1].name).toEqual(mockProducts[5].name);
    expect(result[2].name).toEqual(mockProducts[3].name);
    expect(result[3].name).toEqual(mockProducts[0].name);
    expect(result[4].name).toEqual(mockProducts[2].name);
  });

  it('index method should return a list of current orders by user', async () => {
    const result = await queries.ordersByUser(String(user.id));

    expect(result).toBeDefined();
    expect(result.length).toEqual(2);
    expect(Number(result[0].userId)).toEqual(user.id!);
    expect(result[0].status).toEqual(mockOrder.status);
  });

  it('index method should return a list of completed orders by user', async () => {
    const result = await queries.completedOrdersByUser(String(user.id));

    expect(result).toBeDefined();
    expect(result.length).toEqual(1);
    expect(result[0].userId).toEqual(completedOrder.userId);
    expect(result[0].status).toEqual(OrderStatus.COMPLETE);
  });
});
