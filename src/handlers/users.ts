import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import {
  verifyAuthToken as authMiddleware,
  verifyDecodedUser as verifyDecodedUserMiddleware,
} from './auth';

const store = new UserStore(); // Create a new instance of the UserStore class

// Route handler to get all users from the database and send them as a JSON response
const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

// Route handler to get a specific user by ID from the database and send it as a JSON response
const show = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await store.show(userId);
    res.json(user);
  } catch (err: unknown) {
    if (err instanceof Error) {
      // Zugriff auf err.message ist hier sicher
      if (err.message === `User ${userId} not found`) {
        res.status(404).send(`User ${userId} not found`);
      } else {
        res.status(500).send(err);
      }
    } else {
      // err ist nicht vom Typ Error
      res.status(500).send('An unexpected error occurred.');
    }
  }
};

// Route handler to create a new user in the database and send back the newly created user as a JSON response
const create = async (req: Request, res: Response) => {
  const user: User = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password,
    username: req.body.username,
  };

  try {
    const newUser = await store.create(user);
    const token = jwt.sign(
      { user: newUser },
      process.env.TOKEN_SECRET as string,
    );
    res.json(token);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// Route handler to update a user's information in the database and send back the updated user as a JSON response
const update = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const userUpdate: Partial<User> = {
    username: req.body.username,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  };

  try {
    const updatedUser = await store.update(userId, userUpdate);
    res.json(updatedUser);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// Route handler to delete a user from the database by ID and send back the deleted user as a JSON response
const destroy = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const deleted = await store.delete(userId);
    res.json(deleted);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

// Export the users_routes function as a default export so that it can be imported into other files and used to define the routes for the users API
const users_routes = (app: express.Application) => {
  app.get('/users', authMiddleware, index); // Define the GET route for getting all users
  app.get('/users/:id', authMiddleware, show); // Define the GET route for getting a specific user by ID
  app.post('/users', create); // Define the POST route for creating a new user
  app.put('/users/:id', authMiddleware, verifyDecodedUserMiddleware, update); // Define the PUT route for updating a user by ID
  app.delete('/users/:id', authMiddleware, destroy); // Define the DELETE route for deleting a user with authentication middleware
};

export default users_routes;
