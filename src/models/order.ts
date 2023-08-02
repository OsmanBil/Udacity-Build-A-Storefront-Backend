import Client from '../database'

export type Order = {
    id?: number;
    user_id: number; // The ID of the user who placed the order
    status: string;
}

export class OrderStore {
    async index(): Promise<Order[]> {
        try {
            const conn = await Client.connect()
            const sql = 'SELECT * FROM orders'
            const result = await conn.query(sql)
            conn.release()
            return result.rows
        }
        catch (err) {
            throw new Error(`Unable to get orders: ${err}`)
        }
    }

    async create(order: Order): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
            const result = await conn.query(sql, [order.user_id, order.status]);
            const createdOrder = result.rows[0];
            conn.release();
            return createdOrder;
        } catch (err) {
            throw new Error(`Could not add new order: ${err}`);
        }
    }
    
    async update(orderId: number, orderUpdate: Partial<Order>): Promise<Order> {
        try {
            const conn = await Client.connect();
            const sql = 'UPDATE orders SET status=$1 WHERE id=$2 RETURNING *';
            const result = await conn.query(sql, [orderUpdate.status, orderId]);
            const updatedOrder = result.rows[0];
            conn.release();
            return updatedOrder;
        } catch (err) {
            throw new Error(`Could not update order ${orderId}: ${err}`);
        }
    }
    

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find order ${id}: ${err}`)
        }
    }
    
    async addProduct(quantity: number, orderId: string, productId: string): Promise<Order> {
        try {
            const getOrderSql = 'SELECT status FROM orders WHERE id = $1';
            const insertProductSql = 'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
            const conn = await Client.connect();
            const orderResult = await conn.query(getOrderSql, [orderId]);
            const order = orderResult.rows[0];
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found.`);
            }
    
            if (order.status !== 'active') {
                throw new Error(`Order with ID ${orderId} has status '${order.status}', and cannot accept new products.`);
            }
            const result = await conn.query(insertProductSql, [quantity, orderId, productId]);
            const addedProduct = result.rows[0];
            conn.release();
            return addedProduct;
        } catch (err) {
            throw new Error(`Could not add new product ${productId} to order ${orderId}: ${err}`);
        }
    }

    async getOrderProducts(orderId: number): Promise<any[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM order_products WHERE order_id = $1';
            const result = await conn.query(sql, [orderId]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get order products for order ${orderId}: ${err}`);
        }
    }

    async getActiveOrdersByUser(userId: string): Promise<Order[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM orders WHERE user_id=$1 AND status=\'active\'';
            const result = await conn.query(sql, [userId]);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get active orders for user ${userId}: ${err}`);
        }
    }
}