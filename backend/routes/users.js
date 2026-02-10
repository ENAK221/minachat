const express = require("express");
const router = express.Router();
const db = require("../src/db");
const auth = require("../middleware/authMiddleware");

// Route protégée : obtenir les infos du user connecté
router.get("/me", auth, async (req, res) => {
  try {
    const result = await db.query(
      "SELECT id, username, email, role, is_validated, created_at FROM users WHERE id = $1",
      [req.user.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
