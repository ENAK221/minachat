# ✅ Tests Unitaires - Minachat Backend

## 🎯 Objectif
Assurer la qualité du code avec des tests automatisés pour tous les controllers, routes et middlewares.

---

## 📋 Fichiers de test créés

| Fichier | Description |
|---------|------------|
| `src/controllers/auth.controllers.test.js` | Tests authentification (register, login) |
| `src/routes/messages.test.js` | Tests routes messages |
| `src/middleware/authMiddleware.test.js` | Tests middleware JWT |
| `src/db.test.js` | Tests connexion database |

---

## 🚀 Commandes

### Lancer tous les tests
```bash
npm test
```

### Mode watch (rerun lors de changements)
```bash
npm run test:watch
```

### Voir la couverture de code
```bash
npm run test:coverage
```

---

## 📊 Couverture actuelle

- ✅ Auth Controllers (register, login)
- ✅ Message Routes (GET conversation, POST message)
- ✅ Auth Middleware (JWT validation)
- ✅ Database Connection

---

## 🔬 Ce que les tests font

### Auth Controllers Tests
- ✅ Crée un nouvel utilisateur (hash bcrypt)
- ✅ Retourne JWT pour login valide
- ✅ Reject login avec email inexistant
- ✅ Reject login avec mauvais mot de passe
- ✅ Gère les erreurs serveur

### Message Routes Tests
- ✅ Retourne conversation entre 2 users
- ✅ Rejette accès si l'ID ne correspond pas
- ✅ Crée un nouveau message
- ✅ Gère les erreurs serveur

### Auth Middleware Tests
- ✅ Extrait l'ID du JWT
- ✅ Rejette requête sans token
- ✅ Rejette token invalide

---

## 📈 Avantages pour les recruteurs

1. **Qualité du code** - Preuves que le code marche
2. **Professionnalisme** - Setup test comme en prod
3. **Maintenabilité** - Régression détectées automatiquement
4. **CI/CD Ready** - Prêt pour une pipeline
5. **Documentation** - Les tests documentent le comportement

---

## 🔮 Prochains tests à ajouter

- [ ] Admin middleware tests
- [ ] User routes tests
- [ ] Admin routes tests
- [ ] Socket.io events tests
- [ ] Integration tests E2E

---

## 💡 Pour améliorer la couverture

```bash
# Voir quelles lignes ne sont pas testées
npm run test:coverage

# Ajouter des tests pour les autres routes
# Exemple: admin.test.js, users.test.js
```

---

## ⚡ Tips

- Les tests utilisent **Jest** + **Supertest**
- Mocks pour éviter une vraie BD pendant les tests
- Chaque test est isolé (`beforeEach` clear les mocks)
- Tests rapides (~1-2 secondes)
