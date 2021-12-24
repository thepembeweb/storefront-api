import Client from '../database';
import { Order } from '../models/order';
import { Product } from '../models/product';
import { formatRowColumns, OrderStatus } from '../utils/common-utils';

export type TopFiveProduct = {
  id: number;
  name: string;
  category: string;
  total: number;
};

export class DashboardQueries {
  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products WHERE category=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [category]);

      conn.release();

      const products = result.rows.map((row) => formatRowColumns(row));

      return products;
    } catch (err) {
      throw new Error(
        `Could not find products with category: ${category}. Error: ${err}`
      );
    }
  }

  async topFiveProducts(): Promise<TopFiveProduct[]> {
    try {
      const sql = `SELECT p.id,
                          p.name,
                          p.category,
                          Sum(op.quantity) AS total
                    FROM   products p
                          INNER JOIN order_products op
                                  ON p.id = op.product_id
                    GROUP  BY p.id
                    ORDER  BY Sum(op.quantity) DESC
                    LIMIT  5`;

      const conn = await Client.connect();
      const result = await conn.query(sql);

      conn.release();

      const products = result.rows.map((row) => formatRowColumns(row));

      return products;
    } catch (err) {
      throw new Error(`Could not find products. Error: ${err}`);
    }
  }

  async ordersByUser(userId: string): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [userId]);

      conn.release();

      const orders = result.rows.map((row) => formatRowColumns(row));

      return orders;
    } catch (err) {
      throw new Error(
        `Could not find orders with user id: ${userId}. Error: ${err}`
      );
    }
  }

  async completedOrdersByUser(userId: string): Promise<Order[]> {
    try {
      const sql = 'SELECT * FROM orders WHERE user_id=($1) AND status=($2)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [userId, OrderStatus.COMPLETE]);

      conn.release();

      const orders = result.rows.map((row) => formatRowColumns(row));

      return orders;
    } catch (err) {
      throw new Error(
        `Could not find complete orders with user id: ${userId}. Error: ${err}`
      );
    }
  }
}
