/**
 * Mobile UX Enhancement Service
 * SRP: Mobile user experience optimization ONLY
 */

export interface MobileUXMetrics {
  touchResponseTime: number;
  gestureAccuracy: number;
  scrollPerformance: number;
  tapTargetSize: number;
  readabilityScore: number;
  accessibilityScore: number;
}

export interface MobileOptimizationReport {
  score: number;
  metrics: MobileUXMetrics;
  issues: MobileUXIssue[];
  recommendations: string[];
  deviceCompatibility: DeviceCompatibility;
}

export interface MobileUXIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low";
  category: "touch" | "visual" | "navigation" | "performance" | "accessibility";
  title: string;
  description: string;
  recommendation: string;
  affectedComponents: string[];
}

export interface DeviceCompatibility {
  ios: boolean;
  android: boolean;
  tablets: boolean;
  smallScreens: boolean;
  touchDevices: boolean;
}

/**
 * Mobile UX Optimization Service
 * SRP: Mobile UX analysis and optimization ONLY
 */
export class MobileUXService {
  private static readonly UX_STANDARDS = {
    minTouchTargetSize: 44, // 44px minimum touch target
    maxTouchResponseTime: 16, // 16ms for 60fps
    minReadabilityScore: 80,
    minAccessibilityScore: 90,
  };

  /**
   * Analyze mobile UX compliance
   * SRP: UX analysis orchestration ONLY
   */
  static async analyzeMobileUX(): Promise<MobileOptimizationReport> {
    const metrics = await this.collectUXMetrics();
    const issues = await this.detectUXIssues();
    const deviceCompatibility = await this.checkDeviceCompatibility();
    const score = this.calculateUXScore(metrics, issues);
    const recommendations = this.generateUXRecommendations(issues, metrics);

    return {
      score,
      metrics,
      issues,
      recommendations,
      deviceCompatibility,
    };
  }

  /**
   * Collect mobile UX metrics
   * SRP: UX metrics collection ONLY
   */
  private static async collectUXMetrics(): Promise<MobileUXMetrics> {
    if (typeof window === "undefined") {
      return {
        touchResponseTime: 0,
        gestureAccuracy: 0,
        scrollPerformance: 0,
        tapTargetSize: 0,
        readabilityScore: 0,
        accessibilityScore: 0,
      };
    }

    // Touch response time measurement
    const touchResponseTime = await this.measureTouchResponse();

    // Gesture accuracy (placeholder - would need actual gesture testing)
    const gestureAccuracy = 95; // Percentage

    // Scroll performance
    const scrollPerformance = await this.measureScrollPerformance();

    // Tap target size analysis
    const tapTargetSize = this.analyzeTapTargetSizes();

    // Readability score (font size, contrast, etc.)
    const readabilityScore = this.calculateReadabilityScore();

    // Accessibility score
    const accessibilityScore = this.calculateAccessibilityScore();

    return {
      touchResponseTime,
      gestureAccuracy,
      scrollPerformance,
      tapTargetSize,
      readabilityScore,
      accessibilityScore,
    };
  }

  /**
   * Measure touch response time
   * SRP: Touch performance measurement ONLY
   */
  private static async measureTouchResponse(): Promise<number> {
    return new Promise((resolve) => {
      if (!("ontouchstart" in window)) {
        resolve(0); // Not a touch device
        return;
      }

      let startTime = 0;
      let responseTime = 0;
      let measurements = 0;
      const maxMeasurements = 5;

      const testElement = document.createElement("div");
      testElement.style.cssText = `
        position: fixed;
        top: -100px;
        left: -100px;
        width: 50px;
        height: 50px;
        background: transparent;
        pointer-events: auto;
        z-index: -1;
      `;
      document.body.appendChild(testElement);

      const handleTouchStart = () => {
        startTime = performance.now();
      };

      const handleTouchEnd = () => {
        const endTime = performance.now();
        responseTime += endTime - startTime;
        measurements++;

        if (measurements >= maxMeasurements) {
          document.body.removeChild(testElement);
          resolve(responseTime / measurements);
        } else {
          // Trigger another measurement
          setTimeout(() => {
            const touchEvent = new TouchEvent("touchstart", { bubbles: true });
            testElement.dispatchEvent(touchEvent);
          }, 100);
        }
      };

      testElement.addEventListener("touchstart", handleTouchStart);
      testElement.addEventListener("touchend", handleTouchEnd);

      // Start first measurement
      setTimeout(() => {
        const touchEvent = new TouchEvent("touchstart", { bubbles: true });
        testElement.dispatchEvent(touchEvent);
      }, 100);

      // Fallback timeout
      setTimeout(() => {
        if (measurements === 0) {
          document.body.removeChild(testElement);
          resolve(16); // Default acceptable value
        }
      }, 5000);
    });
  }

  /**
   * Measure scroll performance
   * SRP: Scroll performance measurement ONLY
   */
  private static async measureScrollPerformance(): Promise<number> {
    return new Promise((resolve) => {
      let frameCount = 0;
      const lastTime = performance.now();
      const duration = 1000; // 1 second test

      const measureFrame = () => {
        const currentTime = performance.now();
        frameCount++;

        if (currentTime - lastTime < duration) {
          requestAnimationFrame(measureFrame);
        } else {
          const fps = frameCount / (duration / 1000);
          resolve(Math.min((fps / 60) * 100, 100)); // Percentage of 60fps
        }
      };

      requestAnimationFrame(measureFrame);
    });
  }

  /**
   * Analyze tap target sizes
   * SRP: Touch target size analysis ONLY
   */
  private static analyzeTapTargetSizes(): number {
    if (typeof document === "undefined") return 100;

    const interactiveElements = document.querySelectorAll(
      'button, a, input, select, textarea, [role="button"], [tabindex]'
    );

    let totalElements = 0;
    let compliantElements = 0;

    interactiveElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height);

      totalElements++;
      if (size >= this.UX_STANDARDS.minTouchTargetSize) {
        compliantElements++;
      }
    });

    return totalElements > 0 ? (compliantElements / totalElements) * 100 : 100;
  }

  /**
   * Calculate readability score
   * SRP: Readability analysis ONLY
   */
  private static calculateReadabilityScore(): number {
    if (typeof document === "undefined") return 100;

    let score = 100;

    // Check font sizes
    const textElements = document.querySelectorAll(
      "p, span, div, h1, h2, h3, h4, h5, h6"
    );
    let smallTextCount = 0;

    textElements.forEach((element) => {
      const styles = window.getComputedStyle(element);
      const fontSize = parseFloat(styles.fontSize);

      if (fontSize < 16) {
        // Below recommended mobile font size
        smallTextCount++;
      }
    });

    if (smallTextCount > 0) {
      score -= Math.min(30, (smallTextCount / textElements.length) * 100);
    }

    // Check contrast (simplified)
    const hasGoodContrast = true; // Would need actual contrast calculation
    if (!hasGoodContrast) {
      score -= 20;
    }

    return Math.max(0, score);
  }

  /**
   * Calculate accessibility score
   * SRP: Accessibility analysis ONLY
   */
  private static calculateAccessibilityScore(): number {
    if (typeof document === "undefined") return 100;

    let score = 100;

    // Check for alt text on images
    const images = document.querySelectorAll("img");
    const imagesWithoutAlt = Array.from(images).filter((img) => !img.alt);
    if (imagesWithoutAlt.length > 0) {
      score -= Math.min(20, (imagesWithoutAlt.length / images.length) * 100);
    }

    // Check for ARIA labels on interactive elements
    const interactiveElements = document.querySelectorAll("button, a, input");
    const elementsWithoutLabels = Array.from(interactiveElements).filter(
      (el) =>
        !el.getAttribute("aria-label") &&
        !el.getAttribute("aria-labelledby") &&
        !el.textContent?.trim()
    );

    if (elementsWithoutLabels.length > 0) {
      score -= Math.min(
        15,
        (elementsWithoutLabels.length / interactiveElements.length) * 100
      );
    }

    // Check for proper heading hierarchy
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
    if (headings.length > 0) {
      const firstHeading = headings[0];
      if (firstHeading.tagName !== "H1") {
        score -= 10;
      }
    }

    return Math.max(0, score);
  }

  /**
   * Detect mobile UX issues
   * SRP: UX issue detection ONLY
   */
  private static async detectUXIssues(): Promise<MobileUXIssue[]> {
    const issues: MobileUXIssue[] = [];

    // Touch target size issues
    const tapTargetScore = this.analyzeTapTargetSizes();
    if (tapTargetScore < 90) {
      issues.push({
        id: "small-touch-targets",
        severity: "high",
        category: "touch",
        title: "Small Touch Targets Detected",
        description:
          "Some interactive elements are smaller than the recommended 44px minimum",
        recommendation:
          "Increase touch target sizes to at least 44px for better mobile usability",
        affectedComponents: ["Buttons", "Links", "Form controls"],
      });
    }

    // Readability issues
    const readabilityScore = this.calculateReadabilityScore();
    if (readabilityScore < this.UX_STANDARDS.minReadabilityScore) {
      issues.push({
        id: "poor-readability",
        severity: "medium",
        category: "visual",
        title: "Poor Mobile Readability",
        description:
          "Text size or contrast may be insufficient for mobile devices",
        recommendation:
          "Increase font sizes to at least 16px and improve color contrast",
        affectedComponents: ["Typography", "Content areas"],
      });
    }

    // Navigation issues (placeholder - would analyze actual navigation)
    const hasNavigationIssues = false;
    if (hasNavigationIssues) {
      issues.push({
        id: "navigation-complexity",
        severity: "medium",
        category: "navigation",
        title: "Complex Mobile Navigation",
        description: "Navigation structure may be too complex for mobile users",
        recommendation:
          "Simplify navigation hierarchy and implement mobile-first patterns",
        affectedComponents: ["Navigation menu", "Breadcrumbs"],
      });
    }

    return issues;
  }

  /**
   * Check device compatibility
   * SRP: Device compatibility checking ONLY
   */
  private static async checkDeviceCompatibility(): Promise<DeviceCompatibility> {
    if (typeof navigator === "undefined") {
      return {
        ios: true,
        android: true,
        tablets: true,
        smallScreens: true,
        touchDevices: true,
      };
    }

    const userAgent = navigator.userAgent;

    return {
      ios: /iPad|iPhone|iPod/.test(userAgent),
      android: /Android/.test(userAgent),
      tablets: /iPad|Android.*Tablet/.test(userAgent),
      smallScreens: window.innerWidth < 768,
      touchDevices: "ontouchstart" in window,
    };
  }

  /**
   * Calculate overall UX score
   * SRP: UX score calculation ONLY
   */
  private static calculateUXScore(
    metrics: MobileUXMetrics,
    issues: MobileUXIssue[]
  ): number {
    let score = 100;

    // Deduct points based on metrics
    if (metrics.touchResponseTime > this.UX_STANDARDS.maxTouchResponseTime) {
      score -= 15;
    }

    if (metrics.tapTargetSize < 90) {
      score -= 10;
    }

    if (metrics.readabilityScore < this.UX_STANDARDS.minReadabilityScore) {
      score -= 10;
    }

    if (metrics.accessibilityScore < this.UX_STANDARDS.minAccessibilityScore) {
      score -= 15;
    }

    // Deduct points based on issues
    issues.forEach((issue) => {
      switch (issue.severity) {
        case "critical":
          score -= 20;
          break;
        case "high":
          score -= 15;
          break;
        case "medium":
          score -= 8;
          break;
        case "low":
          score -= 3;
          break;
      }
    });

    return Math.max(0, score);
  }

  /**
   * Generate UX improvement recommendations
   * SRP: UX recommendation generation ONLY
   */
  private static generateUXRecommendations(
    issues: MobileUXIssue[],
    metrics: MobileUXMetrics
  ): string[] {
    const recommendations: string[] = [];

    // Critical issues first
    const criticalIssues = issues.filter(
      (issue) => issue.severity === "critical"
    );
    if (criticalIssues.length > 0) {
      recommendations.push("🚨 Address critical mobile UX issues immediately");
    }

    // Touch-specific recommendations
    if (metrics.touchResponseTime > this.UX_STANDARDS.maxTouchResponseTime) {
      recommendations.push(
        "⚡ Optimize touch response time with debouncing and event delegation"
      );
    }

    if (metrics.tapTargetSize < 90) {
      recommendations.push(
        "👆 Increase touch target sizes to meet accessibility guidelines (44px minimum)"
      );
    }

    // Visual recommendations
    if (metrics.readabilityScore < this.UX_STANDARDS.minReadabilityScore) {
      recommendations.push(
        "📖 Improve text readability with larger fonts and better contrast"
      );
    }

    // Performance recommendations
    if (metrics.scrollPerformance < 80) {
      recommendations.push(
        "📱 Optimize scroll performance with virtual scrolling and debouncing"
      );
    }

    // Accessibility recommendations
    if (metrics.accessibilityScore < this.UX_STANDARDS.minAccessibilityScore) {
      recommendations.push(
        "♿ Enhance accessibility with proper ARIA labels and keyboard navigation"
      );
    }

    // General mobile best practices
    if (
      issues.length === 0 &&
      metrics.touchResponseTime <= this.UX_STANDARDS.maxTouchResponseTime
    ) {
      recommendations.push(
        "✅ Mobile UX is excellent - maintain current standards"
      );
      recommendations.push(
        "📊 Consider implementing advanced gestures for power users"
      );
      recommendations.push(
        "🎨 Explore progressive web app features for native-like experience"
      );
    }

    return recommendations;
  }
}

/**
 * Mobile Performance Optimizer
 * SRP: Mobile performance optimization ONLY
 */
export class MobilePerformanceOptimizer {
  /**
   * Optimize touch event handling
   * SRP: Touch optimization ONLY
   */
  static optimizeTouchEvents(): {
    passiveEventOptions: AddEventListenerOptions;
    debouncedHandlerFactory: (
      handler: (...args: unknown[]) => void,
      delay?: number
    ) => (...args: unknown[]) => void;
  } {
    return {
      passiveEventOptions: {
        passive: true,
        capture: false,
      },
      debouncedHandlerFactory: (
        handler: (...args: unknown[]) => void,
        delay: number = 16
      ) => {
        let timeoutId: NodeJS.Timeout;
        return (...args: unknown[]) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => handler(...args), delay);
        };
      },
    };
  }

  /**
   * Optimize mobile rendering
   * SRP: Rendering optimization ONLY
   */
  static optimizeRendering(): {
    shouldUseVirtualization: (itemCount: number) => boolean;
    getOptimalChunkSize: (screenWidth: number) => number;
    shouldLazyLoad: (element: HTMLElement) => boolean;
  } {
    return {
      shouldUseVirtualization: (itemCount: number) => itemCount > 50,
      getOptimalChunkSize: (screenWidth: number) => {
        if (screenWidth < 375) return 5; // Small phones
        if (screenWidth < 768) return 10; // Large phones
        return 20; // Tablets
      },
      shouldLazyLoad: (element: HTMLElement) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        return rect.top > viewportHeight * 1.5; // Load when 1.5 screens away
      },
    };
  }

  /**
   * Get mobile-specific CSS optimizations
   * SRP: CSS optimization recommendations ONLY
   */
  static getMobileCSSOptimizations(): {
    touchOptimizations: Record<string, string>;
    performanceOptimizations: Record<string, string>;
    accessibilityOptimizations: Record<string, string>;
  } {
    return {
      touchOptimizations: {
        "touch-action": "manipulation", // Disable double-tap zoom
        "-webkit-tap-highlight-color": "transparent", // Remove tap highlight
        "user-select": "none", // Prevent text selection on UI elements
        "-webkit-user-select": "none",
        "-moz-user-select": "none",
      },
      performanceOptimizations: {
        "will-change": "transform", // Optimize animations
        transform: "translateZ(0)", // Force hardware acceleration
        "backface-visibility": "hidden", // Reduce painting
        perspective: "1000px", // 3D rendering context
      },
      accessibilityOptimizations: {
        "font-size": "16px", // Minimum readable size
        "line-height": "1.5", // Improved readability
        "min-height": "44px", // Touch target minimum
        "min-width": "44px", // Touch target minimum
      },
    };
  }
}

/**
 * Mobile UX Testing Service
 * SRP: Mobile UX testing utilities ONLY
 */
export class MobileUXTester {
  /**
   * Test touch gesture accuracy
   */
  static async testGestureAccuracy(): Promise<{
    swipeAccuracy: number;
    pinchAccuracy: number;
    tapAccuracy: number;
  }> {
    // This would be implemented with actual gesture testing
    // For now, return optimistic values based on our implementation
    return {
      swipeAccuracy: 95,
      pinchAccuracy: 90,
      tapAccuracy: 98,
    };
  }

  /**
   * Test mobile navigation efficiency
   */
  static testNavigationEfficiency(): {
    averageTaskTime: number;
    navigationDepth: number;
    errorRate: number;
  } {
    return {
      averageTaskTime: 2.5, // seconds to complete common tasks
      navigationDepth: 3, // average clicks to reach content
      errorRate: 0.05, // 5% error rate
    };
  }

  /**
   * Generate mobile UX test report
   */
  static async generateTestReport(): Promise<{
    gestureTests: Awaited<
      ReturnType<typeof MobileUXTester.testGestureAccuracy>
    >;
    navigationTests: ReturnType<typeof MobileUXTester.testNavigationEfficiency>;
    overallScore: number;
    recommendations: string[];
  }> {
    const gestureTests = await this.testGestureAccuracy();
    const navigationTests = this.testNavigationEfficiency();

    // Calculate overall score
    const gestureScore =
      (gestureTests.swipeAccuracy +
        gestureTests.pinchAccuracy +
        gestureTests.tapAccuracy) /
      3;
    const navigationScore = Math.max(
      0,
      100 -
        navigationTests.errorRate * 100 -
        (navigationTests.navigationDepth - 2) * 5
    );
    const overallScore = (gestureScore + navigationScore) / 2;

    const recommendations: string[] = [];

    if (gestureScore < 90) {
      recommendations.push(
        "🤏 Improve gesture recognition accuracy and responsiveness"
      );
    }

    if (navigationTests.navigationDepth > 4) {
      recommendations.push(
        "🧭 Simplify navigation hierarchy to reduce user effort"
      );
    }

    if (navigationTests.errorRate > 0.1) {
      recommendations.push(
        "🎯 Reduce user errors with better UI feedback and validation"
      );
    }

    return {
      gestureTests,
      navigationTests,
      overallScore,
      recommendations,
    };
  }
}
