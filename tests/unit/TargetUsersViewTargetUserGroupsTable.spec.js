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
});
