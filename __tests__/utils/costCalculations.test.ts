import {
  formatCostAmount,
  formatCostDate,
  calculateTotalCosts,
  filterCostsByYear,
  filterCostsByUserId,
  sortCostsByDate,
  filterCostsByDateRange,
  getCostStatistics,
  cleanCostForJSON,
} from "@/utils/costCalculations";
import { ICost } from "@/types";

describe("Cost Calculations Utils", () => {
  const mockCost1: ICost = {
    _id: "cost1",
    userId: "user123",
    description: "Office supplies",
    date: new Date("2024-03-15"),
    amount: 150.5,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCost2: ICost = {
    _id: "cost2",
    userId: "user123",
    description: "Software license",
    date: new Date("2024-06-20"),
    amount: 299.99,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCost3: ICost = {
    _id: "cost3",
    userId: "user456",
    description: "Marketing campaign",
    date: new Date("2023-12-10"),
    amount: 500.0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("formatCostAmount", () => {
    it("should format amount with Euro symbol and 2 decimal places", () => {
      expect(formatCostAmount(mockCost1)).toBe("€150.50");
      expect(formatCostAmount(mockCost2)).toBe("€299.99");
      expect(formatCostAmount(mockCost3)).toBe("€500.00");
    });
  });

  describe("formatCostDate", () => {
    it("should format date in Italian format", () => {
      expect(formatCostDate(mockCost1)).toBe("15/03/2024");
      expect(formatCostDate(mockCost2)).toBe("20/06/2024");
      expect(formatCostDate(mockCost3)).toBe("10/12/2023");
    });
  });

  describe("calculateTotalCosts", () => {
    it("should calculate total amount from multiple costs", () => {
      const costs = [mockCost1, mockCost2, mockCost3];
      const total = calculateTotalCosts(costs);
      expect(total).toBe(950.49); // 150.50 + 299.99 + 500.00
    });

    it("should return 0 for empty array", () => {
      expect(calculateTotalCosts([])).toBe(0);
    });

    it("should handle single cost", () => {
      expect(calculateTotalCosts([mockCost1])).toBe(150.5);
    });
  });

  describe("filterCostsByYear", () => {
    it("should filter costs by year", () => {
      const costs = [mockCost1, mockCost2, mockCost3];

      const costs2024 = filterCostsByYear(costs, 2024);
      const costs2023 = filterCostsByYear(costs, 2023);

      expect(costs2024).toHaveLength(2);
      expect(costs2023).toHaveLength(1);
      expect(costs2024.map((c) => c._id)).toEqual(["cost1", "cost2"]);
      expect(costs2023[0]._id).toBe("cost3");
    });

    it("should return empty array for year with no costs", () => {
      const costs = [mockCost1, mockCost2, mockCost3];
      const costs2022 = filterCostsByYear(costs, 2022);
      expect(costs2022).toHaveLength(0);
    });
  });

  describe("filterCostsByUserId", () => {
    it("should filter costs by user ID", () => {
      const costs = [mockCost1, mockCost2, mockCost3];

      const user123Costs = filterCostsByUserId(costs, "user123");
      const user456Costs = filterCostsByUserId(costs, "user456");

      expect(user123Costs).toHaveLength(2);
      expect(user456Costs).toHaveLength(1);
      expect(user123Costs.map((c) => c._id)).toEqual(["cost1", "cost2"]);
      expect(user456Costs[0]._id).toBe("cost3");
    });
  });

  describe("sortCostsByDate", () => {
    it("should sort costs by date descending (newest first) by default", () => {
      const costs = [mockCost3, mockCost1, mockCost2]; // Mixed order
      const sorted = sortCostsByDate(costs);

      expect(sorted.map((c) => c._id)).toEqual(["cost2", "cost1", "cost3"]);
    });

    it("should sort costs by date ascending when specified", () => {
      const costs = [mockCost3, mockCost1, mockCost2]; // Mixed order
      const sorted = sortCostsByDate(costs, true);

      expect(sorted.map((c) => c._id)).toEqual(["cost3", "cost1", "cost2"]);
    });

    it("should not mutate original array", () => {
      const costs = [mockCost3, mockCost1, mockCost2];
      const originalOrder = costs.map((c) => c._id);

      sortCostsByDate(costs);

      expect(costs.map((c) => c._id)).toEqual(originalOrder);
    });
  });

  describe("filterCostsByDateRange", () => {
    it("should filter costs within date range", () => {
      const costs = [mockCost1, mockCost2, mockCost3];
      const startDate = new Date("2024-01-01");
      const endDate = new Date("2024-12-31");

      const filtered = filterCostsByDateRange(costs, startDate, endDate);

      expect(filtered).toHaveLength(2);
      expect(filtered.map((c) => c._id)).toEqual(["cost1", "cost2"]);
    });

    it("should return empty array when no costs in range", () => {
      const costs = [mockCost1, mockCost2, mockCost3];
      const startDate = new Date("2025-01-01");
      const endDate = new Date("2025-12-31");

      const filtered = filterCostsByDateRange(costs, startDate, endDate);

      expect(filtered).toHaveLength(0);
    });
  });

  describe("getCostStatistics", () => {
    it("should calculate statistics for multiple costs", () => {
      const costs = [mockCost1, mockCost2, mockCost3]; // 150.50, 299.99, 500.00
      const stats = getCostStatistics(costs);

      expect(stats.total).toBe(950.49);
      expect(stats.count).toBe(3);
      expect(stats.average).toBeCloseTo(316.83, 2);
      expect(stats.min).toBe(150.5);
      expect(stats.max).toBe(500.0);
    });

    it("should return zero statistics for empty array", () => {
      const stats = getCostStatistics([]);

      expect(stats.total).toBe(0);
      expect(stats.count).toBe(0);
      expect(stats.average).toBe(0);
      expect(stats.min).toBe(0);
      expect(stats.max).toBe(0);
    });

    it("should handle single cost", () => {
      const stats = getCostStatistics([mockCost1]);

      expect(stats.total).toBe(150.5);
      expect(stats.count).toBe(1);
      expect(stats.average).toBe(150.5);
      expect(stats.min).toBe(150.5);
      expect(stats.max).toBe(150.5);
    });
  });

  describe("cleanCostForJSON", () => {
    it("should remove __v field from cost object", () => {
      const costWithVersion = { ...mockCost1, __v: 0 } as any;
      const cleaned = cleanCostForJSON(costWithVersion);

      expect(cleaned).not.toHaveProperty("__v");
      expect(cleaned._id).toBe(mockCost1._id);
      expect(cleaned.amount).toBe(mockCost1.amount);
    });

    it("should keep all other properties", () => {
      const cleaned = cleanCostForJSON(mockCost1);

      expect(cleaned._id).toBe(mockCost1._id);
      expect(cleaned.userId).toBe(mockCost1.userId);
      expect(cleaned.description).toBe(mockCost1.description);
      expect(cleaned.amount).toBe(mockCost1.amount);
      expect(cleaned.date).toBe(mockCost1.date);
    });
  });
});
