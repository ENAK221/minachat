const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

const onlineUsers = new Map();
const ONLINE_MS = 2 * 60 * 1000;

// Heartbeat — le frontend appelle cette route toutes les 30s
router.post("/heartbeat", auth, (req, res) => {
  onlineUsers.set(req.user.id, Date.now());
  res.json({ ok: true });
});

// Récupérer tous les utilisateurs avec statut en ligne
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, avatar_url FROM users ORDER BY username ASC"
    );
    const now = Date.now();
    const rows = result.rows.map((u) => ({
      ...u,
      is_online: onlineUsers.has(u.id) && now - onlineUsers.get(u.id) < ONLINE_MS,
    }));
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Route protégée : obtenir les infos du user connecté
router.get("/me", auth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, role, is_validated, created_at, avatar_url, bio FROM users WHERE id = $1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Mettre à jour le profil (avatar, bio, username)
router.patch("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { avatar_url, bio, username } = req.body;

  // l'utilisateur ne peut modifier que son propre profil sauf admin
  if (parseInt(id, 10) !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({ message: "Accès interdit" });
  }

  try {
    const result = await db.query(
      `UPDATE users
       SET avatar_url = COALESCE($1, avatar_url),
           bio = COALESCE($2, bio),
           username = COALESCE($3, username)
       WHERE id = $4
       RETURNING id, username, email, role, is_validated, avatar_url, bio`,
      [avatar_url, bio, username, id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
