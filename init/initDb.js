require('dotenv').config();
const { Client } = require('pg');

const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT,
} = process.env;

const createDatabase = async () => {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    database: 'postgres', // sistem veritabanı
    password: DB_PASS,
    port: DB_PORT,
  });

  try {
    await client.connect();

    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'`
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      console.log(`✅ Database "${DB_NAME}" created.`);
    } else {
      console.log(`ℹ️ Database "${DB_NAME}" is already exists.`);
    }
  } catch (err) {
    console.error('❌ Database couldnt created:', err);
  } finally {
    await client.end();
  }
};

// script çalıştır
createDatabase();
