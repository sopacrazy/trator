import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
});

export const toMysqlDatetime = (isoLike: string) => isoLike.replace('T', ' ').slice(0, 19);

export const fromMysqlDatetime = (dbValue: string | null): string | undefined =>
  dbValue ? dbValue.replace(' ', 'T').slice(0, 16) : undefined;
