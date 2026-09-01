import { Router } from 'express';
import { pool, toMysqlDatetime, fromMysqlDatetime } from '../db.js';
import { requireAuth, AuthedRequest } from '../middleware/requireAuth.js';
import { asyncHandler } from '../asyncHandler.js';

interface UsageRow {
  id: number;
  tractor_id: number;
  operator_id: number;
  departure_time: string;
  initial_rpm: number;
  destination: string;
  departure_notes: string | null;
  return_time: string | null;
  final_rpm: number | null;
  return_notes: string | null;
  status: 'OPEN' | 'CLOSED';
}

const toDto = (u: UsageRow) => ({
  id: String(u.id),
  tractorId: String(u.tractor_id),
  operatorId: String(u.operator_id),
  departureTime: fromMysqlDatetime(u.departure_time),
  initialRpm: u.initial_rpm,
  destination: u.destination,
  departureNotes: u.departure_notes ?? undefined,
  returnTime: fromMysqlDatetime(u.return_time),
  finalRpm: u.final_rpm ?? undefined,
  returnNotes: u.return_notes ?? undefined,
  status: u.status,
});

export const usagesRouter = Router();
usagesRouter.use(requireAuth);

usagesRouter.get('/', asyncHandler(async (_req, res) => {
  const [rows] = await pool.query('SELECT * FROM usage_records ORDER BY departure_time DESC');
  res.json((rows as UsageRow[]).map(toDto));
}));

usagesRouter.post('/', asyncHandler(async (req: AuthedRequest, res) => {
  const { tractorId, operatorId, departureTime, initialRpm, destination, departureNotes } = req.body as {
    tractorId?: string; operatorId?: string; departureTime?: string;
    initialRpm?: number; destination?: string; departureNotes?: string;
  };

  if (!tractorId || !operatorId || !departureTime || initialRpm === undefined || !destination) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  const [openUsages] = await pool.query(
    "SELECT id FROM usage_records WHERE tractor_id = ? AND status = 'OPEN'",
    [Number(tractorId)]
  );
  if ((openUsages as unknown[]).length > 0) {
    return res.status(409).json({ error: 'Este trator já está em uso.' });
  }

  const [result] = await pool.query(
    `INSERT INTO usage_records
      (tractor_id, operator_id, departure_time, initial_rpm, destination, departure_notes, status, created_by)
     VALUES (?, ?, ?, ?, ?, ?, 'OPEN', ?)`,
    [Number(tractorId), Number(operatorId), toMysqlDatetime(departureTime), initialRpm, destination, departureNotes || null, req.user!.id]
  );
  const insertId = (result as { insertId: number }).insertId;

  const [rows] = await pool.query('SELECT * FROM usage_records WHERE id = ?', [insertId]);
  res.status(201).json(toDto((rows as UsageRow[])[0]));
}));

usagesRouter.patch('/:id/return', asyncHandler(async (req, res) => {
  const id = Number(req.params.id);
  const { returnTime, finalRpm, returnNotes } = req.body as {
    returnTime?: string; finalRpm?: number; returnNotes?: string;
  };

  if (!returnTime || finalRpm === undefined) {
    return res.status(400).json({ error: 'Preencha a data de retorno e o RPM final.' });
  }

  const [rows] = await pool.query('SELECT * FROM usage_records WHERE id = ?', [id]);
  const usage = (rows as UsageRow[])[0];
  if (!usage) return res.status(404).json({ error: 'Registro não encontrado.' });
  if (usage.status === 'CLOSED') return res.status(409).json({ error: 'Este uso já foi encerrado.' });
  if (finalRpm <= usage.initial_rpm) {
    return res.status(400).json({ error: 'O RPM final deve ser maior que o RPM inicial.' });
  }

  await pool.query(
    "UPDATE usage_records SET return_time = ?, final_rpm = ?, return_notes = ?, status = 'CLOSED' WHERE id = ?",
    [toMysqlDatetime(returnTime), finalRpm, returnNotes || null, id]
  );

  const [updated] = await pool.query('SELECT * FROM usage_records WHERE id = ?', [id]);
  res.json(toDto((updated as UsageRow[])[0]));
}));
