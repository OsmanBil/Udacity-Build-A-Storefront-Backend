import express, { Request, Response } from 'express'
import { Product, ProductStore } from '../models/product'
import { verifyAuthToken as authMiddleware } from './users';

const store = new ProductStore()

// Route handler to get all products from the database and send them as a JSON response
const index = async (_req: Request, res: Response) => {
    const products = await store.index()
    res.json(products)
}

// Route handler to get a specific product by ID from the database and send it as a JSON response
const show = async (req: Request, res: Response) => {
    const productId = req.params.id;
    const product = await store.show(productId);
    res.json(product)
}

// Route handler to create a new product in the database and send back the newly created product as a JSON response
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

// Route handler to delete a product from the database by ID and send back the deleted product as a JSON response
const destroy = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(req.body.id)
        res.json(deleted)
    }   catch (err) {
        res.status(400)
        res.json(err)
    }
}

// Define the products routes using the given application instance
const products_routes = (app: express.Application) => {
    app.get('/products', index); // Define the GET route for getting all products
    app.get('/products/:id', show); // Define the GET route for getting a specific product by ID
    app.post('/products', authMiddleware, create); // Define the POST route for creating a new product with authentication middleware
    app.delete('/products', authMiddleware, destroy); // Define the DELETE route for deleting a product with authentication middleware
}

export default products_routes