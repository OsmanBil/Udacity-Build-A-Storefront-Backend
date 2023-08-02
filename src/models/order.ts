import Client from '../database'

export type Order = {
    id?: number;
    product_id: number[]; // An array of product IDs
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
            const sql = 'INSERT INTO orders (product_id, user_id, status) VALUES($1, $2, $3) RETURNING *';

            const result = await conn.query(sql, [order.product_id, order.user_id, order.status]);
            const createdOrder = result.rows[0];

            conn.release();

            return createdOrder;
        } catch (err) {
            throw new Error(`Could not add new order: ${err}`);
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
    
            // Überprüfe den Status des Auftrags (Order)
            const orderResult = await conn.query(getOrderSql, [orderId]);
            const order = orderResult.rows[0];
    
            if (!order) {
                throw new Error(`Order with ID ${orderId} not found.`);
            }
    
            if (order.status !== 'active') {
                throw new Error(`Order with ID ${orderId} has status '${order.status}', and cannot accept new products.`);
            }
    
            // Füge den Eintrag in die Tabelle "order_products" hinzu
            const result = await conn.query(insertProductSql, [quantity, orderId, productId]);
            const addedProduct = result.rows[0];
    
            conn.release();
    
            return addedProduct;
        } catch (err) {
            throw new Error(`Could not add new product ${productId} to order ${orderId}: ${err}`);
        }
    }

}