import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../asyncHandler.js';

interface OperatorRow {
  id: number;
  name: string;
  registration: string;
  active: number;
}

const toDto = (o: OperatorRow) => ({
  id: String(o.id), name: o.name, registration: o.registration, active: !!o.active,
});

export const operatorsRouter = Router();
operatorsRouter.use(requireAuth);

operatorsRouter.get('/', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM operators ORDER BY name');
  res.json((rows as OperatorRow[]).map(toDto));
}));

operatorsRouter.post('/', asyncHandler(async (req, res) => {
  const { name, registration } = req.body as { name?: string; registration?: string };
  if (!name || !registration) {
    return res.status(400).json({ error: 'Informe nome e matrícula.' });
  }
  const [result] = await pool.query(
    'INSERT INTO operators (name, registration) VALUES (?, ?)',
    [name, registration]
  );
  const insertId = (result as { insertId: number }).insertId;
  res.status(201).json(toDto({ id: insertId, name, registration, active: 1 }));
}));

operatorsRouter.patch('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name, registration } = req.body as { name?: string; registration?: string };
  if (!name || !registration) {
    return res.status(400).json({ error: 'Informe nome e matrícula.' });
  }
  await pool.query('UPDATE operators SET name = ?, registration = ? WHERE id = ?', [name, registration, id]);
  const [rows] = await pool.query('SELECT * FROM operators WHERE id = ?', [id]);
  const operator = (rows as OperatorRow[])[0];
  if (!operator) return res.status(404).json({ error: 'Operador não encontrado.' });
  res.json(toDto(operator));
}));

operatorsRouter.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [openUsages] = await pool.query(
    "SELECT id FROM usage_records WHERE operator_id = ? AND status = 'OPEN'",
    [id]
  );
  if ((openUsages as unknown[]).length > 0) {
    return res.status(409).json({ error: 'Não é possível desativar um operador com uso em aberto.' });
  }

  await pool.query('UPDATE operators SET active = NOT active WHERE id = ?', [id]);
  const [rows] = await pool.query('SELECT * FROM operators WHERE id = ?', [id]);
  const operator = (rows as OperatorRow[])[0];
  if (!operator) return res.status(404).json({ error: 'Operador não encontrado.' });
  res.json(toDto(operator));
}));
