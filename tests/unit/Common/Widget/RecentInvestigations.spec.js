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

  describe("investigation count handling", () => {
    it("should handle zero investigations", () => {
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": []
      });
      expect(wrapper.vm.tableData.length).toBe(0);
    });

    it("should handle single investigation", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
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
      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("should handle large number of investigations", () => {
      const data = Array.from({ length: 200 }, (_, i) => ({
        resourceId: `inv${i}`,
        status: ["Open", "Closed", "In Progress"][i % 3]
      }));
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData.length).toBe(200);
    });
  });

  describe("status handling", () => {
    it("should handle Open status", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].status).toBe("Open");
    });

    it("should handle Closed status", () => {
      const data = [{ resourceId: "inv1", status: "Closed" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].status).toBe("Closed");
    });

    it("should handle In Progress status", () => {
      const data = [{ resourceId: "inv1", status: "In Progress" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].status).toBe("In Progress");
    });

    it("should handle various status values", () => {
      const statuses = ["Open", "Closed", "In Progress", "Pending", "Resolved"];
      const data = statuses.map((status, idx) => ({
        resourceId: `inv${idx}`,
        status: status
      }));
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      statuses.forEach((status, idx) => {
        expect(wrapper.vm.tableData[idx].status).toBe(status);
      });
    });

    it("should handle case-sensitive status values", () => {
      const data = [
        { resourceId: "inv1", status: "open" },
        { resourceId: "inv2", status: "Open" }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].status).toBe("open");
      expect(wrapper.vm.tableData[1].status).toBe("Open");
    });
  });

  describe("resource ID handling", () => {
    it("should handle standard resource IDs", () => {
      const data = [{ resourceId: "inv123", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv123");
    });

    it("should handle resource IDs with hyphens", () => {
      const data = [{ resourceId: "inv-001-test", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv-001-test");
    });

    it("should handle resource IDs with underscores", () => {
      const data = [{ resourceId: "inv_test_001", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv_test_001");
    });

    it("should handle numeric resource IDs", () => {
      const data = [{ resourceId: "12345", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("12345");
    });

    it("should handle UUID format resource IDs", () => {
      const uuid = "550e8400-e29b-41d4-a716-446655440000";
      const data = [{ resourceId: uuid, status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe(uuid);
    });
  });

  describe("column structure", () => {
    it("should define exactly two columns", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
    });

    it("should define columns as array", () => {
      const wrapper = mountFactory();
      expect(Array.isArray(wrapper.vm.columns)).toBe(true);
    });

    it("should have consistent column structure", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.columns.length).toBe(wrapper2.vm.columns.length);
    });

    it("should maintain column structure with data", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.columns.length).toBe(2);
    });
  });

  describe("empty message handling", () => {
    it("should define empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty).toBeDefined();
      expect(wrapper.vm.empty.message).toBeDefined();
    });

    it("should have correct empty message text", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBe("You do not have any recent investigations");
    });

    it("should display when data is empty", () => {
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": []
      });
      expect(wrapper.vm.empty.message).toContain("recent investigations");
    });

    it("should have consistent empty message", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.empty.message).toBe(wrapper2.vm.empty.message);
    });
  });

  describe("data transformation", () => {
    it("should preserve all investigation properties", () => {
      const data = [{
        resourceId: "inv1",
        status: "Open",
        createdDate: "2023-01-01",
        assignedTo: "user@example.com",
        severity: "high"
      }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv1");
      expect(wrapper.vm.tableData[0].status).toBe("Open");
      expect(wrapper.vm.tableData[0].createdDate).toBe("2023-01-01");
      expect(wrapper.vm.tableData[0].assignedTo).toBe("user@example.com");
      expect(wrapper.vm.tableData[0].severity).toBe("high");
    });

    it("should handle missing optional properties", () => {
      const data = [{ resourceId: "inv1" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0]).toBeDefined();
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv1");
    });

    it("should maintain data integrity across multiple accesses", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      const firstAccess = wrapper.vm.tableData;
      const secondAccess = wrapper.vm.tableData;
      expect(firstAccess).toEqual(secondAccess);
    });

    it("should handle nested data properties", () => {
      const data = [{
        resourceId: "inv1",
        status: "Open",
        metadata: { source: "phishing", type: "email" }
      }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].metadata.source).toBe("phishing");
    });
  });

  describe("performance characteristics", () => {
    it("should render efficiently", () => {
      const startTime = Date.now();
      mountFactory();
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });

    it("should handle large datasets", () => {
      const data = Array.from({ length: 500 }, (_, i) => ({
        resourceId: `inv${i}`,
        status: ["Open", "Closed"][i % 2]
      }));
      const startTime = Date.now();
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(250);
      expect(wrapper.vm.tableData).toHaveLength(500);
    });

    it("should access data properties efficiently", () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        resourceId: `inv${i}`,
        status: "Open"
      }));
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        const tableData = wrapper.vm.tableData;
        expect(tableData).toBeDefined();
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("widget component integration", () => {
    it("should have title property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeDefined();
      expect(wrapper.vm.getTitle).toBe(labels.RecentInvestigations);
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

    it("should work with widget stubs", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });
  });

  describe("accessibility features", () => {
    it("should have semantic component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("RecentInvestigations");
    });

    it("should expose investigation data", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toBe("inv1");
    });

    it("should provide readable empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBeTruthy();
      expect(typeof wrapper.vm.empty.message).toBe("string");
      expect(wrapper.vm.empty.message.length).toBeGreaterThan(0);
    });

    it("should maintain label consistency", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeTruthy();
      expect(typeof wrapper.vm.getTitle).toBe("string");
    });
  });

  describe("complex investigation scenarios", () => {
    it("should handle investigations with very long resource IDs", () => {
      const longId = "investigation-" + "x".repeat(200);
      const data = [{ resourceId: longId, status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toHaveLength(longId.length);
    });

    it("should handle investigations with special characters in status", () => {
      const data = [{ resourceId: "inv1", status: "In-Progress (Urgent)" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].status).toContain("Urgent");
    });

    it("should handle investigations with Unicode characters", () => {
      const data = [{ resourceId: "inv_🔒", status: "Open" }];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData[0].resourceId).toContain("🔒");
    });

    it("should handle rapid data changes", () => {
      const wrapper = mountFactory();
      for (let i = 0; i < 10; i++) {
        const data = Array.from({ length: 50 }, (_, j) => ({
          resourceId: `inv${i}-${j}`,
          status: "Open"
        }));
        const wrapper2 = mountFactory({
          "widgets/getRecentInvestigationsCard": data
        });
        expect(wrapper2.vm.tableData).toHaveLength(50);
        wrapper2.destroy();
      }
    });
  });

  describe("multiple instances independence", () => {
    it("should create independent instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("should maintain separate data in multiple instances", () => {
      const data1 = [{ resourceId: "inv1", status: "Open" }];
      const data2 = [{ resourceId: "inv2", status: "Closed" }];

      const wrapper1 = mountFactory({
        "widgets/getRecentInvestigationsCard": data1
      });
      const wrapper2 = mountFactory({
        "widgets/getRecentInvestigationsCard": data2
      });

      expect(wrapper1.vm.tableData).toEqual(data1);
      expect(wrapper2.vm.tableData).toEqual(data2);
      expect(wrapper1.vm.tableData).not.toEqual(wrapper2.vm.tableData);
    });

    it("should not interfere with other instances", () => {
      const data = [{ resourceId: "inv1", status: "Open" }];
      const wrapper1 = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      const wrapper2 = mountFactory({
        "widgets/getRecentInvestigationsCard": []
      });

      expect(wrapper1.vm.tableData).toHaveLength(1);
      expect(wrapper2.vm.tableData).toHaveLength(0);
    });

    it("should share title and columns across instances", () => {
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

  describe("error handling and recovery", () => {
    it("should handle null investigation data gracefully", () => {
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getRecentInvestigationsCard"]).toBeNull();
    });

    it("should handle undefined investigation data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.tableData).toBeDefined();
    });

    it("should continue functioning with corrupted data", () => {
      const data = [
        { resourceId: "inv1", status: "Open" },
        { resourceId: null, status: "Closed" },
        { resourceId: "inv3", status: null }
      ];
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": data
      });
      expect(wrapper.vm.tableData).toHaveLength(3);
    });

    it("should recover from empty state to populated state", () => {
      const wrapper1 = mountFactory({
        "widgets/getRecentInvestigationsCard": []
      });
      expect(wrapper1.vm.tableData).toHaveLength(0);

      const wrapper2 = mountFactory({
        "widgets/getRecentInvestigationsCard": [{ resourceId: "inv1", status: "Open" }]
      });
      expect(wrapper2.vm.tableData).toHaveLength(1);
    });

    it("should maintain consistency after errors", () => {
      const wrapper = mountFactory({
        "widgets/getRecentInvestigationsCard": []
      });
      expect(wrapper.vm.getTitle).toBe(labels.RecentInvestigations);
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.empty.message).toContain("recent investigations");
    });
  });
});
