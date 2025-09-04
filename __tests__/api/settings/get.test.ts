/**
 * @jest-environment node
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "@/lib/database/mongodb";
import { User } from "@/models/User";
import { UserSettings } from "@/models/UserSettings";
import { GET, PUT } from "@/app/api/settings/route";
import { NextRequest } from "next/server";
import { TestUser, TestRequestBody } from "@/types";

describe("/api/settings", () => {
  let mongoServer: MongoMemoryServer;
  let testUser: TestUser;

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
    // Clean up database before each test
    await User.deleteMany({});
    await UserSettings.deleteMany({});

    // Create test user
    testUser = await User.create({
      email: "test@example.com",
      password: "Test123!",
      name: "Test User",
    });
  });

  const createAuthenticatedRequest = (userId: string) => {
    return new NextRequest("http://localhost:3000/api/settings", {
      headers: {
        "x-user-id": userId, // Simulate authenticated user
      },
    });
  };

  describe("GET /api/settings", () => {
    it("should return default settings for user without existing settings", async () => {
      const request = createAuthenticatedRequest(testUser._id.toString());
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toMatchObject({
        taxRegime: "forfettario",
        substituteRate: 5,
        profitabilityRate: 78,
        pensionSystem: "INPS",
      });
      // Verify undefined properties are not included
      expect(responseData.data.professionalFundId).toBeUndefined();
      expect(responseData.data.inpsRateType).toBeUndefined();
    });

    it("should return existing user settings", async () => {
      // Create existing settings (for ordinario regime, don't set forfettario-specific fields)
      const settings = await UserSettings.create({
        userId: testUser._id,
        taxRegime: "ordinario",
        pensionSystem: "PROFESSIONAL_FUND",
        professionalFundId: "CNPADC",
        manualContributionRate: 18.5,
        manualMinimumContribution: 3500,
        manualFixedAnnualContributions: 50,
      });

      const request = createAuthenticatedRequest(testUser._id.toString());
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toMatchObject({
        taxRegime: "ordinario",
        pensionSystem: "PROFESSIONAL_FUND",
        professionalFundId: "CNPADC",
        manualContributionRate: 18.5,
        manualMinimumContribution: 3500,
        manualFixedAnnualContributions: 50,
      });
      // For ordinario regime, these should be undefined
      expect(responseData.data.substituteRate).toBeUndefined();
      expect(responseData.data.profitabilityRate).toBeUndefined();
    });

    it("should return 401 for unauthenticated requests", async () => {
      const request = new NextRequest("http://localhost:3000/api/settings");
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Non autorizzato");
    });

    it("should return 404 for non-existent user", async () => {
      const request = createAuthenticatedRequest("507f1f77bcf86cd799439011");
      const response = await GET(request);
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Utente non trovato");
    });
  });

  describe("PUT /api/settings", () => {
    const createPutRequest = (userId: string, data: TestRequestBody) => {
      return new NextRequest("http://localhost:3000/api/settings", {
        method: "PUT",
        headers: {
          "x-user-id": userId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    };

    it("should create new settings when none exist", async () => {
      const settingsData = {
        taxRegime: "ordinario",
        pensionSystem: "PROFESSIONAL_FUND",
        professionalFundId: "CNPADC",
        manualContributionRate: 18.5,
        manualMinimumContribution: 3500,
        manualFixedAnnualContributions: 50,
      };

      const request = createPutRequest(testUser._id.toString(), settingsData);
      const response = await PUT(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.message).toBe("Impostazioni aggiornate con successo");
      expect(responseData.data).toMatchObject({
        taxRegime: "ordinario",
        pensionSystem: "PROFESSIONAL_FUND",
        professionalFundId: "CNPADC",
        manualContributionRate: 18.5,
        manualMinimumContribution: 3500,
        manualFixedAnnualContributions: 50,
      });
      // For ordinario regime, these should be undefined
      expect(responseData.data.substituteRate).toBeUndefined();
      expect(responseData.data.profitabilityRate).toBeUndefined();

      // Verify settings were saved to database
      const savedSettings = await UserSettings.findOne({
        userId: testUser._id,
      });
      expect(savedSettings).toBeTruthy();
      expect(savedSettings?.taxRegime).toBe("ordinario");
    });

    it("should update existing settings", async () => {
      // Create initial settings
      await UserSettings.create({
        userId: testUser._id,
        taxRegime: "forfettario",
        substituteRate: 5,
        profitabilityRate: 67,
        pensionSystem: "INPS",
      });

      const updateData = {
        taxRegime: "forfettario",
        substituteRate: 25,
        profitabilityRate: 78,
        pensionSystem: "PROFESSIONAL_FUND",
        professionalFundId: "CNPADC",
      };

      const request = createPutRequest(testUser._id.toString(), updateData);
      const response = await PUT(request);
      const responseData = await response.json();

      expect(response.status).toBe(200);
      expect(responseData.success).toBe(true);
      expect(responseData.data).toMatchObject({
        taxRegime: "forfettario",
        substituteRate: 25,
        profitabilityRate: 78,
        pensionSystem: "PROFESSIONAL_FUND",
        professionalFundId: "CNPADC",
      });
    });

    it("should return 400 for invalid tax regime", async () => {
      const invalidData = {
        taxRegime: "invalid_regime",
      };

      const request = createPutRequest(testUser._id.toString(), invalidData);
      const response = await PUT(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Dati non validi");
      expect(responseData.errors).toContain(
        'Invalid option: expected one of "forfettario"|"ordinario"'
      );
    });

    it("should return 400 for invalid pension system", async () => {
      const invalidData = {
        pensionSystem: "INVALID_SYSTEM",
      };

      const request = createPutRequest(testUser._id.toString(), invalidData);
      const response = await PUT(request);
      const responseData = await response.json();

      expect(response.status).toBe(400);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Dati non validi");
      expect(responseData.errors).toContain(
        'Invalid option: expected one of "INPS"|"PROFESSIONAL_FUND"'
      );
    });

    it("should return 401 for unauthenticated requests", async () => {
      const request = new NextRequest("http://localhost:3000/api/settings", {
        method: "PUT",
        body: JSON.stringify({ taxRegime: "forfettario" }),
      });

      const response = await PUT(request);
      const responseData = await response.json();

      expect(response.status).toBe(401);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Non autorizzato");
    });

    it("should return 404 for non-existent user", async () => {
      const request = createPutRequest("507f1f77bcf86cd799439011", {
        taxRegime: "forfettario",
      });
      const response = await PUT(request);
      const responseData = await response.json();

      expect(response.status).toBe(404);
      expect(responseData.success).toBe(false);
      expect(responseData.message).toBe("Utente non trovato");
    });
  });
});
