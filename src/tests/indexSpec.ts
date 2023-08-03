import supertest from 'supertest';
import express from 'express';
import app from '../server';
import path from 'path';

const request = supertest(app);

describe('Test endpoint responses', () => {
    // Endpoint index
    it('gets the index endpoint', async () => {
      const response = await request.get('/');
      expect(response.status).toBe(200);
    });
    // // Endpoint api
    // it('gets the api endpoint', async () => {
    //   const response = await request.get('/api');
    //   expect(response.status).toBe(200);
    // });
    // // Endpoint images
    // it('gets the images endpoint', async () => {
    //   const response = await request.get('/api/images');
    //   expect(response.status).toBe(400);
    // });
  });