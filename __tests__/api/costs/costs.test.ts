import { POST, GET } from "@/app/api/costs/route";
import { GET as GET_BY_ID, PUT, DELETE } from "@/app/api/costs/[id]/route";
import { connectDB, disconnectDB } from "@/lib/database/mongodb";
import { User, Cost } from "@/models";
import { generateToken } from "@/lib/auth/jwt";
import {
  TestUser,
  TestCost,
  MockRequestOptions,
  TestRequestBody,
} from "@/types";

/**
 * Mock NextRequest for testing
 * Functional approach - factory function instead of class
 */
const createMockRequest = (
  url: string,
  options: MockRequestOptions = {}
): Request => {
  const { method = "GET", body, headers = {} } = options;

  return new Request(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  }) as Request;
};

describe("/api/costs", () => {
  let testUser: TestUser;
  let authToken: string;

  beforeAll(async () => {
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
  });

  beforeEach(async () => {
    // Clean database
    await User.deleteMany({});
    await Cost.deleteMany({});

    // Create test user
    testUser = new User({
      email: "test@example.com",
      password: "Password123",
      name: "Test User",
    });
    await testUser.save();

    // Generate auth token
    authToken = generateToken(testUser._id.toString(), testUser.email);
  });

  afterEach(async () => {
    // Clean up after each test
    await User.deleteMany({});
    await Cost.deleteMany({});
  });

  describe("POST /api/costs", () => {
    it("should create a new cost successfully", async () => {
      const costData = {
        description: "Test expense for office supplies",
        date: "2024-01-15T10:00:00.000Z",
        amount: 150.75,
      };

      const request = createMockRequest("http://localhost:3000/api/costs", {
        method: "POST",
        body: costData,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe("Costo creato con successo");
      expect(responseData.data).toMatchObject({
        description: costData.description,
        amount: costData.amount,
      });
      expect(responseData.data.id).toBeDefined();
      expect(responseData.data.createdAt).toBeDefined();
    });

    it("should return 401 for missing authentication", async () => {
      const costData = {
        description: "Test expense",
        date: "2024-01-15T10:00:00.000Z",
        amount: 100,
      };

      const request = createMockRequest("http://localhost:3000/api/costs", {
        method: "POST",
        body: costData,
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe(
        "Token di autenticazione mancante o non valido"
      );
    });

    it("should return 400 for invalid cost data", async () => {
      const invalidCostData = {
        description: "AB", // Too short
        date: "invalid-date",
        amount: -50, // Negative amount
      };

      const request = createMockRequest("http://localhost:3000/api/costs", {
        method: "POST",
        body: invalidCostData,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Dati del costo non validi");
      expect(responseData.errors).toBeDefined();
      expect(Array.isArray(responseData.errors)).toBe(true);
    });

    it("should validate amount precision (max 2 decimal places)", async () => {
      const costData = {
        description: "Test expense with too many decimals",
        date: "2024-01-15T10:00:00.000Z",
        amount: 150.123, // 3 decimal places - should fail
      };

      const request = createMockRequest("http://localhost:3000/api/costs", {
        method: "POST",
        body: costData,
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
    });
  });

  describe("GET /api/costs", () => {
    beforeEach(async () => {
      // Create test costs
      const costs = [
        {
          userId: testUser._id.toString(),
          description: "Office supplies 2024",
          date: new Date("2024-01-15"),
          amount: 150.75,
        },
        {
          userId: testUser._id.toString(),
          description: "Software license 2024",
          date: new Date("2024-02-01"),
          amount: 299.99,
        },
        {
          userId: testUser._id.toString(),
          description: "Office supplies 2023",
          date: new Date("2023-12-15"),
          amount: 89.5,
        },
      ];

      await Cost.create(costs);
    });

    it("should get all costs for authenticated user", async () => {
      const request = createMockRequest("http://localhost:3000/api/costs", {
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toBeDefined();
      expect(Array.isArray(responseData.data)).toBe(true);
      expect(responseData.data.length).toBe(3);
      expect(responseData.meta.total).toBe(3);
      expect(responseData.meta.returned).toBe(3);
    });

    it("should filter costs by year", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/costs?year=2024",
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.length).toBe(2); // Only 2024 costs
      expect(responseData.meta.total).toBe(2);
      expect(responseData.meta.year).toBe(2024);
    });

    it("should apply pagination", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/costs?limit=2&offset=1",
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.length).toBe(2); // Limited to 2
      expect(responseData.meta.total).toBe(3); // Total is still 3
      expect(responseData.meta.returned).toBe(2); // But returned only 2
    });

    it("should return 401 for missing authentication", async () => {
      const request = createMockRequest("http://localhost:3000/api/costs");

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
    });

    it("should return 400 for invalid year parameter", async () => {
      const request = createMockRequest(
        "http://localhost:3000/api/costs?year=invalid",
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Parametri di query non validi");
    });
  });

  describe("GET /api/costs/[id]", () => {
    let testCost: TestCost;

    beforeEach(async () => {
      testCost = new Cost({
        userId: testUser._id.toString(),
        description: "Test expense for retrieval",
        date: new Date("2024-01-15"),
        amount: 175.5,
      });
      await testCost.save();
    });

    it("should get a specific cost by ID", async () => {
      const request = createMockRequest(
        `http://localhost:3000/api/costs/${testCost._id}`,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET_BY_ID(request, {
        params: { id: testCost._id.toString() },
      });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data.id).toBe(testCost._id.toString());
      expect(responseData.data.description).toBe(testCost.description);
      expect(responseData.data.amount).toBe(testCost.amount);
    });

    it("should return 404 for non-existent cost", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const request = createMockRequest(
        `http://localhost:3000/api/costs/${nonExistentId}`,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET_BY_ID(request, {
        params: { id: nonExistentId },
      });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Costo non trovato");
    });

    it("should return 400 for invalid cost ID", async () => {
      const invalidId = "invalid-id";
      const request = createMockRequest(
        `http://localhost:3000/api/costs/${invalidId}`,
        {
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await GET_BY_ID(request, { params: { id: invalidId } });
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("ID costo non valido");
    });
  });

  describe("PUT /api/costs/[id]", () => {
    let testCost: TestCost;

    beforeEach(async () => {
      testCost = new Cost({
        userId: testUser._id.toString(),
        description: "Original description",
        date: new Date("2024-01-15"),
        amount: 100.0,
      });
      await testCost.save();
    });

    it("should update a cost successfully", async () => {
      const updateData = {
        description: "Updated description",
        amount: 200.5,
      };

      const request = createMockRequest(
        `http://localhost:3000/api/costs/${testCost._id}`,
        {
          method: "PUT",
          body: updateData,
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await PUT(request, {
        params: { id: testCost._id.toString() },
      });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe("Costo aggiornato con successo");
      expect(responseData.data.description).toBe(updateData.description);
      expect(responseData.data.amount).toBe(updateData.amount);
    });

    it("should return 404 for non-existent cost", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const updateData = { description: "Updated" };

      const request = createMockRequest(
        `http://localhost:3000/api/costs/${nonExistentId}`,
        {
          method: "PUT",
          body: updateData,
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await PUT(request, { params: { id: nonExistentId } });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Costo non trovato");
    });
  });

  describe("DELETE /api/costs/[id]", () => {
    let testCost: TestCost;

    beforeEach(async () => {
      testCost = new Cost({
        userId: testUser._id.toString(),
        description: "Cost to be deleted",
        date: new Date("2024-01-15"),
        amount: 50.0,
      });
      await testCost.save();
    });

    it("should delete a cost successfully", async () => {
      const request = createMockRequest(
        `http://localhost:3000/api/costs/${testCost._id}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await DELETE(request, {
        params: { id: testCost._id.toString() },
      });
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe("Costo eliminato con successo");

      // Verify cost is actually deleted
      const deletedCost = await Cost.findById(testCost._id);
      expect(deletedCost).toBeNull();
    });

    it("should return 404 for non-existent cost", async () => {
      const nonExistentId = "507f1f77bcf86cd799439011";
      const request = createMockRequest(
        `http://localhost:3000/api/costs/${nonExistentId}`,
        {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${authToken}`,
          },
        }
      );

      const response = await DELETE(request, { params: { id: nonExistentId } });
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Costo non trovato");
    });
  });
});
