import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import jwt from 'jsonwebtoken'

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
        const authorizationHeader: any = req.headers.authorization
        const token = authorizationHeader.split(' ')[1]

        jwt.verify(token, process.env.TOKEN_SECRET as string)
    }   catch (err) {
        res.status(401)
        res.json(`Invalid token ${err}`)
        return
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
        const authorizationHeader: any = req.headers.authorization
        const token = authorizationHeader.split(' ')[1]
        jwt.verify(token, process.env.TOKEN_SECRET as string)
    }   catch (err) {
        res.status(401)
        res.json('Access denied, invalid token')
        return
    }

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
    app.post('/products', create)
    app.delete('/products', destroy)
}

export default products_routes