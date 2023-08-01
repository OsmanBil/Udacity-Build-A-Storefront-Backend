CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER[] NOT NULL,
    user_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL
);
