import express, { Request, Response } from 'express'
import { User, UserStore } from '../models/user'
import jwt from 'jsonwebtoken'


const store = new UserStore()


// It calls the UserStore instance's index method to retrieve all the users and sends them back as a JSON response.
const index = async (_req: Request, res: Response) => {
    const users = await store.index()
    res.json(users)
}



// The function creates a new Book object from the received data, then calls the BookStore instance's create method to store the book in the database, and sends back the newly created book as a JSON response. If an error occurs during the build process, an error message is returned as a JSON response with a 400 status code.
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
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string)

        next()
    } catch (error) {
        res.status(401)
    }
}


const authenticate = async (req: Request, res: Response) => {
    const user: User = {     
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        username: req.body.username, }
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
    };

    try {
        
        const authorizationHeader: any = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string);

        if (typeof decoded === 'string') {
            throw new Error('Invalid JWT payload.');
        }
        // Überprüfen, ob das dekodierte Benutzerobjekt vorhanden und die ID übereinstimmt
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
    app.get('/users', index)
    //app.get('/books/:id', show)
    app.post('/users', create)
    // app.delete('/books', destroy)
    //app.put('/users/:id', verifyAuthToken, update)
    app.put('/users/:id', verifyAuthToken, update)
}


// const mount = (app: express.Application) => {
//     app.get('/users', index)
//     app.get('/users/:id', show)
//     app.post('/users', verifyAuthToken, create)
//     app.put('/users/:id', verifyAuthToken, update)
//     app.delete('/users/:id', verifyAuthToken, destroy)
// }

export default users_routes