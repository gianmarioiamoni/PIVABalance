/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/register/route";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "@/lib/database/mongodb";
import { User } from "@/models";
import { findUserByEmail } from "@/utils/userQueries";

// Types for test data
interface ValidUserData {
  email: string;
  password: string;
  name: string;
}

interface PartialUserData {
  email?: string;
  password?: string;
  name?: string;
}

type TestRequestBody =
  | ValidUserData
  | PartialUserData
  | Record<string, unknown>;

describe("/api/auth/register", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await connectDB();
  });

  afterAll(async () => {
    await disconnectDB();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  const createRequest = (body: TestRequestBody) => {
    return new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  describe("Successful Registration", () => {
    it("should register a new user with valid data", async () => {
      const userData = {
        email: "test@example.com",
        password: "Test123!",
        name: "Test User",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe(
        "Registrazione completata con successo"
      );
      expect(responseData.data.token).toBeDefined();
      expect(responseData.data.user.email).toBe("test@example.com");
      expect(responseData.data.user.name).toBe("Test User");
      expect(responseData.data.user.id).toBeDefined();

      // Verify user was created in database
      const createdUser = await findUserByEmail("test@example.com");
      expect(createdUser).toBeDefined();
      expect(createdUser?.name).toBe("Test User");
    });

    it("should convert email to lowercase", async () => {
      const userData = {
        email: "TEST@EXAMPLE.COM",
        password: "Test123!",
        name: "Test User",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(201);
      expect(responseData.data.user.email).toBe("test@example.com");
    });
  });

  describe("Validation Errors", () => {
    it("should return error for missing email", async () => {
      const userData = {
        password: "Test123!",
        name: "Test User",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Dati di registrazione non validi");
      expect(responseData.errors).toContain(
        "Invalid input: expected string, received undefined"
      );
    });

    it("should return error for invalid email format", async () => {
      const userData = {
        email: "invalid-email",
        password: "Test123!",
        name: "Test User",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.errors).toContain("Invalid email format");
    });

    it("should return error for weak password", async () => {
      const userData = {
        email: "test@example.com",
        password: "weak",
        name: "Test User",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.errors).toEqual(
        expect.arrayContaining([
          expect.stringContaining("Password must be at least 8 characters"),
        ])
      );
    });

    it("should return error for invalid name", async () => {
      const userData = {
        email: "test@example.com",
        password: "Test123!",
        name: "Test123",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.errors).toContain(
        "Name can only contain letters, spaces, apostrophes, and hyphens"
      );
    });

    it("should return error for short name", async () => {
      const userData = {
        email: "test@example.com",
        password: "Test123!",
        name: "A",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.errors).toContain(
        "Name must be at least 2 characters"
      );
    });
  });

  describe("Duplicate Email", () => {
    it("should return error when email already exists", async () => {
      // Create first user
      await User.create({
        email: "test@example.com",
        password: "Test123!",
        name: "First User",
      });

      // Try to create second user with same email
      const userData = {
        email: "test@example.com",
        password: "Different123!",
        name: "Second User",
      };

      const request = createRequest(userData);
      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Email già registrata");
    });
  });

  describe("Invalid JSON", () => {
    it("should handle invalid JSON gracefully", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: "invalid json",
        }
      );

      const response = await POST(request);
      const responseData = await response.json();

      expect(response.status).toBe(500);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Errore interno del server");
    });
  });
});
