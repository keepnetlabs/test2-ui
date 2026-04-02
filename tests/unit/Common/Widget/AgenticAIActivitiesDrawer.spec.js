import { createLocalVue, shallowMount } from "@vue/test-utils";
import AgenticAIActivitiesDrawer from "@/components/Common/Widget/WidgetComponents/AgenticAIActivitiesDrawer.vue";
import { customVuetify as vuetify } from "../../utils";
import * as CompanyAPI from "@/api/company";
import * as AgenticAIService from "@/api/agenticAIService";

jest.mock("@/api/company", () => ({
  searchAgenticAIActivities: jest.fn(),
  approveAgenticAIBatch: jest.fn(),
  approveAgenticAIActivity: jest.fn(),
  rejectAgenticAIActivity: jest.fn(),
  rejectAgenticAIBatch: jest.fn()
}));

jest.mock("@/api/agenticAIService", () => ({
  retryAutonomous: jest.fn(() => Promise.resolve())
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

const makeGroupedBatchApiRow = (batchId, title = "Batch") => ({
  batchResourceId: batchId,
  batchName: `${title} ${batchId}`,
  activities: [
    {
      batchResourceId: batchId,
      activityType: 1,
      activityTypeName: "Phishing",
      statusName: "executed"
    }
  ],
  statusCounts: { Approved: 1, Pending: 0, Declined: 0 }
});

/** Default totalNumberOfPages 0 = API did not send page count; component uses totals / heuristics. */
const mockBatchGroupedResponse = (results = [], totalNumberOfRecords = null, totalNumberOfPages = 0) => ({
  data: {
    data: {
      results,
      totalNumberOfRecords:
        totalNumberOfRecords != null ? totalNumberOfRecords : Math.max(results.length, 0),
      totalNumberOfPages
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

  it("normalizes waiting for approval status to Pending", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeStatus("waiting for approval")).toBe("Pending");
  });

  it("normalizes executed to Approved and rejected to Declined", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeStatus("executed")).toBe("Approved");
    expect(wrapper.vm.normalizeStatus("rejected")).toBe("Declined");
  });

  it("normalizes statuses with underscores or hyphens to Pending", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.normalizeStatus("waiting_for_approval")).toBe("Pending");
    expect(wrapper.vm.normalizeStatus("waiting-for-approval")).toBe("Pending");
  });

  it("treats waiting for approval status as actionable regardless of case", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.isWaitingForApproval({ status: "waiting for approval" })).toBe(true);
    expect(wrapper.vm.isWaitingForApproval({ status: "Waiting for Approval" })).toBe(true);
  });

  it("treats Pending status as waiting for approval", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.isWaitingForApproval({ status: "Pending" })).toBe(true);
  });

  it("applies Approved status to paged data when statusName is executed", async () => {
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

    expect(wrapper.vm.pagedTableData[0].status).toBe("Approved");
  });

  it("applies Pending status to paged data when statusName is waiting for approval", async () => {
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

    expect(wrapper.vm.pagedTableData[0].status).toBe("Pending");
  });

  it("resets page number on search change", () => {
    const wrapper = mountFactory();
    wrapper.vm.serverSideProps.pageNumber = 3;

    wrapper.vm.handleSearchChange({
      filter: { SearchInputTextValue: "test" }
    });

    expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
  });

  describe("mapActivityToRow", () => {
    it("uses UI-friendly activity type labels without Simulation suffix", () => {
      const wrapper = mountFactory();
      const row = wrapper.vm.mapActivityToRow({
        resourceId: "r1",
        activityType: 1,
        activityTypeName: "Phishing Simulation"
      });
      expect(row.contentType).toBe("Phishing");
    });

    it("includes explanationJson in mapped row", () => {
      const wrapper = mountFactory();
      const activity = {
        resourceId: "r1",
        activityType: 1,
        statusName: "executed",
        explanationJson: { reasoningText: "User has low score." }
      };
      const row = wrapper.vm.mapActivityToRow(activity);
      expect(row.explanationJson).toEqual({ reasoningText: "User has low score." });
    });

    it("sets explanationJson to null when not provided", () => {
      const wrapper = mountFactory();
      const row = wrapper.vm.mapActivityToRow({ resourceId: "r1" });
      expect(row.explanationJson).toBeNull();
    });

    it("uses contentCategory for Training rows when scenarioName is absent", () => {
      const wrapper = mountFactory();
      const row = wrapper.vm.mapActivityToRow({
        resourceId: "fsHFsdxklGhr",
        activityType: 4,
        activityTypeName: "Training",
        contentCategory: "Training | Link Inspection Basics",
        statusName: "Pending"
      });
      expect(row.scenarioName).toBe("Training | Link Inspection Basics");
    });

    it("prefers scenarioName over contentCategory for Training when both exist", () => {
      const wrapper = mountFactory();
      const row = wrapper.vm.mapActivityToRow({
        resourceId: "r1",
        activityType: 4,
        scenarioName: "Named module",
        contentCategory: "Training | Other"
      });
      expect(row.scenarioName).toBe("Named module");
    });
  });

  describe("getBatchStatusCounts", () => {
    it("maps statusCounts keys to approved, pending, declined", () => {
      const wrapper = mountFactory();
      const batch = {
        statusCounts: { Approved: 2, Pending: 3, Declined: 1 }
      };
      expect(wrapper.vm.getBatchStatusCounts(batch)).toEqual({
        approved: 2,
        pending: 3,
        declined: 1
      });
    });

    it("returns zeros when statusCounts is missing", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getBatchStatusCounts({})).toEqual({
        approved: 0,
        pending: 0,
        declined: 0
      });
    });
  });

  describe("getBatchSegmentWidth", () => {
    it("returns 0% when userCount is zero", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getBatchSegmentWidth({ userCount: 0 }, "approved")).toBe("0%");
    });

    it("calculates approved segment correctly", () => {
      const wrapper = mountFactory();
      const batch = { userCount: 4, statusCounts: { Approved: 2, Pending: 1, Declined: 1 } };
      expect(wrapper.vm.getBatchSegmentWidth(batch, "approved")).toBe("50%");
    });

    it("calculates pending segment correctly", () => {
      const wrapper = mountFactory();
      const batch = { userCount: 4, statusCounts: { Approved: 2, Pending: 1, Declined: 1 } };
      expect(wrapper.vm.getBatchSegmentWidth(batch, "pending")).toBe("25%");
    });

    it("calculates declined segment correctly", () => {
      const wrapper = mountFactory();
      const batch = { userCount: 4, statusCounts: { Approved: 2, Pending: 1, Declined: 1 } };
      expect(wrapper.vm.getBatchSegmentWidth(batch, "declined")).toBe("25%");
    });

    it("handles missing statusCounts gracefully", () => {
      const wrapper = mountFactory();
      const batch = { userCount: 2, statusCounts: {} };
      expect(wrapper.vm.getBatchSegmentWidth(batch, "approved")).toBe("0%");
    });
  });

  describe("formatBatchDate", () => {
    it("returns the date string as-is from backend", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.formatBatchDate("03/25/2026 07:49")).toBe("03/25/2026 07:49");
    });

    it("returns empty string for empty input", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.formatBatchDate("")).toBe("");
    });

    it("returns empty string when no argument given", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.formatBatchDate()).toBe("");
    });
  });

  describe("previewReasoningText computed", () => {
    it("returns reasoningText from previewActivityRow explanationJson", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        previewActivityRow: {
          status: "Pending",
          explanationJson: { reasoningText: "Finance scenario selected." }
        }
      });
      expect(wrapper.vm.previewReasoningText).toBe("Finance scenario selected.");
    });

    it("returns empty string when previewActivityRow is null", () => {
      const wrapper = mountFactory();
      wrapper.setData({ previewActivityRow: null });
      expect(wrapper.vm.previewReasoningText).toBe("");
    });

    it("returns empty string when explanationJson is missing", () => {
      const wrapper = mountFactory();
      wrapper.setData({ previewActivityRow: { status: "Pending", explanationJson: null } });
      expect(wrapper.vm.previewReasoningText).toBe("");
    });
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
    it("should normalize pending status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("pending")).toBe("Pending");
    });

    it("should normalize waiting for approval to Pending", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("waiting for approval")).toBe("Pending");
    });

    it("should normalize executed to Approved", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("executed")).toBe("Approved");
    });

    it("should normalize rejected to Declined", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("rejected")).toBe("Declined");
    });

    it("should normalize declined", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("declined")).toBe("Declined");
    });

    it("should handle underscore separated status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("waiting_for_approval")).toBe("Pending");
    });

    it("should handle hyphen separated status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("waiting-for-approval")).toBe("Pending");
    });

    it("should normalize error status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("error")).toBe("Error");
    });
  });

  describe("Activity Status Detection", () => {
    it("should detect waiting for approval status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "waiting for approval" })).toBe(true);
    });

    it("should detect Pending as waiting for approval", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "Pending" })).toBe(true);
    });

    it("should not detect approved/executed as waiting for approval", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "Approved" })).toBe(false);
      expect(wrapper.vm.isWaitingForApproval({ status: "executed" })).toBe(false);
    });

    it("should handle missing status field", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({})).toBe(false);
    });

    it("isExecuted returns true for approved or executed status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isExecuted({ status: "Approved" })).toBe(true);
      expect(wrapper.vm.isExecuted({ status: "executed" })).toBe(true);
    });

    it("isExecuted returns false for other statuses", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isExecuted({ status: "Pending" })).toBe(false);
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
    it("should fetch activities and populate pagedTableData with Approved status", async () => {
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
      expect(wrapper.vm.pagedTableData.length).toBe(1);
      expect(wrapper.vm.pagedTableData[0].status).toBe("Approved");
    });

    it("should normalize to Pending when statusName is waiting for approval", async () => {
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

      expect(wrapper.vm.pagedTableData[0].status).toBe("Pending");
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

    it("maps explanationJson from API response", async () => {
      const activities = [
        {
          resourceId: "a1",
          batchResourceId: "b1",
          activityType: 1,
          statusName: "executed",
          explanationJson: { reasoningText: "Low score user." }
        }
      ];
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue(mockActivityResponse(activities));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchActivities();

      expect(wrapper.vm.pagedTableData[0].explanationJson).toEqual({ reasoningText: "Low score user." });
    });
  });

  describe("Batch list infinite scroll", () => {
    it("mapActivityToBatch maps makeGroupedBatchApiRow to a batch with batchResourceId", () => {
      const wrapper = mountFactory();
      const mapped = wrapper.vm.mapActivityToBatch(makeGroupedBatchApiRow("b1"));
      expect(mapped.batchResourceId).toBe("b1");
      expect(mapped.title).toContain("b1");
    });

    it("buildBatchRequestPayload uses pageSize 100 and requested pageNumber", () => {
      const wrapper = mountFactory();
      const p1 = wrapper.vm.buildBatchRequestPayload(1);
      const p3 = wrapper.vm.buildBatchRequestPayload(3);
      expect(p1.pageSize).toBe(100);
      expect(p1.pageNumber).toBe(1);
      expect(p1.isGroupedByBatch).toBe(true);
      expect(p3.pageNumber).toBe(3);
    });

    it("batchListHasMore is true when loaded count is below API total", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchListTotalPages: 0,
        batchListTotalRecords: 100,
        batchList: [makeGroupedBatchApiRow("b1")],
        batchListLastPageSize: 1
      });
      expect(wrapper.vm.batchListHasMore).toBe(true);
    });

    it("batchListHasMore is false when loaded count reaches API total", () => {
      const wrapper = mountFactory();
      const row = makeGroupedBatchApiRow("b1");
      wrapper.setData({
        batchListTotalPages: 0,
        batchListTotalRecords: 1,
        batchList: [row],
        batchListLastPageSize: 1
      });
      expect(wrapper.vm.batchListHasMore).toBe(false);
    });

    it("batchListHasMore prefers totalNumberOfPages over raw totals when set", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchListTotalPages: 3,
        batchListPageNumber: 2,
        batchListTotalRecords: 500,
        batchList: [makeGroupedBatchApiRow("b1")],
        batchListLastPageSize: 100
      });
      expect(wrapper.vm.batchListHasMore).toBe(true);
      wrapper.setData({ batchListPageNumber: 3 });
      expect(wrapper.vm.batchListHasMore).toBe(false);
    });

    it("batchListHasMore falls back to last page size when API total is unknown", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchListTotalPages: 0,
        batchListTotalRecords: 0,
        batchList: [],
        batchListLastPageSize: 100
      });
      expect(wrapper.vm.batchListHasMore).toBe(true);
      wrapper.setData({ batchListLastPageSize: 99 });
      expect(wrapper.vm.batchListHasMore).toBe(false);
    });

    it("fetchBatches does not call API when drawer value is false", async () => {
      const wrapper = mountFactory({ value: false });
      CompanyAPI.searchAgenticAIActivities.mockClear();
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      expect(CompanyAPI.searchAgenticAIActivities).not.toHaveBeenCalled();
    });

    it("fetchBatches replaces list on first page and sets selection from API total", async () => {
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue(
        mockBatchGroupedResponse([makeGroupedBatchApiRow("b1"), makeGroupedBatchApiRow("b2")], 42)
      );
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });

      expect(CompanyAPI.searchAgenticAIActivities).toHaveBeenCalledWith(
        expect.objectContaining({ pageNumber: 1, pageSize: 100, isGroupedByBatch: true })
      );
      expect(wrapper.vm.batchList.length).toBe(2);
      expect(wrapper.vm.batchListPageNumber).toBe(1);
      expect(wrapper.vm.batchListTotalRecords).toBe(42);
      expect(wrapper.vm.batchListTotalPages).toBe(0);
      expect(wrapper.vm.selectedBatchId).toBe("b1");
      expect(wrapper.vm.batchListLoading).toBe(false);
    });

    it("fetchBatches append merges next page and requests pageNumber + 1", async () => {
      CompanyAPI.searchAgenticAIActivities
        .mockResolvedValueOnce(mockBatchGroupedResponse([makeGroupedBatchApiRow("b1")], 5, 5))
        .mockResolvedValueOnce(mockBatchGroupedResponse([makeGroupedBatchApiRow("b2")], 5, 5));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      expect(wrapper.vm.batchListPageNumber).toBe(1);

      await wrapper.vm.fetchBatches({ append: true, preserveSelection: true });

      expect(CompanyAPI.searchAgenticAIActivities).toHaveBeenLastCalledWith(
        expect.objectContaining({ pageNumber: 2 })
      );
      expect(wrapper.vm.batchList.map((b) => b.batchResourceId)).toEqual(["b1", "b2"]);
      expect(wrapper.vm.batchListPageNumber).toBe(2);
      expect(wrapper.vm.batchListTotalPages).toBe(5);
      expect(wrapper.vm.batchListLoadingMore).toBe(false);
    });

    it("fetchBatches append with empty results caps total to stop further loads", async () => {
      CompanyAPI.searchAgenticAIActivities
        .mockResolvedValueOnce(mockBatchGroupedResponse([makeGroupedBatchApiRow("b1")], 99))
        .mockResolvedValueOnce(mockBatchGroupedResponse([], 99));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      await wrapper.vm.fetchBatches({ append: true, preserveSelection: true });

      expect(wrapper.vm.batchList.length).toBe(1);
      expect(wrapper.vm.batchListTotalRecords).toBe(1);
      expect(wrapper.vm.batchListLastPageSize).toBe(0);
      expect(wrapper.vm.batchListHasMore).toBe(false);
    });

    it("fetchBatches append with duplicate ids only caps total and does not grow list", async () => {
      const dup = makeGroupedBatchApiRow("b1");
      CompanyAPI.searchAgenticAIActivities
        .mockResolvedValueOnce(mockBatchGroupedResponse([dup], 10))
        .mockResolvedValueOnce(mockBatchGroupedResponse([dup], 10));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      expect(wrapper.vm.batchList.length).toBe(1);

      await wrapper.vm.fetchBatches({ append: true, preserveSelection: true });

      expect(wrapper.vm.batchList.length).toBe(1);
      expect(wrapper.vm.batchListTotalRecords).toBe(1);
      expect(wrapper.vm.batchListHasMore).toBe(false);
    });

    it("fetchBatches ignores stale response when a newer request completed first", async () => {
      let resolveSlow;
      const slowPromise = new Promise((resolve) => {
        resolveSlow = resolve;
      });
      let call = 0;
      CompanyAPI.searchAgenticAIActivities.mockImplementation(() => {
        call += 1;
        if (call === 1) {
          return slowPromise;
        }
        return Promise.resolve(mockBatchGroupedResponse([makeGroupedBatchApiRow("b-fast")], 2));
      });

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      const pendingSlow = wrapper.vm.fetchBatches({ preserveSelection: false });
      await wrapper.vm.$nextTick();
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      await Promise.resolve();

      expect(wrapper.vm.batchList[0].batchResourceId).toBe("b-fast");

      resolveSlow(mockBatchGroupedResponse([makeGroupedBatchApiRow("b-slow")], 2));
      await pendingSlow;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.batchList[0].batchResourceId).toBe("b-fast");
    });

    it("fetchBatches append returns early when already loading more", async () => {
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      wrapper.setData({
        batchList: [makeGroupedBatchApiRow("b1")],
        batchListPageNumber: 1,
        batchListTotalPages: 0,
        batchListTotalRecords: 100,
        batchListLastPageSize: 100,
        batchListLoadingMore: true
      });
      CompanyAPI.searchAgenticAIActivities.mockClear();
      await wrapper.vm.fetchBatches({ append: true });
      expect(CompanyAPI.searchAgenticAIActivities).not.toHaveBeenCalled();
    });

    it("fetchBatches append returns early when initial batch list is still loading", async () => {
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      wrapper.setData({
        batchList: [],
        batchListLoading: true,
        batchListTotalPages: 0,
        batchListTotalRecords: 100,
        batchListLastPageSize: 0
      });
      CompanyAPI.searchAgenticAIActivities.mockClear();
      await wrapper.vm.fetchBatches({ append: true });
      expect(CompanyAPI.searchAgenticAIActivities).not.toHaveBeenCalled();
    });

    it("handleBatchListScroll calls fetchBatches with append when near bottom", async () => {
      const wrapper = mountFactory();
      const fetchSpy = jest.spyOn(wrapper.vm, "fetchBatches").mockResolvedValue();
      wrapper.setData({
        batchListLoading: false,
        batchListLoadingMore: false,
        batchList: [{ batchResourceId: "a", activities: [] }],
        batchListTotalPages: 0,
        batchListTotalRecords: 200,
        batchListLastPageSize: 100,
        batchListPageNumber: 1
      });
      const div = document.createElement("div");
      Object.defineProperty(div, "scrollHeight", { value: 1000, configurable: true });
      Object.defineProperty(div, "scrollTop", { value: 880, configurable: true });
      Object.defineProperty(div, "clientHeight", { value: 100, configurable: true });
      await wrapper.vm.handleBatchListScroll({ currentTarget: div });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(fetchSpy).toHaveBeenCalledWith({ preserveSelection: true, append: true });
      fetchSpy.mockRestore();
    });

    it("handleBatchListScroll does nothing when not near bottom", async () => {
      const wrapper = mountFactory();
      const fetchSpy = jest.spyOn(wrapper.vm, "fetchBatches").mockResolvedValue();
      wrapper.setData({
        batchListLoading: false,
        batchListLoadingMore: false,
        batchList: [{ batchResourceId: "a", activities: [] }],
        batchListTotalPages: 0,
        batchListTotalRecords: 200,
        batchListLastPageSize: 100
      });
      const div = document.createElement("div");
      Object.defineProperty(div, "scrollHeight", { value: 1000, configurable: true });
      Object.defineProperty(div, "scrollTop", { value: 100, configurable: true });
      Object.defineProperty(div, "clientHeight", { value: 100, configurable: true });
      await wrapper.vm.handleBatchListScroll({ currentTarget: div });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it("handleBatchListScroll does not fetch when batchListLoading is true", async () => {
      const wrapper = mountFactory();
      const fetchSpy = jest.spyOn(wrapper.vm, "fetchBatches").mockResolvedValue();
      wrapper.setData({
        batchListLoading: true,
        batchListLoadingMore: false,
        batchList: [{ batchResourceId: "a", activities: [] }],
        batchListTotalPages: 0,
        batchListTotalRecords: 200,
        batchListLastPageSize: 100
      });
      const div = document.createElement("div");
      Object.defineProperty(div, "scrollHeight", { value: 1000, configurable: true });
      Object.defineProperty(div, "scrollTop", { value: 880, configurable: true });
      Object.defineProperty(div, "clientHeight", { value: 100, configurable: true });
      await wrapper.vm.handleBatchListScroll({ currentTarget: div });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it("handleBatchListScroll does not fetch when batchListLoadingMore is true", async () => {
      const wrapper = mountFactory();
      const fetchSpy = jest.spyOn(wrapper.vm, "fetchBatches").mockResolvedValue();
      wrapper.setData({
        batchListLoading: false,
        batchListLoadingMore: true,
        batchList: [{ batchResourceId: "a", activities: [] }],
        batchListTotalPages: 0,
        batchListTotalRecords: 200,
        batchListLastPageSize: 100
      });
      const div = document.createElement("div");
      Object.defineProperty(div, "scrollHeight", { value: 1000, configurable: true });
      Object.defineProperty(div, "scrollTop", { value: 880, configurable: true });
      Object.defineProperty(div, "clientHeight", { value: 100, configurable: true });
      await wrapper.vm.handleBatchListScroll({ currentTarget: div });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it("handleBatchListScroll does not fetch when hasMore is false", async () => {
      const wrapper = mountFactory();
      const fetchSpy = jest.spyOn(wrapper.vm, "fetchBatches").mockResolvedValue();
      wrapper.setData({
        batchListLoading: false,
        batchListLoadingMore: false,
        batchList: [{ batchResourceId: "a", activities: [] }],
        batchListTotalPages: 0,
        batchListTotalRecords: 1,
        batchListLastPageSize: 1
      });
      const div = document.createElement("div");
      Object.defineProperty(div, "scrollHeight", { value: 1000, configurable: true });
      Object.defineProperty(div, "scrollTop", { value: 880, configurable: true });
      Object.defineProperty(div, "clientHeight", { value: 100, configurable: true });
      await wrapper.vm.handleBatchListScroll({ currentTarget: div });
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });

    it("cancelBatchListScrollRaf clears scheduled scroll frame", () => {
      const wrapper = mountFactory();
      const spy = jest.spyOn(window, "cancelAnimationFrame").mockImplementation(() => {});
      wrapper.vm.batchListScrollRafId = 42;
      wrapper.vm.cancelBatchListScrollRaf();
      expect(spy).toHaveBeenCalledWith(42);
      expect(wrapper.vm.batchListScrollRafId).toBeNull();
      spy.mockRestore();
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

  describe("Confirm vs retry modal exclusivity", () => {
    it("handleDecline clears reject dialog before opening confirm", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "r1", batchResourceId: "b1" };
      wrapper.setData({
        rejectDialog: { status: true, action: "retry", row, loading: false }
      });
      wrapper.vm.handleDecline(row);
      expect(wrapper.vm.rejectDialog.status).toBe(false);
      expect(wrapper.vm.confirmDialog.status).toBe(true);
      expect(wrapper.vm.confirmDialog.action).toBe("decline");
    });

    it("handleRetry clears confirm dialog before opening retry feedback", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "r1", batchResourceId: "b1" };
      wrapper.setData({
        confirmDialog: {
          status: true,
          action: "decline",
          row,
          icon: "mdi-close",
          title: "Confirm Decline",
          message: "test",
          recommendation: "",
          confirmText: "DECLINE",
          loading: false
        }
      });
      wrapper.vm.handleRetry(row);
      expect(wrapper.vm.confirmDialog.status).toBe(false);
      expect(wrapper.vm.rejectDialog.status).toBe(true);
      expect(wrapper.vm.rejectDialog.action).toBe("retry");
    });

    it("initializeDrawerData resets both confirm and reject dialogs", () => {
      const wrapper = mountFactory(
        { value: false },
        {
          fetchBatches: jest.fn().mockResolvedValue(undefined),
          fetchActivities: jest.fn(),
          moveToBody: jest.fn()
        }
      );
      const closeConfirmSpy = jest.spyOn(wrapper.vm, "closeConfirmDialog");
      const closeRejectSpy = jest.spyOn(wrapper.vm, "closeRejectDialog");
      wrapper.vm.initializeDrawerData();
      expect(closeConfirmSpy).toHaveBeenCalled();
      expect(closeRejectSpy).toHaveBeenCalled();
      closeConfirmSpy.mockRestore();
      closeRejectSpy.mockRestore();
    });

    it("handleApprove and handleDeclineAll clear reject dialog before opening confirm", () => {
      const wrapper = mountFactory();
      const batchRow = { batchResourceId: "b1", waitingCount: 2 };
      wrapper.setData({
        rejectDialog: { status: true, action: "retry", row: {}, loading: false },
        selectedBatchId: "b1",
        selectedBatchPendingCount: 2
      });
      wrapper.vm.handleApprove(batchRow);
      expect(wrapper.vm.rejectDialog.status).toBe(false);
      expect(wrapper.vm.confirmDialog.action).toBe("approve");

      wrapper.setData({
        rejectDialog: { status: true, action: "retry", row: {}, loading: false }
      });
      wrapper.vm.handleDeclineAll(batchRow);
      expect(wrapper.vm.rejectDialog.status).toBe(false);
      expect(wrapper.vm.confirmDialog.action).toBe("declineAll");
    });

    it("handleConfirmAction declines via API, dispatches snackbar and resets confirm", async () => {
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      const fetchBatches = jest.fn().mockResolvedValue(undefined);
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches, fetchActivities, refreshTableLayout: jest.fn() }
      );
      wrapper.setData({
        actionInProgress: false,
        confirmDialog: {
          status: true,
          action: "decline",
          row: { resourceId: "act-1", batchResourceId: "b-1" },
          icon: "mdi-close",
          title: "Confirm Decline",
          message: "test",
          recommendation: "",
          confirmText: "DECLINE",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith({
        resourceIds: ["act-1"]
      });
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "common/createSnackBar",
        expect.objectContaining({
          message: "Action declined and will not be executed.",
          color: "green"
        })
      );
      expect(wrapper.vm.confirmDialog.status).toBe(false);
      expect(fetchBatches).toHaveBeenCalled();
      expect(fetchActivities).toHaveBeenCalled();
    });

    it("handleConfirmAction calls closePreview when preview was open", async () => {
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches: jest.fn().mockResolvedValue(),
          fetchActivities: jest.fn().mockResolvedValue(),
          refreshTableLayout: jest.fn()
        }
      );
      const closePreviewSpy = jest.spyOn(wrapper.vm, "closePreview");
      wrapper.setData({
        actionInProgress: false,
        previewType: "Quishing",
        confirmDialog: {
          status: true,
          action: "decline",
          row: { resourceId: "r1", batchResourceId: "b1" },
          icon: "mdi-close",
          title: "Confirm Decline",
          message: "m",
          recommendation: "",
          confirmText: "DECLINE",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(closePreviewSpy).toHaveBeenCalled();
      closePreviewSpy.mockRestore();
    });

    it("handleConfirmAction returns early when confirm row is missing", async () => {
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches: jest.fn(), fetchActivities: jest.fn(), refreshTableLayout: jest.fn() }
      );
      wrapper.setData({
        confirmDialog: {
          status: true,
          action: "decline",
          row: null,
          icon: "mdi-close",
          title: "",
          message: "",
          recommendation: "",
          confirmText: "DECLINE",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(CompanyAPI.rejectAgenticAIActivity).not.toHaveBeenCalled();
    });
  });

  describe("Preview handlers", () => {
    it("handlePreviewDecline opens decline confirm and clears reject dialog", () => {
      const wrapper = mountFactory();
      const row = { resourceId: "r1", batchResourceId: "b1" };
      wrapper.setData({
        previewActivityRow: row,
        rejectDialog: { status: true, action: "retry", row, loading: false }
      });
      wrapper.vm.handlePreviewDecline();
      expect(wrapper.vm.rejectDialog.status).toBe(false);
      expect(wrapper.vm.confirmDialog.status).toBe(true);
      expect(wrapper.vm.confirmDialog.action).toBe("decline");
      expect(wrapper.vm.confirmDialog.message).toContain("will be declined");
    });

    it("handlePreviewDecline does nothing when previewActivityRow is null", () => {
      const wrapper = mountFactory();
      wrapper.setData({ previewActivityRow: null, confirmDialog: { status: false } });
      wrapper.vm.handlePreviewDecline();
      expect(wrapper.vm.confirmDialog.status).toBe(false);
    });

    it("handlePreviewRetry opens retry dialog with preview row", () => {
      const wrapper = mountFactory();
      const row = {
        resourceId: "r1",
        batchResourceId: "b1",
        activityType: 1,
        targetUserResourceId: "u1"
      };
      wrapper.setData({ previewActivityRow: row });
      wrapper.vm.handlePreviewRetry();
      expect(wrapper.vm.rejectDialog.status).toBe(true);
      expect(wrapper.vm.rejectDialog.action).toBe("retry");
      expect(wrapper.vm.rejectDialog.row).toEqual(row);
    });

    it("handlePreviewRetry does nothing when previewActivityRow is null", () => {
      const wrapper = mountFactory();
      wrapper.setData({ previewActivityRow: null });
      wrapper.vm.handlePreviewRetry();
      expect(wrapper.vm.rejectDialog.status).toBe(false);
    });
  });

  describe("getApprovalCountForDialog", () => {
    it("returns selected batch pending count when batch matches selection", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b-match", waitingCount: 7, title: "Batch" }],
        selectedBatchId: "b-match",
        pagedTableData: []
      });
      expect(
        wrapper.vm.getApprovalCountForDialog({
          batchResourceId: "b-match",
          waitingCount: 1
        })
      ).toBe(7);
    });

    it("returns waitingCount from row when batch does not match selection", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        selectedBatchId: "other",
        selectedBatchPendingCount: 3
      });
      expect(
        wrapper.vm.getApprovalCountForDialog({
          batchResourceId: "b-x",
          waitingCount: 4
        })
      ).toBe(4);
    });

    it("returns 1 for pending row without batch context", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getApprovalCountForDialog({ status: "Pending" })).toBe(1);
    });
  });

  describe("isRowError", () => {
    it("returns true when status is error", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isRowError({ status: "error" })).toBe(true);
    });

    it("returns false for non-error statuses", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isRowError({ status: "Pending" })).toBe(false);
      expect(wrapper.vm.isRowError({})).toBe(false);
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

  describe("formatActivityTypeDisplay and API filter helpers", () => {
    it("maps phishing, quishing, smishing, training and preserves unknown labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.formatActivityTypeDisplay("Phishing Simulation")).toBe("Phishing");
      expect(wrapper.vm.formatActivityTypeDisplay("Quishing")).toBe("Quishing");
      expect(wrapper.vm.formatActivityTypeDisplay("Smishing Simulation")).toBe("Smishing");
      expect(wrapper.vm.formatActivityTypeDisplay("training")).toBe("Training");
      expect(wrapper.vm.formatActivityTypeDisplay("Custom Type")).toBe("Custom Type");
    });

    it("normalizeBatchTypeFilterLabel returns empty for smishing (excluded from batch filters)", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeBatchTypeFilterLabel("Smishing")).toBe("");
    });

    it("getBatchTypeFilterValueForApi maps product types to API codes", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getBatchTypeFilterValueForApi("Phishing")).toBe("1");
      expect(wrapper.vm.getBatchTypeFilterValueForApi("Quishing")).toBe("2");
      expect(wrapper.vm.getBatchTypeFilterValueForApi("Training")).toBe("4");
      expect(wrapper.vm.getBatchTypeFilterValueForApi("other")).toBe("other");
    });

    it("getStatusFilterValueForApi maps batch status labels to API codes", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getStatusFilterValueForApi("pending")).toBe("1");
      expect(wrapper.vm.getStatusFilterValueForApi("declined")).toBe("3");
      expect(wrapper.vm.getStatusFilterValueForApi("executed")).toBe("4");
      expect(wrapper.vm.getStatusFilterValueForApi("error")).toBe("5");
      expect(wrapper.vm.getStatusFilterValueForApi("custom")).toBe("custom");
    });

    it("getBatchWaitingCount reads Pending from multiple possible keys", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getBatchWaitingCount({ Pending: 3 })).toBe(3);
      expect(wrapper.vm.getBatchWaitingCount({ pending: 2 })).toBe(2);
      expect(wrapper.vm.getBatchWaitingCount({})).toBe(0);
    });

    it("getStableFilterItems prepends selected value when missing from list", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getStableFilterItems(["a", "b"], "z")).toEqual(["z", "a", "b"]);
      expect(wrapper.vm.getStableFilterItems(["a", "b"], "a")).toEqual(["a", "b"]);
    });
  });

  describe("computed: preview, pending copy, drawer columns", () => {
    it("hasNestedPreview, isPreviewRowWaitingForApproval, isPreviewRowError", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        previewType: "Phishing",
        previewActivityRow: { status: "Pending" }
      });
      expect(wrapper.vm.hasNestedPreview).toBe(true);
      expect(wrapper.vm.isPreviewRowWaitingForApproval).toBe(true);
      expect(wrapper.vm.isPreviewRowError).toBe(false);

      wrapper.setData({ previewActivityRow: { status: "error" } });
      expect(wrapper.vm.isPreviewRowError).toBe(true);
    });

    it("pendingApprovalText uses singular or plural", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 1, title: "B" }],
        selectedBatchId: "b1",
        pagedTableData: []
      });
      expect(wrapper.vm.pendingApprovalText).toBe("1 approval is waiting");

      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 3, title: "B" }],
        selectedBatchId: "b1"
      });
      expect(wrapper.vm.pendingApprovalText).toBe("3 approvals are waiting");
    });

    it("selectedBatchPendingCount falls back to counting rows when batch pending is unset", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: null, title: "B" }],
        selectedBatchId: "b1",
        pagedTableData: [
          { status: "Pending", resourceId: "1" },
          { status: "Pending", resourceId: "2" },
          { status: "Approved", resourceId: "3" }
        ]
      });
      expect(wrapper.vm.selectedBatchPendingCount).toBe(2);
    });

    it("drawerColumns renames status column to Approval Status and fixes to right", () => {
      const wrapper = mountFactory({
        columns: [
          { property: "scenarioName", label: "Scenario" },
          { property: "status", label: "Status" }
        ]
      });
      const cols = wrapper.vm.drawerColumns;
      const statusCol = cols.find((c) => c.property === "status");
      expect(statusCol.label).toBe("Approval Status");
      expect(statusCol.fixed).toBe("right");
    });

    it("drawerColumns hides Assigned Scenario column when batch is Training", () => {
      const wrapper = mountFactory({
        columns: [
          { property: "scenarioName", label: "Assigned Scenario" },
          { property: "status", label: "Status" }
        ]
      });
      wrapper.setData({
        batchList: [
          {
            batchResourceId: "b1",
            title: "Training batch",
            contentType: "Training",
            activities: [{ activityType: 4 }]
          }
        ],
        selectedBatchId: "b1"
      });
      expect(wrapper.vm.drawerColumns.some((c) => c.property === "scenarioName")).toBe(false);
      expect(wrapper.vm.drawerColumns.find((c) => c.property === "status")?.label).toBe(
        "Approval Status"
      );
    });
  });

  describe("handleConfirmAction batch and single-row flows", () => {
    it("handleConfirmAction approve calls approveAgenticAIBatch and shows success snackbar", async () => {
      CompanyAPI.approveAgenticAIBatch.mockResolvedValue({
        data: { data: { approvedCount: 5, errorCount: 0 } }
      });
      const fetchBatches = jest.fn().mockResolvedValue(undefined);
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches, fetchActivities, refreshTableLayout: jest.fn() }
      );
      wrapper.setData({
        actionInProgress: false,
        confirmDialog: {
          status: true,
          action: "approve",
          row: { batchResourceId: "batch-1" },
          icon: "mdi-check",
          title: "Confirm Approval",
          message: "m",
          recommendation: "",
          confirmText: "APPROVE ALL USERS",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(CompanyAPI.approveAgenticAIBatch).toHaveBeenCalledWith({ batchResourceId: "batch-1" });
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "common/createSnackBar",
        expect.objectContaining({
          message: "Action approved and executed successfully.",
          color: "green"
        })
      );
      expect(wrapper.emitted("on-approve")).toBeTruthy();
    });

    it("handleConfirmAction approve shows partial-failure snackbar when errors present", async () => {
      CompanyAPI.approveAgenticAIBatch.mockResolvedValue({
        data: { data: { approvedCount: 2, errorCount: 1 } }
      });
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches: jest.fn().mockResolvedValue(),
          fetchActivities: jest.fn().mockResolvedValue(),
          refreshTableLayout: jest.fn()
        }
      );
      wrapper.setData({
        actionInProgress: false,
        confirmDialog: {
          status: true,
          action: "approve",
          row: { batchResourceId: "b1" },
          icon: "mdi-check",
          title: "Confirm Approval",
          message: "m",
          recommendation: "",
          confirmText: "APPROVE ALL USERS",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "common/createSnackBar",
        expect.objectContaining({
          message: "2 approved, 1 failed",
          color: "orange"
        })
      );
    });

    it("handleConfirmAction approveActivity calls approveAgenticAIActivity", async () => {
      CompanyAPI.approveAgenticAIActivity.mockResolvedValue({
        data: { data: { errorCount: 0 } }
      });
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches: jest.fn().mockResolvedValue(),
          fetchActivities: jest.fn().mockResolvedValue(),
          refreshTableLayout: jest.fn()
        }
      );
      wrapper.setData({
        actionInProgress: false,
        confirmDialog: {
          status: true,
          action: "approveActivity",
          row: { resourceId: "act-1", batchResourceId: "b1" },
          icon: "mdi-check",
          title: "Confirm Approval",
          message: "m",
          recommendation: "",
          confirmText: "APPROVE",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(CompanyAPI.approveAgenticAIActivity).toHaveBeenCalledWith({ resourceIds: ["act-1"] });
    });

    it("handleConfirmAction declineAll calls rejectAgenticAIBatch", async () => {
      CompanyAPI.rejectAgenticAIBatch.mockResolvedValue({ data: { data: {} } });
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches: jest.fn().mockResolvedValue(),
          fetchActivities: jest.fn().mockResolvedValue(),
          refreshTableLayout: jest.fn()
        }
      );
      wrapper.setData({
        actionInProgress: false,
        confirmDialog: {
          status: true,
          action: "declineAll",
          row: { batchResourceId: "batch-x" },
          icon: "mdi-close",
          title: "Confirm Decline",
          message: "m",
          recommendation: "",
          confirmText: "DECLINE ALL",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(CompanyAPI.rejectAgenticAIBatch).toHaveBeenCalledWith({ batchResourceId: "batch-x" });
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "common/createSnackBar",
        expect.objectContaining({ message: "All pending actions declined." })
      );
    });
  });

  describe("handleRejectConfirm and retry flow", () => {
    it("returns early when reject row is missing", async () => {
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches: jest.fn(), fetchActivities: jest.fn(), refreshTableLayout: jest.fn() }
      );
      wrapper.setData({
        rejectDialog: { status: true, action: "retry", row: null, loading: false }
      });

      await wrapper.vm.handleRejectConfirm("reason text");

      expect(CompanyAPI.rejectAgenticAIActivity).not.toHaveBeenCalled();
    });

    it("retry flow calls reject API and retryAutonomous, then closes preview when open", async () => {
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches: jest.fn().mockResolvedValue(),
          fetchActivities: jest.fn().mockResolvedValue(),
          refreshTableLayout: jest.fn()
        }
      );
      const closePreviewSpy = jest.spyOn(wrapper.vm, "closePreview");
      wrapper.setData({
        actionInProgress: false,
        previewType: "Phishing",
        rejectDialog: {
          status: true,
          action: "retry",
          row: {
            resourceId: "r1",
            batchResourceId: "b1",
            activityType: 1,
            targetUserResourceId: "u1",
            firstName: "A",
            lastName: "B",
            department: "IT",
            preferredLanguage: "en",
            scenarioResourceId: "sc1"
          },
          loading: false
        }
      });

      await wrapper.vm.handleRejectConfirm("Please retry with a better scenario.");

      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceIds: ["r1"],
          batchResourceId: "b1",
          rejectingReason: "Please retry with a better scenario."
        })
      );
      expect(AgenticAIService.retryAutonomous).toHaveBeenCalled();
      expect(closePreviewSpy).toHaveBeenCalled();
      closePreviewSpy.mockRestore();
    });
  });

  describe("handleView, preview overlay, and handlePreviewApprove", () => {
    it("handleView does nothing for unknown activity type", async () => {
      const wrapper = mountFactory();
      await wrapper.vm.handleView({ activityType: 999, resourceId: "r1" });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.previewType).toBeNull();
    });

    it("handleView sets phishing preview when scenarioResourceId is present", async () => {
      const wrapper = mountFactory();
      await wrapper.vm.handleView({
        activityType: 1,
        resourceId: "r1",
        scenarioResourceId: "sc-1",
        scenarioName: "Test"
      });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.previewType).toBe("Phishing");
      expect(wrapper.vm.previewSelectedRow).toEqual({ resourceId: "sc-1", name: "Test" });
    });

    it("handleView does not open training preview without trainingResourceId", async () => {
      const wrapper = mountFactory();
      await wrapper.vm.handleView({
        activityType: 4,
        resourceId: "r1",
        scenarioResourceId: "sc-1"
      });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.previewType).toBeNull();
    });

    it("handleView does not open simulator preview without scenarioResourceId for non-training", async () => {
      const wrapper = mountFactory();
      await wrapper.vm.handleView({ activityType: 2, resourceId: "r1" });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.previewType).toBeNull();
    });

    it("onPreviewClosed clears preview state", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        previewType: "Phishing",
        previewSelectedRow: { resourceId: "x" },
        previewActivityRow: { resourceId: "y" },
        previewClosing: true
      });
      wrapper.vm.onPreviewClosed();
      expect(wrapper.vm.previewType).toBeNull();
      expect(wrapper.vm.previewSelectedRow).toBeNull();
      expect(wrapper.vm.previewActivityRow).toBeNull();
      expect(wrapper.vm.previewClosing).toBe(false);
    });

    it("handleMainOverlayClick closes nested preview without closing drawer", () => {
      const wrapper = mountFactory();
      const closePreviewSpy = jest.spyOn(wrapper.vm, "closePreview");
      const closeDrawerSpy = jest.spyOn(wrapper.vm, "closeDrawer").mockImplementation(() => {});
      wrapper.setData({ previewClosing: false, previewType: "Phishing" });
      wrapper.vm.handleMainOverlayClick();
      expect(closePreviewSpy).toHaveBeenCalled();
      expect(closeDrawerSpy).not.toHaveBeenCalled();
      closePreviewSpy.mockRestore();
      closeDrawerSpy.mockRestore();
    });

    it("handlePreviewApprove uses approveActivity for training and phishing", async () => {
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      const exec = jest.spyOn(wrapper.vm, "executeApproveReject").mockResolvedValue();

      wrapper.setData({
        previewActivityRow: {
          activityType: 4,
          resourceId: "r1",
          batchResourceId: "b1",
          trainingResourceId: "t1"
        }
      });
      wrapper.vm.handlePreviewApprove();
      expect(exec).toHaveBeenCalledWith(
        "approveActivity",
        expect.objectContaining({ activityType: 4, trainingResourceId: "t1" })
      );

      exec.mockClear();
      wrapper.setData({
        previewActivityRow: {
          activityType: 1,
          resourceId: "r2",
          scenarioResourceId: "s1"
        }
      });
      wrapper.vm.handlePreviewApprove();
      expect(exec).toHaveBeenCalledWith(
        "approveActivity",
        expect.objectContaining({ activityType: 1 })
      );

      exec.mockRestore();
    });

    it("handleViewReport resolves route and opens window for campaign report", () => {
      const openSpy = jest.spyOn(window, "open").mockImplementation(() => {});
      const wrapper = mountFactory();
      wrapper.vm.$router.resolve = jest.fn(() => ({ href: "/reports/campaign/1" }));

      wrapper.vm.handleViewReport({
        activityType: 1,
        campaignResourceId: "camp-1",
        instanceGroup: 2
      });

      expect(wrapper.vm.$router.resolve).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Campaign Report",
          params: { id: "camp-1", instanceGroup: 2 }
        })
      );
      expect(openSpy).toHaveBeenCalledWith("/reports/campaign/1", "_blank");
      openSpy.mockRestore();
    });

    it("handleViewReport returns early when activity type has no report route", () => {
      const openSpy = jest.spyOn(window, "open").mockImplementation(() => {});
      const wrapper = mountFactory();
      wrapper.vm.$router.resolve = jest.fn(() => ({ href: "/" }));

      wrapper.vm.handleViewReport({ activityType: 99, campaignResourceId: "x" });

      expect(wrapper.vm.$router.resolve).not.toHaveBeenCalled();
      expect(openSpy).not.toHaveBeenCalled();
      openSpy.mockRestore();
    });
  });

  describe("Lightbox, overlay branches, and small row helpers", () => {
    it("selectedBatchTitle and showApproveAllBanner follow selection and pending count", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.selectedBatchTitle).toBe("Select an activity");
      expect(wrapper.vm.showApproveAllBanner).toBe(false);

      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 2, title: "My Batch" }],
        selectedBatchId: "b1",
        pagedTableData: []
      });
      expect(wrapper.vm.selectedBatchTitle).toBe("My Batch");
      expect(wrapper.vm.showApproveAllBanner).toBe(true);

      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 0, title: "Done" }],
        selectedBatchId: "b1"
      });
      expect(wrapper.vm.showApproveAllBanner).toBe(false);
    });

    it("handleApproveRow opens confirm with approveActivity action", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleApproveRow({ resourceId: "a1", batchResourceId: "b1" });
      expect(wrapper.vm.confirmDialog.status).toBe(true);
      expect(wrapper.vm.confirmDialog.action).toBe("approveActivity");
      expect(wrapper.vm.confirmDialog.confirmText).toBe("APPROVE");
    });

    it("getViewActionId and getUserCountText return stable strings", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getViewActionId(3)).toBe("btn-agentic-ai-activity-view-3");
      expect(wrapper.vm.getUserCountText(42)).toBe("42");
    });

    it("handleLightboxClose resets training lightbox in store when closing", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleLightboxClose(false);
      expect(wrapper.vm.$store.commit).toHaveBeenCalledWith("trainingLibrary/SET_LIGHTBOX", {
        status: false,
        previewData: null,
        isLoading: false,
        type: null
      });
    });

    it("handleLightboxClose does not commit when lightbox stays open", () => {
      const wrapper = mountFactory();
      wrapper.vm.$store.commit.mockClear();
      wrapper.vm.handleLightboxClose(true);
      expect(wrapper.vm.$store.commit).not.toHaveBeenCalled();
    });

    it("handleMainOverlayClick when previewClosing clears preview and closes drawer", () => {
      const wrapper = mountFactory();
      const onPreviewClosedSpy = jest.spyOn(wrapper.vm, "onPreviewClosed");
      const closeDrawerSpy = jest.spyOn(wrapper.vm, "closeDrawer").mockImplementation(() => {});
      wrapper.setData({
        previewClosing: true,
        previewType: "Phishing",
        previewActivityRow: { resourceId: "r1" }
      });
      wrapper.vm.handleMainOverlayClick();
      expect(onPreviewClosedSpy).toHaveBeenCalled();
      expect(closeDrawerSpy).toHaveBeenCalled();
      onPreviewClosedSpy.mockRestore();
      closeDrawerSpy.mockRestore();
    });

    it("getStatusBadgeColor maps normalized statuses to palette", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getStatusBadgeColor("Pending")).toBe("#2196f3");
      expect(wrapper.vm.getStatusBadgeColor("Approved")).toBe("#43a047");
      expect(wrapper.vm.getStatusBadgeColor("Declined")).toBe("#757575");
      expect(wrapper.vm.getStatusBadgeColor("error")).toBe("#e53935");
      expect(wrapper.vm.getStatusBadgeColor("Unknown")).toBe("#667085");
    });
  });

  describe("executeApproveReject target user guard", () => {
    it("does not call approveAgenticAIActivity when approveActivity and target user not Active", async () => {
      const wrapper = mountFactory({ value: true });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("approveActivity", {
        resourceId: "r1",
        batchResourceId: "b1",
        targetUserStatus: "Inactive"
      });
      expect(CompanyAPI.approveAgenticAIActivity).not.toHaveBeenCalled();
    });

    it("does not call reject or retry when retry action and target user not Active", async () => {
      const wrapper = mountFactory({ value: true });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("retry", {
        resourceId: "r1",
        batchResourceId: "b1",
        activityType: 1,
        targetUserStatus: "Inactive",
        targetUserResourceId: "u1",
        firstName: "A",
        lastName: "B",
        department: "D"
      });
      expect(CompanyAPI.rejectAgenticAIActivity).not.toHaveBeenCalled();
      expect(AgenticAIService.retryAutonomous).not.toHaveBeenCalled();
    });

    it("calls approveAgenticAIActivity when approveActivity and target user Active", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.approveAgenticAIActivity.mockResolvedValue({ data: { data: { errorCount: 0 } } });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("approveActivity", {
        resourceId: "r1",
        batchResourceId: "b1",
        targetUserStatus: "Active",
        status: "Pending"
      });
      expect(CompanyAPI.approveAgenticAIActivity).toHaveBeenCalledWith({
        resourceIds: ["r1"]
      });
    });

    it("still calls rejectAgenticAIActivity on decline when target user is not Active", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("decline", {
        resourceId: "r1",
        batchResourceId: "b1",
        targetUserStatus: "Inactive"
      });
      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith({
        resourceIds: ["r1"]
      });
    });

    it("calls approveAgenticAIBatch for batch approve when row has inactive target user (no per-row guard)", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.approveAgenticAIBatch.mockResolvedValue({
        data: { data: { approvedCount: 2, errorCount: 0 } }
      });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("approve", {
        batchResourceId: "batch-1",
        targetUserStatus: "Inactive"
      });
      expect(CompanyAPI.approveAgenticAIBatch).toHaveBeenCalledWith({ batchResourceId: "batch-1" });
    });

    it("returns without calling API when actionInProgress is already true", async () => {
      const wrapper = mountFactory({ value: true });
      wrapper.setData({ actionInProgress: true });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("approveActivity", {
        resourceId: "r1",
        batchResourceId: "b1",
        targetUserStatus: "Active"
      });
      expect(CompanyAPI.approveAgenticAIActivity).not.toHaveBeenCalled();
    });

    it("returns without calling API when row is null", async () => {
      const wrapper = mountFactory({ value: true });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("approveActivity", null);
      expect(CompanyAPI.approveAgenticAIActivity).not.toHaveBeenCalled();
    });

    it("calls rejectAgenticAIBatch for declineAll when target user is not Active (no guard)", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.rejectAgenticAIBatch.mockResolvedValue({ data: { data: {} } });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("declineAll", {
        batchResourceId: "batch-x",
        targetUserStatus: "Inactive"
      });
      expect(CompanyAPI.rejectAgenticAIBatch).toHaveBeenCalledWith({ batchResourceId: "batch-x" });
    });

    it("passes rejectingReason to rejectAgenticAIActivity on decline when provided", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject(
        "decline",
        {
          resourceId: "r1",
          batchResourceId: "b1",
          targetUserStatus: "Active"
        },
        "Not aligned with policy"
      );
      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith({
        resourceIds: ["r1"],
        rejectingReason: "Not aligned with policy"
      });
    });

    it("omits rejectingReason key on decline when third arg is falsy", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("decline", {
        resourceId: "r1",
        batchResourceId: "b1",
        targetUserStatus: "Active"
      });
      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith({
        resourceIds: ["r1"]
      });
    });

    it("runs full retry branch when target user is Active", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      AgenticAIService.retryAutonomous.mockResolvedValue(undefined);
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject(
        "retry",
        {
          resourceId: "r1",
          batchResourceId: "b1",
          activityType: 4,
          targetUserStatus: "Active",
          targetUserResourceId: "u1",
          firstName: "A",
          lastName: "B",
          department: "D",
          preferredLanguage: "en",
          scenarioResourceId: "sc1"
        },
        "Please retry"
      );
      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith({
        resourceIds: ["r1"],
        batchResourceId: "b1",
        rejectingReason: "Please retry"
      });
      expect(AgenticAIService.retryAutonomous).toHaveBeenCalledWith(
        expect.objectContaining({
          targetUserResourceId: "u1",
          actions: ["training"],
          batchResourceId: "b1",
          rejectingReason: "Please retry",
          rejectedScenarioResourceId: "sc1"
        })
      );
    });
  });
});
