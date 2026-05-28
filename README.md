# Minachat

Application de messagerie privée fullstack avec système de rôles et panneau d'administration.

---

## Apercu

Minachat permet à des utilisateurs inscrits, et validés par un administrateur, de s'envoyer des messages privés. Elle inclut un panneau d'administration complet pour gérer les comptes, valider les inscriptions et modérer les utilisateurs.

---

## Stack technique

| Couche          | Technologie                                      |
|-----------------|--------------------------------------------------|
| Frontend        | React 19, Vite 7, Tailwind CSS 4, Framer Motion |
| Backend         | Node.js, Express 5                               |
| Base de données | PostgreSQL (Neon)                                |
| Auth            | JWT (jsonwebtoken) + bcrypt                      |
| Temps réel      | Socket.IO 4                                      |

---

## Fonctionnalites

### Utilisateur
- Inscription avec avatar (URL) et biographie — en attente de validation admin
- Connexion sécurisée par JWT (durée 7 jours)
- Messagerie privée entre utilisateurs (rafraîchissement toutes les 2 secondes)
- Modification du profil (avatar, bio, username)
- Interface responsive avec animations (Framer Motion)

### Administration
- Tableau de bord listant tous les comptes utilisateurs
- Validation ou blocage d'un compte (`is_validated`)
- Avertissement d'un utilisateur (compteur `warning_count` en base)
- Suppression d'un compte
- Création manuelle d'un compte (utilisateur ou admin)
- Protection du super-admin (aucune action possible sur ce compte)

---

## Structure du projet

```
minachat/
├── backend/                         # API REST (Node.js / Express)
│   ├── src/
│   │   ├── controllers/
│   │   │   └── auth.controllers.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js    # Vérification JWT
│   │   │   └── adminMiddleware.js   # Vérification rôle admin
│   │   ├── routes/
│   │   │   ├── auth.js             # POST /auth/register, /auth/login
│   │   │   ├── users.js            # GET /users, /users/me — PATCH /users/:id
│   │   │   ├── messages.js         # GET /messages/conversation — POST /messages
│   │   │   └── admin.js            # CRUD + modération /admin/users
│   │   ├── db.js                   # Pool de connexion PostgreSQL (pg)
│   │   └── server.js               # Point d'entrée Express
│   ├── schema.sql                   # Schéma SQL initial
│   ├── seedUsers.js                 # Peuplement de comptes de test
│   ├── createAdmin.js               # Création d'un compte admin
│   └── package.json
│
├── src/                             # Frontend React
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Layout.jsx
│   │   ├── PrivateRoute.jsx         # Redirige vers /login si non connecté
│   │   └── AdminRoute.jsx           # Redirige si rôle != admin
│   ├── context/
│   │   └── UserContext.jsx          # Contexte utilisateur global
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ChatPage.jsx             # Messagerie privée
│   │   ├── Profile.jsx              # Édition du profil
│   │   └── AdminPage.jsx            # Panneau d'administration
│   ├── services/
│   ├── config.js                    # URL de l'API via VITE_API_URL
│   └── main.jsx
│
├── index.html
├── vite.config.js
└── package.json
```

---

## Base de donnees

```sql
-- Utilisateurs
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  username      TEXT,
  email         TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'user',      -- 'user' | 'admin'
  is_validated  BOOLEAN NOT NULL DEFAULT FALSE,
  warning_count INTEGER NOT NULL DEFAULT 0,
  avatar_url    TEXT,
  bio           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages privés
CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  sender_id   INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## API — Endpoints

### Authentification — `/auth`

| Méthode | Route            | Description                              | Auth |
|---------|------------------|------------------------------------------|------|
| POST    | `/auth/register` | Inscription (en attente de validation)   | Non  |
| POST    | `/auth/login`    | Connexion — retourne un token JWT        | Non  |

### Utilisateurs — `/users`

| Méthode | Route        | Description                                        | Auth |
|---------|--------------|----------------------------------------------------|------|
| GET     | `/users`     | Liste tous les utilisateurs (id, username, avatar) | JWT  |
| GET     | `/users/me`  | Profil complet de l'utilisateur connecté           | JWT  |
| PATCH   | `/users/:id` | Modifier son profil (avatar, bio, username)        | JWT  |

### Messages — `/messages`

| Méthode | Route                               | Description                        | Auth |
|---------|-------------------------------------|------------------------------------|------|
| GET     | `/messages/conversation/:me/:other` | Historique entre deux utilisateurs | JWT  |
| POST    | `/messages`                         | Envoyer un message                 | JWT  |

### Administration — `/admin` (rôle `admin` requis)

| Méthode | Route                       | Description                    |
|---------|-----------------------------|--------------------------------|
| GET     | `/admin/users`              | Liste tous les utilisateurs    |
| POST    | `/admin/users`              | Créer un utilisateur           |
| PATCH   | `/admin/users/:id/validate` | Valider ou bloquer un compte   |
| POST    | `/admin/users/:id/warn`     | Avertir un utilisateur         |
| DELETE  | `/admin/users/:id`          | Supprimer un utilisateur       |

---

## Installation locale

### Prérequis

- Node.js 18+
- Une base de données PostgreSQL (locale ou [Neon](https://neon.tech))

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd minachat
```

### 2. Configurer le backend

Créer `backend/.env` :

```env
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
JWT_SECRET=une_cle_secrete_longue_et_aleatoire
PORT=5000
```

Initialiser la base de données :

```bash
psql $DATABASE_URL -f backend/schema.sql
```

Installer et démarrer :

```bash
cd backend
npm install
npm run dev
```

### 3. Configurer le frontend

Depuis la racine du projet :

```bash
npm install
```

Créer `.env` à la racine :

```env
VITE_API_URL=http://localhost:5000
```

Démarrer :

```bash
npm run dev
```

### 4. (Optionnel) Créer un admin et peupler des comptes de test

```bash
cd backend
node createAdmin.js   # Crée le premier compte administrateur
node seedUsers.js     # Ajoute des comptes de test
```

---

## Acces en local

| Service    | URL                    |
|------------|------------------------|
| Frontend   | http://localhost:5173  |
| Backend    | http://localhost:5000  |
| API health | http://localhost:5000/ |

### Comptes de test (après `node seedUsers.js`)

| Email            | Mot de passe | Rôle |
|------------------|--------------|------|
| thier@gmail.com  | thier123     | user |
| cheikh@gmail.com | cheikh123    | user |

> Le premier compte admin doit être créé via `node createAdmin.js` ou directement en base.

---

## Scripts disponibles

### Backend (`backend/`)

| Commande                | Action                        |
|-------------------------|-------------------------------|
| `npm run dev`           | Démarrage avec nodemon        |
| `npm start`             | Démarrage en production       |
| `npm test`              | Tests Jest                    |
| `npm run test:watch`    | Tests en mode watch           |
| `npm run test:coverage` | Rapport de couverture         |

### Frontend (racine)

| Commande          | Action                     |
|-------------------|----------------------------|
| `npm run dev`     | Serveur de développement   |
| `npm run build`   | Build de production        |
| `npm run preview` | Prévisualisation du build  |
| `npm run lint`    | Vérification ESLint        |

---

## Securite

- Mots de passe hashés avec **bcrypt** (salt rounds : 10)
- Authentification par token **JWT** via l'en-tête `Authorization: Bearer <token>`
- Rôle `admin` vérifié côté serveur sur chaque route d'administration
- Le super-admin est protégé contre toute modification ou suppression

---

## Ameliorations possibles

- Remplacement du polling par une connexion Socket.IO persistante pour le temps réel
- Mot de passe oublié / réinitialisation par email
- Chat de groupe, envoi de fichiers, réactions aux messages
- Déploiement conteneurisé (Docker)

---

## Auteur

**Ousmane Kane** — kane.ousmane2@ugb.edu.sn
