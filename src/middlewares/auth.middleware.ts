import { Injectable, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface TokenPayload {
  walletId: string;
  transaction: string;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction) {
    const token = request.headers.authorization;

    if (!token) {
      return response.status(401).json({
        error: ['Token is required!'],
      });
    }

    try {
      const data = jwt.verify(token, process.env.TOKEN_SECRET);

      const { walletId } = data as TokenPayload;
      response.locals.walletId = walletId;
      next();
    } catch (error) {
      return response.status(401).json({
        error: ['Token invalid!'],
      });
    }
  }
}
