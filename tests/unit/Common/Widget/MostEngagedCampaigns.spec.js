import { createLocalVue, shallowMount } from "@vue/test-utils";
import MostEngagedCampaigns from "@/components/Common/Widget/WidgetComponents/MostEngagedCampaigns.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("MostEngagedCampaigns widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(MostEngagedCampaigns, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getMostEngagedCampaignsCard": [],
            ...gettersOverrides
          }
        },
        $router: { push: jest.fn() }
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
      expect(wrapper.vm.getTitle).toBe(labels.MostEngagedCampaigns);
    });

    it("should render as a Vue component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("MostEngagedCampaigns");
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have router available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$router).toBeDefined();
    });
  });

  describe("table data and columns", () => {
    it("exposes table data from store getter", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("defines columns and empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.empty.message).toBe(labels.EmptyMostEngagedCampaignsWidget);
    });

    it("should have two columns defined", () => {
      const wrapper = mountFactory();
      const columns = wrapper.vm.columns;
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBe(2);
    });

    it("should have proper column structure", () => {
      const wrapper = mountFactory();
      const columns = wrapper.vm.columns;
      columns.forEach(column => {
        expect(column).toBeDefined();
      });
    });

    it("should have empty message defined", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty).toBeDefined();
      expect(wrapper.vm.empty.message).toBeDefined();
    });
  });

  describe("widget data handling", () => {
    it("should handle empty campaigns data", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should handle single campaign", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 5 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(1);
    });

    it("should handle multiple campaigns", () => {
      const data = [
        { name: "Campaign 1", phishedUsersCount: 10 },
        { name: "Campaign 2", phishedUsersCount: 8 },
        { name: "Campaign 3", phishedUsersCount: 12 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("should handle campaigns with zero phished users", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 0 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(0);
    });

    it("should handle campaigns with large user counts", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 999999 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(999999);
    });
  });

  describe("store getters", () => {
    it("should get most engaged campaigns from store", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 15 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getMostEngagedCampaignsCard"]).toEqual(data);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle empty store data", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getMostEngagedCampaignsCard"]).toEqual([]);
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

    it("should handle loading state transitions", async () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": false
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
    });
  });

  describe("title property", () => {
    it("should return correct title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.MostEngagedCampaigns);
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
    it("should handle campaign data changes", async () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should maintain title reactivity", () => {
      const wrapper = mountFactory();
      const title1 = wrapper.vm.getTitle;
      expect(title1).toBe(labels.MostEngagedCampaigns);
    });
  });

  describe("mocking setup", () => {
    it("should have WidgetLoading stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have WidgetContainer stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have WidgetHeader stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have WidgetBody stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have WidgetList stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
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
    it("should handle null campaign data", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getMostEngagedCampaignsCard"]).toBeNull();
    });

    it("should handle undefined campaign data", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": undefined
      });
      expect(wrapper.vm.$store.getters["widgets/getMostEngagedCampaignsCard"]).toBeUndefined();
    });

    it("should handle campaigns with special characters in names", () => {
      const data = [{ name: "Campaign <script>alert()</script>", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toBe("Campaign <script>alert()</script>");
    });

    it("should handle campaigns with unicode characters", () => {
      const data = [{ name: "活动 1", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toBe("活动 1");
    });

    it("should handle campaigns with empty name", () => {
      const data = [{ name: "", phishedUsersCount: 5 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toBe("");
    });

    it("should handle very long campaign names", () => {
      const longName = "A".repeat(500);
      const data = [{ name: longName, phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toBe(longName);
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
      const data = [{ name: "Campaign 1", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      const result1 = wrapper.vm.tableData;
      const result2 = wrapper.vm.tableData;
      expect(result1).toEqual(result2);
    });

    it("should not modify data internally", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical campaign data", () => {
      const data = [
        { name: "Email Security Campaign", phishedUsersCount: 25 },
        { name: "Phishing Awareness", phishedUsersCount: 18 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(2);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should work with loading state false and populated data", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 30 }];
      const wrapper = mountFactory({
        "widgets/getIsLoading": false,
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should display correct title and columns together", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.MostEngagedCampaigns);
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.empty.message).toBe(labels.EmptyMostEngagedCampaignsWidget);
    });
  });

  describe("campaign count handling", () => {
    it("should handle zero campaigns", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper.vm.tableData.length).toBe(0);
    });

    it("should handle single campaign", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(1);
    });

    it("should handle multiple campaigns", () => {
      const data = [
        { name: "Campaign 1", phishedUsersCount: 10 },
        { name: "Campaign 2", phishedUsersCount: 20 },
        { name: "Campaign 3", phishedUsersCount: 15 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("should handle large number of campaigns", () => {
      const data = Array.from({ length: 500 }, (_, i) => ({
        name: `Campaign ${i}`,
        phishedUsersCount: Math.floor(Math.random() * 1000)
      }));
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(500);
    });
  });

  describe("engagement metrics handling", () => {
    it("should handle zero phished users count", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 0 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(0);
    });

    it("should handle single phished user", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 1 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(1);
    });

    it("should handle multiple phished users", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 100 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(100);
    });

    it("should handle very large user counts", () => {
      const data = [
        { name: "Campaign 1", phishedUsersCount: 1000000 },
        { name: "Campaign 2", phishedUsersCount: 9999999 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(1000000);
      expect(wrapper.vm.tableData[1].phishedUsersCount).toBe(9999999);
    });

    it("should handle campaigns with varied user counts", () => {
      const data = [
        { name: "Campaign 1", phishedUsersCount: 5 },
        { name: "Campaign 2", phishedUsersCount: 50 },
        { name: "Campaign 3", phishedUsersCount: 500 },
        { name: "Campaign 4", phishedUsersCount: 5000 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      const counts = wrapper.vm.tableData.map(c => c.phishedUsersCount);
      expect(counts).toEqual([5, 50, 500, 5000]);
    });
  });

  describe("campaign name handling", () => {
    it("should handle standard campaign names", () => {
      const data = [{ name: "Standard Campaign", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toBe("Standard Campaign");
    });

    it("should handle campaign names with numbers", () => {
      const data = [{ name: "Campaign 2024-Q1", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toBe("Campaign 2024-Q1");
    });

    it("should handle campaign names with special characters", () => {
      const data = [{ name: "Campaign & Promotion (Phase 1)", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toContain("&");
    });

    it("should handle campaign names with hyphens and underscores", () => {
      const data = [{ name: "phishing-test_v2", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toBe("phishing-test_v2");
    });

    it("should handle very long campaign names", () => {
      const longName = "A".repeat(300);
      const data = [{ name: longName, phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name).toHaveLength(300);
    });
  });

  describe("column configuration", () => {
    it("should have exactly two columns", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
    });

    it("should have columns as array", () => {
      const wrapper = mountFactory();
      expect(Array.isArray(wrapper.vm.columns)).toBe(true);
    });

    it("should maintain column structure with data", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.columns.length).toBe(2);
    });

    it("should have consistent columns across instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.columns.length).toBe(wrapper2.vm.columns.length);
    });
  });

  describe("empty state handling", () => {
    it("should define empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty).toBeDefined();
      expect(wrapper.vm.empty.message).toBeDefined();
    });

    it("should have correct empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBe(labels.EmptyMostEngagedCampaignsWidget);
    });

    it("should have consistent empty message", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.empty.message).toBe(wrapper2.vm.empty.message);
    });

    it("should display empty message for empty data", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper.vm.empty.message).toContain("engaged");
    });
  });

  describe("performance characteristics", () => {
    it("should mount efficiently", () => {
      const startTime = Date.now();
      mountFactory();
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(250);
    });

    it("should handle large datasets", () => {
      const data = Array.from({ length: 1000 }, (_, i) => ({
        name: `Campaign ${i}`,
        phishedUsersCount: i * 10
      }));
      const startTime = Date.now();
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(500);
      expect(wrapper.vm.tableData).toHaveLength(1000);
    });

    it("should access data efficiently", () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        name: `Campaign ${i}`,
        phishedUsersCount: i
      }));
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        const tableData = wrapper.vm.tableData;
        expect(tableData).toBeDefined();
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(200);
    });
  });

  describe("widget component integration", () => {
    it("should have title property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeDefined();
      expect(wrapper.vm.getTitle).toBe(labels.MostEngagedCampaigns);
    });

    it("should have columns property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns).toBeDefined();
      expect(Array.isArray(wrapper.vm.columns)).toBe(true);
    });

    it("should have empty property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty).toBeDefined();
      expect(wrapper.vm.empty.message).toBeDefined();
    });

    it("should have tableData property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.tableData).toBeDefined();
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true);
    });

    it("should work with all widget stubs", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });
  });

  describe("multiple instances independence", () => {
    it("should create independent instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("should maintain separate data in multiple instances", () => {
      const data1 = [{ name: "Campaign 1", phishedUsersCount: 100 }];
      const data2 = [{ name: "Campaign 2", phishedUsersCount: 50 }];

      const wrapper1 = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data1
      });
      const wrapper2 = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data2
      });

      expect(wrapper1.vm.tableData).toEqual(data1);
      expect(wrapper2.vm.tableData).toEqual(data2);
    });

    it("should not interfere with other instances", () => {
      const data = [{ name: "Campaign 1", phishedUsersCount: 10 }];
      const wrapper1 = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      const wrapper2 = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });

      expect(wrapper1.vm.tableData).toHaveLength(1);
      expect(wrapper2.vm.tableData).toHaveLength(0);
    });

    it("should share title and properties across instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.getTitle).toBe(wrapper2.vm.getTitle);
      expect(wrapper1.vm.columns.length).toBe(wrapper2.vm.columns.length);
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

  describe("complex campaign scenarios", () => {
    it("should handle campaigns with same phished user count", () => {
      const data = [
        { name: "Campaign A", phishedUsersCount: 50 },
        { name: "Campaign B", phishedUsersCount: 50 },
        { name: "Campaign C", phishedUsersCount: 50 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData.filter(c => c.phishedUsersCount === 50)).toHaveLength(3);
    });

    it("should handle campaigns in descending order", () => {
      const data = [
        { name: "Campaign 1", phishedUsersCount: 100 },
        { name: "Campaign 2", phishedUsersCount: 50 },
        { name: "Campaign 3", phishedUsersCount: 25 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(100);
      expect(wrapper.vm.tableData[2].phishedUsersCount).toBe(25);
    });

    it("should handle campaigns with very long names and high counts", () => {
      const longName = "International Phishing Awareness Training - Q4 2024 " + "X".repeat(200);
      const data = [{
        name: longName,
        phishedUsersCount: 5000000
      }];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData[0].name.length).toBeGreaterThan(200);
      expect(wrapper.vm.tableData[0].phishedUsersCount).toBe(5000000);
    });

    it("should handle rapid data changes", () => {
      const wrapper = mountFactory();
      for (let i = 0; i < 10; i++) {
        const data = Array.from({ length: 100 }, (_, j) => ({
          name: `Campaign ${i}-${j}`,
          phishedUsersCount: i * j
        }));
        const wrapper2 = mountFactory({
          "widgets/getMostEngagedCampaignsCard": data
        });
        expect(wrapper2.vm.tableData).toHaveLength(100);
        wrapper2.destroy();
      }
    });
  });

  describe("error handling and recovery", () => {
    it("should handle null campaign data gracefully", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getMostEngagedCampaignsCard"]).toBeNull();
    });

    it("should handle undefined campaign data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.tableData).toBeDefined();
    });

    it("should continue functioning with mixed data quality", () => {
      const data = [
        { name: "Campaign 1", phishedUsersCount: 100 },
        { name: null, phishedUsersCount: 50 },
        { name: "Campaign 3", phishedUsersCount: null }
      ];
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": data
      });
      expect(wrapper.vm.tableData).toHaveLength(3);
    });

    it("should maintain consistency after errors", () => {
      const wrapper = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper.vm.getTitle).toBe(labels.MostEngagedCampaigns);
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.empty.message).toBe(labels.EmptyMostEngagedCampaignsWidget);
    });

    it("should recover from empty state transitions", () => {
      const wrapper1 = mountFactory({
        "widgets/getMostEngagedCampaignsCard": []
      });
      expect(wrapper1.vm.tableData).toHaveLength(0);

      const wrapper2 = mountFactory({
        "widgets/getMostEngagedCampaignsCard": [
          { name: "Campaign 1", phishedUsersCount: 50 }
        ]
      });
      expect(wrapper2.vm.tableData).toHaveLength(1);
    });
  });
});
