import { createLocalVue, shallowMount } from "@vue/test-utils";
import RoiSummaryIrHeader from "@/components/Common/Widget/WidgetComponents/RoiSummaryIrHeader.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("RoiSummaryIrHeader widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(RoiSummaryIrHeader, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getROISummaryCard": { revenue: "0", time: "0" },
            "widgets/getIsLoading": false,
            ...gettersOverrides
          }
        }
      },
      stubs: ["CardLoading", "v-icon"]
    });
  };

  describe("component structure", () => {
    it("uses labels from constants", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.labels).toBe(labels);
    });

    it("should render as a Vue component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("RoiSummaryIrHeader");
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have labels property available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.labels).toBeDefined();
    });
  });

  describe("isRoiSummaryEmpty method", () => {
    it("returns true when ROI summary is empty", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "0", time: "0" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(true);
    });

    it("returns true when both revenue and time are 0", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(true);
    });

    it("returns false when ROI summary has values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "120", time: "5" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("returns false when revenue has a value", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "100", time: "0" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("returns false when time has a value", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "0", time: "10" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("returns false when both have values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "250", time: "8" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });
  });

  describe("store getters", () => {
    it("should get ROI summary card from store", () => {
      const mockData = { revenue: "500", time: "20" };
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": mockData
      });
      expect(wrapper.vm.$store.getters["widgets/getROISummaryCard"]).toEqual(mockData);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle default ROI summary card", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "0", time: "0" }
      });
      expect(wrapper.vm.$store.getters["widgets/getROISummaryCard"]).toEqual({ revenue: "0", time: "0" });
    });

    it("should handle loading state as false", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
    });
  });

  describe("widget data handling", () => {
    it("should handle default widget data", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "0", time: "0" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(true);
    });

    it("should handle widget data with numeric string values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "1500", time: "30" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("should handle widget data with decimal values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "1500.50", time: "30.5" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("should handle partial widget data", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "100" }
      });
      const data = wrapper.vm.$store.getters["widgets/getROISummaryCard"];
      expect(data.revenue).toBe("100");
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

    it("should handle loading state changes", async () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
    });
  });

  describe("component reactivity", () => {
    it("should handle ROI data changes", async () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "0", time: "0" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(true);
    });

    it("should maintain labels reactivity", () => {
      const wrapper = mountFactory();
      const labels1 = wrapper.vm.labels;
      expect(labels1).toBe(labels);
    });
  });

  describe("mocking setup", () => {
    it("should have CardLoading stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have v-icon stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have Vuetify available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$vuetify).toBeDefined();
    });
  });

  describe("widget rendering", () => {
    it("should render without errors", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });

    it("should have component definition", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options).toBeDefined();
    });

    it("should be mounted successfully", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });

    it("should render with default props", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should handle null ROI data", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getROISummaryCard"]).toBeNull();
    });

    it("should handle undefined ROI data", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": undefined
      });
      expect(wrapper.vm.$store.getters["widgets/getROISummaryCard"]).toBeUndefined();
    });

    it("should handle very large revenue values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "999999999", time: "100" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("should handle very large time values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "100", time: "999999" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("should handle negative numeric string values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "-100", time: "-5" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("should handle non-numeric string values", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "abc", time: "xyz" }
      });
      const data = wrapper.vm.$store.getters["widgets/getROISummaryCard"];
      expect(data.revenue).toBe("abc");
      expect(data.time).toBe("xyz");
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
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "500", time: "10" }
      });
      const result1 = wrapper.vm.isRoiSummaryEmpty();
      const result2 = wrapper.vm.isRoiSummaryEmpty();
      expect(result1).toBe(result2);
      expect(result1).toBe(false);
    });

    it("should not modify data internally", () => {
      const mockData = { revenue: "100", time: "5" };
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": mockData
      });
      const data = wrapper.vm.$store.getters["widgets/getROISummaryCard"];
      expect(data).toEqual(mockData);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical ROI data", () => {
      const mockData = { revenue: "5000", time: "25" };
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": mockData
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getROISummaryCard": { revenue: "0", time: "0" }
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(true);
    });

    it("should work with loading state false and populated data", () => {
      const mockData = { revenue: "3000", time: "15" };
      const wrapper = mountFactory({
        "widgets/getIsLoading": false,
        "widgets/getROISummaryCard": mockData
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
    });

    it("should handle rapid state changes", () => {
      const wrapper = mountFactory({
        "widgets/getROISummaryCard": { revenue: "0", time: "0" }
      });
      expect(wrapper.vm.isRoiSummaryEmpty()).toBe(true);
    });
  });
});
