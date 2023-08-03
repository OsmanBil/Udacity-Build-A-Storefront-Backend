import express, { Request, Response } from 'express'
import { verifyAuthToken as authMiddleware } from './auth';
import { DashboardStore } from '../services/dashboard';

const store = new DashboardStore()

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


// Define the order routes using the given application instance
const dashboard_routes = (app: express.Application) => {
    app.get('/orders/users/:id', authMiddleware, getActiveOrdersByUser); // Define the GET route for getting all active orders of a user with authentication middleware
    app.get('/orders/:id/products', authMiddleware, getOrderProducts); // Define the GET route for getting all products of an order with authentication middleware
}

export default dashboard_routes