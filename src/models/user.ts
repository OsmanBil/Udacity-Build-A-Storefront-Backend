import Client from '../database';
import bcrypt from 'bcrypt';

export type User = {
    firstName: string;
    lastName: string;
    password: string;
    id?: number;
    username: string;
}


const pepper = 'your-pepper-value'; // A pepper value used to add extra randomness to password hashing
const saltRounds: number = 10; // The number of salt rounds used for password hashing


export class UserStore {
    // Function to get all users from the database
    async index(): Promise<User[]> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users';
            const result = await conn.query(sql);
            conn.release();
            return result.rows;
        } catch (err) {
            throw new Error(`Could not get users. Error: ${err}`);
        }
    }

    // Function to get a specific user by ID from the database
    async show(id: string): Promise<User> {
        try {
            const sql = 'SELECT * FROM users WHERE id=($1)'
            const conn = await Client.connect()
            const result = await conn.query(sql, [id])
            conn.release()
            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find product ${id}: ${err}`)
        }
    }

    // Function to create a new user in the database
    async create(u: User): Promise<User> {
        try {
            const conn = await Client.connect()
            const sql = 'INSERT INTO users (firstName, lastName, username, password) VALUES($1, $2, $3, $4) RETURNING *'
            const hash = bcrypt.hashSync(u.password + pepper, saltRounds);
            const result = await conn.query(sql, [u.firstName, u.lastName, u.username, hash])
            const user = result.rows[0]
            conn.release()
            return user
        } catch (err) {
            throw new Error(`unable create user (${u.username}): ${err}`)
        }
    }

    // Function to authenticate a user based on the provided username and password
    async authenticate(username: string, password: string): Promise<User | null> {
        const conn = await Client.connect()
        const sql = 'SELECT password FROM users WHERE username=($1)'
        const result = await conn.query(sql, [username])

        if (result.rows.length) {
            const user = result.rows[0]

            if (bcrypt.compareSync(password + pepper, user.password)) {
                return user
            }
        }
        return null
    }

    // Function to update a user's information in the database
    async update(id: number, updatedUser: Partial<User>): Promise<User | null> {
        try {
            const conn = await Client.connect();
            const existingUser = await this.findById(id);

            if (!existingUser) {
                throw new Error(`User with ID ${id} not found.`);
            }
            const mergedUser: User = { ...existingUser, ...updatedUser };
            const sql = 'UPDATE users SET firstName = $1, lastName = $2, username = $3, password = $4 WHERE id = $5 RETURNING *';
            const hash = bcrypt.hashSync(mergedUser.password + pepper, saltRounds);
            const result = await conn.query(sql, [mergedUser.firstName, mergedUser.lastName, mergedUser.username, hash, id]);
            const user = result.rows[0];
            conn.release();
            return user;
        } catch (err) {
            throw new Error(`Unable to update user (ID: ${id}): ${err}`);
        }
    }

    // Function to find a user by ID in the database
    async findById(id: number): Promise<User | null> {
        try {
            const conn = await Client.connect();
            const sql = 'SELECT * FROM users WHERE id = $1';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length) {
                return result.rows[0];
            }
            return null;
        } catch (err) {
            throw new Error(`Unable to find user (ID: ${id}): ${err}`);
        }
    }
}