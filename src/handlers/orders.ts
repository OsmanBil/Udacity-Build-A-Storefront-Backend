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
        product_id: [],
        user_id: 0,
    };
    try {
        const authorizationHeader: any = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.TOKEN_SECRET as string);

        // Überprüfen, ob der Benutzer im JWT-Token vorhanden ist und eine ID hat
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
        const addedProduct = await store.addProduct(quantity, orderId, productId )
        res.json(addedProduct)
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


const order_routes = (app: express.Application) => {
    app.get('/orders', index)
    //app.get('/orders/:id', show)
    app.post('/orders', authMiddleware, create)
    // add product
    app.post('/orders/:id/products', addProduct)
}

export default order_routes