/**
 * @jest-environment node
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDB, disconnectDB } from "@/lib/database/mongodb";
import { User } from "@/models/User";

describe("User Model", () => {
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
    // Clean up database before each test
    await User.deleteMany({});
  });

  describe("User Creation", () => {
    it("should create a user with valid data", async () => {
      const userData = {
        email: "test@example.com",
        password: "Test123!",
        name: "Test User",
      };

      const user = new User(userData);
      await user.save();

      expect(user._id).toBeDefined();
      expect(user.email).toBe("test@example.com");
      expect(user.name).toBe("Test User");
      expect(user.password).not.toBe("Test123!"); // Should be hashed
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it("should hash password before saving", async () => {
      const userData = {
        email: "test@example.com",
        password: "Test123!",
        name: "Test User",
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe("Test123!");
      expect(user.password).toMatch(/^\$2[aby]\$/);
    });

    it("should convert email to lowercase", async () => {
      const userData = {
        email: "TEST@EXAMPLE.COM",
        password: "Test123!",
        name: "Test User",
      };

      const user = new User(userData);
      await user.save();

      expect(user.email).toBe("test@example.com");
    });

    it("should create user with Google ID without password", async () => {
      const userData = {
        email: "test@example.com",
        name: "Test User",
        googleId: "google123",
      };

      const user = new User(userData);
      await user.save();

      expect(user.googleId).toBe("google123");
      expect(user.password).toBeUndefined();
    });
  });

  describe("Validation", () => {
    it("should require email", async () => {
      const user = new User({
        password: "Test123!",
        name: "Test User",
      });

      await expect(user.save()).rejects.toThrow("Email is required");
    });

    it("should require name", async () => {
      const user = new User({
        email: "test@example.com",
        password: "Test123!",
      });

      await expect(user.save()).rejects.toThrow("Name is required");
    });

    it("should require password when no Google ID is provided", async () => {
      const user = new User({
        email: "test@example.com",
        name: "Test User",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should validate email format", async () => {
      const user = new User({
        email: "invalid-email",
        password: "Test123!",
        name: "Test User",
      });

      await expect(user.save()).rejects.toThrow(
        "Please enter a valid email address"
      );
    });

    it("should validate password strength", async () => {
      const user = new User({
        email: "test@example.com",
        password: "weak",
        name: "Test User",
      });

      await expect(user.save()).rejects.toThrow();
    });

    it("should validate name contains only allowed characters", async () => {
      const user = new User({
        email: "test@example.com",
        password: "Test123!",
        name: "Test123",
      });

      await expect(user.save()).rejects.toThrow(
        "Name can only contain letters, spaces, apostrophes, and hyphens"
      );
    });

    it("should enforce unique email", async () => {
      await User.create({
        email: "test@example.com",
        password: "Test123!",
        name: "First User",
      });

      const duplicateUser = new User({
        email: "test@example.com",
        password: "Test456!",
        name: "Second User",
      });

      await expect(duplicateUser.save()).rejects.toThrow();
    });
  });

  describe("Instance Methods", () => {
    let user: any;

    beforeEach(async () => {
      user = await User.create({
        email: "test@example.com",
        password: "Test123!",
        name: "Test User",
      });
    });

    it("should compare password correctly", async () => {
      const isMatch = await user.comparePassword("Test123!");
      expect(isMatch).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const isMatch = await user.comparePassword("wrongpassword");
      expect(isMatch).toBe(false);
    });

    it("should handle empty password comparison", async () => {
      await expect(user.comparePassword("")).rejects.toThrow();
    });

    it("should exclude password from JSON output", () => {
      const json = user.toJSON();
      expect(json.password).toBeUndefined();
      expect(json.email).toBe("test@example.com");
      expect(json.name).toBe("Test User");
    });
  });

  describe("Static Methods", () => {
    beforeEach(async () => {
      await User.create({
        email: "test@example.com",
        password: "Test123!",
        name: "Test User",
      });
      await User.create({
        email: "google@example.com",
        name: "Google User",
        googleId: "google123",
      });
    });

    it("should find user by email", async () => {
      const user = await User.findByEmail("test@example.com");
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
    });

    it("should find user by email case-insensitive", async () => {
      const user = await User.findByEmail("TEST@EXAMPLE.COM");
      expect(user).toBeDefined();
      expect(user?.email).toBe("test@example.com");
    });

    it("should find user by Google ID", async () => {
      const user = await User.findByGoogleId("google123");
      expect(user).toBeDefined();
      expect(user?.googleId).toBe("google123");
    });

    it("should return null for non-existent email", async () => {
      const user = await User.findByEmail("nonexistent@example.com");
      expect(user).toBeNull();
    });

    it("should return null for non-existent Google ID", async () => {
      const user = await User.findByGoogleId("nonexistent");
      expect(user).toBeNull();
    });
  });

  describe("Virtual Properties", () => {
    it("should return display name from name", async () => {
      const user = await User.create({
        email: "test@example.com",
        password: "Test123!",
        name: "Test User",
      });

      expect(user.displayName).toBe("Test User");
    });

    it("should return display name from email when name is not provided", () => {
      // Create user without name property to test fallback to email
      const userData = {
        email: "testuser@example.com",
        password: "Test123!",
        name: "TestUser",
      };

      const user = new User(userData);
      // Set name to undefined to test fallback
      user.name = undefined as any;

      expect(user.displayName).toBe("testuser");
    });
  });
});
