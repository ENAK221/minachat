const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");

// INSCRIPTION
router.post("/register", async (req, res) => {
  const { username, email, password, avatar_url, bio } = req.body;

  try {
    // Vérifier présence des champs avatar et bio
    if (!avatar_url || !bio) {
      return res.status(400).json({ message: "Avatar et description requis" });
    }
    // Vérifier si l'utilisateur existe déjà
    const userExists = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur
    const newUser = await db.query(
      `INSERT INTO users (username, email, password, role, is_validated, avatar_url, bio)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, role, is_validated, avatar_url, bio`,
      [username, email, hashedPassword, "user", false, req.body.avatar_url || null, req.body.bio || ""]
    );

    res.status(201).json({
      message: "Inscription réussie. En attente de validation par un admin.",
      user: newUser.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// CONNEXION
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0)
      return res.status(400).json({ message: "Utilisateur introuvable" });

    const user = result.rows[0];

    // Vérifier validation admin
    if (!user.is_validated) {
      return res.status(403).json({ message: "Compte en attente de validation" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url,
        bio: user.bio
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;