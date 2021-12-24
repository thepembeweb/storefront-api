CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    price NUMERIC(6,2) NOT NULL,
    category VARCHAR(100) NOT NULL
);