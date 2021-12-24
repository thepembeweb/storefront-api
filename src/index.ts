import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import dotenv from 'dotenv';
import dashboardRoutes from './handlers/dashboard';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import userRoutes from './handlers/users';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req: Request, res: Response) => {
  res.send('<h1>Storefront API</h1>');
});

dashboardRoutes(app);
orderRoutes(app);
productRoutes(app);
userRoutes(app);

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));

export default app;
