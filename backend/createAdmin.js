const db = require("./src/db");
const bcrypt = require("bcrypt");

(async () => {
  try {
    console.log("Création du super admin ousmane...");

    // Vérifier si l'utilisateur existe déjà
    const existing = await db.query("SELECT id FROM users WHERE email = $1", [
      "ousmane@gmail.com",
    ]);

    if (existing.rows.length > 0) {
      console.log(" L'utilisateur ousmane@gmail.com existe déjà!");
      process.exit();
    }

    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash("ousmane123", 10);

    // Créer le super admin
    await db.query(
      `INSERT INTO users (username, email, password, role, is_validated)
       VALUES ($1, $2, $3, 'admin', true)`,
      ["ousmane", "ousmane@gmail.com", hashedPassword]
    );

    console.log("Super admin créé avec succès!");
    console.log(" Email: ousmane@gmail.com");
    console.log(" Mot de passe: ousmane123");
    console.log(" Role: admin (tous les droits)");
  } catch (err) {
    console.error(" Erreur:", err);
  } finally {
    await db.pool.end();
    process.exit();
  }
})();
