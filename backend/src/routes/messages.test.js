const request = require("supertest");
const express = require("express");

// Mock la BD
jest.mock("../db", () => ({
  query: jest.fn(),
}));

// Mock le middleware auth
jest.mock("../middleware/authMiddleware", () => {
  return (req, res, next) => {
    req.user = { id: 1 }; // Simule un utilisateur connecté
    next();
  };
});

const db = require("../db");
const messageRoutes = require("../routes/messages");

const app = express();
app.use(express.json());
app.use("/messages", messageRoutes);

describe("Message Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /messages/conversation/:me/:other", () => {
    it("devrait retourner la conversation entre deux utilisateurs", async () => {
      const mockMessages = [
        {
          id: 1,
          sender_id: 1,
          receiver_id: 2,
          content: "Salut",
          created_at: "2025-01-01T10:00:00Z",
        },
        {
          id: 2,
          sender_id: 2,
          receiver_id: 1,
          content: "Coucou",
          created_at: "2025-01-01T10:01:00Z",
        },
      ];

      db.query.mockResolvedValueOnce({ rows: mockMessages });

      const response = await request(app).get("/messages/conversation/1/2");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMessages);
    });

    it("devrait retourner 403 si l'ID ne correspond pas au token", async () => {
      const response = await request(app).get("/messages/conversation/999/2");

      expect(response.status).toBe(403);
    });
  });

  describe("POST /messages", () => {
    it("devrait créer un nouveau message", async () => {
      const newMessage = {
        id: 3,
        sender_id: 1,
        receiver_id: 2,
        content: "Nouveau message",
        created_at: "2025-01-01T10:02:00Z",
      };

      db.query.mockResolvedValueOnce({ rows: [newMessage] });

      const response = await request(app)
        .post("/messages")
        .send({
          receiver_id: 2,
          content: "Nouveau message",
        });

      expect(response.status).toBe(201);
      expect(response.body.data).toEqual(newMessage);
    });

    it("devrait retourner 500 en cas d'erreur serveur", async () => {
      db.query.mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app)
        .post("/messages")
        .send({
          receiver_id: 2,
          content: "Message",
        });

      expect(response.status).toBe(500);
    });
  });
});
