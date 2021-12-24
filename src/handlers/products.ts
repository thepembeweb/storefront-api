import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import { verifyAuthToken } from '../middleware/auth';
import { handleError } from '../utils/common-utils';

const store = new ProductStore();

const index = async (_req: Request, res: Response) => {
  try {
    const products = await store.index();
    res.json(products);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(req.params.id);
    res.json(product);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };

    const newProduct = await store.create(product);
    res.json(newProduct);
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
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };

    const updatedProduct = await store.update(id, product);
    res.json(updatedProduct);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const destroy = async (req: Request, res: Response): Promise<void> => {
  try {
    const deleted = await store.delete(req.params.id);
    res.json(deleted);
  } catch (error: unknown) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.put('/products/:id', verifyAuthToken, update);
  app.delete('/products/:id', verifyAuthToken, destroy);
};

export default productRoutes;
