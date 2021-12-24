# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

- `products` [GET] - Index
- `products/:id` [GET] - Show
- `products` [POST] - Create [token required]
  ```
  {
     "name": "Product 1",
     "price": "100",
     "category": "Category 1",
   }
  ```
- `top-five-products` [GET] - Top 5 most popular products
- `products/category/:category` [GET] - Products by category (args: product category)

#### Users

- `users` [GET] - Index [token required]
- `users/:id` [GET] - Show [token required]
- `users` [POST] - Create N[token required]
  ```
  {
     "username": "",
     "firstName": "Joe",
     "lastName": "Bloggs",
     "password": "password123",
   }
  ```

#### Orders

- `/users/:id/orders/active` [GET] - Current Order by user (args: user id)[token required]
- `/users/:id/orders/complete` [GET] - Completed Orders by user (args: user id)[token required]

## Data Shapes

#### Product

- id
- name
- price
- [OPTIONAL] category
  ```
    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(64) NOT NULL,
        price NUMERIC(6,2) NOT NULL,
        category VARCHAR(100) NOT NULL
    );
  ```

#### User

- id
- firstName
- lastName
- password
  ```
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100),
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        password_digest VARCHAR
    );
  ```

#### Orders

- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

  ```
    CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id bigint REFERENCES users(id),
        status VARCHAR(15)
    );

    CREATE TABLE order_products (
        id SERIAL PRIMARY KEY,
        quantity integer,
        order_id bigint REFERENCES orders(id),
        product_id bigint REFERENCES products(id)
    );
  ```
