import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { authRouter } from './routes/auth.js';
import { usersRouter } from './routes/users.js';
import { tractorsRouter } from './routes/tractors.js';
import { operatorsRouter } from './routes/operators.js';
import { usagesRouter } from './routes/usages.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/tractors', tractorsRouter);
app.use('/api/operators', operatorsRouter);
app.use('/api/usages', usagesRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const distPath = path.join(import.meta.dirname, 'dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const port = Number(process.env.PORT || 3002);
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});
