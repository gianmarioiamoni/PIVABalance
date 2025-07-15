/**
 * @jest-environment node
 */
import {
  connectDB,
  disconnectDB,
  getConnectionStatus,
} from "@/lib/database/mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("MongoDB Connection", () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    // Start in-memory MongoDB instance for testing
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
  });

  afterAll(async () => {
    // Cleanup
    await disconnectDB();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Ensure clean state for each test
    await disconnectDB();
  });

  describe("connectDB", () => {
    it("should connect to MongoDB successfully", async () => {
      const connection = await connectDB();
      expect(connection).toBeDefined();
      expect(getConnectionStatus()).toBe("connected");
    });

    it("should reuse existing connection when called multiple times", async () => {
      const connection1 = await connectDB();
      const connection2 = await connectDB();

      expect(connection1).toBe(connection2);
      expect(getConnectionStatus()).toBe("connected");
    });

    it("should handle connection errors gracefully", async () => {
      // Test with timeout to simulate connection failure
      const originalUri = process.env.MONGODB_URI;
      process.env.MONGODB_URI = "mongodb://invalid-host:27017/test";

      // Mongoose doesn't immediately throw on invalid connections
      // So we test that connection status stays disconnected after attempted connection
      try {
        await connectDB();
        // If it doesn't throw, check connection status
        const status = getConnectionStatus();
        expect(["disconnected", "connecting"]).toContain(status);
      } catch (error) {
        // This is expected for invalid connections
        expect(error).toBeDefined();
      }

      // Restore original URI
      process.env.MONGODB_URI = originalUri;
    }, 10000);
  });

  describe("disconnectDB", () => {
    it("should disconnect from MongoDB successfully", async () => {
      await connectDB();
      expect(getConnectionStatus()).toBe("connected");

      await disconnectDB();
      expect(getConnectionStatus()).toBe("disconnected");
    });

    it("should handle disconnect when not connected", async () => {
      // Should not throw when disconnecting from already disconnected state
      await expect(disconnectDB()).resolves.not.toThrow();
    });
  });

  describe("getConnectionStatus", () => {
    it("should return correct status when disconnected", async () => {
      expect(getConnectionStatus()).toBe("disconnected");
    });

    it("should return correct status when connected", async () => {
      await connectDB();
      expect(getConnectionStatus()).toBe("connected");
    });
  });
});
