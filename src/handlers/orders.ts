import express, { Request, Response } from 'express'
import { Order, OrderStore } from '../models/order'
import jwt from 'jsonwebtoken'
import { verifyAuthToken as authMiddleware } from './users';


const store = new OrderStore()

const index = async (_req: Request, res: Response) => {
    const orders = await store.index()
    res.json(orders)
}

const show = async (_req: Request, res: Response) => {
    console.log(_req.params)
    const order = await store.show(_req.params.id)
    res.json(order)
}

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

const addProduct = async (_req: Request, res: Response) => {
    const orderId: any = _req.params.id
    const productId: string = _req.body.productId
    const quantity: any = parseInt(_req.body.quantity)

    try {
        const addedProduct = await store.addProduct(quantity, orderId, productId)
        res.json(addedProduct)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

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

const getActiveOrdersByUser = async (req: Request, res: Response) => {
    const userId = req.params.id; // oder extrahieren Sie es aus dem Token, wie Sie es bei der `create` Funktion gemacht haben
    try {
        const activeOrders = await store.getActiveOrdersByUser(userId);
        res.json(activeOrders);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

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

const order_routes = (app: express.Application) => {
    app.get('/orders', index)
    app.get('/orders/:id', authMiddleware, show)
    app.get('/orders/users/:id', authMiddleware, getActiveOrdersByUser);
    app.post('/orders', authMiddleware, create)
    app.get('/orders/:id/products', authMiddleware, getOrderProducts);
    app.put('/orders/:id', authMiddleware, update);
    // add product
    app.post('/orders/:id/products', addProduct)
}

export default order_routes