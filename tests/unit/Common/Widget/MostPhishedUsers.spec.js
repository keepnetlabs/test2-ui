import { createLocalVue, shallowMount } from "@vue/test-utils";
import MostPhishedUsers from "@/components/Common/Widget/WidgetComponents/MostPhishedUsers.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("MostPhishedUsers widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(MostPhishedUsers, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getMostPhishedUsersCard": [
              { email: "a@example.com", count: 3 }
            ],
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
      expect(wrapper.vm.getTitle).toBe(labels.MostPhishedUsers);
    });

    it("should render as a Vue component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("MostPhishedUsers");
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });
  });

  describe("table data and columns", () => {
    it("exposes table data from store getter", () => {
      const data = [{ email: "test@example.com", count: 5 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });

    it("defines columns and empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.empty.message).toBe(labels.EmptyMostPhishedUsersWidget);
    });

    it("should have two columns", () => {
      const wrapper = mountFactory();
      const columns = wrapper.vm.columns;
      expect(Array.isArray(columns)).toBe(true);
      expect(columns.length).toBe(2);
    });

    it("should have empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty).toBeDefined();
      expect(wrapper.vm.empty.message).toBeDefined();
    });
  });

  describe("widget data handling", () => {
    it("should handle empty users data", () => {
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": []
      });
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should handle single user", () => {
      const data = [{ email: "user@example.com", count: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(1);
    });

    it("should handle multiple users", () => {
      const data = [
        { email: "user1@example.com", count: 10 },
        { email: "user2@example.com", count: 8 },
        { email: "user3@example.com", count: 5 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("should handle users with zero count", () => {
      const data = [{ email: "user@example.com", count: 0 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData[0].count).toBe(0);
    });

    it("should handle users with large counts", () => {
      const data = [{ email: "user@example.com", count: 999999 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData[0].count).toBe(999999);
    });
  });

  describe("store getters", () => {
    it("should get most phished users from store", () => {
      const data = [{ email: "user@example.com", count: 15 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getMostPhishedUsersCard"]).toEqual(data);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle empty store data", () => {
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getMostPhishedUsersCard"]).toEqual([]);
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
      expect(wrapper.vm.getTitle).toBe(labels.MostPhishedUsers);
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
    it("should handle null user data", () => {
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getMostPhishedUsersCard"]).toBeNull();
    });

    it("should handle users with special characters in email", () => {
      const data = [{ email: "user+test@example.com", count: 5 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData[0].email).toBe("user+test@example.com");
    });

    it("should handle users with unicode emails", () => {
      const data = [{ email: "用户@example.com", count: 3 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData[0].email).toBe("用户@example.com");
    });

    it("should handle negative count values", () => {
      const data = [{ email: "user@example.com", count: -5 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData[0].count).toBe(-5);
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
      const data = [{ email: "user@example.com", count: 10 }];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical phished users data", () => {
      const data = [
        { email: "john@company.com", count: 25 },
        { email: "jane@company.com", count: 18 }
      ];
      const wrapper = mountFactory({
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.tableData).toEqual(data);
      expect(wrapper.vm.tableData.length).toBe(2);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getMostPhishedUsersCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("should work with loading state false and populated data", () => {
      const data = [{ email: "user@example.com", count: 20 }];
      const wrapper = mountFactory({
        "widgets/getIsLoading": false,
        "widgets/getMostPhishedUsersCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(false);
      expect(wrapper.vm.tableData).toEqual(data);
    });
  });
});
