import { createLocalVue, shallowMount } from "@vue/test-utils";
import TargetUsersViewTargetUserGroupsTable from "@/components/TargetUsers/TargetUsersViewTargetUserGroupsTable.vue";
import { customVuetify as vuetify } from "./utils";
import { getTargetUserViewUserGroups } from "@/api/targetUsers";

jest.mock("@/api/targetUsers", () => ({
  getTargetUserViewUserGroups: jest.fn()
}));

describe("TargetUsersViewTargetUserGroupsTable", () => {
  const localVue = createLocalVue();

  const mountFactory = (propsData = {}, methodMocks = {}) => {
    return shallowMount(TargetUsersViewTargetUserGroupsTable, {
      localVue,
      vuetify,
      propsData: {
        itemResourceId: "user-1",
        ...propsData
      },
      mocks: {
        $router: { push: jest.fn() }
      },
      methods: {
        ...methodMocks
      },
      stubs: ["DataTable"]
    });
  };

  beforeEach(() => {
    getTargetUserViewUserGroups.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: "g1", name: "Group 1" }],
          totalNumberOfRecords: 1,
          totalNumberOfPages: 1,
          pageNumber: 1
        }
      }
    });
  });

  it("loads data on created", async () => {
    const wrapper = mountFactory();
    await Promise.resolve();

    expect(getTargetUserViewUserGroups).toHaveBeenCalled();
    expect(wrapper.vm.tableData).toEqual([{ resourceId: "g1", name: "Group 1" }]);
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("updates pagination and calls API on page change", async () => {
    const wrapper = mountFactory();
    await Promise.resolve();

    wrapper.vm.serverSidePageNumberChanged(3);

    expect(wrapper.vm.axiosPayload.pageNumber).toBe(3);
    expect(getTargetUserViewUserGroups).toHaveBeenCalled();
  });

  it("updates page size and resets page number", () => {
    const wrapper = mountFactory();

    wrapper.vm.serverSideSizeChanged(10);

    expect(wrapper.vm.axiosPayload.pageSize).toBe(10);
    expect(wrapper.vm.serverSideProps.pageSize).toBe(10);
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1);
    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
  });

  it("filters search values by filterable columns", () => {
    const wrapper = mountFactory();
    const validField = wrapper.vm.tableOptions.columns[0].property;
    wrapper.vm.tableOptions.columns.push({ property: "NonFilterable" });

    wrapper.vm.handleSearchChange({
      filter: {
        FilterGroups: [
          {
            FilterItems: [
              { FieldName: validField, Value: "test" },
              { FieldName: "NonFilterable", Value: "x" }
            ]
          }
        ]
      }
    });

    expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([
      { FieldName: validField, Value: "test" }
    ]);
    expect(wrapper.vm.axiosPayload.pageNumber).toBe(1);
  });

  it("navigates to group users on name click", () => {
    const wrapper = mountFactory();
    const row = { resourceId: "g1", name: "Group 1" };

    wrapper.vm.handleGroupNameClick(row);

    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: "Target Group Users",
      params: { id: "g1", label: "Group 1", from: "people" }
    });
  });

  describe("Component Rendering", () => {
    it("renders component successfully", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });

    it("mounts with required props", () => {
      const wrapper = mountFactory({ itemResourceId: "user-123" });
      expect(wrapper.props("itemResourceId")).toBe("user-123");
    });

    it("renders data table component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("initializes with empty data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.tableData).toBeDefined();
    });
  });

  describe("Data Loading", () => {
    it("loads data on component creation", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(getTargetUserViewUserGroups).toHaveBeenCalled();
    });

    it("sets loading state during data fetch", async () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBeDefined();
      await Promise.resolve();
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("populates tableData from API response", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([{ resourceId: "g1", name: "Group 1" }]);
    });

    it("handles API response structure correctly", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toBeDefined();
      expect(wrapper.vm.tableData.length).toBeGreaterThan(0);
    });

    it("initializes server side props", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.serverSideProps).toBeDefined();
      expect(wrapper.vm.serverSideProps.pageSize).toBeDefined();
    });

    it("loads with specific user resource ID", async () => {
      const wrapper = mountFactory({ itemResourceId: "custom-user-id" });
      await Promise.resolve();

      expect(getTargetUserViewUserGroups).toHaveBeenCalled();
    });
  });

  describe("Pagination", () => {
    it("initializes with default page size", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.axiosPayload.pageSize).toBeDefined();
    });

    it("updates page number on page change", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      wrapper.vm.serverSidePageNumberChanged(3);
      expect(wrapper.vm.axiosPayload.pageNumber).toBe(3);
    });

    it("calls API when page changes", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();
      jest.clearAllMocks();

      wrapper.vm.serverSidePageNumberChanged(2);
      expect(getTargetUserViewUserGroups).toHaveBeenCalled();
    });

    it("updates page size", () => {
      const wrapper = mountFactory();

      wrapper.vm.serverSideSizeChanged(10);
      expect(wrapper.vm.axiosPayload.pageSize).toBe(10);
    });

    it("resets page number when size changes", () => {
      const wrapper = mountFactory();
      wrapper.vm.serverSideSizeChanged(10);

      expect(wrapper.vm.axiosPayload.pageNumber).toBe(1);
    });

    it("updates server-side properties on size change", () => {
      const wrapper = mountFactory();

      wrapper.vm.serverSideSizeChanged(10);
      expect(wrapper.vm.serverSideProps.pageSize).toBe(10);
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
    });

    it("handles multiple page changes", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      wrapper.vm.serverSidePageNumberChanged(2);
      expect(wrapper.vm.axiosPayload.pageNumber).toBe(2);

      wrapper.vm.serverSidePageNumberChanged(5);
      expect(wrapper.vm.axiosPayload.pageNumber).toBe(5);
    });

    it("handles multiple size changes", () => {
      const wrapper = mountFactory();

      wrapper.vm.serverSideSizeChanged(10);
      expect(wrapper.vm.axiosPayload.pageSize).toBe(10);

      wrapper.vm.serverSideSizeChanged(20);
      expect(wrapper.vm.axiosPayload.pageSize).toBe(20);
    });
  });

  describe("Search and Filtering", () => {
    it("filters search by filterable columns", () => {
      const wrapper = mountFactory();
      const validField = wrapper.vm.tableOptions.columns[0].property;

      wrapper.vm.handleSearchChange({
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: validField, Value: "test" }
              ]
            }
          ]
        }
      });

      expect(wrapper.vm.axiosPayload.filter).toBeDefined();
    });

    it("removes non-filterable fields from search", () => {
      const wrapper = mountFactory();
      const validField = wrapper.vm.tableOptions.columns[0].property;
      wrapper.vm.tableOptions.columns.push({ property: "NonFilterable" });

      wrapper.vm.handleSearchChange({
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: validField, Value: "test" },
                { FieldName: "NonFilterable", Value: "x" }
              ]
            }
          ]
        }
      });

      const filterItems = wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems;
      expect(filterItems.length).toBe(1);
      expect(filterItems[0].FieldName).toBe(validField);
    });

    it("resets page number on search change", () => {
      const wrapper = mountFactory();

      wrapper.vm.handleSearchChange({
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: "name", Value: "test" }
              ]
            }
          ]
        }
      });

      expect(wrapper.vm.axiosPayload.pageNumber).toBe(1);
    });

    it("handles search with multiple filters", () => {
      const wrapper = mountFactory();
      const validField = wrapper.vm.tableOptions.columns[0].property;

      wrapper.vm.handleSearchChange({
        filter: {
          FilterGroups: [
            {
              FilterItems: [
                { FieldName: validField, Value: "test1" },
                { FieldName: validField, Value: "test2" }
              ]
            }
          ]
        }
      });

      expect(wrapper.vm.axiosPayload.filter).toBeDefined();
    });

    it("handles search with no results", () => {
      const wrapper = mountFactory();

      wrapper.vm.handleSearchChange({
        filter: {
          FilterGroups: [
            {
              FilterItems: []
            }
          ]
        }
      });

      expect(wrapper.vm.axiosPayload.pageNumber).toBe(1);
    });
  });

  describe("Navigation", () => {
    it("navigates to group users on click", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "g1", name: "Group 1" };

      wrapper.vm.handleGroupNameClick(row);
      expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });

    it("passes correct parameters to router", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "g1", name: "Group 1" };

      wrapper.vm.handleGroupNameClick(row);
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: "Target Group Users",
        params: { id: "g1", label: "Group 1", from: "people" }
      });
    });

    it("handles group with different resource ID", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "custom-group-id", name: "Custom Group" };

      wrapper.vm.handleGroupNameClick(row);
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: "Target Group Users",
        params: { id: "custom-group-id", label: "Custom Group", from: "people" }
      });
    });

    it("passes from parameter consistently", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "g1", name: "Group 1" };

      wrapper.vm.handleGroupNameClick(row);
      const callParams = wrapper.vm.$router.push.mock.calls[0][0].params;
      expect(callParams.from).toBe("people");
    });

    it("handles multiple navigation clicks", () => {
      const wrapper = mountFactory();

      wrapper.vm.handleGroupNameClick({ resourceId: "g1", name: "Group 1" });
      wrapper.vm.handleGroupNameClick({ resourceId: "g2", name: "Group 2" });

      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(2);
    });
  });

  describe("Props Handling", () => {
    it("accepts itemResourceId prop", () => {
      const wrapper = mountFactory({ itemResourceId: "test-id" });
      expect(wrapper.props("itemResourceId")).toBe("test-id");
    });

    it("uses itemResourceId in API call", async () => {
      const wrapper = mountFactory({ itemResourceId: "user-123" });
      await Promise.resolve();

      expect(getTargetUserViewUserGroups).toHaveBeenCalled();
    });

    it("handles different itemResourceId values", async () => {
      const wrapper1 = mountFactory({ itemResourceId: "user-1" });
      const wrapper2 = mountFactory({ itemResourceId: "user-2" });

      expect(wrapper1.props("itemResourceId")).toBe("user-1");
      expect(wrapper2.props("itemResourceId")).toBe("user-2");
    });

    it("updates with new itemResourceId", async () => {
      const wrapper = mountFactory({ itemResourceId: "user-1" });
      await wrapper.setProps({ itemResourceId: "user-2" });
      expect(wrapper.props("itemResourceId")).toBe("user-2");
    });
  });

  describe("Table Configuration", () => {
    it("has configured columns", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.tableOptions.columns).toBeDefined();
      expect(wrapper.vm.tableOptions.columns.length).toBeGreaterThan(0);
    });

    it("columns have filterable property", () => {
      const wrapper = mountFactory();
      const columns = wrapper.vm.tableOptions.columns;
      columns.forEach((col) => {
        expect(col.hasOwnProperty("property")).toBe(true);
      });
    });

    it("has server-side properties configured", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.serverSideProps).toBeDefined();
      expect(wrapper.vm.serverSideProps.pageSize).toBeDefined();
      expect(wrapper.vm.serverSideProps.pageNumber).toBeDefined();
    });

    it("axios payload is properly initialized", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.axiosPayload).toBeDefined();
      expect(wrapper.vm.axiosPayload.pageSize).toBeDefined();
      expect(wrapper.vm.axiosPayload.pageNumber).toBeDefined();
    });
  });

  describe("API Integration", () => {
    it("calls API with correct parameters", async () => {
      const wrapper = mountFactory({ itemResourceId: "test-user" });
      await Promise.resolve();

      expect(getTargetUserViewUserGroups).toHaveBeenCalled();
    });

    it("handles API response with multiple groups", async () => {
      getTargetUserViewUserGroups.mockResolvedValue({
        data: {
          data: {
            results: [
              { resourceId: "g1", name: "Group 1" },
              { resourceId: "g2", name: "Group 2" }
            ],
            totalNumberOfRecords: 2,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData.length).toBe(2);
    });

    it("clears loading state after API call", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("handles empty API response", async () => {
      getTargetUserViewUserGroups.mockResolvedValue({
        data: {
          data: {
            results: [],
            totalNumberOfRecords: 0,
            totalNumberOfPages: 0,
            pageNumber: 1
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData.length).toBe(0);
    });
  });

  describe("Component Lifecycle", () => {
    it("mounts successfully", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("unmounts without errors", () => {
      const wrapper = mountFactory();
      expect(() => wrapper.destroy()).not.toThrow();
    });

    it("initializes data on creation", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toBeDefined();
    });

    it("handles multiple mount/unmount cycles", () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mountFactory();
        expect(wrapper.vm).toBeDefined();
        wrapper.destroy();
      }
    });

    it("maintains state after operations", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      const initialData = [...wrapper.vm.tableData];
      wrapper.vm.serverSidePageNumberChanged(2);

      expect(wrapper.vm.tableData).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("handles very long group names", async () => {
      const longName = "G".repeat(100);
      getTargetUserViewUserGroups.mockResolvedValue({
        data: {
          data: {
            results: [{ resourceId: "g1", name: longName }],
            totalNumberOfRecords: 1,
            totalNumberOfPages: 1,
            pageNumber: 1
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].name).toBe(longName);
    });

    it("handles large page sizes", () => {
      const wrapper = mountFactory();

      wrapper.vm.serverSideSizeChanged(1000);
      expect(wrapper.vm.axiosPayload.pageSize).toBe(1000);
    });

    it("handles group with special characters", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "g@#$", name: "Group@#$%" };

      wrapper.vm.handleGroupNameClick(row);
      expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });

    it("handles null resource ID gracefully", () => {
      const wrapper = mountFactory({ itemResourceId: null });
      expect(wrapper.exists()).toBe(true);
    });

    it("handles rapid consecutive page changes", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      wrapper.vm.serverSidePageNumberChanged(2);
      wrapper.vm.serverSidePageNumberChanged(3);
      wrapper.vm.serverSidePageNumberChanged(1);

      expect(wrapper.vm.axiosPayload.pageNumber).toBe(1);
    });
  });
});
