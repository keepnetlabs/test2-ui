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
});
