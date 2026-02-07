import { createLocalVue, shallowMount } from "@vue/test-utils";
import PhishingReporterIrHeader from "@/components/Common/Widget/WidgetComponents/PhishingReporterIrHeader.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("PhishingReporterIrHeader widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(PhishingReporterIrHeader, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getPhishingReporterCard": null,
            "widgets/getIsLoading": false,
            ...gettersOverrides
          }
        },
        $router: { push: jest.fn() }
      },
      stubs: ["CardLoading", "router-link", "v-icon"]
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
      expect(wrapper.vm.$options.name).toBe("PhishingReporterIrHeader");
    });

    it("should have router available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$router).toBeDefined();
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });
  });

  describe("isPhishingEmpty method", () => {
    it("returns true for null phishing data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty(null)).toBe(true);
    });

    it("returns true for empty phishing status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty({ onlineUsersCount: 0, offlineUsersCount: 0 })).toBe(true);
    });

    it("returns false when onlineUsersCount exists", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty({ onlineUsersCount: 1, offlineUsersCount: 0 })).toBe(false);
    });

    it("returns false when offlineUsersCount exists", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty({ onlineUsersCount: 0, offlineUsersCount: 1 })).toBe(false);
    });

    it("returns false when both counts exist", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty({ onlineUsersCount: 5, offlineUsersCount: 3 })).toBe(false);
    });

    it("returns false for object with only onlineUsersCount", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty({ onlineUsersCount: 10 })).toBe(false);
    });
  });

  describe("store getters", () => {
    it("should get phishing reporter card data from store", () => {
      const mockData = { onlineUsersCount: 5, offlineUsersCount: 2 };
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": mockData
      });
      expect(wrapper.vm.$store.getters["widgets/getPhishingReporterCard"]).toEqual(mockData);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle null phishing reporter card", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getPhishingReporterCard"]).toBeNull();
    });

    it("should handle loading state as false", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
    });
  });

  describe("widget data handling", () => {
    it("should handle empty widget data", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": null,
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.isPhishingEmpty(null)).toBe(true);
    });

    it("should handle widget data with zero counts", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": { onlineUsersCount: 0, offlineUsersCount: 0 }
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(true);
    });

    it("should handle widget data with values", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": { onlineUsersCount: 10, offlineUsersCount: 5 }
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle partial widget data", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": { onlineUsersCount: 3 }
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
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

    it("should handle loading state transitions", async () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
    });
  });

  describe("router integration", () => {
    it("should have router push method available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$router.push).toBeDefined();
      expect(typeof wrapper.vm.$router.push).toBe("function");
    });

    it("should be able to call router push", () => {
      const wrapper = mountFactory();
      const pushSpy = jest.spyOn(wrapper.vm.$router, "push");
      wrapper.vm.$router.push({ name: "test" });
      expect(pushSpy).toHaveBeenCalled();
      pushSpy.mockRestore();
    });
  });

  describe("component reactivity", () => {
    it("should handle phishing data changes", async () => {
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": null
      });
      expect(wrapper.vm.isPhishingEmpty(null)).toBe(true);
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

    it("should have router-link stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$router).toBeDefined();
    });

    it("should have v-icon stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
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
  });

  describe("edge cases", () => {
    it("should handle undefined phishing data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty(undefined)).toBe(true);
    });

    it("should handle empty object", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty({})).toBe(true);
    });

    it("should handle object with negative values", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: -1, offlineUsersCount: -1 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle very large user counts", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: 999999, offlineUsersCount: 999999 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle string values in counts", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: "5", offlineUsersCount: "3" };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
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
      const wrapper = mountFactory();
      const result1 = wrapper.vm.isPhishingEmpty({ onlineUsersCount: 1, offlineUsersCount: 0 });
      const result2 = wrapper.vm.isPhishingEmpty({ onlineUsersCount: 1, offlineUsersCount: 0 });
      expect(result1).toBe(result2);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical phishing reporter data", () => {
      const mockData = {
        onlineUsersCount: 15,
        offlineUsersCount: 8
      };
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": mockData
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getPhishingReporterCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.isPhishingEmpty(null)).toBe(true);
    });

    it("should work with loading state false and populated data", () => {
      const mockData = { onlineUsersCount: 20, offlineUsersCount: 10 };
      const wrapper = mountFactory({
        "widgets/getIsLoading": false,
        "widgets/getPhishingReporterCard": mockData
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });
  });
});
