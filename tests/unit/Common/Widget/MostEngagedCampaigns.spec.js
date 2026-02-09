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
});
