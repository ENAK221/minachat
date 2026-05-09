const jwt = require("jsonwebtoken");

/**
 * Middleware de vérification de token JWT.
 * Il suffit de placer ce middleware dans les routes qui doivent être protégées.
 * Il lit l'en-tête Authorization au format "Bearer <token>", le vérifie
 * puis ajoute un objet `user` à la requête avec l'ID et le rôle (si présents).
 */
module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Token manquant" });
  }

  // form "Bearer xxxx..."
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Format de token invalide" });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // on peut stocker tout ce que l'on veut dans req.user
    req.user = {
      id: payload.id,
      role: payload.role,
    };
    next();
  } catch (err) {
    console.error("JWT error", err);
    return res.status(401).json({ message: "Token invalide" });
  }
};