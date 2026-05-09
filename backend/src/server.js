const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

// Middlewares
app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const adminRoutes = require("./routes/admin");

// Route de test
app.get("/", (req, res) => {
  res.json({ message: "Backend opérationnel" });
});

// Utilisation des routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);
app.use("/admin", adminRoutes);

// Lancement du serveur
app.listen(process.env.PORT || 5000, () => {
  console.log(`Serveur lancé sur le port ${process.env.PORT || 5000}`);
});
