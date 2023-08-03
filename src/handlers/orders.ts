import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import jwt from 'jsonwebtoken'
import { verifyAuthToken as authMiddleware } from './auth';


const store = new OrderStore()

// Route handler to get all orders from the database and send them as a JSON response
const index = async (_req: Request, res: Response) => {
    const orders = await store.index()
    res.json(orders)
}

// Route handler to get a specific order by ID from the database and send it as a JSON response
const show = async (_req: Request, res: Response) => {
    const order = await store.show(_req.params.id)
    res.json(order)
}

// Route handler to create a new order in the database and send back the newly created order as a JSON response
const create = async (req: Request, res: Response) => {
    const order: Order = {
        status: req.body.status,
        user_id: 0,
    };
    try {
        const authorizationHeader: any = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET as string);

        if (decoded && decoded.user && decoded.user.id) {
            order.user_id = decoded.user.id;
        } else {
            throw new Error('Unable to get user ID from the token.');
        }

        const newOrder = await store.create(order);
        res.json(newOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

// Route handler to add a product to an order in the database and send back the added product as a JSON response
const addProduct = async (_req: Request, res: Response) => {
    const orderId: number = parseInt(_req.params.id, 10);
    const productId: number = _req.body.productId
    const quantity: number = parseInt(_req.body.quantity)

    try {
        const addedProduct = await store.addProduct(quantity, orderId, productId)
        res.json(addedProduct)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

// Route handler to get all products of an order from the database and send them as a JSON response
const getOrderProducts = async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id);
    try {
        const orderProducts = await store.getOrderProducts(orderId);
        res.json(orderProducts);
    } catch (err) {
        res.status(400)
        res.json(err)
    }

};

// Route handler to get all active orders of a user from the database and send them as a JSON response
const getActiveOrdersByUser = async (req: Request, res: Response) => {
    const userId = req.params.id;
    try {
        const activeOrders = await store.getActiveOrdersByUser(userId);
        res.json(activeOrders);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

// Route handler to update an order's information in the database and send back the updated order as a JSON response
const update = async (req: Request, res: Response) => {
    const orderId = parseInt(req.params.id);
    const orderUpdate: Partial<Order> = {
        status: req.body.status
    };

    try {
        const updatedOrder = await store.update(orderId, orderUpdate);
        res.json(updatedOrder);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

// Define the order routes using the given application instance
const order_routes = (app: express.Application) => {
    app.get('/orders', index); // Define the GET route for getting all orders
    app.get('/orders/:id', authMiddleware, show); // Define the GET route for getting a specific order by ID with authentication middleware
    app.get('/orders/users/:id', authMiddleware, getActiveOrdersByUser); // Define the GET route for getting all active orders of a user with authentication middleware
    app.post('/orders', authMiddleware, create); // Define the POST route for creating a new order with authentication middleware
    app.get('/orders/:id/products', authMiddleware, getOrderProducts); // Define the GET route for getting all products of an order with authentication middleware
    app.put('/orders/:id', authMiddleware, update); // Define the PUT route for updating an order by ID with authentication middleware
    app.post('/orders/:id/products',authMiddleware, addProduct); // Define the POST route for adding a product to an order
}

export default order_routes