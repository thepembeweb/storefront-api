import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/order';
import { verifyAuthToken } from '../middleware/auth';
import { handleError } from '../utils/common-utils';

const store = new OrderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const orders = await store.index();
    res.json(orders);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.params.id);
    res.json(order);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order: Order = {
      userId: req.body.userId,
      status: req.body.status
    };

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const order: Order = {
      userId: req.body.userId,
      status: req.body.status
    };

    const updatedOrder = await store.update(id, order);
    res.json(updatedOrder);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const addProduct = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { productId, quantity } = req.body;

    const newOrder = await store.addProduct(id, productId, parseInt(quantity));
    res.json(newOrder);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const removeProduct = async (req: Request, res: Response) => {
  try {
    const { id, productId } = req.params;

    const deletedOrder = await store.deleteProduct(id, productId);
    res.json(deletedOrder);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', verifyAuthToken, show);
  app.post('/orders', verifyAuthToken, create);
  app.put('/orders/:id', verifyAuthToken, update);
  app.delete('/orders/:id', verifyAuthToken, destroy);
  app.post('/orders/:id/products', verifyAuthToken, addProduct);
  app.delete('/orders/:id/products/:productId', verifyAuthToken, removeProduct);
};

export default orderRoutes;
