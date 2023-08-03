# Udacity Storefront Backend Project Requirements
Udacity Storefront Backend Project Requirements

# RESTful Routes and HTTP Verbs

Users Routes

Retrieve all users from the database.
    Method: GET
    Endpoint: /users

    Example Request:
    GET http://localhost:3000/users/
    Authorization: Bearer <access_token>

Retrieve a specific user by ID.  
    Method: GET
    Endpoint: /users/:id

    Example Request:
    GET http://localhost:3000/users/12345
    Authorization: Bearer <access_token>

Create a new user with authentication middleware.
    Method: POST
    Endpoint: /users
    
    Example Request:
    POST http://localhost:3000/users
    Authorization: Bearer <access_token>

    {
        "firstName": "Test",
        "lastName": "User",
        "password": "myPassword",
        "username": "MyUsername"
    }

Update a user by ID with authentication middleware.
    Method: PUT
    Endpoint: /users/:id

    Example Request:
    PUT http://localhost:3000/users/12345
    Authorization: Bearer <access_token>

    {
        "firstName": "Test",
        "lastName": "User",
        "password": "myPassword",
        "username": "MyUsername"
    }

Delete a user by ID with authentication middleware.
    Method: DELETE
    Endpoint: /users/:id

    Example Request:
    DELETE http://localhost:3000/users/12345
    Authorization: Bearer <access_token>

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

Retrieve all active orders of a user with authentication middleware.
    
    GET /orders/users/:id
    Method: GET
    Endpoint: /orders/users/:id

    Example Request:
    GET http://localhost:3000/orders/users/12345
    Authorization: Bearer <access_token>

Retrieve all products of an order with authentication middleware.
    
    GET /orders/:id/products
    Method: GET
    Endpoint: /orders/:id/products

    Example Request:
    GET http://localhost:3000/orders/1/products
    Authorization: Bearer <access_token>

# Database Schema

Table: order_products

    CREATE TABLE order_products (
        id SERIAL PRIMARY KEY,
        quantity INTEGER NOT NULL,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL
    );

Table: orders

    CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL
    );

Table: products

    CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL
    );

Table: users

    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL
    );
