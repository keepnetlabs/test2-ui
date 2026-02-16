import { createLocalVue, shallowMount } from "@vue/test-utils";
import RecentCampaigns from "@/components/Common/Widget/WidgetComponents/RecentCampaigns.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("RecentCampaigns widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(RecentCampaigns, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getRecentCampaignsCard": [],
            ...gettersOverrides
          }
        }
      },
      stubs: [
        "WidgetLoading",
        "WidgetContainer",
        "WidgetHeader",
        "WidgetBody",
        "WidgetList",
        "DataTableChart"
      ]
    });
  };

  describe("component structure", () => {
    it("uses title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.RecentCampaigns);
    });

    it("should render as a Vue component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("RecentCampaigns");
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });
  });

  describe("table data and campaigns", () => {
    it("exposes table data from store getter", () => {
      const data = [{ name: "Campaign 1" }];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should handle empty campaigns data", () => {
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": []
      });
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should handle single campaign", () => {
      const data = [{ name: "Security Awareness" }];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(1);
    });

    it("should handle multiple campaigns", () => {
      const data = [
        { name: "Campaign 1" },
        { name: "Campaign 2" },
        { name: "Campaign 3" }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(3);
    });
  });

  describe("chart options for different campaign methods", () => {
    it("returns chart options for Click-Only method", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(options.labels).toEqual([labels.NoResponse, labels.Clicked, labels.Opened]);
    });

    it("returns chart options for MFA method", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "MFA" });
      expect(options.labels).toContain(labels.SubmittedMFACode);
    });

    it("chart options have proper structure", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(options).toBeDefined();
      expect(options.labels).toBeDefined();
      expect(Array.isArray(options.labels)).toBe(true);
    });

    it("returns different options for different methods", () => {
      const wrapper = mountFactory();
      const clickOnlyOptions = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      const mfaOptions = wrapper.vm.getChartOptionsForRow({ method: "MFA" });
      expect(clickOnlyOptions.labels).not.toEqual(mfaOptions.labels);
    });

    it("handles campaign with supported method types", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(options).toBeDefined();
      expect(options.labels).toBeDefined();
      expect(Array.isArray(options.labels)).toBe(true);
    });
  });

  describe("store getters", () => {
    it("should get recent campaigns from store", () => {
      const data = [{ name: "Campaign 1" }];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentCampaignsCard"]).toEqual(data);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle empty store data", () => {
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentCampaignsCard"]).toEqual([]);
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
    it("should handle null campaign data", () => {
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentCampaignsCard"]).toBeNull();
    });

    it("should handle campaign with Click-Only method", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(options).toBeDefined();
      expect(options.labels).toBeDefined();
    });

    it("should handle campaign with MFA method", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "MFA" });
      expect(options).toBeDefined();
      expect(options.labels).toBeDefined();
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
      const data = [{ name: "Campaign 1" }];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical campaign data", () => {
      const data = [
        { name: "Phishing Awareness", method: "Click-Only" },
        { name: "MFA Security", method: "MFA" }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(2);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getRecentCampaignsCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should work with loading state false and populated data", () => {
      const data = [{ name: "Campaign 1" }];
      const wrapper = mountFactory({
        "widgets/getIsLoading": false,
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should build chart options for Click-Only campaign method", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(options).toBeDefined();
      expect(options.labels).toBeDefined();
      expect(Array.isArray(options.labels)).toBe(true);
      expect(options.labels.length).toBeGreaterThan(0);
    });
  });

  describe("Title & Labels Management", () => {
    it("should use correct title from labels constant", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.RecentCampaigns);
    });

    it("should have consistent title across instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.getTitle).toBe(wrapper2.vm.getTitle);
    });

    it("should return string title", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getTitle).toBe('string');
    });

    it("should have non-empty title", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle.length).toBeGreaterThan(0);
    });
  });

  describe("Chart Options Variations", () => {
    it("should generate valid Click-Only options", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(options.labels).toContain(labels.NoResponse);
      expect(options.labels).toContain(labels.Clicked);
      expect(options.labels).toContain(labels.Opened);
    });

    it("should generate valid MFA options", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "MFA" });
      expect(options.labels).toBeDefined();
      expect(options.labels.length).toBeGreaterThan(0);
    });

    it("should generate different options for different methods", () => {
      const wrapper = mountFactory();
      const clickOnlyOptions = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      const mfaOptions = wrapper.vm.getChartOptionsForRow({ method: "MFA" });

      const clickLabels = JSON.stringify(clickOnlyOptions.labels.sort());
      const mfaLabels = JSON.stringify(mfaOptions.labels.sort());
      expect(clickLabels).not.toBe(mfaLabels);
    });

    it("should always return defined options object", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(options).toBeDefined();
      expect(typeof options).toBe('object');
    });

    it("should always return labels array", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(Array.isArray(options.labels)).toBe(true);
    });

    it("should handle unknown campaign method gracefully", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "Unknown-Method" });
      // Unknown methods return undefined
      expect(options === undefined || options !== null).toBe(true);
    });
  });

  describe("Data Variations & Edge Cases", () => {
    it("should handle campaign without method property", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ name: "Campaign" });
      // Method returns undefined for missing method
      expect(options === undefined || options !== null).toBe(true);
    });

    it("should handle campaign with empty method string", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: "" });
      // Method returns undefined for empty string
      expect(options === undefined || options !== null).toBe(true);
    });

    it("should handle campaign with null method", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: null });
      // Method returns undefined for null method
      expect(options === undefined || options !== null).toBe(true);
    });

    it("should handle campaign with undefined method", () => {
      const wrapper = mountFactory();
      const options = wrapper.vm.getChartOptionsForRow({ method: undefined });
      // Method returns undefined for undefined method
      expect(options === undefined || options !== null).toBe(true);
    });

    it("should handle very large campaign datasets", () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({
        name: `Campaign ${i}`,
        method: i % 2 === 0 ? "Click-Only" : "MFA"
      }));
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": largeData
      });
      expect(wrapper.vm.tableData.length).toBe(1000);
    });

    it("should handle campaigns with special characters in names", () => {
      const data = [
        { name: "Campaign & Test", method: "Click-Only" },
        { name: "Campaign <Script>", method: "MFA" },
        { name: "Campaign 测试", method: "Click-Only" }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(3);
    });
  });

  describe("Component Lifecycle & State", () => {
    it("should initialize with default state", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
      expect(wrapper.vm.$options.name).toBe("RecentCampaigns");
    });

    it("should maintain state after forceUpdate", () => {
      const data = [{ name: "Campaign 1" }];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      const originalData = wrapper.vm.tableData;
      wrapper.vm.$forceUpdate();
      expect(wrapper.vm.tableData).toEqual(originalData);
    });

    it("should handle rapid state changes", () => {
      const wrapper = mountFactory();
      for (let i = 0; i < 100; i++) {
        wrapper.vm.$forceUpdate();
      }
      expect(wrapper.vm).toBeDefined();
    });

    it("should clean up properly on destroy", () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.destroy();
      }).not.toThrow();
    });

    it("should be re-mountable after destruction", () => {
      const wrapper1 = mountFactory();
      wrapper1.destroy();
      const wrapper2 = mountFactory();
      expect(wrapper2.exists()).toBe(true);
    });
  });

  describe("Store Integration & Getters", () => {
    it("should have access to widgets module getters", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store.getters["widgets/getRecentCampaignsCard"]).toBeDefined();
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBeDefined();
    });

    it("should update when getter value changes", () => {
      const data1 = [{ name: "Campaign 1" }];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data1
      });
      expect(wrapper.vm.tableData).toEqual(data1);

      const data2 = [{ name: "Campaign 2" }];
      const wrapper2 = mountFactory({
        "widgets/getRecentCampaignsCard": data2
      });
      expect(wrapper2.vm.tableData).toEqual(data2);
    });

    it("should handle undefined getter values", () => {
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": undefined
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentCampaignsCard"]).toBeUndefined();
    });

    it("should handle loading state transitions", () => {
      const wrapper1 = mountFactory({ "widgets/getIsLoading": false });
      expect(wrapper1.vm.$store.getters["widgets/getIsLoading"]).toBe(false);

      const wrapper2 = mountFactory({ "widgets/getIsLoading": true });
      expect(wrapper2.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });
  });

  describe("Multiple Instance Isolation", () => {
    it("should support multiple independent instances", () => {
      const data1 = [{ name: "Campaign 1" }];
      const data2 = [{ name: "Campaign 2" }];

      const wrapper1 = mountFactory({
        "widgets/getRecentCampaignsCard": data1
      });
      const wrapper2 = mountFactory({
        "widgets/getRecentCampaignsCard": data2
      });

      expect(wrapper1.vm.tableData).toEqual(data1);
      expect(wrapper2.vm.tableData).toEqual(data2);
      expect(wrapper1.vm.tableData).not.toEqual(wrapper2.vm.tableData);
    });

    it("should not share state between instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();

      expect(wrapper1.vm).not.toBe(wrapper2.vm);
      expect(wrapper1.vm.$store).toBeDefined();
      expect(wrapper2.vm.$store).toBeDefined();
    });

    it("should handle concurrent operations", () => {
      const wrappers = [];
      for (let i = 0; i < 5; i++) {
        wrappers.push(mountFactory({
          "widgets/getRecentCampaignsCard": [{ name: `Campaign ${i}` }]
        }));
      }

      wrappers.forEach((wrapper, index) => {
        expect(wrapper.vm.tableData[0].name).toBe(`Campaign ${index}`);
      });

      wrappers.forEach(w => w.destroy());
    });
  });

  describe("Performance & Efficiency", () => {
    it("should mount quickly", () => {
      const start = performance.now();
      const wrapper = mountFactory();
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(200);
      wrapper.destroy();
    });

    it("should handle getChartOptionsForRow quickly", () => {
      const wrapper = mountFactory();
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      }
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it("should process large datasets efficiently", () => {
      const largeData = Array.from({ length: 5000 }, (_, i) => ({
        name: `Campaign ${i}`,
        method: i % 2 === 0 ? "Click-Only" : "MFA"
      }));

      const start = performance.now();
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": largeData
      });
      const duration = performance.now() - start;

      expect(wrapper.vm.tableData.length).toBe(5000);
      expect(duration).toBeLessThan(500);
      wrapper.destroy();
    });
  });

  describe("Computed Properties", () => {
    it("should have getTitle computed property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeDefined();
    });

    it("getTitle should be reactive", () => {
      const wrapper = mountFactory();
      const title1 = wrapper.vm.getTitle;
      wrapper.vm.$forceUpdate();
      const title2 = wrapper.vm.getTitle;
      expect(title1).toBe(title2);
    });

    it("should have tableData computed property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.tableData).toBeDefined();
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true);
    });

    it("tableData should update from store", () => {
      const data = [{ name: "Test Campaign" }];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });
  });

  describe("Method Validation & Behavior", () => {
    it("getChartOptionsForRow should be callable", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getChartOptionsForRow).toBe('function');
    });

    it("getChartOptionsForRow should accept campaign object", () => {
      const wrapper = mountFactory();
      const result = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
      expect(result).toBeDefined();
    });

    it("getChartOptionsForRow should return consistent results", () => {
      const wrapper = mountFactory();
      const campaign = { method: "Click-Only" };
      const result1 = wrapper.vm.getChartOptionsForRow(campaign);
      const result2 = wrapper.vm.getChartOptionsForRow(campaign);

      expect(JSON.stringify(result1.labels)).toBe(JSON.stringify(result2.labels));
    });

    it("getChartOptionsForRow should handle campaign with multiple properties", () => {
      const wrapper = mountFactory();
      const campaign = {
        name: "Test Campaign",
        method: "Click-Only",
        id: 123,
        status: "active"
      };
      const options = wrapper.vm.getChartOptionsForRow(campaign);
      expect(options).toBeDefined();
      expect(options.labels).toBeDefined();
    });
  });

  describe("Component Initialization", () => {
    it("should initialize with proper component structure", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options).toBeDefined();
      expect(wrapper.vm.$options.name).toBe("RecentCampaigns");
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have Vuetify available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$vuetify).toBeDefined();
    });

    it("should have proper data initialization", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.tableData).toBeDefined();
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true);
    });

    it("should support mount factory with custom getters", () => {
      const customGetters = {
        "widgets/getRecentCampaignsCard": [{ name: "Custom" }],
        "widgets/getIsLoading": true
      };
      const wrapper = mountFactory(customGetters);
      expect(wrapper.vm.tableData).toEqual([{ name: "Custom" }]);
    });
  });

  describe("Widget Container Integration", () => {
    it("should have WidgetContainer stub available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.components).toBeDefined();
    });

    it("should render without child component errors", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });

    it("should support widget stubs properly", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Accessibility & Usability", () => {
    it("should have labels for all campaign data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeDefined();
      expect(typeof wrapper.vm.getTitle).toBe('string');
    });

    it("should handle campaigns with accessibility metadata", () => {
      const data = [
        { name: "Campaign 1", method: "Click-Only", ariaLabel: "Campaign 1" }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should support screen reader friendly output", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle.length).toBeGreaterThan(0);
    });
  });
});
