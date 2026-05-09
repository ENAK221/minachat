const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

describe("Auth Middleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test_secret_key";
  });

  it("devrait extraire l'ID du JWT du header Authorization", (done) => {
    const token = jwt.sign({ id: 123 }, process.env.JWT_SECRET);

    const req = {
      headers: {
        authorization: `Bearer ${token}`,
      },
    };

    const res = {};
    const next = jest.fn(() => {
      expect(req.user).toEqual({ id: 123, role: undefined });
      expect(next).toHaveBeenCalled();
      done();
    });

    authMiddleware(req, res, next);
  });

  it("devrait retourner 401 si pas de token", (done) => {
    const req = {
      headers: {},
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token manquant" });
    done();
  });

  it("devrait retourner 401 si format du token invalide", (done) => {
    const req = {
      headers: {
        authorization: "InvalidFormat token",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    done();
  });

  it("devrait retourner 401 si le token est invalide", (done) => {
    const req = {
      headers: {
        authorization: "Bearer invalid_token_here",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Token invalide" });
    done();
  });
});
