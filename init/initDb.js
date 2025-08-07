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
      console.log(`✅ Veritabanı "${DB_NAME}" oluşturuldu.`);
    } else {
      console.log(`ℹ️ Veritabanı "${DB_NAME}" zaten mevcut.`);
    }
  } catch (err) {
    console.error('❌ Veritabanı oluşturulamadı:', err);
  } finally {
    await client.end();
  }
};

// script çalıştır
createDatabase();
