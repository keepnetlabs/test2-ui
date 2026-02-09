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
});
