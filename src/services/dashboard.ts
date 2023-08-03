import Client from '../database'


export type Order = {
    id?: number;
    user_id: number;
    status: string;
}

export class DashboardStore {
    // Function to get all products for a specific order from the database
    async getOrderProducts(orderId: number): Promise<Order[]> {
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

    // Function to get all active orders for a specific user from the database
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