import Client from '../database';
import { formatRowColumns } from '../utils/common-utils';

export type Order = {
  id?: number;
  userId: number;
  status: string;
};

export type OrderProduct = {
  id?: number;
  quantity: number;
  orderId: string;
  productId: string;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);

      conn.release();

      const orders = result.rows.map((row) => formatRowColumns(row));

      return orders;
    } catch (err) {
      throw new Error(`Could not get orders. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);

      conn.release();

      const order = formatRowColumns(result.rows[0]);

      return order;
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    try {
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [order.userId, order.status]);

      conn.release();

      const newOrder = formatRowColumns(result.rows[0]);

      return newOrder;
    } catch (err) {
      throw new Error(`Could not add new order ${order.id}. Error: ${err}`);
    }
  }

  async update(id: string, order: Order): Promise<Order> {
    try {
      const sql =
        'UPDATE orders SET user_id = ($2), status = ($3) WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id, order.userId, order.status]);

      conn.release();

      const updatedOrder = formatRowColumns(result.rows[0]);

      return updatedOrder;
    } catch (err) {
      throw new Error(`Could not add new order ${order.id}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Order> {
    try {
      const sql = 'DELETE FROM orders WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);

      conn.release();

      const deletedOrder = formatRowColumns(result.rows[0]);

      return deletedOrder;
    } catch (err) {
      throw new Error(`Could not delete order ${id}. Error: ${err}`);
    }
  }

  async addProduct(
    orderId: string,
    productId: string,
    quantity: number
  ): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [quantity, orderId, productId]);

      conn.release();

      const newOrder = formatRowColumns(result.rows[0]);

      return newOrder;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`
      );
    }
  }

  async deleteProduct(
    orderId: string,
    productId: string
  ): Promise<OrderProduct> {
    try {
      const sql =
        'DELETE FROM order_products WHERE order_id = ($1) AND product_id = ($2) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [orderId, productId]);

      conn.release();

      const deletedOrderProduct = formatRowColumns(result.rows[0]);

      return deletedOrderProduct;
    } catch (err) {
      throw new Error(
        `Could not delete product ${productId} from order ${orderId}: ${err}`
      );
    }
  }
}
