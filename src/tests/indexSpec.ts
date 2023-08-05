import supertest from 'supertest';
import app from '../server';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Order, OrderStore } from '../models/order';
import { Product, ProductStore } from '../models/product';
import { UserStore } from '../models/user';

type DecodedToken = string | JwtPayload | null;

const request = supertest(app);
let token: string;
let orderId: number;
let productId: number;
let userId1: number;
let userId2: number;

beforeAll((done) => {
  request
    .post('/users')
    .send({
      username: 'testUsername',
      password: 'testPassword',
      firstName: 'testFirstName',
      lastName: 'testLastName',
    })
    .end((err, response) => {
      token = response.body;

      const decoded: DecodedToken = jwt.decode(token as string);
      if (
        typeof decoded !== 'string' &&
        decoded &&
        'user' in decoded &&
        'id' in decoded.user
      ) {
        userId1 = decoded.user.id;
      }

      request
        .post('/products')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'testProduct',
          price: 100,
          category: 'testCategory',
        })
        .end((err, response) => {
          productId = response.body.id;
          done();
        });
    });
});

describe('Test endpoint responses', () => {
  describe('Server Main Route', () => {
    it('gets the api endpoint', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(200);
    });
  });

  describe('Users Routes', () => {
    it('should retrieve all users', async () => {
      const response = await request
        .get('/users')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should create a new user', async () => {
      const res = await request.post('/users').send({
        username: 'testUsername2',
        password: 'testPassword2',
        firstName: 'testFirstName2',
        lastName: 'testLastName2',
      });

      expect(res.statusCode).toEqual(200);
      const decoded: DecodedToken = jwt.decode(token as string);
      if (
        typeof decoded !== 'string' &&
        decoded &&
        'user' in decoded &&
        'id' in decoded.user
      )
        userId2 = decoded.user.id;
    });

    it('should retrieve a specific user by ID', async () => {
      const response = await request
        .get(`/users/${userId2}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should update a user by ID', async () => {
      const response = await request
        .put(`/users/${userId2}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          firstName: 'updatedFirstName',
          lastName: 'updatedLastName',
          password: 'updatedPassword',
          username: 'updatedUsername',
        });

      expect(response.status).toBe(200);
    });

    it('should delete a user', async () => {
      const response = await request
        .delete(`/users/${userId2}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
    });

    it('should fail to create a new user due to missing information', async () => {
      const res = await request.post('/users').send({
        username: 'testUsername3',
        // Password is missing
        firstName: 'testFirstName3',
        lastName: 'testLastName3',
      });

      expect(res.statusCode).toEqual(400);
    });

    it('should fail to retrieve a non-existent user', async () => {
      const response = await request
        .get(`/users/9999999`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(500);
    });
  });

  describe('Orders Routes', () => {
    it('should create a new order', async () => {
      const response = await request
        .post('/orders')
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'active',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toEqual('active');
      orderId = response.body.id;
    });

    it('should retrieve all orders', async () => {
      const response = await request
        .get('/orders')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should retrieve a specific order by ID', async () => {
      const response = await request
        .get(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should update an order', async () => {
      const response = await request
        .put(`/orders/${orderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'active',
        });

      expect(response.status).toBe(200);
      expect(response.body.status).toEqual('active');
    });

    it('should add a product to an order', async () => {
      const response = await request
        .post(`/orders/${orderId}/products`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          productId: productId,
          quantity: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toEqual(2);
    });
  });

  describe('Products Routes', () => {
    it('should retrieve all products', async () => {
      const response = await request
        .get('/products')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should retrieve a specific product by ID', async () => {
      const response = await request
        .get(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });

    it('should update a product', async () => {
      const response = await request
        .put(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'updatedProduct',
          price: 200,
          category: 'updatedCategory',
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toEqual('updatedProduct');
    });

    it('should delete a product', async () => {
      const response = await request
        .delete(`/products/${productId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
    });
  });

  describe('Order Model', () => {
    const store = new OrderStore();
    let testOrder: Order;

    // Test for the index method
    it('should have an index method', () => {
      expect(typeof store.index).toBe('function');
    });

    it('index method should return a list of orders', async () => {
      const result = await store.index();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    // Test for the create method
    it('should have a create method', () => {
      expect(typeof store.create).toBe('function');
    });

    it('create method should add an order', async () => {
      testOrder = await store.create({
        user_id: 1,
        status: 'active',
      } as Order);

      expect(testOrder).toBeDefined();
      expect(testOrder.user_id).toBe(1);
      expect(testOrder.status).toBe('active');
    });

    // Test for the update method
    it('should have an update method', () => {
      expect(typeof store.update).toBe('function');
    });

    it('update method should update the status of an order', async () => {
      const updatedOrder = await store.update(testOrder.id!, {
        status: 'complete',
      });

      expect(updatedOrder).toBeDefined();
      expect(updatedOrder.id).toBe(testOrder.id);
      expect(updatedOrder.status).toBe('complete');
    });

    // Test for the show method
    it('should have a show method', () => {
      expect(typeof store.show).toBe('function');
    });

    it('show method should return the correct order', async () => {
      const result = await store.show(`${testOrder.id}`);

      expect(result).toBeDefined();
      expect(result.id).toBe(testOrder.id);
      expect(result.user_id).toBe(1);
      expect(result.status).toBe('complete');
    });

    // Test for the addProduct method
    it('should have an addProduct method', () => {
      expect(typeof store.addProduct).toBe('function');
    });
  });

  describe('Product Model', () => {
    const store = new ProductStore();
    let testProduct: Product;

    // Test for the index method
    it('should have an index method', () => {
      expect(typeof store.index).toBe('function');
    });

    it('index method should return a list of products', async () => {
      const result = await store.index();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    // Test for the create method
    it('should have a create method', () => {
      expect(typeof store.create).toBe('function');
    });

    it('create method should add a product', async () => {
      testProduct = await store.create({
        name: 'Test Product',
        price: 100,
        category: 'Test Category',
      });

      expect(testProduct).toBeDefined();
      expect(testProduct.name).toBe('Test Product');
      expect(testProduct.category).toBe('Test Category');
    });

    // Test for the show method
    it('should have a show method', () => {
      expect(typeof store.show).toBe('function');
    });

    it('show method should return the correct product', async () => {
      const result = await store.show(`${testProduct.id}`);

      expect(result).toBeDefined();
      expect(result.id).toBe(testProduct.id);
      expect(result.name).toBe('Test Product');
      expect(result.category).toBe('Test Category');
    });

    // Test for the update method
    it('should have an update method', () => {
      expect(typeof store.update).toBe('function');
    });

    it('should have an update method', () => {
      expect(typeof store.update).toBe('function');
    });

    it('update method should update the product details', async () => {
      const updatedProduct = await store.update(testProduct.id!, {
        name: 'Updated Product',
        price: 150,
        category: 'Updated Category',
      });

      if (updatedProduct !== null) {
        expect(updatedProduct).toBeDefined();
        expect(updatedProduct.id).toBe(testProduct.id);
        expect(updatedProduct.name).toBe('Updated Product');
        expect(updatedProduct.category).toBe('Updated Category');
      } else {
        throw new Error('Updated product is null');
      }
    });

    // Test for the delete method
    it('should have a delete method', () => {
      expect(typeof store.delete).toBe('function');
    });
  });

  describe('User Model', () => {
    const store = new UserStore();
    let userId: number;

    it('should have an index method', () => {
      expect(typeof store.index).toBe('function');
    });

    it('index method should return a list of users', async () => {
      const result = await store.index();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should have a show method', () => {
      expect(typeof store.show).toBe('function');
    });

    it('should have a create method', () => {
      expect(typeof store.create).toBe('function');
    });

    it('create method should add a user', async () => {
      const result = await store.create({
        firstName: 'Test',
        lastName: 'User',
        username: 'testuser',
        password: 'password123',
      });
      expect(result).toBeDefined();
      if (result) {
        expect(result.username).toBe('testuser');
        userId = result.id!;
      }
    });

    it('should have an update method', () => {
      expect(typeof store.update).toBe('function');
    });

    it('update method should update a user', async () => {
      const result = await store.update(userId, {
        firstName: 'Updated',
        lastName: 'User',
        username: 'updateduser',
        password: 'newpassword123',
      });
      expect(result).toBeDefined();
      if (result) {
        expect(result.username).toBe('updateduser');
      }
    });

    it('should have a delete method', () => {
      expect(typeof store.delete).toBe('function');
    });

    it('should have an authenticate method', () => {
      expect(typeof store.authenticate).toBe('function');
    });
  });

  afterAll((done) => {
    request
      .delete(`/orders/${orderId}/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err1) => {
        if (err1) {
          console.error('Error deleting order product:', err1);
        }

        request
          .delete(`/orders/${orderId}`)
          .set('Authorization', `Bearer ${token}`)
          .end((err2) => {
            if (err2) {
              console.error('Error deleting order:', err2);
            }

            request
              .delete(`/products/${productId}`)
              .set('Authorization', `Bearer ${token}`)
              .end((err3) => {
                if (err3) {
                  console.error('Error deleting product:', err3);
                }

                request
                  .delete(`/users/${userId1}`)
                  .set('Authorization', `Bearer ${token}`)
                  .end((err4) => {
                    if (err4) {
                      console.error('Error deleting user:', err4);
                    }
                    done();
                  });
              });
          });
      });
  });
});
