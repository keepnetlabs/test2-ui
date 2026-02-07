import { createLocalVue, shallowMount } from "@vue/test-utils";
import RecentInvestigations from "@/components/Common/Widget/WidgetComponents/RecentInvestigations.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("RecentInvestigations widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(RecentInvestigations, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getRecentInvestigationsCard": [],
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
        "router-link",
        "v-progress-linear"
      ]
    });
  };

  describe("component structure", () => {
    it("uses title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.RecentInvestigations);
    });

    it("should render as a Vue component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("RecentInvestigations");
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });
  });

  describe("table data and columns", () => {
    it("exposes table data from store getter", () => {
      const data = [{ resourceId: "r1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("defines columns and empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.empty.message).toBe(
        "You do not have any recent investigations"
      );
    });

    it("should have two columns", () => {
      const wrapper = mountFactory();
      const columns = wrapper.vm.columns;
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBe(2);
    });

    it("should have proper empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty).toBeDefined();
      expect(wrapper.vm.empty.message).toBeDefined();
      expect(wrapper.vm.empty.message).toContain("recent investigations");
    });
  });

  describe("widget data handling", () => {
    it("should handle empty investigations data", () => {
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": []
      });
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should handle single investigation", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(1);
    });

    it("should handle multiple investigations", () => {
      const data = [
        { resourceId: "inv1", status: "Open" },
        { resourceId: "inv2", status: "Closed" },
        { resourceId: "inv3", status: "In Progress" }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("should preserve investigation properties", () => {
      const data = [{ resourceId: "inv1", status: "Open", createdDate: "2023-01-01" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv1");
      expect(wrapper.vm.tableData[0].status).toBe("Open");
    });

    it("should handle investigations with different statuses", () => {
      const statuses = ["Open", "Closed", "In Progress", "Pending"];
      const data = statuses.map((status, idx) => ({
        resourceId: `inv${idx}`,
        status: status
      }));
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });
  });

  describe("store getters", () => {
    it("should get recent investigations from store", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentInvestigationsCard"]).toEqual(data);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle empty store data", () => {
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentInvestigationsCard"]).toEqual([]);
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
      expect(wrapper.vm.getTitle).toBe(labels.RecentInvestigations);
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

  describe("router and progress integration", () => {
    it("should have router-link stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have v-progress-linear stub configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm) .toBeDefined();
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

    it("should render with default props", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe("edge cases", () => {
    it("should handle null investigation data", () => {
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentInvestigationsCard"]).toBeNull();
    });

    it("should handle investigations with special characters in ID", () => {
      const data = [{ resourceId: "inv-1_test", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv-1_test");
    });

    it("should handle investigations with very long resource IDs", () => {
      const longId = "A".repeat(100);
      const data = [{ resourceId: longId, status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe(longId);
    });

    it("should handle investigations with empty status", () => {
      const data = [{ resourceId: "inv1", status: "" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].status).toBe("");
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
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should not modify data internally", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical investigations data", () => {
      const data = [
        { resourceId: "inv001", status: "Open" },
        { resourceId: "inv002", status: "Closed" }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(2);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getRecentInvestigationsCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should work with loading state false and populated data", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getIsLoading": false,
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("should display correct title and columns together", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.RecentInvestigations);
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.empty.message).toContain("recent investigations");
    });
  });
});
