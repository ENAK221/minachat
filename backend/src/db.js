const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false
});

// Test de connexion
pool.connect()
  .then(() => console.log("Connecté à PostgreSQL"))
  .catch(err => console.error("Erreur de connexion PostgreSQL", err));

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
