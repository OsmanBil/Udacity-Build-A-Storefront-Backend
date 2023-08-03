# Udacity Storefront Backend Project

This project is a part of the Udacity Storefront Backend Project. It serves as the backend for the Storefront application.

# Installation

To set up the project, you need to install the required packages. Run the following command to install the dependencies:

npm install

# Database Setup and Connection

Before running the backend, you need to set up and connect to the database. Make sure you have a compatible database installed - PostgreSQL

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

    Replace the datas with your actual database connection details
    
        
# Usage

Its a Udacity learn Project


# Tests
This project includes automated tests to ensure the proper functioning of the endpoints. The tests are designed to verify specific behaviors and response codes.

Test with: 
npm test

Some test cases are expected to return a response with a status code of 200. These tests are aimed at verifying the successful execution and expected behavior of the endpoints. A 200 response indicates that the request was successfully processed and the expected data or result was returned.

Other test cases are expected to return a response with a status code of 400. These tests are designed to check for error handling and validation scenarios. A 400 response typically indicates that the request was malformed, contained invalid data, or violated some validation rules. By testing for these scenarios, we ensure that the endpoints correctly identify and handle such situations, providing appropriate error messages or responses.