import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import users_routes from './handlers/users';
import products_routes from './handlers/products';
import order_routes from './handlers/orders';
import dashboard_routes from './handlers/dashboard';

const app: express.Application = express(); // Create an Express application (App)
const address: string = '0.0.0.0:3000'; // The address and port on which the server will run

app.use(bodyParser.json()); // Use the bodyParser middleware to parse the request body if it is in JSON format

// Define a route handler for the main endpoint ('/') of the server
app.get('/', function (req: Request, res: Response) {
  res.send('Main Route is working');
});

// Connect the user routes handler, product routes handler, and order routes handler to the Express app
users_routes(app);
products_routes(app);
order_routes(app);
dashboard_routes(app);

// Start the server and make it listen for incoming connections on port 3000
app.listen(3000, function () {
  console.log(`Starting app on: ${address}`);
});

export default app;