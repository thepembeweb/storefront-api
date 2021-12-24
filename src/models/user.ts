import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Client from '../database';
import { formatRowColumns } from '../utils/common-utils';

dotenv.config();

const pepper: string = process.env.BCRYPT_PASSWORD || '';
const saltRounds: string = process.env.SALT_ROUNDS || '';

export type User = {
  id?: number;
  username: string;
  firstName: string;
  lastName: string;
  password?: string;
  passwordDigest?: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';
      const result = await conn.query(sql);

      conn.release();

      const users = result.rows.map((row) => formatRowColumns(row));

      return users;
    } catch (err) {
      throw new Error(`Could not get users. Error: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);

      conn.release();

      const user = formatRowColumns(result.rows[0]);

      return user;
    } catch (err) {
      throw new Error(`Could not find user ${id}. Error: ${err}`);
    }
  }

  async create(user: User): Promise<User> {
    try {
      const passwordDigest = bcrypt.hashSync(
        user.password + pepper,
        parseInt(saltRounds)
      );

      const sql =
        'INSERT INTO users (username, first_name, last_name, password_digest) VALUES($1, $2, $3, $4) RETURNING *';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        user.username,
        user.firstName,
        user.lastName,
        passwordDigest
      ]);

      conn.release();

      const newUser = formatRowColumns(result.rows[0]);

      return newUser;
    } catch (err) {
      throw new Error(`Could not add new user ${user.username}. Error: ${err}`);
    }
  }

  async update(id: string, user: User): Promise<User> {
    try {
      const sql =
        'UPDATE users SET first_name = ($2), last_name = ($3), password_digest = ($4) WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [
        id,
        user.firstName,
        user.lastName,
        user.passwordDigest
      ]);

      conn.release();

      const updatedUser = formatRowColumns(result.rows[0]);

      return updatedUser;
    } catch (err) {
      throw new Error(`Could not update user ${user.username}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      const sql = 'DELETE FROM users WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);

      conn.release();

      const deletedUser = formatRowColumns(result.rows[0]);

      return deletedUser;
    } catch (err) {
      throw new Error(`Could not delete user ${id}. Error: ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    const conn = await Client.connect();
    const sql = 'SELECT * FROM users WHERE username = ($1);';

    const result = await conn.query(sql, [username]);

    if (result.rows.length) {
      const user = formatRowColumns(result.rows[0]);
      if (bcrypt.compareSync(password + pepper, user.passwordDigest)) {
        return user;
      }
    }
    return null;
  }
}
