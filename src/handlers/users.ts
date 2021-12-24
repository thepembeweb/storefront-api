import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import { User, UserStore } from '../models/user';
import { verifyAuthToken } from '../middleware/auth';
import { handleError } from '../utils/common-utils';

dotenv.config();

const store = new UserStore();

const index = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.show(req.params.id);
    res.json(user);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const user: User = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    };

    const newUser = await store.create(user);
    res.json(newUser);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id;
    const user: User = {
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    };

    const updatedUser = await store.update(id, user);
    res.json(updatedUser);
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

const authenticate = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await store.authenticate(req.body.username, req.body.password);
    const token = jwt.sign({ user }, process.env.JWT_SECRET as Secret, {
      expiresIn: '1h'
    });
    res.json(token);
  } catch (error) {
    const errorResponse = handleError(error);

    res.status(errorResponse.status).send({
      error: errorResponse
    });
  }
};

const userRoutes = (app: express.Application): void => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.put('/users/:id', verifyAuthToken, update);
  app.delete('/users/:id', verifyAuthToken, destroy);
  app.post('/authenticate', authenticate);
};

export default userRoutes;
