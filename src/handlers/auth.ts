import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Middleware function to verify the authenticity of the JWT token
export const verifyAuthToken = (
  req: Request,
  res: Response,
  next: () => void,
) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401);
    res.json('Access denied, no token provided');
    return;
  }

  try {
    const token = authorizationHeader.split(' ')[1];
    jwt.verify(token, process.env.TOKEN_SECRET as string);
    next();
  } catch (err) {
    res.status(401);
    res.json('Access denied, invalid token');
    return;
  }
};

// Middleware function to verify if the decoded user from the JWT token matches the requested user ID
export const verifyDecodedUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    res.status(401).json({ message: 'Access denied, no token provided.' });
    return;
  }

  const decoded = jwt.decode(authorizationHeader.split(' ')[1]);

  if (!decoded || typeof decoded === 'string') {
    res.status(401).json({ message: 'Invalid JWT payload.' });
    return;
  }

  const userId = parseInt(req.params.id);

  if (decoded.user && decoded.user.id === userId) {
    next();
  } else {
    res.status(401).json({ message: 'Access denied, invalid token' });
  }
};
