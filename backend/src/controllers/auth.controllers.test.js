const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authControllers = require("../src/controllers/auth.controllers");

// Mock la base de données
jest.mock("../src/db", () => ({
  query: jest.fn(),
}));

const db = require("../src/db");

describe("Auth Controllers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = "test_secret_key";
  });

  describe("register", () => {
    it("devrait créer un nouvel utilisateur avec mot de passe hashé", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.query.mockResolvedValueOnce({ rows: [{ id: 1, email: req.body.email }] });

      await authControllers.register(req, res);

      expect(res.json).toHaveBeenCalledWith({ message: "Utilisateur créé" });
      expect(db.query).toHaveBeenCalled();
    });

    it("devrait retourner une erreur 500 en cas d'erreur serveur", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.query.mockRejectedValueOnce(new Error("Database error"));

      await authControllers.register(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("login", () => {
    it("devrait retourner un JWT si les identifiants sont valides", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "password123",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const hashedPassword = await bcrypt.hash("password123", 10);

      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: req.body.email, password: hashedPassword }],
      });

      await authControllers.login(req, res);

      expect(res.json).toHaveBeenCalled();
      const call = res.json.mock.calls[0][0];
      expect(call).toHaveProperty("token");
    });

    it("devrait retourner 400 si l'utilisateur n'existe pas", async () => {
      const req = {
        body: {
          email: "nonexistent@example.com",
          password: "password123",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      db.query.mockResolvedValueOnce({ rows: [] });

      await authControllers.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("devrait retourner 400 si le mot de passe est incorrect", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "wrongpassword",
        },
      };

      const res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis(),
      };

      const hashedPassword = await bcrypt.hash("correctpassword", 10);

      db.query.mockResolvedValueOnce({
        rows: [{ id: 1, email: req.body.email, password: hashedPassword }],
      });

      await authControllers.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
9