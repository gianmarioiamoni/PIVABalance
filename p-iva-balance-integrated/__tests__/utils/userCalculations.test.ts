import {
  getUserDisplayName,
  compareUserPassword,
  hashPassword,
  validatePasswordStrength,
  validateEmail,
  validateName,
  isGoogleUser,
  hasPassword,
  cleanUserForJSON,
  normalizeEmail,
  getUserInitials,
} from "@/utils/userCalculations";
import { IUser } from "@/types";

describe("User Calculations Utils", () => {
  const mockUser: IUser = {
    _id: "user123",
    email: "john.doe@example.com",
    name: "John Doe",
    password: "hashedPassword123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockGoogleUser: IUser = {
    _id: "user456",
    email: "jane.smith@gmail.com",
    name: "Jane Smith",
    googleId: "google123456",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUserNoName: IUser = {
    _id: "user789",
    email: "testuser@domain.com",
    password: "hashedPassword456",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("getUserDisplayName", () => {
    it("should return user name when available", () => {
      expect(getUserDisplayName(mockUser)).toBe("John Doe");
      expect(getUserDisplayName(mockGoogleUser)).toBe("Jane Smith");
    });

    it("should return email username when name is not available", () => {
      expect(getUserDisplayName(mockUserNoName)).toBe("testuser");
    });
  });

  describe("validatePasswordStrength", () => {
    it("should validate strong passwords", () => {
      const result = validatePasswordStrength("StrongPass123");
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject passwords that are too short", () => {
      const result = validatePasswordStrength("Short1");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must be at least 8 characters long"
      );
    });

    it("should reject passwords without lowercase letters", () => {
      const result = validatePasswordStrength("PASSWORD123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one lowercase letter"
      );
    });

    it("should reject passwords without uppercase letters", () => {
      const result = validatePasswordStrength("password123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter"
      );
    });

    it("should reject passwords without numbers", () => {
      const result = validatePasswordStrength("PasswordOnly");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
    });

    it("should handle empty password", () => {
      const result = validatePasswordStrength("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
    });
  });

  describe("validateEmail", () => {
    it("should validate correct email formats", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
      expect(validateEmail("user_name@example.org")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("@domain.com")).toBe(false);
      expect(validateEmail("user@")).toBe(false);
      expect(validateEmail("user..name@domain.com")).toBe(false);
      expect(validateEmail("user+tag@example.org")).toBe(false); // + not supported by current regex
    });
  });

  describe("validateName", () => {
    it("should validate correct names", () => {
      const result1 = validateName("John Doe");
      const result2 = validateName("Marie-Claire O'Connor");
      const result3 = validateName("José García");

      expect(result1.isValid).toBe(true);
      expect(result2.isValid).toBe(true);
      expect(result3.isValid).toBe(true);
    });

    it("should reject names that are too short", () => {
      const result = validateName("J");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Name must be at least 2 characters long"
      );
    });

    it("should reject names that are too long", () => {
      const longName = "A".repeat(101);
      const result = validateName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name cannot exceed 100 characters");
    });

    it("should reject names with invalid characters", () => {
      const result = validateName("John123");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Name can only contain letters, spaces, apostrophes, and hyphens"
      );
    });

    it("should handle empty name", () => {
      const result = validateName("");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Name is required");
    });
  });

  describe("isGoogleUser", () => {
    it("should return true for users with Google ID", () => {
      expect(isGoogleUser(mockGoogleUser)).toBe(true);
    });

    it("should return false for users without Google ID", () => {
      expect(isGoogleUser(mockUser)).toBe(false);
      expect(isGoogleUser(mockUserNoName)).toBe(false);
    });
  });

  describe("hasPassword", () => {
    it("should return true for users with password", () => {
      expect(hasPassword(mockUser)).toBe(true);
      expect(hasPassword(mockUserNoName)).toBe(true);
    });

    it("should return false for users without password", () => {
      expect(hasPassword(mockGoogleUser)).toBe(false);
    });
  });

  describe("normalizeEmail", () => {
    it("should convert email to lowercase and trim", () => {
      expect(normalizeEmail("  JOHN.DOE@EXAMPLE.COM  ")).toBe(
        "john.doe@example.com"
      );
      expect(normalizeEmail("Test@Domain.org")).toBe("test@domain.org");
    });
  });

  describe("getUserInitials", () => {
    it("should return initials from full name", () => {
      expect(getUserInitials(mockUser)).toBe("JD");
      expect(getUserInitials(mockGoogleUser)).toBe("JS");
    });

    it("should return first two characters of display name for single name", () => {
      expect(getUserInitials(mockUserNoName)).toBe("TE"); // from "testuser"
    });

    it("should handle names with multiple words", () => {
      const userWithLongName: IUser = {
        ...mockUser,
        name: "John Michael Smith",
      };
      expect(getUserInitials(userWithLongName)).toBe("JM");
    });
  });

  describe("cleanUserForJSON", () => {
    it("should remove password and __v fields", () => {
      const userWithSensitiveData = { ...mockUser, __v: 0 } as any;
      const cleaned = cleanUserForJSON(userWithSensitiveData);

      expect(cleaned).not.toHaveProperty("password");
      expect(cleaned).not.toHaveProperty("__v");
      expect(cleaned._id).toBe(mockUser._id);
      expect(cleaned.email).toBe(mockUser.email);
      expect(cleaned.name).toBe(mockUser.name);
    });
  });

  describe("Password hashing and comparison", () => {
    it("should hash password and verify correctly", async () => {
      const plainPassword = "TestPassword123";
      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(50); // Bcrypt hashes are typically 60 chars

      const isValid = await compareUserPassword(plainPassword, hashedPassword);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const plainPassword = "TestPassword123";
      const wrongPassword = "WrongPassword456";
      const hashedPassword = await hashPassword(plainPassword);

      const isValid = await compareUserPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it("should handle empty password comparison", async () => {
      const hashedPassword = await hashPassword("TestPassword123");

      await expect(compareUserPassword("", hashedPassword)).rejects.toThrow(
        "Password comparison failed"
      );
    });

    it("should handle missing hash", async () => {
      await expect(compareUserPassword("TestPassword123", "")).rejects.toThrow(
        "Password comparison failed"
      );
    });
  });
});
