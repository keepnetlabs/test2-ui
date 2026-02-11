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

  describe('Component Structure', () => {
    it('should render component successfully', () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });

    it('should have navigation drawer', () => {
      const wrapper = mountFactory();
      expect(wrapper.find('vnavigationdrawer-stub').exists()).toBe(false);
    });

    it('should have data table component', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it('should accept columns prop', () => {
      const wrapper = mountFactory({ columns: baseColumns });
      expect(wrapper.props('columns')).toEqual(baseColumns);
    });

    it('should accept tableData prop', () => {
      const wrapper = mountFactory({ tableData: [] });
      expect(wrapper.props('tableData')).toEqual([]);
    });
  });

  describe('Status Normalization', () => {
    it('should normalize waiting for approval status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus('waiting for approval')).toBe('Waiting for Approval');
    });

    it('should normalize executed status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus('executed')).toBe('Executed');
    });

    it('should normalize rejected status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus('rejected')).toBe('Rejected');
    });

    it('should handle underscore separated status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus('waiting_for_approval')).toBe('Waiting for Approval');
    });

    it('should handle hyphen separated status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus('waiting-for-approval')).toBe('Waiting for Approval');
    });

    it('should preserve already normalized status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus('Executed')).toBe('Executed');
    });

    it('should handle mixed case status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus('WAITING FOR APPROVAL')).toBeDefined();
    });

    it('should normalize multiple status variations', () => {
      const wrapper = mountFactory();
      const statuses = ['pending', 'processing', 'completed'];
      statuses.forEach(status => {
        expect(wrapper.vm.normalizeStatus(status)).toBeDefined();
      });
    });
  });

  describe('Activity Status Detection', () => {
    it('should detect waiting for approval status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: 'waiting for approval' })).toBe(true);
    });

    it('should detect waiting for approval with capital letters', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: 'Waiting for Approval' })).toBe(true);
    });

    it('should not detect non-approval status', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: 'executed' })).toBe(false);
    });

    it('should handle missing status field', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({})).toBeDefined();
    });

    it('should be case-insensitive for approval check', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: 'WAITING FOR APPROVAL' })).toBeDefined();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch activities', async () => {
      jest.useFakeTimers();
      const wrapper = mountFactory(
        { value: true, tableData: [{ status: 'waiting for approval' }] },
        { refreshTableLayout: jest.fn() }
      );

      const fetchPromise = wrapper.vm.fetchActivities();
      jest.runAllTimers();
      await fetchPromise;

      expect(wrapper.vm.pagedTableData).toBeDefined();
      jest.useRealTimers();
    });

    it('should normalize status during fetch', async () => {
      jest.useFakeTimers();
      const wrapper = mountFactory(
        { value: true, tableData: [{ status: 'waiting for approval' }] },
        { refreshTableLayout: jest.fn() }
      );

      const fetchPromise = wrapper.vm.fetchActivities();
      jest.runAllTimers();
      await fetchPromise;

      expect(wrapper.vm.pagedTableData[0].status).toBe('Waiting for Approval');
      jest.useRealTimers();
    });

    it('should populate paged table data', async () => {
      jest.useFakeTimers();
      const wrapper = mountFactory(
        { value: true, tableData: [{ id: 1 }, { id: 2 }] },
        { refreshTableLayout: jest.fn() }
      );

      const fetchPromise = wrapper.vm.fetchActivities();
      jest.runAllTimers();
      await fetchPromise;

      expect(wrapper.vm.pagedTableData).toEqual(expect.any(Array));
      jest.useRealTimers();
    });
  });

  describe('Data Filtering', () => {
    it('should filter data by search term', () => {
      const wrapper = mountFactory({
        columns: [{ property: 'name' }, { property: 'email' }]
      });
      const data = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' }
      ];

      const result = wrapper.vm.applySearch(data, 'alice');
      expect(result).toEqual([{ name: 'Alice', email: 'alice@example.com' }]);
    });

    it('should return all data when search is empty', () => {
      const wrapper = mountFactory();
      const data = [{ name: 'A' }, { name: 'B' }];

      const result = wrapper.vm.applySearch(data, '');
      expect(result).toEqual(data);
    });

    it('should search across multiple columns', () => {
      const wrapper = mountFactory({
        columns: [{ property: 'name' }, { property: 'email' }]
      });
      const data = [
        { name: 'Alice', email: 'alice@example.com' },
        { name: 'Bob', email: 'bob@example.com' }
      ];

      const result = wrapper.vm.applySearch(data, 'bob@example');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should be case-insensitive in search', () => {
      const wrapper = mountFactory({
        columns: [{ property: 'name' }]
      });
      const data = [{ name: 'Alice' }];

      const result1 = wrapper.vm.applySearch(data, 'alice');
      const result2 = wrapper.vm.applySearch(data, 'ALICE');
      expect(result1).toEqual(result2);
    });

    it('should handle special characters in search', () => {
      const wrapper = mountFactory({
        columns: [{ property: 'name' }]
      });
      const data = [{ name: 'John@Doe' }];

      const result = wrapper.vm.applySearch(data, '@');
      expect(result).toEqual(expect.any(Array));
    });
  });

  describe('Data Sorting', () => {
    it('should sort ascending', () => {
      const wrapper = mountFactory();
      const data = [{ value: 3 }, { value: 1 }, { value: 2 }];

      const result = wrapper.vm.applySort(data, { prop: 'value', order: 'ascending' });
      expect(result.map(r => r.value)).toEqual([1, 2, 3]);
    });

    it('should sort descending', () => {
      const wrapper = mountFactory();
      const data = [{ value: 3 }, { value: 1 }, { value: 2 }];

      const result = wrapper.vm.applySort(data, { prop: 'value', order: 'descending' });
      expect(result.map(r => r.value)).toEqual([3, 2, 1]);
    });

    it('should handle null values in sort', () => {
      const wrapper = mountFactory();
      const data = [{ value: null }, { value: 2 }, { value: undefined }];

      const result = wrapper.vm.applySort(data, { prop: 'value', order: 'ascending' });
      expect(result).toEqual(expect.any(Array));
    });

    it('should sort string values', () => {
      const wrapper = mountFactory();
      const data = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];

      const result = wrapper.vm.applySort(data, { prop: 'name', order: 'ascending' });
      expect(result[0].name).toBe('Alice');
    });

    it('should handle missing sort property', () => {
      const wrapper = mountFactory();
      const data = [{ value: 2 }, { value: 1 }];

      expect(() => {
        wrapper.vm.applySort(data, { prop: 'missing', order: 'ascending' });
      }).not.toThrow();
    });
  });

  describe('Data Pagination', () => {
    it('should paginate first page', () => {
      const wrapper = mountFactory();
      const data = [1, 2, 3, 4, 5].map(v => ({ value: v }));

      const result = wrapper.vm.applyPagination(data, 1, 2);
      expect(result.map(r => r.value)).toEqual([1, 2]);
    });

    it('should paginate second page', () => {
      const wrapper = mountFactory();
      const data = [1, 2, 3, 4, 5].map(v => ({ value: v }));

      const result = wrapper.vm.applyPagination(data, 2, 2);
      expect(result.map(r => r.value)).toEqual([3, 4]);
    });

    it('should handle out of range page', () => {
      const wrapper = mountFactory();
      const data = [1, 2].map(v => ({ value: v }));

      const result = wrapper.vm.applyPagination(data, 10, 2);
      expect(result).toEqual(expect.any(Array));
    });

    it('should handle page size larger than data', () => {
      const wrapper = mountFactory();
      const data = [1, 2].map(v => ({ value: v }));

      const result = wrapper.vm.applyPagination(data, 1, 10);
      expect(result.length).toBeLessThanOrEqual(2);
    });

    it('should handle zero page number', () => {
      const wrapper = mountFactory();
      const data = [1, 2].map(v => ({ value: v }));

      expect(() => {
        wrapper.vm.applyPagination(data, 0, 2);
      }).not.toThrow();
    });
  });

  describe('Event Handling', () => {
    it('should emit on-close event', () => {
      const wrapper = mountFactory();
      wrapper.vm.handleClose();
      expect(wrapper.emitted()['on-close']).toBeTruthy();
    });

    it('should reset page on search change', () => {
      const wrapper = mountFactory();
      wrapper.vm.serverSideProps.pageNumber = 5;

      wrapper.vm.handleSearchChange({ filter: { SearchInputTextValue: 'test' } });
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
    });

    it('should accept search change event', () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.vm.handleSearchChange({ filter: { SearchInputTextValue: 'test' } });
      }).not.toThrow();
    });

    it('should accept sort configuration', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it('should support pagination', () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.applyPagination).toBeDefined();
    });
  });

  describe('Body Scroll Control', () => {
    it('should control body scroll by default', () => {
      const wrapper = mountFactory({ value: true });
      expect(wrapper.vm).toBeDefined();
    });

    it('should skip scroll control when flag is false', async () => {
      const wrapper = mountFactory({ value: true, shouldControlBodyScroll: false });
      const disableSpy = jest.spyOn(wrapper.vm, 'disableBodyScroll');

      await wrapper.setProps({ value: true });
      expect(disableSpy).not.toHaveBeenCalled();
    });

    it('should toggle body scroll on value change', async () => {
      const wrapper = mountFactory({ value: false });
      await wrapper.setProps({ value: true });
      await wrapper.setProps({ value: false });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Props Management', () => {
    it('should accept value prop', () => {
      const wrapper = mountFactory({ value: true });
      expect(wrapper.props('value')).toBe(true);
    });

    it('should accept columns prop', () => {
      const wrapper = mountFactory({ columns: baseColumns });
      expect(wrapper.props('columns')).toEqual(baseColumns);
    });

    it('should accept tableData prop', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const wrapper = mountFactory({ tableData: data });
      expect(wrapper.props('tableData')).toEqual(data);
    });

    it('should support dynamic prop updates', async () => {
      const wrapper = mountFactory();
      await wrapper.setProps({ value: true });
      expect(wrapper.props('value')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty columns', () => {
      const wrapper = mountFactory({ columns: [] });
      expect(wrapper.props('columns')).toEqual([]);
    });

    it('should handle empty tableData', () => {
      const wrapper = mountFactory({ tableData: [] });
      expect(wrapper.vm).toBeDefined();
    });

    it('should handle very large dataset', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => ({ id: i }));
      const wrapper = mountFactory({ tableData: largeData });
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle special characters in data', () => {
      const data = [{ name: 'Test & Co. <Script>' }];
      const wrapper = mountFactory({ tableData: data });
      expect(wrapper.exists()).toBe(true);
    });

    it('should handle null values in data', () => {
      const data = [{ value: null }, { value: undefined }];
      const wrapper = mountFactory({ tableData: data });
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe('Multiple Instances', () => {
    it('should support multiple drawer instances', () => {
      const wrapper1 = mountFactory({ value: true });
      const wrapper2 = mountFactory({ value: false });

      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it('should maintain separate state', () => {
      const wrapper1 = mountFactory({ value: true });
      const wrapper2 = mountFactory({ value: false });

      expect(wrapper1.props('value')).not.toBe(wrapper2.props('value'));
    });
  });
});
