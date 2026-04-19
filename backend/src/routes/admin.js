const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../../middleware/authMiddleware");
const admin = require("../../middleware/adminMiddleware");
const bcrypt = require("bcrypt");

// adresse de l'administrateur principal à cacher
const SUPER_ADMIN_EMAIL = 'superadmin@gmail.com';

// Liste de tous les utilisateurs (pour que l'admin les gère)
router.get("/users", auth, admin, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, role, is_validated, created_at, avatar_url, bio, COALESCE(warning_count,0) AS warning_count FROM users WHERE email <> $1 ORDER BY username ASC",
      [SUPER_ADMIN_EMAIL]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Créer un utilisateur (l'admin peut en ajouter)
router.post("/users", auth, admin, async (req, res) => {
  const { username, email, password, role = "user", validated = true } = req.body;
  try {
    // vérifier existence
    const exists = await db.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      `INSERT INTO users (username, email, password, role, is_validated)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, role, is_validated, avatar_url, bio`,
      [username, email, hashedPassword, role, validated]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Valider / bloquer un utilisateur
router.patch("/users/:id/validate", auth, admin, async (req, res) => {
  const { id } = req.params;
  const { is_validated } = req.body;

  try {
    // refuse de modifier le super-admin
    const check = await db.query("SELECT email FROM users WHERE id=$1", [id]);
    if (check.rows[0] && check.rows[0].email === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ message: "Action interdite sur super admin" });
    }

    const result = await db.query(
      "UPDATE users SET is_validated = $1 WHERE id = $2 RETURNING id, username, email, role, is_validated",
      [is_validated, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Avertir un utilisateur (incrémente warning_count)
router.post("/users/:id/warn", auth, admin, async (req, res) => {
  const { id } = req.params;
  try {
    // ne pas avertir super admin
    const check = await db.query("SELECT email FROM users WHERE id=$1", [id]);
    if (check.rows[0] && check.rows[0].email === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ message: "Action interdite sur super admin" });
    }

    const result = await db.query(
      `UPDATE users SET warning_count = COALESCE(warning_count,0) + 1
       WHERE id = $1 RETURNING id, username, email, role, is_validated, warning_count`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Utilisateur introuvable" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Supprimer un utilisateur
router.delete("/users/:id", auth, admin, async (req, res) => {
  const { id } = req.params;
  try {
    // empêcher suppression du super admin
    const check = await db.query("SELECT email FROM users WHERE id=$1", [id]);
    if (check.rows[0] && check.rows[0].email === SUPER_ADMIN_EMAIL) {
      return res.status(403).json({ message: "Impossible de supprimer le super admin" });
    }

    const result = await db.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
