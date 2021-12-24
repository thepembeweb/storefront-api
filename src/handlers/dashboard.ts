import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import { verifyAuthToken } from '../middleware/auth';
import { handleError } from '../utils/common-utils';

const queries = new DashboardQueries();

const productsByCategory = async (req: Request, res: Response) => {
  try {
    const products = await queries.productsByCategory(req.params.category);
    res.json(products);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const topFiveProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.topFiveProducts();
    res.json(products);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const ordersByUser = async (req: Request, res: Response) => {
  try {
    const products = await queries.ordersByUser(req.params.id);
    res.json(products);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const completedOrdersByUser = async (req: Request, res: Response) => {
  try {
    const products = await queries.completedOrdersByUser(req.params.id);
    res.json(products);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const dashboardRoutes = (app: express.Application) => {
  app.get('/products/category/:category', productsByCategory);
  app.get('/top-five-products', verifyAuthToken, topFiveProducts);
  app.get('/users/:id/orders/active', verifyAuthToken, ordersByUser);
  app.get('/users/:id/orders/complete', verifyAuthToken, completedOrdersByUser);
};

export default dashboardRoutes;
