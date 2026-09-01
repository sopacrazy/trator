import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { signToken } from '../auth.js';
import { requireAuth, AuthedRequest } from '../middleware/requireAuth.js';
import { asyncHandler } from '../asyncHandler.js';

interface UserRow {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  active: number;
}

export const authRouter = Router();

authRouter.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (!username || !password) {
    return res.status(400).json({ error: 'Informe usuário e senha.' });
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  const user = (rows as UserRow[])[0];

  if (!user || !user.active) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Usuário ou senha inválidos.' });
  }

  const token = signToken({ id: user.id, username: user.username, name: user.name });
  res.json({
    token,
    user: { id: String(user.id), username: user.username, name: user.name },
  });
}));

authRouter.get('/me', requireAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const [rows] = await pool.query('SELECT id, username, name, active FROM users WHERE id = ?', [req.user!.id]);
  const user = (rows as UserRow[])[0];

  if (!user || !user.active) {
    return res.status(401).json({ error: 'Sessão inválida.' });
  }

  res.json({ id: String(user.id), username: user.username, name: user.name });
}));
