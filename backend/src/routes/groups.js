const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/authMiddleware");

// CRÉER UN GROUPE
router.post("/", auth, async (req, res) => {
  const { name, memberIds } = req.body;
  const createdBy = req.user.id;

  if (!name || !memberIds || memberIds.length === 0) {
    return res.status(400).json({ message: "Nom et membres requis" });
  }

  try {
    // Créer le groupe
    const group = await db.query(
      "INSERT INTO groups (name, created_by) VALUES ($1, $2) RETURNING *",
      [name, createdBy]
    );

    const groupId = group.rows[0].id;

    // Ajouter le créateur comme membre
    const allMembers = [...new Set([createdBy, ...memberIds])];

    for (const userId of allMembers) {
      await db.query(
        "INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)",
        [groupId, userId]
      );
    }

    res.status(201).json(group.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// OBTENIR SES GROUPES
router.get("/", auth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT g.id, g.name, g.created_by, g.created_at
       FROM groups g
       INNER JOIN group_members gm ON g.id = gm.group_id
       WHERE gm.user_id = $1
       ORDER BY g.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// OBTENIR LES MEMBRES D'UN GROUPE
router.get("/:id/members", auth, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT u.id, u.username, u.avatar_url
       FROM users u
       INNER JOIN group_members gm ON u.id = gm.user_id
       WHERE gm.group_id = $1`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// OBTENIR LES MESSAGES D'UN GROUPE
router.get("/:id/messages", auth, async (req, res) => {
  const { id } = req.params;

  try {
    // Vérifier que l'utilisateur est membre du groupe
    const isMember = await db.query(
      "SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, req.user.id]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const result = await db.query(
      `SELECT m.id, m.content, m.created_at, m.sender_id,
              u.username AS sender_name, u.avatar_url AS sender_avatar
       FROM messages m
       INNER JOIN users u ON m.sender_id = u.id
       WHERE m.group_id = $1
       ORDER BY m.id ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// ENVOYER UN MESSAGE DANS UN GROUPE
router.post("/:id/messages", auth, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const senderId = req.user.id;

  if (!content || !content.trim()) {
    return res.status(400).json({ message: "Message vide" });
  }

  try {
    // Vérifier que l'utilisateur est membre du groupe
    const isMember = await db.query(
      "SELECT 1 FROM group_members WHERE group_id = $1 AND user_id = $2",
      [id, senderId]
    );

    if (isMember.rows.length === 0) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    const result = await db.query(
      `INSERT INTO messages (sender_id, group_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [senderId, id, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
