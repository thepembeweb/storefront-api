import Client from '../database';
import { formatRowColumns } from '../utils/common-utils';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);

      conn.release();

      const products = result.rows.map((row) => formatRowColumns(row));

      return products;
    } catch (err) {
      throw new Error(`Could not get products. Error: ${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);

      conn.release();

      const product = formatRowColumns(result.rows[0]);

      return product;
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        product.name,
        product.price,
        product.category
      ]);

      conn.release();

      const newProduct = formatRowColumns(result.rows[0]);

      return newProduct;
    } catch (err) {
      throw new Error(
        `Could not add new product ${product.name}. Error: ${err}`
      );
    }
  }

  async update(id: string, product: Product): Promise<Product> {
    try {
      const sql =
        'UPDATE products SET name = ($2), price = ($3), category = ($4) WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        id,
        product.name,
        product.price,
        product.category
      ]);

      conn.release();

      const updatedProduct = formatRowColumns(result.rows[0]);

      return updatedProduct;
    } catch (err) {
      throw new Error(
        `Could not add new product ${product.name}. Error: ${err}`
      );
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);

      conn.release();

      const deletedProduct = formatRowColumns(result.rows[0]);

      return deletedProduct;
    } catch (err) {
      throw new Error(`Could not delete product ${id}. Error: ${err}`);
    }
  }
}
