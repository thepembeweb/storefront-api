import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import jwt, { Secret } from 'jsonwebtoken';

dotenv.config();

export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader?.split(' ')[1] || '';

    jwt.verify(token, process.env.JWT_SECRET as Secret);

    next();
  } catch (err) {
    res.status(401).json(err);
  }
};
