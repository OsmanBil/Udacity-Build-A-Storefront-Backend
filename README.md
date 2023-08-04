# Udacity Storefront Backend Project

This project is a part of the Udacity Storefront Backend Project. It serves as the backend for the Storefront application.

# Installation

To set up the project, you need to install the required packages. Run the following command to install the dependencies:

npm install

# Database Setup and Connection

Before running the backend, you need to set up and connect to the database. Make sure you have a compatible database installed - PostgreSQL.

    1. Create a new database for this project.
    2. Set the necessary environment variables to connect to the database. Use the following environment variables:

        POSTGRES_HOST=127.0.0.1
        POSTGRES_DB=your_db
        POSTGRES_DB_TEST=your_test_db
        POSTGRES_USER=your_user
        POSTGRES_PASSWORD=your_password
        ENV=dev
        BCRYPT_PASSWORD=your_secret_password 
        SALT_ROUNDS=10
        TOKEN_SECRET=your_secret_token

    Replace the datas with your actual database connection details.
    3. Create the tables with:
        db-migrate up

    Please note that the 'database.json' file is not included in the version control to avoid exposing sensitive information. Make sure to update the connection details in the 'database.json' file according to your local database setup before running the migration.

# Backend and Database Ports

The backend server and database may run on different ports. By default, the backend server runs on port 3000, and the database may use its default port 5432 for PostgreSQL.

# Routes

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

# Usage

This project serves as the backend for the Udacity Storefront application. It provides various API endpoints to handle user authentication, product management, order processing, and more.

To start the backend server, use the following command:

 npm start

# Tests
This project includes automated tests to ensure the proper functioning of the endpoints. The tests are designed to verify specific behaviors and response codes.

Test with: 
npm test

Some test cases are expected to return a response with a status code of 200. These tests are aimed at verifying the successful execution and expected behavior of the endpoints. A 200 response indicates that the request was successfully processed and the expected data or result was returned.

Other test cases are expected to return a response with a status code of 400. These tests are designed to check for error handling and validation scenarios. A 400 response typically indicates that the request was malformed, contained invalid data, or violated some validation rules. By testing for these scenarios, we ensure that the endpoints correctly identify and handle such situations, providing appropriate error messages or responses.