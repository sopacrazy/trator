import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../auth.js';

export interface AuthedRequest extends Request {
  user?: TokenPayload;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Não autenticado.' });
  }

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
}
