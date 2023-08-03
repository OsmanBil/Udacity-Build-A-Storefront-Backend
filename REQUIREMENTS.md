# Udacity Storefront Backend Project Requirements
Udacity Storefront Backend Project Requirements

# RESTful Routes and HTTP Verbs

Users Routes

    GET /users: Retrieve all users from the database.
    GET /users/:id: Retrieve a specific user by ID.
    POST /users: Create a new user with authentication middleware.
    PUT /users/:id: Update a user by ID with authentication middleware.
    DELETE /users/:id: Delete a user by ID with authentication middleware.

Orders Routes

    GET /orders: Retrieve all orders from the database.
    GET /orders/:id: Retrieve a specific order by ID with authentication middleware.
    POST /orders: Create a new order with authentication middleware.
    PUT /orders/:id: Update an order by ID with authentication middleware.
    POST /orders/:id/products: Add a product to an order with authentication middleware.

Products Routes

    GET /products: Retrieve all products from the database.
    GET /products/:id: Retrieve a specific product by ID.
    POST /products: Create a new product with authentication middleware.
    PUT /products/:id: Update a product by ID with authentication middleware.
    DELETE /products/:id: Delete a product by ID with authentication middleware.

Dashboard Routes

    GET /orders/users/:id: Retrieve all active orders of a user with authentication middleware.
    GET /orders/:id/products: Retrieve all products of an order with authentication middleware.

# Database Schema

Table: order_products
CREATE TABLE order_products (
    id SERIAL PRIMARY KEY,
    quantity INTEGER NOT NULL,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL
);


Table: orders
Column	    Type	        Constraints
id	        SERIAL	        PRIMARY KEY
user_id	    INTEGER	        NOT NULL
status	    VARCHAR(50)	    NOT NULL


Table: products
Column	    Type	        Constraints
id	        ERIAL	        PRIMARY KEY
name	    VARCHAR(255)	NOT NULL
price	    NUMERIC(10,2)	NOT NULL
category	VARCHAR(100)	NOT NULL


Table: users
Column	    Type	        Constraints
id	        SERIAL	        PRIMARY KEY
firstName	VARCHAR(255)	NOT NULL
lastName	VARCHAR(255)	NOT NULL
password	VARCHAR(255)	NOT NULL
username	VARCHAR(255)	NOT NULL