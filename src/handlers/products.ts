import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import jwt from 'jsonwebtoken'
import { verifyAuthToken as authMiddleware } from './users';

const store = new ProductStore()

const index = async (_req: Request, res: Response) => {
    const products = await store.index()
    res.json(products)
}

const show = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await store.show(productId);
    res.json(product)
}

const create = async (req: Request, res: Response) => {
    const product: Product = {
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
    }

    try {
        const newProduct = await store.create(product)
        res.json(newProduct)
    }   catch (err) {
        res.status(400)
        res.json(err)
    }
}

const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(req.body.id)
        res.json(deleted)
    }   catch (err) {
        res.status(400)
        res.json(err)
    }
}

const products_routes = (app: express.Application) => {
    app.get('/products', index)
    app.get('/products/:id', show)
    app.post('/products',authMiddleware, create)
    app.delete('/products',authMiddleware, destroy)
}

export default products_routes