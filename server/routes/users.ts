import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../asyncHandler.js';

interface UserRow {
  id: number;
  username: string;
  name: string;
  active: number;
}

export const usersRouter = Router();
usersRouter.use(requireAuth);

usersRouter.get('/', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT id, username, name, active FROM users ORDER BY name');
  res.json((rows as UserRow[]).map(u => ({
    id: String(u.id), username: u.username, name: u.name, active: !!u.active,
  })));
}));

usersRouter.post('/', asyncHandler(async (req, res) => {
  const { username, password, name } = req.body as { username?: string; password?: string; name?: string };

  if (!username || !password || !name) {
    return res.status(400).json({ error: 'Informe usuário, senha e nome.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if ((existing as unknown[]).length > 0) {
    return res.status(409).json({ error: 'Este nome de usuário já está em uso.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    'INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)',
    [username, hash, name]
  );
  const insertId = (result as { insertId: number }).insertId;

  res.status(201).json({ id: String(insertId), username, name, active: true });
}));

usersRouter.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('UPDATE users SET active = NOT active WHERE id = ?', [id]);
  const [rows] = await pool.query('SELECT id, username, name, active FROM users WHERE id = ?', [id]);
  const user = (rows as UserRow[])[0];
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
  res.json({ id: String(user.id), username: user.username, name: user.name, active: !!user.active });
}));
