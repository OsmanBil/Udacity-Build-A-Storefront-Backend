import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export class OrderStore {
  // Function to get all orders from the database
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get orders: ${err}`);
    }
  }

  // Function to create a new order in the database
  async create(order: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const result = await conn.query(sql, [order.user_id, order.status]);
      const createdOrder = result.rows[0];
      conn.release();
      return createdOrder;
    } catch (err) {
      throw new Error(`Could not add new order: ${err}`);
    }
  }

  // Function to update the status of an order in the database
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

  // Function to get a specific order by ID from the database
  async show(id: string): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}: ${err}`);
    }
  }

  // Function to add a product to an order in the database
  async addProduct(
    quantity: number,
    orderId: number,
    productId: number,
  ): Promise<Order> {
    try {
      const getOrderSql = 'SELECT status FROM orders WHERE id = $1';
      const insertProductSql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();
      const orderResult = await conn.query(getOrderSql, [orderId]);
      const order = orderResult.rows[0];
      if (!order) {
        throw new Error(`Order with ID ${orderId} not found.`);
      }

      if (order.status !== 'active') {
        throw new Error(
          `Order with ID ${orderId} has status '${order.status}', and cannot accept new products.`,
        );
      }
      const result = await conn.query(insertProductSql, [
        quantity,
        orderId,
        productId,
      ]);
      const addedProduct = result.rows[0];
      conn.release();
      return addedProduct;
    } catch (err) {
      throw new Error(
        `Could not add new product ${productId} to order ${orderId}: ${err}`,
      );
    }
  }
}
