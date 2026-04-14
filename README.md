# Minachat

Petit projet de messagerie en temps réel, développé dans le cadre d'un BTS SIO SLAM.

## 📦 Technologies

- **Backend** : Node.js + Express
- **Base de données** : PostgreSQL
- **Authentification** : JWT + bcrypt
- **Frontend** : React (via Vite) + Tailwind CSS

## ✅ Fonctionnalités principales

1. Inscription / connexion avec validation par admin
2. **Gestion des rôles (`user` / `admin`)** – les administrateurs ont un
   tableau de bord dédié
3. Profils enrichis : photo de profil (URL) et description personnelle
4. Panneau d'administration :
   - affichage des inscriptions en attente
   - validation/bannissement/suppression des comptes
   - création d'utilisateurs (rôle, avatar, bio)
   - **avertissement** des utilisateurs (compteur de warnings, stocké en base)
   - outils de filtrage et organisation
5. Chat privé entre utilisateurs (rafraîchi toutes les 2 secondes)
6. Interface responsive, design moderne avec animations
7. Script de peuplement (`seedUsers.js`)

## 🚀 Installation

1. **Cloner le dépôt et installer les dépendances**
   ```bash
   git clone <repo-url>
   cd minachat/backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Préparer la base de données**
   Exécuter les commandes SQL suivantes (psql, pgAdmin, ...):

   -- pour créer un administrateur manuellement :
   -- générer un hash bcrypt (cf. script dans le projet ou `node -e "…"`)
   -- puis insérer :
   -- INSERT INTO users (username,email,password,role,is_validated) VALUES
   -- ('super admin','superadmin@gmail.com','<hash>','admin',true);
   ```sql
   -- table utilisateurs
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       username TEXT NOT NULL,
       email TEXT NOT NULL UNIQUE,
       password TEXT NOT NULL,
       role TEXT NOT NULL DEFAULT 'user',
       is_validated BOOLEAN NOT NULL DEFAULT FALSE,
       avatar_url TEXT,
       bio TEXT DEFAULT '',
       warning_count INTEGER NOT NULL DEFAULT 0,
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
   );

   -- table messages
   CREATE TABLE messages (
       id SERIAL PRIMARY KEY,
       sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
       content TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
   );
   -- si la table users existe déjà, ajouter les nouvelles colonnes :
   ALTER TABLE users
       ADD COLUMN IF NOT EXISTS avatar_url TEXT,
       ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '',
       ADD COLUMN IF NOT EXISTS warning_count INTEGER NOT NULL DEFAULT 0;   ```

3. **Configurer les variables d'environnement**
   Créer `backend/.env` :
   ```dotenv
   DB_HOST=localhost
   DB_USER=<username>
   DB_PASSWORD=<password>
   DB_NAME=<database>
   DB_PORT=5432
   JWT_SECRET=<secret>
   PORT=5000
   ```

4. **Lancer les serveurs**
   ```bash
   # backend
   cd backend && npm start

   # frontend
   cd frontend && npm run dev
   ```

5. **(Optionnel) Peupler des comptes de test**
   ```bash
   cd backend && node seedUsers.js
   ```
   Cela crée `thier@gmail.com` / `thier123` et `cheikh@gmail.com` / `cheikh123`.
7. **Accéder au tableau de bord admin**
   - Se connecter avec un compte ayant `role='admin'`.
   - Cliquer sur le lien **Admin** dans la barre de navigation ou
     accéder à `/admin`.
   - Utiliser les boutons de filtrage pour voir uniquement les nouvelles
     inscriptions ou tous les utilisateurs.
   - Valider, bloquer ou supprimer chaque compte, et en créer de nouveaux
     directement depuis le formulaire situé en haut.
6. Ouvrir le navigateur sur `http://localhost:3000` (ou port affiché par Vite).

## 📁 Organisation du projet

- `backend/` : code serveur, routes, middleware
- `frontend/` : application React
- `backend/seedUsers.js` : script d'ajout d'utilisateurs de test

## 💡 Améliorations possibles
- Passage à WebSocket pour un chat en temps réel
- Mot de passe oublié / profil utilisateur / 2FA
- Chat de groupe, envoi de fichiers, réactions
- Tests unitaires / E2E, CI/CD, déploiement Docker

Le projet est volontairement simple mais structuré, idéal pour un dossier ou une démonstration orale. N'hésitez pas à explorer le code et à le personnaliser !
