import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  // Function to get all products from the database
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Unable to get products: ${err}`);
    }
  }

  // Function to get a specific product by ID from the database
  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}: ${err}`);
    }
  }

  // Function to create a new product in the database
  async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      const result = await conn.query(sql, [p.name, p.price, p.category]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not add new product ${p.name}: ${err}`);
    }
  }

  // Function to update a product's information in the database
  async update(
    id: number,
    updatedProduct: Partial<Product>,
  ): Promise<Product | null> {
    try {
      const conn = await Client.connect();
      const existingProduct = await this.findById(id);

      if (!existingProduct) {
        throw new Error(`Product with ID ${id} not found.`);
      }
      const mergedProduct: Product = { ...existingProduct, ...updatedProduct };
      const sql =
        'UPDATE products SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *';
      const result = await conn.query(sql, [
        mergedProduct.name,
        mergedProduct.price,
        mergedProduct.category,
        id,
      ]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Unable to update product (ID: ${id}): ${err}`);
    }
  }

  // Function to delete a product from the database by ID
  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not delete product ${id}: ${err}`);
    }
  }

  // Function to find a product by ID in the database
  async findById(id: number): Promise<Product | null> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products WHERE id = $1';
      const result = await conn.query(sql, [id]);
      conn.release();
      if (result.rows.length) {
        return result.rows[0];
      }
      return null;
    } catch (err) {
      throw new Error(`Unable to find product (ID: ${id}): ${err}`);
    }
  }
}
