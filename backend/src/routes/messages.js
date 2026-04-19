const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../../middleware/authMiddleware");

// OBTENIR LA CONVERSATION ENTRE DEUX UTILISATEURS (protégée)
// url exemple : /messages/conversation/3/7
router.get(
  "/conversation/:me/:other",
  auth,
  async (req, res) => {
    const { me, other } = req.params;

    // le token doit correspondre à l'utilisateur qui fait la requête
    if (parseInt(me, 10) !== req.user.id) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    try {
      const result = await db.query(
        `SELECT * FROM messages
         WHERE (sender_id=$1 AND receiver_id=$2)
            OR (sender_id=$2 AND receiver_id=$1)
         ORDER BY id ASC`,
        [me, other]
      );
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
);

// ENVOYER UN MESSAGE (importance : utilisateur connecté sera l'expéditeur)
router.post("/", auth, async (req, res) => {
  const { receiver_id, content } = req.body;
  const sender_id = req.user.id; // récupéré depuis le token

  try {
    const newMessage = await db.query(
      "INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3) RETURNING *",
      [sender_id, receiver_id, content]
    );

    res.status(201).json({
      message: "Message envoyé",
      data: newMessage.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
