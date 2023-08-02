import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'


const store = new UserStore()

// It calls the UserStore instance's index method to retrieve all the users and sends them back as a JSON response.
const index = async (_req: Request, res: Response) => {
    try {
        const authorizationHeader: any = _req.headers.authorization
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
    const users = await store.index()
    res.json(users)
}

const show = async (req: Request, res: Response) => {
    const userId = req.params.id;
    const user = await store.show(userId);
    res.json(user);
};

// The function creates a new User object from the received data, then calls the UserStore instance's create method to store the user in the database, and sends back the newly created user as a JSON response. If an error occurs during the build process, an error message is returned as a JSON response with a 400 status code.
const create = async (req: Request, res: Response) => {
    const user: User = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        username: req.body.username,
    }

    try {
        const newUser = await store.create(user)
        var token = jwt.sign({ user: newUser }, process.env.TOKEN_SECRET as string, { expiresIn: '1h' });
        res.json(token)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

const verifyAuthToken = (req: Request, res: Response, next: () => void) => {
    try {
        const authorizationHeader: any = req.headers.authorization
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
        next();
    } catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }
}


const authenticate = async (req: Request, res: Response) => {
    const user: User = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        username: req.body.username,
    }
    try {
        const u = await store.authenticate(user.username, user.password)
        var token = jwt.sign({ user: u }, process.env.TOKEN_SECRET as string);
        res.json(token)
    }
    catch (error) {
        res.status(401)
        res.json({ error })
    }
}


const update = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const userUpdate: Partial<User> = {
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };

    try {
        const authorizationHeader: any = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

        if (typeof decoded === 'string') {
            throw new Error('Invalid JWT payload.');
        }
        // Verify that the decoded user object exists and the ID matches
        if (decoded.user && decoded.user.id === userId) {
            const updatedUser = await store.update(userId, userUpdate);
            res.json(updatedUser);
        } else {
            res.status(401);
            res.json({ error: 'Unauthorized: You can only update your own user.' });
        }
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

// The code exports the books_routes function as a default export so that it can be imported into other files and used in an Express application to define the routes for the books API.
const users_routes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, index)
    app.get('/users/:id', verifyAuthToken, show)
    app.post('/users', create)
    app.put('/users/:id', verifyAuthToken, update)
}

export default users_routes