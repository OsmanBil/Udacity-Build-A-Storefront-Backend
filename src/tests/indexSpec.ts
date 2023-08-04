import supertest from 'supertest';
import app from '../server';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
