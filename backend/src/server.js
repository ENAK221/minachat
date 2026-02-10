const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Import des routes
const authRoutes = require("../routes/auth");
const userRoutes = require("../routes/users");
const messageRoutes = require("../routes/messages");

// Utilisation des routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

app.listen(5000, () => {
  console.log(`Serveur lancé sur le port 5000`);
});
