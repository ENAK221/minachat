const express = require("express");
const router = express.Router();
const db = require("../src/db");

// OBTENIR TOUS LES MESSAGES
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM messages ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ENVOYER UN MESSAGE
router.post("/", async (req, res) => {
  const { sender_id, content } = req.body;

  try {
    const newMessage = await db.query(
      "INSERT INTO messages (sender_id, content) VALUES ($1, $2) RETURNING *",
      [sender_id, content]
    );

    res.status(201).json({
      message: "Message envoyé",
      data: newMessage.rows[0]
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
