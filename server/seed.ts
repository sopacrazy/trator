import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from './db.js';

async function seed() {
  const username = process.env.SEED_ADMIN_USERNAME || 'admin';
  const password = process.env.SEED_ADMIN_PASSWORD;
  const name = process.env.SEED_ADMIN_NAME || 'Administrador';

  if (!password) {
    throw new Error('Defina SEED_ADMIN_PASSWORD no .env antes de rodar o seed.');
  }

  const [existing] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
  if ((existing as unknown[]).length === 0) {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (username, password_hash, name) VALUES (?, ?, ?)', [username, hash, name]);
    console.log(`Usuário admin "${username}" criado.`);
  } else {
    console.log(`Usuário admin "${username}" já existe, pulando.`);
  }

  const [tractorRows] = await pool.query('SELECT COUNT(*) as count FROM tractors');
  if ((tractorRows as { count: number }[])[0].count === 0) {
    await pool.query(
      'INSERT INTO tractors (name, plate, model) VALUES (?, ?, ?), (?, ?, ?), (?, ?, ?)',
      [
        'Trator 01', 'MNB-1234', 'Massey Ferguson 4707',
        'Trator 02', 'OPQ-5678', 'John Deere 5075E',
        'Trator 03', 'RST-9012', 'New Holland TL5',
      ]
    );
    console.log('Tratores de exemplo criados.');
  } else {
    console.log('Tratores já existem, pulando.');
  }

  const [operatorRows] = await pool.query('SELECT COUNT(*) as count FROM operators');
  if ((operatorRows as { count: number }[])[0].count === 0) {
    await pool.query(
      'INSERT INTO operators (name, registration) VALUES (?, ?), (?, ?), (?, ?), (?, ?)',
      ['João Silva', '1001', 'Carlos Mendes', '1002', 'Pedro Alves', '1003', 'Ana Lima', '1004']
    );
    console.log('Operadores de exemplo criados.');
  } else {
    console.log('Operadores já existem, pulando.');
  }

  console.log('Seed concluído.');
  await pool.end();
}

seed().catch(err => {
  console.error('Seed falhou:', err);
  process.exit(1);
});
