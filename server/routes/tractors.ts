import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { asyncHandler } from '../asyncHandler.js';

interface TractorRow {
  id: number;
  name: string;
  plate: string;
  model: string;
  active: number;
}

const toDto = (t: TractorRow) => ({
  id: String(t.id), name: t.name, plate: t.plate, model: t.model, active: !!t.active,
});

export const tractorsRouter = Router();
tractorsRouter.use(requireAuth);

tractorsRouter.get('/', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM tractors ORDER BY name');
  res.json((rows as TractorRow[]).map(toDto));
}));

tractorsRouter.post('/', asyncHandler(async (req, res) => {
  const { name, plate, model } = req.body as { name?: string; plate?: string; model?: string };
  if (!name || !plate || !model) {
    return res.status(400).json({ error: 'Informe nome, placa e modelo.' });
  }
  const [result] = await pool.query(
    'INSERT INTO tractors (name, plate, model) VALUES (?, ?, ?)',
    [name, plate, model]
  );
  const insertId = (result as { insertId: number }).insertId;
  res.status(201).json(toDto({ id: insertId, name, plate, model, active: 1 }));
}));

tractorsRouter.patch('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { name, plate, model } = req.body as { name?: string; plate?: string; model?: string };
  if (!name || !plate || !model) {
    return res.status(400).json({ error: 'Informe nome, placa e modelo.' });
  }
  await pool.query('UPDATE tractors SET name = ?, plate = ?, model = ? WHERE id = ?', [name, plate, model, id]);
  const [rows] = await pool.query('SELECT * FROM tractors WHERE id = ?', [id]);
  const tractor = (rows as TractorRow[])[0];
  if (!tractor) return res.status(404).json({ error: 'Trator não encontrado.' });
  res.json(toDto(tractor));
}));

tractorsRouter.patch('/:id/toggle', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const [openUsages] = await pool.query(
    "SELECT id FROM usage_records WHERE tractor_id = ? AND status = 'OPEN'",
    [id]
  );
  if ((openUsages as unknown[]).length > 0) {
    return res.status(409).json({ error: 'Não é possível desativar um trator com uso em aberto.' });
  }

  await pool.query('UPDATE tractors SET active = NOT active WHERE id = ?', [id]);
  const [rows] = await pool.query('SELECT * FROM tractors WHERE id = ?', [id]);
  const tractor = (rows as TractorRow[])[0];
  if (!tractor) return res.status(404).json({ error: 'Trator não encontrado.' });
  res.json(toDto(tractor));
}));
