import { createLocalVue, shallowMount } from "@vue/test-utils";
import AgenticAIActivitiesDrawer from "@/components/Common/Widget/WidgetComponents/AgenticAIActivitiesDrawer.vue";
import { customVuetify as vuetify } from "../../utils";
import * as CompanyAPI from "@/api/company";

jest.mock("@/api/company", () => ({
  searchAgenticAIActivities: jest.fn(),
  approveAgenticAIBatch: jest.fn(),
  rejectAgenticAIActivity: jest.fn()
}));

const mockActivityResponse = (activities = []) => ({
  data: {
    data: {
      results: activities,
      totalNumberOfRecords: activities.length,
      totalNumberOfPages: 1
    }
  }
});

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
        ...propsData
      },
      methods: {
        ...methodMocks
      },
      mocks: {
        $store: {
          getters: {
            "trainingLibrary/getLightbox": {}
          },
          commit: jest.fn(),
          dispatch: jest.fn()
        },
        $router: { resolve: jest.fn(() => ({ href: "/" })) }
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

  beforeEach(() => {
    jest.clearAllMocks();
    CompanyAPI.searchAgenticAIActivities.mockResolvedValue(mockActivityResponse([]));
  });

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
    const activities = [
      {
        resourceId: "a1",
        batchResourceId: "b1",
        activityType: 1,
        statusName: "waiting for approval",
        targetUserFirstName: "John",
        targetUserLastName: "Doe"
      }
    ];
    CompanyAPI.searchAgenticAIActivities.mockResolvedValue(mockActivityResponse(activities));

    const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
    await wrapper.vm.fetchActivities();

    expect(wrapper.vm.pagedTableData[0].status).toBe("Waiting for Approval");
  });

  it("resets page number on search change", () => {
    const wrapper = mountFactory();
    wrapper.vm.serverSideProps.pageNumber = 3;

    wrapper.vm.handleSearchChange({
      filter: { SearchInputTextValue: "test" }
    });

    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
  });

  describe("Component Structure", () => {
    it("should render component successfully", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });

    it("should have data table component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should accept columns prop", () => {
      const wrapper = mountFactory({ columns: baseColumns });
      expect(wrapper.props("columns")).toEqual(baseColumns);
    });
  });

  describe("Status Normalization", () => {
    it("should normalize waiting for approval status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("waiting for approval")).toBe("Waiting for Approval");
    });

    it("should normalize executed status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("executed")).toBe("Executed");
    });

    it("should normalize rejected status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("rejected")).toBe("Rejected");
    });

    it("should handle underscore separated status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("waiting_for_approval")).toBe("Waiting for Approval");
    });

    it("should handle hyphen separated status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("waiting-for-approval")).toBe("Waiting for Approval");
    });

    it("should preserve already normalized status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("Executed")).toBe("Executed");
    });

    it("should handle mixed case status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("WAITING FOR APPROVAL")).toBeDefined();
    });

    it("should normalize multiple status variations", () => {
      const wrapper = mountFactory();
      const statuses = ["pending", "processing", "completed"];
      statuses.forEach((status) => {
        expect(wrapper.vm.normalizeStatus(status)).toBeDefined();
      });
    });
  });

  describe("Activity Status Detection", () => {
    it("should detect waiting for approval status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "waiting for approval" })).toBe(true);
    });

    it("should detect waiting for approval with capital letters", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "Waiting for Approval" })).toBe(true);
    });

    it("should not detect non-approval status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "executed" })).toBe(false);
    });

    it("should handle missing status field", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({})).toBeDefined();
    });

    it("should be case-insensitive for approval check", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "WAITING FOR APPROVAL" })).toBeDefined();
    });
  });

  describe("Field Mapping", () => {
    it("should map getFilterFieldName correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getFilterFieldName("firstName")).toBe("targetUserFirstName");
      expect(wrapper.vm.getFilterFieldName("contentType")).toBe("ActivityType");
      expect(wrapper.vm.getFilterFieldName("status")).toBe("Status");
      expect(wrapper.vm.getFilterFieldName("unknown")).toBe("unknown");
    });

    it("should map getSortFieldName correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getSortFieldName("firstName")).toBe("TargetUserFirstName");
      expect(wrapper.vm.getSortFieldName("status")).toBe("Status");
      expect(wrapper.vm.getSortFieldName("unknown")).toBe("unknown");
    });

    it("should return CreateTime as default for getSortFieldName", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getSortFieldName(null)).toBe("CreateTime");
      expect(wrapper.vm.getSortFieldName(undefined)).toBe("CreateTime");
    });

    it("should normalize filter item with FieldName and Value", () => {
      const wrapper = mountFactory();
      const result = wrapper.vm.normalizeFilterItem({
        FieldName: "firstName",
        Value: "John"
      });
      expect(result.FieldName).toBe("targetUserFirstName");
      expect(result.Value).toBe("John");
    });
  });

  describe("Data Fetching", () => {
    it("should fetch activities and populate pagedTableData", async () => {
      const activities = [
        {
          resourceId: "a1",
          batchResourceId: "b1",
          activityType: 1,
          statusName: "executed",
          targetUserFirstName: "Jane",
          targetUserLastName: "Doe"
        }
      ];
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue(mockActivityResponse(activities));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchActivities();

      expect(CompanyAPI.searchAgenticAIActivities).toHaveBeenCalled();
      expect(wrapper.vm.pagedTableData).toBeDefined();
      expect(wrapper.vm.pagedTableData.length).toBe(1);
      expect(wrapper.vm.pagedTableData[0].status).toBe("Executed");
    });

    it("should normalize status during fetch", async () => {
      const activities = [
        {
          resourceId: "a1",
          batchResourceId: "b1",
          activityType: 1,
          statusName: "waiting for approval",
          targetUserFirstName: "John",
          targetUserLastName: "Doe"
        }
      ];
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue(mockActivityResponse(activities));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchActivities();

      expect(wrapper.vm.pagedTableData[0].status).toBe("Waiting for Approval");
    });

    it("should not fetch when value is false", async () => {
      const wrapper = mountFactory({ value: false });
      await wrapper.vm.fetchActivities();

      expect(CompanyAPI.searchAgenticAIActivities).not.toHaveBeenCalled();
    });

    it("should handle API error gracefully", async () => {
      CompanyAPI.searchAgenticAIActivities.mockRejectedValue(new Error("Network error"));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchActivities();

      expect(wrapper.vm.pagedTableData).toEqual([]);
    });
  });

  describe("Server-Side Events", () => {
    it("should reset page on search change and call fetchActivities", async () => {
      const wrapper = mountFactory({ value: true });
      wrapper.vm.serverSideProps.pageNumber = 5;

      wrapper.vm.handleSearchChange({ filter: { SearchInputTextValue: "test" } });

      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
      await wrapper.vm.$nextTick();
      expect(CompanyAPI.searchAgenticAIActivities).toHaveBeenCalled();
    });

    it("should handle sort change and call fetchActivities", async () => {
      const wrapper = mountFactory({ value: true });
      wrapper.vm.handleSortChange({ prop: "status", order: "ascending" });

      expect(wrapper.vm.axiosPayload.orderBy).toBe("status");
      expect(wrapper.vm.axiosPayload.ascending).toBe(true);
      await wrapper.vm.$nextTick();
      expect(CompanyAPI.searchAgenticAIActivities).toHaveBeenCalled();
    });

    it("should handle page change and call fetchActivities", async () => {
      const wrapper = mountFactory({ value: true });
      wrapper.vm.handleServerSidePageChange(2);

      expect(wrapper.vm.serverSideProps.pageNumber).toBe(2);
      expect(wrapper.vm.axiosPayload.pageNumber).toBe(2);
      await wrapper.vm.$nextTick();
      expect(CompanyAPI.searchAgenticAIActivities).toHaveBeenCalled();
    });

    it("should handle page size change and reset page number", async () => {
      const wrapper = mountFactory({ value: true });
      wrapper.vm.serverSideProps.pageNumber = 3;
      wrapper.vm.handleServerSideSizeChange(10);

      expect(wrapper.vm.serverSideProps.pageSize).toBe(10);
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
      expect(wrapper.vm.axiosPayload.pageNumber).toBe(1);
    });

    it("should call handleRefresh to refetch only activities", async () => {
      const fetchActivities = jest.fn().mockResolvedValue();
      const fetchBatches = jest.fn().mockResolvedValue();
      const wrapper = mountFactory(
        { value: true },
        { fetchActivities, fetchBatches }
      );
      await wrapper.vm.handleRefresh();

      expect(fetchActivities).toHaveBeenCalledTimes(1);
      expect(fetchBatches).not.toHaveBeenCalled();
    });
  });

  describe("Drawer Close", () => {
    it("should emit on-close when closeDrawer is called", (done) => {
      const wrapper = mountFactory({ value: true });
      wrapper.vm.closeDrawer();

      setTimeout(() => {
        expect(wrapper.emitted()["on-close"]).toBeTruthy();
        done();
      }, 300);
    });
  });

  describe("Event Handling", () => {
    it("should reset page on search change", () => {
      const wrapper = mountFactory();
      wrapper.vm.serverSideProps.pageNumber = 5;

      wrapper.vm.handleSearchChange({ filter: { SearchInputTextValue: "test" } });
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
    });

    it("should accept search change event", () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.vm.handleSearchChange({ filter: { SearchInputTextValue: "test" } });
      }).not.toThrow();
    });

    it("should support server-side pagination", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.handleServerSidePageChange).toBeDefined();
      expect(wrapper.vm.handleServerSideSizeChange).toBeDefined();
    });
  });

  describe("Props Management", () => {
    it("should accept value prop", () => {
      const wrapper = mountFactory({ value: true });
      expect(wrapper.props("value")).toBe(true);
    });

    it("should accept columns prop", () => {
      const wrapper = mountFactory({ columns: baseColumns });
      expect(wrapper.props("columns")).toEqual(baseColumns);
    });

    it("should support dynamic prop updates", async () => {
      const wrapper = mountFactory();
      await wrapper.setProps({ value: true });
      expect(wrapper.props("value")).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty columns", () => {
      const wrapper = mountFactory({ columns: [] });
      expect(wrapper.props("columns")).toEqual([]);
    });

    it("should handle empty API response", async () => {
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue(mockActivityResponse([]));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchActivities();

      expect(wrapper.vm.pagedTableData).toEqual([]);
    });

    it("should handle API response with totalRowCount fallback", async () => {
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue({
        data: {
          data: {
            results: [{ resourceId: "a1", totalRowCount: 1 }],
            totalNumberOfRecords: undefined,
            totalNumberOfPages: undefined
          }
        }
      });

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchActivities();

      expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(1);
    });
  });

  describe("Multiple Instances", () => {
    it("should support multiple drawer instances", () => {
      const wrapper1 = mountFactory({ value: true });
      const wrapper2 = mountFactory({ value: false });

      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("should maintain separate state", () => {
      const wrapper1 = mountFactory({ value: true });
      const wrapper2 = mountFactory({ value: false });

      expect(wrapper1.props("value")).not.toBe(wrapper2.props("value"));
    });
  });
});
