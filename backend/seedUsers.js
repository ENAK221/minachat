const db = require("./src/db");
const bcrypt = require("bcrypt");

(async () => {
  try {
    console.log("Seeding users...");

    // === SUPER ADMIN ===
    const adminEmail = "superadmin@gmail.com";
    const adminPass = "superadmin123";
    const adminHash = await bcrypt.hash(adminPass, 10);

    const adminExists = await db.query(
      "SELECT id FROM users WHERE email=$1",
      [adminEmail]
    );

    if (adminExists.rows.length === 0) {
      await db.query(
        `INSERT INTO users (username, email, password, role, is_validated)
         VALUES ($1, $2, $3, 'admin', true)`,
        ["super admin", adminEmail, adminHash]
      );
      console.log("✔ Super admin créé !");
    } else {
      console.log("ℹ Super admin existe déjà");
    }

    // === AUTRES UTILISATEURS ===
    const users = [
      {
        username: "thier",
        email: "thier@gmail.com",
        pwd: "thier123",
        avatar: "https://i.pravatar.cc/150?img=12",
        bio: "Salut, je suis Thiérry et j'adore discuter !",
      },
      {
        username: "cheikh",
        email: "cheikh@gmail.com",
        pwd: "cheikh123",
        avatar: "https://i.pravatar.cc/150?img=5",
        bio: "Moi c'est Cheikh, toujours dispo pour un chat.",
      },
    ];

    for (let u of users) {
      const exists = await db.query(
        "SELECT id FROM users WHERE email = $1",
        [u.email]
      );

      const hash = await bcrypt.hash(u.pwd, 10);

      if (exists.rows.length > 0) {
        await db.query(
          `UPDATE users
           SET avatar_url = $1, bio = $2
           WHERE email = $3`,
          [u.avatar, u.bio, u.email]
        );
        console.log(`✔ Profil mis à jour : ${u.email}`);
      } else {
        await db.query(
          `INSERT INTO users (username, email, password, role, is_validated, avatar_url, bio)
           VALUES ($1, $2, $3, 'user', true, $4, $5)`,
          [u.username, u.email, hash, u.avatar, u.bio]
        );
        console.log(`✔ Utilisateur créé : ${u.email}`);
      }
    }

    console.log("🎉 Seeding terminé !");
  } catch (err) {
    console.error("❌ Erreur pendant le seeding :", err);
  } finally {
    await db.pool.end(); // fermeture propre du pool
    process.exit();
  }
})();
