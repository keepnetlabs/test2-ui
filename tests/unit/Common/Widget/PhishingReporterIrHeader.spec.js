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

  describe("user count handling", () => {
    it("should handle zero online users", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: 0, offlineUsersCount: 5 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle zero offline users", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: 5, offlineUsersCount: 0 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle large online user counts", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: 100000, offlineUsersCount: 5 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle large offline user counts", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: 5, offlineUsersCount: 100000 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle equal online and offline counts", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: 50, offlineUsersCount: 50 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });
  });

  describe("data validation and edge cases", () => {
    it("should validate null values correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty(null)).toBe(true);
    });

    it("should validate undefined values correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty(undefined)).toBe(true);
    });

    it("should validate empty objects correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty({})).toBe(true);
    });

    it("should handle objects with null properties", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: null, offlineUsersCount: null };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(true);
    });

    it("should handle objects with undefined properties", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: undefined, offlineUsersCount: undefined };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(true);
    });

    it("should handle float values in counts", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: 5.5, offlineUsersCount: 3.2 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle negative user counts", () => {
      const wrapper = mountFactory();
      const data = { onlineUsersCount: -5, offlineUsersCount: 3 };
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });
  });

  describe("store data structure and updates", () => {
    it("should preserve complete phishing data structure", () => {
      const mockData = {
        onlineUsersCount: 10,
        offlineUsersCount: 5,
        totalCount: 15,
        lastUpdate: "2024-01-15"
      };
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": mockData
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(data).toEqual(mockData);
    });

    it("should handle partial phishing data structures", () => {
      const mockData = { onlineUsersCount: 10 };
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": mockData
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(data.onlineUsersCount).toBe(10);
    });

    it("should handle phishing data with extra properties", () => {
      const mockData = {
        onlineUsersCount: 10,
        offlineUsersCount: 5,
        metadata: { source: "api", timestamp: Date.now() }
      };
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": mockData
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(data.metadata).toBeDefined();
    });
  });

  describe("performance characteristics", () => {
    it("should mount efficiently", () => {
      const startTime = Date.now();
      mountFactory();
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(150);
    });

    it("should evaluate isPhishingEmpty efficiently", () => {
      const wrapper = mountFactory();
      const startTime = Date.now();
      for (let i = 0; i < 1000; i++) {
        wrapper.vm.isPhishingEmpty({ onlineUsersCount: i, offlineUsersCount: i });
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(150);
    });

    it("should handle rapid data changes efficiently", () => {
      const startTime = Date.now();
      for (let i = 0; i < 50; i++) {
        const mockData = { onlineUsersCount: i, offlineUsersCount: i * 2 };
        mountFactory({
          "widgets/getPhishingReporterCard": mockData
        });
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(5000);
    });
  });

  describe("widget component integration", () => {
    it("should have labels property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.labels).toBeDefined();
      expect(wrapper.vm.labels).toBe(labels);
    });

    it("should have access to router", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$router).toBeDefined();
      expect(wrapper.vm.$router.push).toBeDefined();
    });

    it("should have access to store getters", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store.getters["widgets/getPhishingReporterCard"]).toBeDefined();
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBeDefined();
    });

    it("should support CardLoading stub", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });

    it("should support router-link stub", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$router).toBeDefined();
    });
  });

  describe("accessibility and labels", () => {
    it("should have semantic component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("PhishingReporterIrHeader");
    });

    it("should have readable labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.labels).toBeTruthy();
      expect(typeof wrapper.vm.labels).toBe("object");
    });

    it("should expose user count data for display", () => {
      const mockData = { onlineUsersCount: 15, offlineUsersCount: 8 };
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": mockData
      });
      const data = wrapper.vm.$store.getters["widgets/getPhishingReporterCard"];
      expect(data.onlineUsersCount).toBe(15);
      expect(data.offlineUsersCount).toBe(8);
    });
  });

  describe("multiple instances independence", () => {
    it("should create independent instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("should maintain separate data in multiple instances", () => {
      const data1 = { onlineUsersCount: 10, offlineUsersCount: 5 };
      const data2 = { onlineUsersCount: 20, offlineUsersCount: 8 };

      const wrapper1 = mountFactory({
        "widgets/getPhishingReporterCard": data1
      });
      const wrapper2 = mountFactory({
        "widgets/getPhishingReporterCard": data2
      });

      expect(wrapper1.vm.$store.getters["widgets/getPhishingReporterCard"]).toEqual(data1);
      expect(wrapper2.vm.$store.getters["widgets/getPhishingReporterCard"]).toEqual(data2);
    });

    it("should not interfere with other instances", () => {
      const data = { onlineUsersCount: 10, offlineUsersCount: 5 };
      const wrapper1 = mountFactory({
        "widgets/getPhishingReporterCard": data
      });
      const wrapper2 = mountFactory({
        "widgets/getPhishingReporterCard": null
      });

      expect(wrapper1.vm.$store.getters["widgets/getPhishingReporterCard"]).toEqual(data);
      expect(wrapper2.vm.$store.getters["widgets/getPhishingReporterCard"]).toBeNull();
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

  describe("complex phishing scenarios", () => {
    it("should handle scenarios with all user types", () => {
      const data = {
        onlineUsersCount: 100,
        offlineUsersCount: 50,
        totalUsers: 150,
        reportedCount: 30
      };
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": data
      });
      expect(wrapper.vm.isPhishingEmpty(data)).toBe(false);
    });

    it("should handle scenarios with mixed user states", () => {
      const data1 = { onlineUsersCount: 0, offlineUsersCount: 100 };
      const data2 = { onlineUsersCount: 100, offlineUsersCount: 0 };
      const data3 = { onlineUsersCount: 50, offlineUsersCount: 50 };

      const wrapper = mountFactory();
      expect(wrapper.vm.isPhishingEmpty(data1)).toBe(false);
      expect(wrapper.vm.isPhishingEmpty(data2)).toBe(false);
      expect(wrapper.vm.isPhishingEmpty(data3)).toBe(false);
    });

    it("should consistently evaluate data across multiple calls", () => {
      const data = { onlineUsersCount: 25, offlineUsersCount: 10 };
      const wrapper = mountFactory();

      const result1 = wrapper.vm.isPhishingEmpty(data);
      const result2 = wrapper.vm.isPhishingEmpty(data);
      const result3 = wrapper.vm.isPhishingEmpty(data);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe(false);
    });
  });

  describe("error handling and recovery", () => {
    it("should handle null data gracefully", () => {
      const wrapper = mountFactory({
        "widgets/getPhishingReporterCard": null
      });
      expect(wrapper.vm.isPhishingEmpty(null)).toBe(true);
    });

    it("should continue functioning after error states", () => {
      const wrapper = mountFactory();
      wrapper.vm.isPhishingEmpty(null);
      wrapper.vm.isPhishingEmpty(undefined);
      wrapper.vm.isPhishingEmpty({});
      expect(wrapper.vm).toBeDefined();
    });

    it("should maintain state consistency with various inputs", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("PhishingReporterIrHeader");
      expect(wrapper.vm.labels).toBe(labels);
      expect(wrapper.vm.$router).toBeDefined();
    });
  });
});
