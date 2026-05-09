const db = require("../db");

jest.mock("pg", () => {
  return {
    Pool: jest.fn(() => ({
      connect: jest.fn(),
      query: jest.fn(),
    })),
  };
});

describe("Database Connection", () => {
  it("devrait exporter les fonctions query et pool", () => {
    expect(db).toHaveProperty("query");
    expect(db).toHaveProperty("pool");
  });

  it("devrait exporter une fonction query", () => {
    expect(typeof db.query).toBe("function");
  });
});
