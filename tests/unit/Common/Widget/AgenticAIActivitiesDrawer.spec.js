import { createLocalVue, shallowMount } from "@vue/test-utils";
import AgenticAIActivitiesDrawer from "@/components/Common/Widget/WidgetComponents/AgenticAIActivitiesDrawer.vue";
import { customVuetify as vuetify } from "../../utils";

describe("AgenticAIActivitiesDrawer", () => {
  const localVue = createLocalVue();

  const baseColumns = [
    {
      label: "Status",
      property: "status",
      type: "status",
      show: true
    }
  ];

  const mountFactory = (propsData = {}, methodMocks = {}) => {
    return shallowMount(AgenticAIActivitiesDrawer, {
      localVue,
      vuetify,
      propsData: {
        value: false,
        columns: baseColumns,
        tableData: [],
        ...propsData
      },
      methods: {
        ...methodMocks
      },
      stubs: [
        "DataTable",
        "DefaultButtonRowAction",
        "DefaultMenuRowAction",
        "RowActionsMenu",
        "VNavigationDrawer",
        "VIcon",
        "v-tooltip"
      ]
    });
  };

  it("normalizes waiting for approval status", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeStatus("waiting for approval")).toBe(
      "Waiting for Approval"
    );
  });

  it("normalizes executed and rejected statuses", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeStatus("executed")).toBe("Executed");
    expect(wrapper.vm.normalizeStatus("rejected")).toBe("Rejected");
  });

  it("normalizes statuses with underscores or hyphens", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeStatus("waiting_for_approval")).toBe(
      "Waiting for Approval"
    );
    expect(wrapper.vm.normalizeStatus("waiting-for-approval")).toBe(
      "Waiting for Approval"
    );
  });

  it("treats waiting for approval status as actionable regardless of case", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.isWaitingForApproval({ status: "waiting for approval" })).toBe(
      true
    );
    expect(wrapper.vm.isWaitingForApproval({ status: "Waiting for Approval" })).toBe(
      true
    );
  });

  it("applies normalized status to paged data in fetchActivities", async () => {
    jest.useFakeTimers();
    const wrapper = mountFactory(
      {
        value: true,
        columns: baseColumns,
        tableData: [{ status: "waiting for approval" }]
      },
      {
        refreshTableLayout: jest.fn()
      }
    );

    const fetchPromise = wrapper.vm.fetchActivities();
    jest.runAllTimers();
    await fetchPromise;

    expect(wrapper.vm.pagedTableData[0].status).toBe("Waiting for Approval");
    jest.useRealTimers();
  });

  it("filters data by search term across columns", () => {
    const wrapper = mountFactory({
      columns: [
        { property: "name" },
        { property: "email" }
      ]
    });
    const data = [
      { name: "Alice", email: "alice@example.com" },
      { name: "Bob", email: "bob@example.com" }
    ];

    const result = wrapper.vm.applySearch(data, "alice");

    expect(result).toEqual([{ name: "Alice", email: "alice@example.com" }]);
  });

  it("sorts data by provided sort props", () => {
    const wrapper = mountFactory();
    const data = [{ value: 2 }, { value: 1 }];

    const asc = wrapper.vm.applySort(data, { prop: "value", order: "ascending" });
    const desc = wrapper.vm.applySort(data, { prop: "value", order: "descending" });

    expect(asc.map((row) => row.value)).toEqual([1, 2]);
    expect(desc.map((row) => row.value)).toEqual([2, 1]);
  });

  it("paginates data using page number and size", () => {
    const wrapper = mountFactory();
    const data = [1, 2, 3, 4, 5].map((value) => ({ value }));

    const page1 = wrapper.vm.applyPagination(data, 1, 2);
    const page2 = wrapper.vm.applyPagination(data, 2, 2);

    expect(page1.map((row) => row.value)).toEqual([1, 2]);
    expect(page2.map((row) => row.value)).toEqual([3, 4]);
  });

  it("emits on-close when handleClose is called", () => {
    const wrapper = mountFactory();
    wrapper.vm.handleClose();
    expect(wrapper.emitted()["on-close"]).toBeTruthy();
  });

  it("skips body scroll toggling when shouldControlBodyScroll is false", async () => {
    const wrapper = mountFactory({ value: true, shouldControlBodyScroll: false });
    const disableSpy = jest.spyOn(wrapper.vm, "disableBodyScroll");
    const enableSpy = jest.spyOn(wrapper.vm, "enableBodyScroll");

    await wrapper.setProps({ value: true });
    await wrapper.setProps({ value: false });

    expect(disableSpy).not.toHaveBeenCalled();
    expect(enableSpy).not.toHaveBeenCalled();
  });

  it("returns original data when search value is empty", () => {
    const wrapper = mountFactory();
    const data = [{ name: "A" }, { name: "B" }];

    const result = wrapper.vm.applySearch(data, "");

    expect(result).toEqual(data);
  });

  it("handles sorting when values are null or undefined", () => {
    const wrapper = mountFactory();
    const data = [{ value: null }, { value: 2 }, { value: undefined }];

    const result = wrapper.vm.applySort(data, { prop: "value", order: "ascending" });

    expect(result[2].value).toBe(2);
    expect(result.slice(0, 2).map((row) => row.value)).toEqual(
      expect.arrayContaining([null, undefined])
    );
  });

  it("resets page number on search change", () => {
    const wrapper = mountFactory();
    wrapper.vm.serverSideProps.pageNumber = 3;

    wrapper.vm.handleSearchChange({
      filter: { SearchInputTextValue: "test" }
    });

    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
  });
});
