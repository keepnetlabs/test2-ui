import { createLocalVue, shallowMount } from "@vue/test-utils";
import Reporters from "@/components/Common/Widget/WidgetComponents/Reporters.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

jest.mock("@/utils/functions", () => ({
  getTextColor: jest.fn((val) => `color-${val}`)
}));

describe("Reporters widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(Reporters, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getReportersCard": [],
            ...gettersOverrides
          }
        }
      },
      stubs: [
        "WidgetLoading",
        "WidgetContainer",
        "WidgetHeader",
        "WidgetBody",
        "WidgetList"
      ]
    });
  };

  describe("component structure", () => {
    it("uses title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.Reporters);
    });

    it("should render as a Vue component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("Reporters");
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });
  });

  describe("table data handling", () => {
    it("exposes table data from store getter", () => {
      const data = [{ reporterEmail: "a@b.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should handle empty reporters data", () => {
      const wrapper = mountFactory({
        "widgets/getReportersCard": []
      });
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should handle single reporter", () => {
      const data = [{ reporterEmail: "reporter@example.com", reliability: "medium" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(1);
    });

    it("should handle multiple reporters", () => {
      const data = [
        { reporterEmail: "reporter1@example.com", reliability: "high" },
        { reporterEmail: "reporter2@example.com", reliability: "medium" },
        { reporterEmail: "reporter3@example.com", reliability: "low" }
      ];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("should preserve reporter properties", () => {
      const data = [{ reporterEmail: "test@example.com", reliability: "high", score: 95 }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("test@example.com");
      expect(wrapper.vm.tableData[0].reliability).toBe("high");
    });
  });

  describe("text color utility", () => {
    it("maps text color via utility", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("high")).toBe("color-high");
    });

    it("handles different reliability levels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("high")).toBe("color-high");
      expect(wrapper.vm.getTextColor("medium")).toBe("color-medium");
      expect(wrapper.vm.getTextColor("low")).toBe("color-low");
    });

    it("handles custom reliability values", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("critical")).toBe("color-critical");
      expect(wrapper.vm.getTextColor("excellent")).toBe("color-excellent");
    });

    it("returns color string format", () => {
      const wrapper = mountFactory();
      const color = wrapper.vm.getTextColor("any");
      expect(typeof color).toBe("string");
      expect(color).toMatch(/^color-/);
    });
  });

  describe("store getters", () => {
    it("should get reporters card from store", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getReportersCard"]).toEqual(data);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle empty store data", () => {
      const wrapper = mountFactory({
        "widgets/getReportersCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getReportersCard"]).toEqual([]);
    });

    it("should handle loading state as false", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
    });
  });

  describe("loading state handling", () => {
    it("should indicate loading when getIsLoading is true", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should indicate not loading when getIsLoading is false", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
    });
  });

  describe("title property", () => {
    it("should return correct title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.Reporters);
    });

    it("should be a string", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getTitle).toBe("string");
    });

    it("should not be empty", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle.length).toBeGreaterThan(0);
    });
  });

  describe("widget rendering", () => {
    it("should render without errors", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });

    it("should be mounted successfully", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });

    it("should have component definition", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should handle null reporter data", () => {
      const wrapper = mountFactory({
        "widgets/getReportersCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getReportersCard"]).toBeNull();
    });

    it("should handle reporters with special characters in email", () => {
      const data = [{ reporterEmail: "user+test@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user+test@example.com");
    });

    it("should handle empty reliability string", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("")).toBe("color-");
    });

    it("should handle numeric values as strings", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("123")).toBe("color-123");
    });
  });

  describe("consistency and reliability", () => {
    it("should render consistently", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name);
    });

    it("should handle component destruction gracefully", () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.destroy();
      }).not.toThrow();
    });

    it("should maintain state across multiple calls", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("utility function returns consistent results", () => {
      const wrapper = mountFactory();
      const color1 = wrapper.vm.getTextColor("high");
      const color2 = wrapper.vm.getTextColor("high");
      expect(color1).toBe(color2);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical reporters data", () => {
      const data = [
        { reporterEmail: "john@company.com", reliability: "high" },
        { reporterEmail: "jane@company.com", reliability: "medium" }
      ];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(2);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getReportersCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should work with loading state false and populated data", () => {
      const data = [{ reporterEmail: "reporter@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getIsLoading": false,
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should apply color utilities to reporters with different reliability levels", () => {
      const wrapper = mountFactory();
      const colors = ["high", "medium", "low"].map(level =>
        wrapper.vm.getTextColor(level)
      );
      expect(colors).toEqual(["color-high", "color-medium", "color-low"]);
    });
  });

  describe("reliability level mapping", () => {
    it("should map reliability level to color for high", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("high")).toBe("color-high");
    });

    it("should map reliability level to color for medium", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("medium")).toBe("color-medium");
    });

    it("should map reliability level to color for low", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("low")).toBe("color-low");
    });

    it("should handle reliability with different case", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("HIGH")).toBe("color-HIGH");
      expect(wrapper.vm.getTextColor("Low")).toBe("color-Low");
    });

    it("should handle unknown reliability levels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("unknown")).toBe("color-unknown");
    });
  });

  describe("email format variations", () => {
    it("should handle standard email format", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user@example.com");
    });

    it("should handle email with multiple subdomains", () => {
      const data = [{ reporterEmail: "user@mail.example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user@mail.example.com");
    });

    it("should handle email with numbers", () => {
      const data = [{ reporterEmail: "user123@example456.com", reliability: "medium" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user123@example456.com");
    });

    it("should handle email with special characters", () => {
      const data = [{ reporterEmail: "user+tag@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user+tag@example.com");
    });

    it("should handle email with dots in username", () => {
      const data = [{ reporterEmail: "first.last@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("first.last@example.com");
    });

    it("should handle uppercase email addresses", () => {
      const data = [{ reporterEmail: "USER@EXAMPLE.COM", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("USER@EXAMPLE.COM");
    });
  });

  describe("reporter count handling", () => {
    it("should handle zero reporters", () => {
      const wrapper = mountFactory({
        "widgets/getReportersCard": []
      });
      expect(wrapper.vm.tableData.length).toBe(0);
    });

    it("should handle single reporter", () => {
      const data = [{ reporterEmail: "reporter@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(1);
    });

    it("should handle multiple reporters", () => {
      const data = [
        { reporterEmail: "reporter1@example.com", reliability: "high" },
        { reporterEmail: "reporter2@example.com", reliability: "medium" },
        { reporterEmail: "reporter3@example.com", reliability: "low" }
      ];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("should handle large number of reporters", () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        reporterEmail: `reporter${i}@example.com`,
        reliability: ["high", "medium", "low"][i % 3]
      }));
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(100);
    });
  });

  describe("data transformation scenarios", () => {
    it("should preserve all reporter properties", () => {
      const data = [{
        reporterEmail: "user@example.com",
        reliability: "high",
        score: 95,
        reports: 150
      }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].score).toBe(95);
      expect(wrapper.vm.tableData[0].reports).toBe(150);
    });

    it("should handle missing reliability property", () => {
      const data = [{ reporterEmail: "user@example.com" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0]).toBeDefined();
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user@example.com");
    });

    it("should handle reporters with undefined values", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: undefined }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0]).toBeDefined();
    });

    it("should maintain data integrity across multiple accesses", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      const firstAccess = wrapper.vm.tableData;
      const secondAccess = wrapper.vm.tableData;
      expect(firstAccess).toEqual(secondAccess);
    });
  });

  describe("color utility edge cases", () => {
    it("should handle empty string input", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("")).toBe("color-");
    });

    it("should handle whitespace input", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor(" ")).toBe("color- ");
    });

    it("should handle very long input", () => {
      const wrapper = mountFactory();
      const longString = "a".repeat(100);
      expect(wrapper.vm.getTextColor(longString)).toBe(`color-${longString}`);
    });

    it("should handle special characters", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTextColor("high-priority")).toBe("color-high-priority");
      expect(wrapper.vm.getTextColor("very-high")).toBe("color-very-high");
    });

    it("should preserve case sensitivity", () => {
      const wrapper = mountFactory();
      const result1 = wrapper.vm.getTextColor("High");
      const result2 = wrapper.vm.getTextColor("high");
      expect(result1).not.toBe(result2);
    });
  });

  describe("multiple reporters with different levels", () => {
    it("should handle mix of high and low reliability", () => {
      const data = [
        { reporterEmail: "reporter1@example.com", reliability: "high" },
        { reporterEmail: "reporter2@example.com", reliability: "low" }
      ];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData).toHaveLength(2);
      expect(wrapper.vm.tableData[0].reliability).toBe("high");
      expect(wrapper.vm.tableData[1].reliability).toBe("low");
    });

    it("should handle all three reliability levels", () => {
      const data = [
        { reporterEmail: "high@example.com", reliability: "high" },
        { reporterEmail: "medium@example.com", reliability: "medium" },
        { reporterEmail: "low@example.com", reliability: "low" }
      ];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      const colors = wrapper.vm.tableData.map(r => wrapper.vm.getTextColor(r.reliability));
      expect(colors).toEqual(["color-high", "color-medium", "color-low"]);
    });

    it("should apply colors correctly to multiple reporters", () => {
      const data = [
        { reporterEmail: "reporter1@example.com", reliability: "high" },
        { reporterEmail: "reporter2@example.com", reliability: "medium" },
        { reporterEmail: "reporter3@example.com", reliability: "low" },
        { reporterEmail: "reporter4@example.com", reliability: "high" }
      ];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      const reporterReliabilities = wrapper.vm.tableData.map(r => r.reliability);
      expect(reporterReliabilities).toEqual(["high", "medium", "low", "high"]);
    });
  });

  describe("performance characteristics", () => {
    it("should render efficiently with empty data", () => {
      const startTime = Date.now();
      mountFactory({ "widgets/getReportersCard": [] });
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(200);
    });

    it("should handle large datasets without performance degradation", () => {
      const data = Array.from({ length: 1000 }, (_, i) => ({
        reporterEmail: `reporter${i}@example.com`,
        reliability: ["high", "medium", "low"][i % 3]
      }));
      const startTime = Date.now();
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500);
      expect(wrapper.vm.tableData).toHaveLength(1000);
    });

    it("should access color utility without performance penalty", () => {
      const wrapper = mountFactory();
      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        wrapper.vm.getTextColor("high");
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("widget component integration", () => {
    it("should have all required widget properties", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeDefined();
      expect(wrapper.vm.tableData).toBeDefined();
      expect(wrapper.vm.getTextColor).toBeDefined();
    });

    it("should integrate with WidgetContainer stub", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });

    it("should work with WidgetLoading stub", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("should work with WidgetList stub", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("accessibility features", () => {
    it("should have semantic component structure", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("Reporters");
    });

    it("should expose data properties for screen readers", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: "high" }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user@example.com");
    });

    it("should maintain content structure consistency", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeTruthy();
      expect(typeof wrapper.vm.getTitle).toBe("string");
    });
  });

  describe("complex reporter scenarios", () => {
    it("should handle reporters with very long emails", () => {
      const data = [{
        reporterEmail: "very.long.email.address.with.many.parts@subdomain.example.com",
        reliability: "high"
      }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toContain("@");
    });

    it("should handle reporters with international domain names", () => {
      const data = [{
        reporterEmail: "user@example.café",
        reliability: "medium"
      }];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData[0].reporterEmail).toBe("user@example.café");
    });

    it("should handle duplicate reporter emails with different reliability", () => {
      const data = [
        { reporterEmail: "user@example.com", reliability: "high" },
        { reporterEmail: "user@example.com", reliability: "low" }
      ];
      const wrapper = mountFactory({
        "widgets/getReportersCard": data
      });
      expect(wrapper.vm.tableData).toHaveLength(2);
    });

    it("should handle rapid state changes", async () => {
      const wrapper = mountFactory();
      const data1 = [{ reporterEmail: "reporter1@example.com", reliability: "high" }];
      const wrapper2 = mountFactory({
        "widgets/getReportersCard": data1
      });
      expect(wrapper2.vm.tableData).toEqual(data1);
    });
  });

  describe("multiple instances independence", () => {
    it("should create independent widget instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("should maintain separate state in multiple instances", () => {
      const data1 = [{ reporterEmail: "reporter1@example.com", reliability: "high" }];
      const data2 = [{ reporterEmail: "reporter2@example.com", reliability: "low" }];

      const wrapper1 = mountFactory({
        "widgets/getReportersCard": data1
      });
      const wrapper2 = mountFactory({
        "widgets/getReportersCard": data2
      });

      expect(wrapper1.vm.tableData).toEqual(data1);
      expect(wrapper2.vm.tableData).toEqual(data2);
      expect(wrapper1.vm.tableData).not.toEqual(wrapper2.vm.tableData);
    });

    it("should not interfere with other instances", () => {
      const data = [{ reporterEmail: "user@example.com", reliability: "high" }];
      const wrapper1 = mountFactory({
        "widgets/getReportersCard": data
      });
      const wrapper2 = mountFactory({
        "widgets/getReportersCard": []
      });

      expect(wrapper1.vm.tableData).toHaveLength(1);
      expect(wrapper2.vm.tableData).toHaveLength(0);
    });

    it("should share labels reference across instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.getTitle).toBe(wrapper2.vm.getTitle);
    });

    it("should handle cleanup independently", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();

      expect(() => {
        wrapper1.destroy();
        expect(wrapper2.exists()).toBe(true);
      }).not.toThrow();

      wrapper2.destroy();
    });
  });
});
