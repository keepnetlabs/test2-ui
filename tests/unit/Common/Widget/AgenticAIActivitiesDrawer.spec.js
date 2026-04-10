import { createLocalVue, shallowMount } from "@vue/test-utils";
import AgenticAIActivitiesDrawer from "@/components/Common/Widget/WidgetComponents/AgenticAIActivitiesDrawer.vue";
import { customVuetify as vuetify } from "../../utils";
import * as CompanyAPI from "@/api/company";
import * as AgenticAIService from "@/api/agenticAIService";
import { resolveAgenticRetryLanguage } from "@/services/agenticAIRetryLanguage";
import { getDataTableFieldLabel } from "@/utils/functions";

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

jest.mock("@/services/agenticAIRetryLanguage", () => ({
  resolveAgenticRetryLanguage: jest.fn(() => Promise.resolve(""))
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
        "VNavigationDrawer",
        "VIcon",
        "v-tooltip"
      ]
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
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

    it("maps declineReason to trimmed string or null when empty", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.mapActivityToRow({
          resourceId: "r1",
          statusName: "Declined",
          declineReason: "  Policy block  "
        }).declineReason
      ).toBe("Policy block");
      expect(
        wrapper.vm.mapActivityToRow({
          resourceId: "r2",
          statusName: "Declined",
          declineReason: "   "
        }).declineReason
      ).toBeNull();
      expect(wrapper.vm.mapActivityToRow({ resourceId: "r3", statusName: "Pending" }).declineReason).toBeNull();
    });

    it("maps errorMessage to trimmed string and falls back to validation detail", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.mapActivityToRow({
          resourceId: "r1",
          statusName: "Error",
          errorMessage: "  Unverified domain  "
        }).errorMessage
      ).toBe("Unverified domain");

      expect(
        wrapper.vm.mapActivityToRow({
          resourceId: "r2",
          statusName: "Error",
          validationDetail: JSON.stringify([{ Message: "Domain is not verified." }])
        }).errorMessage
      ).toBe("Domain is not verified.");

      expect(wrapper.vm.mapActivityToRow({ resourceId: "r3", statusName: "Pending" }).errorMessage).toBeNull();
    });

    it("maps retryOfActivityResourceId and retryActivityResourceId when present", () => {
      const wrapper = mountFactory();
      const row = wrapper.vm.mapActivityToRow({
        resourceId: "r-new",
        statusName: "Retried",
        retryOfActivityResourceId: "orig-1",
        retryActivityResourceId: "retry-2"
      });
      expect(row.retryOfActivityResourceId).toBe("orig-1");
      expect(row.retryActivityResourceId).toBe("retry-2");
    });

    it("defaults retry resource id fields to null when absent", () => {
      const wrapper = mountFactory();
      const row = wrapper.vm.mapActivityToRow({ resourceId: "r1", statusName: "Pending" });
      expect(row.retryOfActivityResourceId).toBeNull();
      expect(row.retryActivityResourceId).toBeNull();
    });
  });

  describe("getBatchStatusCounts", () => {
    it("maps statusCounts keys to approved, pending, declined, and error", () => {
      const wrapper = mountFactory();
      const batch = {
        statusCounts: { Approved: 2, Pending: 3, Declined: 1, Error: 4 }
      };
      expect(wrapper.vm.getBatchStatusCounts(batch)).toEqual({
        approved: 2,
        pending: 3,
        declined: 1,
        error: 4,
        retrying: 0,
        retried: 0
      });
    });

    it("returns zeros when statusCounts is missing", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getBatchStatusCounts({})).toEqual({
        approved: 0,
        pending: 0,
        declined: 0,
        error: 0,
        retrying: 0,
        retried: 0
      });
    });

    it("reads retrying and retried from alternate API key casings", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.getBatchStatusCounts({
          statusCounts: { Retrying: 2, Retried: 1, Approved: 1 }
        })
      ).toEqual({
        approved: 1,
        pending: 0,
        declined: 0,
        error: 0,
        retrying: 2,
        retried: 1
      });
      expect(
        wrapper.vm.getBatchStatusCounts({
          statusCounts: { retrying: 3, retried: 4, failed: 2 }
        })
      ).toEqual({
        approved: 0,
        pending: 0,
        declined: 0,
        error: 2,
        retrying: 3,
        retried: 4
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

    it("calculates retrying and retried segment widths", () => {
      const wrapper = mountFactory();
      const batch = {
        userCount: 10,
        statusCounts: { Approved: 2, Pending: 2, Declined: 1, Error: 1, Retrying: 2, Retried: 2 }
      };
      expect(wrapper.vm.getBatchSegmentWidth(batch, "retrying")).toBe("20%");
      expect(wrapper.vm.getBatchSegmentWidth(batch, "retried")).toBe("20%");
      expect(wrapper.vm.getBatchSegmentWidth(batch, "error")).toBe("10%");
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

  describe("previewDeclineReasonText computed", () => {
    it("returns trimmed declineReason from preview row", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        previewActivityRow: { status: "Declined", declineReason: "  Policy violation  " }
      });
      expect(wrapper.vm.previewDeclineReasonText).toBe("Policy violation");
    });

    it("returns empty string when preview row missing or declineReason empty", () => {
      const wrapper = mountFactory();
      wrapper.setData({ previewActivityRow: null });
      expect(wrapper.vm.previewDeclineReasonText).toBe("");

      wrapper.setData({ previewActivityRow: { declineReason: null } });
      expect(wrapper.vm.previewDeclineReasonText).toBe("");

      wrapper.setData({ previewActivityRow: { declineReason: "   " } });
      expect(wrapper.vm.previewDeclineReasonText).toBe("");
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

    it("exposes stable saved filter persistence keys for the detail DataTable", async () => {
      const wrapper = mountFactory({ value: true });
      await wrapper.setData({
        batchList: [makeGroupedBatchApiRow("b-1")],
        selectedBatchId: "b-1"
      });

      const dataTable = wrapper.find("datatable-stub");
      expect(dataTable.exists()).toBe(true);
      expect(wrapper.vm.savedFiltersLocalStorageKey).toBe("AgenticAIActivitiesTableSearchKeys");
      expect(wrapper.vm.savedTableSettingsLocalStorageKey).toBe("AgenticAIActivitiesTableSettings");
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

    it("should normalize retried and retrying statuses", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("retried")).toBe("Retried");
      expect(wrapper.vm.normalizeStatus("retrying")).toBe("Retrying");
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
      expect(wrapper.vm.getFilterFieldName("targetUserStatus")).toBe("targetUserStatus");
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

    it("should call handleGlobalRefresh to refetch batches and activities while preserving selection", async () => {
      const fetchActivities = jest.fn().mockResolvedValue();
      const fetchBatches = jest.fn().mockResolvedValue();
      const clearLeftSearchDebounce = jest.fn();
      const wrapper = mountFactory(
        { value: true },
        { fetchActivities, fetchBatches, clearLeftSearchDebounce }
      );
      wrapper.setData({
        selectedBatchId: "batch-1",
        batchListLoading: false,
        batchListLoadingMore: false,
        isLoading: false,
        actionInProgress: false
      });

      await wrapper.vm.handleGlobalRefresh();

      expect(clearLeftSearchDebounce).toHaveBeenCalledTimes(1);
      expect(fetchBatches).toHaveBeenCalledWith({ preserveSelection: true });
      expect(fetchActivities).toHaveBeenCalledTimes(1);
    });

    it("should clear table state on handleGlobalRefresh when selection is missing after batch reload", async () => {
      const fetchActivities = jest.fn().mockResolvedValue();
      const fetchBatches = jest.fn().mockImplementation(async function () {
        this.selectedBatchId = null;
      });
      const clearLeftSearchDebounce = jest.fn();
      const wrapper = mountFactory(
        { value: true },
        { fetchActivities, fetchBatches, clearLeftSearchDebounce }
      );
      wrapper.setData({
        selectedBatchId: "batch-1",
        pagedTableData: [{ resourceId: "row-1" }],
        serverSideProps: {
          pageNumber: 3,
          totalNumberOfRecords: 11,
          totalNumberOfPages: 2
        },
        batchListLoading: false,
        batchListLoadingMore: false,
        isLoading: false,
        actionInProgress: false
      });

      await wrapper.vm.handleGlobalRefresh();

      expect(clearLeftSearchDebounce).toHaveBeenCalledTimes(1);
      expect(fetchBatches).toHaveBeenCalledWith({ preserveSelection: true });
      expect(fetchActivities).not.toHaveBeenCalled();
      expect(wrapper.vm.pagedTableData).toEqual([]);
      expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(0);
      expect(wrapper.vm.serverSideProps.totalNumberOfPages).toBe(0);
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
    });

    it("should not run handleGlobalRefresh while global refresh is disabled", async () => {
      const fetchActivities = jest.fn().mockResolvedValue();
      const fetchBatches = jest.fn().mockResolvedValue();
      const clearLeftSearchDebounce = jest.fn();
      const wrapper = mountFactory(
        { value: true },
        { fetchActivities, fetchBatches, clearLeftSearchDebounce }
      );
      wrapper.setData({
        batchListLoading: true,
        batchListLoadingMore: false,
        isLoading: false,
        actionInProgress: false
      });

      await wrapper.vm.handleGlobalRefresh();

      expect(clearLeftSearchDebounce).not.toHaveBeenCalled();
      expect(fetchBatches).not.toHaveBeenCalled();
      expect(fetchActivities).not.toHaveBeenCalled();
    });
  });

  describe("Filter Refresh UI", () => {
    it("renders refresh action next to left filters when batch list is visible", async () => {
      const wrapper = mountFactory({ value: true });
      wrapper.setData({
        batchList: [makeGroupedBatchApiRow("batch-1")],
        batchListLoading: false
      });
      await wrapper.vm.$nextTick();

      expect(wrapper.find(".agentic-ai-activities-drawer__list-filter-actions").exists()).toBe(true);
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
    it("handleDecline opens reject feedback dialog (decline) instead of calling API immediately", async () => {
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches: jest.fn().mockResolvedValue(),
          fetchActivities: jest.fn().mockResolvedValue(),
          refreshTableLayout: jest.fn()
        }
      );
      const row = { resourceId: "r1", batchResourceId: "b1" };
      wrapper.setData({
        rejectDialog: { status: true, action: "retry", row, loading: false }
      });
      await wrapper.vm.handleDecline(row);
      expect(wrapper.vm.confirmDialog.status).toBe(false);
      expect(wrapper.vm.rejectDialog.status).toBe(true);
      expect(wrapper.vm.rejectDialog.action).toBe("decline");
      expect(wrapper.vm.rejectDialog.row).toEqual(row);
      expect(CompanyAPI.rejectAgenticAIActivity).not.toHaveBeenCalled();
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

    it("initializeDrawerData applies saved activity table filters before fetching", () => {
      const wrapper = mountFactory(
        { value: false },
        {
          fetchBatches: jest.fn().mockResolvedValue(undefined),
          fetchActivities: jest.fn(),
          moveToBody: jest.fn()
        }
      );
      const applySavedFiltersSpy = jest.spyOn(wrapper.vm, "applySavedActivitiesTableFilters");

      wrapper.vm.initializeDrawerData();

      expect(applySavedFiltersSpy).toHaveBeenCalledTimes(1);
      applySavedFiltersSpy.mockRestore();
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
      expect(wrapper.vm.confirmDialog.status).toBe(false);
      expect(wrapper.vm.rejectDialog.status).toBe(true);
      expect(wrapper.vm.rejectDialog.action).toBe("declineAll");
      expect(wrapper.vm.rejectDialog.row).toEqual(batchRow);
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
        selectedBatchId: "b-1",
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

      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceIds: ["act-1"],
          declineForRetry: false
        })
      );
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "common/createSnackBar",
        expect.objectContaining({
          message: "Recommendation declined.",
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
    it("handlePreviewDecline opens decline feedback dialog; preview closes only after confirm", async () => {
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches: jest.fn().mockResolvedValue(),
          fetchActivities: jest.fn().mockResolvedValue(),
          refreshTableLayout: jest.fn()
        }
      );
      const row = { resourceId: "r1", batchResourceId: "b1" };
      const closePreviewSpy = jest.spyOn(wrapper.vm, "closePreview");
      wrapper.setData({
        previewActivityRow: row,
        previewType: "Phishing",
        rejectDialog: { status: true, action: "retry", row, loading: false }
      });
      await wrapper.vm.handlePreviewDecline();
      expect(wrapper.vm.rejectDialog.status).toBe(true);
      expect(wrapper.vm.rejectDialog.action).toBe("decline");
      expect(wrapper.vm.rejectDialog.row).toEqual(row);
      expect(closePreviewSpy).not.toHaveBeenCalled();
      expect(wrapper.vm.confirmDialog.status).toBe(false);
      expect(CompanyAPI.rejectAgenticAIActivity).not.toHaveBeenCalled();
      closePreviewSpy.mockRestore();
    });

    it("handlePreviewDecline does nothing when previewActivityRow is null", async () => {
      const wrapper = mountFactory();
      wrapper.setData({ previewActivityRow: null, confirmDialog: { status: false } });
      await wrapper.vm.handlePreviewDecline();
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
      expect(wrapper.vm.getStatusFilterValueForApi("retrying")).toBe("6");
      expect(wrapper.vm.getStatusFilterValueForApi("retried")).toBe("7");
      expect(wrapper.vm.getStatusFilterValueForApi("custom")).toBe("custom");
    });

    it("getBatchWaitingCount reads Pending from multiple possible keys", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getBatchWaitingCount({ Pending: 3 })).toBe(3);
      expect(wrapper.vm.getBatchWaitingCount({ pending: 2 })).toBe(2);
      expect(wrapper.vm.getBatchWaitingCount({ WaitingForApproval: 5 })).toBe(5);
      expect(wrapper.vm.getBatchWaitingCount({ "waiting for approval": 4 })).toBe(4);
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

    it("drawerColumns renames status column to Approval Status, fixes to right, and uses slot for custom cell", () => {
      const wrapper = mountFactory({
        columns: [
          { property: "scenarioName", label: "Scenario" },
          { property: "targetUserStatus", label: "User Status" },
          { property: "status", label: "Status" }
        ]
      });
      const cols = wrapper.vm.drawerColumns;
      const statusCol = cols.find((c) => c.property === "status");
      expect(statusCol.label).toBe("Approval Status");
      expect(statusCol.fixed).toBe("right");
      expect(statusCol.type).toBe("slot");
      const statusIdx = cols.findIndex((c) => c.property === "status");
      const userStatusIdx = cols.findIndex((c) => c.property === "targetUserStatus");
      expect(userStatusIdx).toBeGreaterThan(-1);
      expect(userStatusIdx).toBeLessThan(statusIdx);
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

    it("isCurrentBatchTraining is true when selected batch contentType resolves to Training without activityType 4", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [
          {
            batchResourceId: "b1",
            title: "T",
            contentType: "Training",
            activities: []
          }
        ],
        selectedBatchId: "b1"
      });
      expect(wrapper.vm.isCurrentBatchTraining).toBe(true);
    });

    it("previewApprovalActionsDisabled reflects inactive target user in preview row", () => {
      const wrapper = mountFactory();
      wrapper.setData({ previewActivityRow: { targetUserStatus: "Inactive" } });
      expect(wrapper.vm.previewApprovalActionsDisabled).toBe(true);
      wrapper.setData({ previewActivityRow: { targetUserStatus: "Active" } });
      expect(wrapper.vm.previewApprovalActionsDisabled).toBe(false);
    });

    it("previewApprovalActionsDisabled locks actions while approve request is running", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        actionInProgress: true,
        previewActivityRow: { targetUserStatus: "Active" }
      });

      expect(wrapper.vm.previewApprovalActionsDisabled).toBe(true);
      expect(wrapper.vm.previewApprovalActionsDisabledTooltip).toBe("Action in progress. Please wait.");
    });
  });

  describe("Approval status slot helpers", () => {
    it("agenticApprovalStatusColumnForCell forces type status for DataTableStatus fallback", () => {
      const wrapper = mountFactory();
      const col = { property: "status", type: "slot", label: "Approval Status" };
      expect(wrapper.vm.agenticApprovalStatusColumnForCell(col)).toEqual({
        property: "status",
        type: "status",
        label: "Approval Status"
      });
    });

    it("shouldShowApprovalStatusDeclineReasonTooltip is true for Retried or Declined with non-empty declineReason", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Retried",
          declineReason: "Previous run failed"
        })
      ).toBe(true);
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Declined",
          declineReason: "User opted out"
        })
      ).toBe(true);
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "rejected",
          declineReason: "Spam"
        })
      ).toBe(true);
    });

    it("shouldShowApprovalStatusDeclineReasonTooltip is true for Error with non-empty errorMessage", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Error",
          errorMessage: "Unverified domain"
        })
      ).toBe(true);
      expect(
        wrapper.vm.getApprovalStatusTooltipText({
          status: "Error",
          errorMessage: "Unverified domain"
        })
      ).toBe("Unverified domain");
    });

    it("shouldShowApprovalStatusDeclineReasonTooltip is false without reason or for other statuses", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Retried",
          declineReason: null
        })
      ).toBe(false);
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Retried",
          declineReason: "   "
        })
      ).toBe(false);
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Pending",
          declineReason: "Should not show"
        })
      ).toBe(false);
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Approved",
          declineReason: "x"
        })
      ).toBe(false);
    });

    it("shouldShowApprovalStatusDeclineReasonTooltip is false for Retrying or Error without errorMessage", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Retrying",
          declineReason: "Queued"
        })
      ).toBe(false);
      expect(
        wrapper.vm.shouldShowApprovalStatusDeclineReasonTooltip({
          status: "Error",
          declineReason: "Failed"
        })
      ).toBe(false);
    });

    it("getApprovalStatusTooltipText prefers declineReason for Declined and ignores unsupported statuses", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.getApprovalStatusTooltipText({
          status: "Declined",
          declineReason: "Policy block",
          errorMessage: "Should not be used"
        })
      ).toBe("Policy block");
      expect(
        wrapper.vm.getApprovalStatusTooltipText({
          status: "Pending",
          declineReason: "Should not show"
        })
      ).toBe("");
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
          confirmText: "Approve All",
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
          confirmText: "Approve All",
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
          confirmText: "Decline All",
          loading: false
        }
      });

      await wrapper.vm.handleConfirmAction();

      expect(CompanyAPI.rejectAgenticAIBatch).toHaveBeenCalledWith(
        expect.objectContaining({ batchResourceId: "batch-x", declineForRetry: false })
      );
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "common/createSnackBar",
        expect.objectContaining({ message: "Pending recommendations declined." })
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
      const closePreviewSpy = jest.spyOn(wrapper.vm, "closePreview").mockImplementation(() => {});
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
          reason: "Please retry with a better scenario.",
          declineForRetry: true
        })
      );
      expect(AgenticAIService.retryAutonomous).toHaveBeenCalledWith(
        expect.objectContaining({
          retryOfActivityResourceId: "r1",
          rejectingReason: "Please retry with a better scenario."
        })
      );
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

    it("handleMainOverlayClick does not close drawer while an action is in progress", () => {
      const wrapper = mountFactory();
      const closeDrawerSpy = jest.spyOn(wrapper.vm, "closeDrawer").mockImplementation(() => {});

      wrapper.setData({ actionInProgress: true, previewClosing: false, previewType: null });
      wrapper.vm.handleMainOverlayClick();

      expect(closeDrawerSpy).not.toHaveBeenCalled();
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
      await wrapper.vm.handlePreviewApprove();
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
      await wrapper.vm.handlePreviewApprove();
      expect(exec).toHaveBeenCalledWith(
        "approveActivity",
        expect.objectContaining({ activityType: 1 })
      );

      exec.mockRestore();
    });

    it("handlePreviewApprove keeps preview open until approve call finishes", async () => {
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      let resolveApprove;
      const exec = jest.spyOn(wrapper.vm, "executeApproveReject").mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveApprove = resolve;
          })
      );
      const closePreviewSpy = jest.spyOn(wrapper.vm, "closePreview");

      wrapper.setData({
        previewType: "Phishing",
        previewActivityRow: {
          activityType: 1,
          resourceId: "r1",
          scenarioResourceId: "s1"
        }
      });

      const approvePromise = wrapper.vm.handlePreviewApprove();

      expect(closePreviewSpy).not.toHaveBeenCalled();

      resolveApprove();
      await approvePromise;

      expect(closePreviewSpy).toHaveBeenCalledTimes(1);

      exec.mockRestore();
      closePreviewSpy.mockRestore();
    });

    it("handleViewReport resolves route and opens window for campaign report", () => {
      const openSpy = jest.spyOn(window, "open").mockImplementation(() => {});
      const wrapper = mountFactory();
      wrapper.vm.$router.resolve = jest.fn(() => ({ href: "/reports/campaign/1" }));

      wrapper.vm.handleViewReport({
        status: "Approved",
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
    it("renders a dedicated overlay hook class for drawer-specific stacking", async () => {
      const wrapper = mountFactory({ value: true });
      await wrapper.setData({ isVisible: true });
      expect(wrapper.find(".agentic-ai-activities-drawer__overlay").exists()).toBe(true);
    });

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

    it("handleApproveRow approves without AgenticAIConfirmDialog", async () => {
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
      await wrapper.vm.handleApproveRow({ resourceId: "a1", batchResourceId: "b1" });
      expect(wrapper.vm.confirmDialog.status).toBe(false);
      expect(CompanyAPI.approveAgenticAIActivity).toHaveBeenCalledWith({ resourceIds: ["a1"] });
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

    it("handleMainOverlayClick closes drawer directly when no nested preview is open", () => {
      const wrapper = mountFactory();
      const closePreviewSpy = jest.spyOn(wrapper.vm, "closePreview");
      const closeDrawerSpy = jest.spyOn(wrapper.vm, "closeDrawer").mockImplementation(() => {});
      wrapper.setData({
        previewClosing: false,
        previewType: null
      });

      wrapper.vm.handleMainOverlayClick();

      expect(closePreviewSpy).not.toHaveBeenCalled();
      expect(closeDrawerSpy).toHaveBeenCalled();
      closePreviewSpy.mockRestore();
      closeDrawerSpy.mockRestore();
    });

    it("getStatusBadgeColor maps normalized statuses to palette", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getStatusBadgeColor("Pending")).toBe("#2196f3");
      expect(wrapper.vm.getStatusBadgeColor("Approved")).toBe("#43a047");
      expect(wrapper.vm.getStatusBadgeColor("Declined")).toBe("#757575");
      expect(wrapper.vm.getStatusBadgeColor("rejected")).toBe("#757575");
      expect(wrapper.vm.getStatusBadgeColor("error")).toBe("#e53935");
      expect(wrapper.vm.getStatusBadgeColor("Retrying")).toBe("#1173C1");
      expect(wrapper.vm.getStatusBadgeColor("Retried")).toBe("#757575");
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

    it("uses resolved content language for retry payload", async () => {
      resolveAgenticRetryLanguage.mockResolvedValue("German");
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });

      const fetchBatches = jest.fn().mockResolvedValue();
      const fetchActivities = jest.fn();
      const wrapper = mountFactory(
        { value: true },
        {
          fetchBatches,
          fetchActivities
        }
      );

      const row = {
        resourceId: "r1",
        batchResourceId: "b1",
        activityType: 1,
        targetUserStatus: "Active",
        targetUserResourceId: "u1",
        firstName: "Ada",
        lastName: "Lovelace",
        department: "Engineering",
        preferredLanguage: "English",
        scenarioResourceId: "s1"
      };

      await wrapper.vm.executeApproveReject("retry", row, { reason: "Needs rewrite" });

      expect(resolveAgenticRetryLanguage).toHaveBeenCalledWith(row);
      expect(AgenticAIService.retryAutonomous).toHaveBeenCalledWith(
        expect.objectContaining({
          targetUserResourceId: "u1",
          preferredLanguage: "German",
          rejectingReason: "Needs rewrite",
          rejectedScenarioResourceId: "s1"
        })
      );
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
        resourceIds: ["r1"],
        declineForRetry: false
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
      expect(CompanyAPI.rejectAgenticAIBatch).toHaveBeenCalledWith(
        expect.objectContaining({ batchResourceId: "batch-x", declineForRetry: false })
      );
    });

    it("passes reason to rejectAgenticAIActivity on decline when provided", async () => {
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
        reason: "Not aligned with policy",
        declineForRetry: false
      });
    });

    it("omits reason key on decline when third arg is falsy", async () => {
      const wrapper = mountFactory({ value: true });
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject("decline", {
        resourceId: "r1",
        batchResourceId: "b1",
        targetUserStatus: "Active"
      });
      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith({
        resourceIds: ["r1"],
        declineForRetry: false
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
        reason: "Please retry",
        declineForRetry: true
      });
      expect(AgenticAIService.retryAutonomous).toHaveBeenCalledWith(
        expect.objectContaining({
          targetUserResourceId: "u1",
          actions: ["training"],
          batchResourceId: "b1",
          rejectingReason: "Please retry",
          rejectedScenarioResourceId: "sc1",
          retryOfActivityResourceId: "r1"
        })
      );
    });
  });

  describe("normalizeTargetUserIsDeletedFlag and target user helpers", () => {
    it("maps truthy/falsy and string forms for deleted flag", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag(true)).toBe(true);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag(1)).toBe(true);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag("true")).toBe(true);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag(" TRUE ")).toBe(true);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag(false)).toBe(false);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag(0)).toBe(false);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag(null)).toBe(false);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag(undefined)).toBe(false);
      expect(wrapper.vm.normalizeTargetUserIsDeletedFlag("false")).toBe(false);
    });

    it("isTargetUserActive is false when deleted flag or status is deleted", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isTargetUserActive({ targetUserIsDeleted: true })).toBe(false);
      expect(wrapper.vm.isTargetUserActive({ targetUserStatus: "Deleted" })).toBe(false);
      expect(wrapper.vm.isTargetUserActive({ targetUserStatus: "deleted" })).toBe(false);
    });

    it("isTargetUserActive treats missing or null status as active", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isTargetUserActive({})).toBe(true);
      expect(wrapper.vm.isTargetUserActive({ targetUserStatus: null })).toBe(true);
    });

    it("isTargetUserActive is true only for Active", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isTargetUserActive({ targetUserStatus: "Active" })).toBe(true);
      expect(wrapper.vm.isTargetUserActive({ targetUserStatus: "Inactive" })).toBe(false);
    });

    it("isTargetUserActionRestricted is the inverse of active", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isTargetUserActionRestricted({ targetUserStatus: "Inactive" })).toBe(true);
      expect(wrapper.vm.isTargetUserActionRestricted({ targetUserStatus: "Active" })).toBe(false);
    });

    it("mapActivityToRow forces Deleted user status when targetUserIsDeleted string is true", () => {
      const wrapper = mountFactory();
      const row = wrapper.vm.mapActivityToRow({
        resourceId: "r1",
        targetUserIsDeleted: "true",
        targetUserStatus: "Active"
      });
      expect(row.targetUserIsDeleted).toBe(true);
      expect(row.targetUserStatus).toBe("Deleted");
    });
  });

  describe("getActivityTypeName, mapActivityToBatch, getBatchStatusCounts", () => {
    it("getActivityTypeName prefers ACTIVITY_TYPE_MAP then activityTypeName", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getActivityTypeName({ activityType: 1 })).toBe("Phishing");
      expect(wrapper.vm.getActivityTypeName({ activityType: 4 })).toBe("Training");
      expect(wrapper.vm.getActivityTypeName({ activityTypeName: "Custom" })).toBe("Custom");
    });

    it("mapActivityToBatch uses Untitled activity and resourceId when batch metadata is sparse", () => {
      const wrapper = mountFactory();
      const batch = wrapper.vm.mapActivityToBatch({
        resourceId: "only-res",
        activities: []
      });
      expect(batch.title).toBe("Untitled activity");
      expect(batch.batchResourceId).toBe("only-res");
    });

    it("getBatchStatusCounts maps Executed and rejected keys into approved/declined", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.getBatchStatusCounts({
          statusCounts: { Executed: 2, rejected: 1 }
        })
      ).toEqual({
        approved: 2,
        pending: 0,
        declined: 1,
        error: 0,
        retrying: 0,
        retried: 0
      });
    });
  });

  describe("Extra status normalization and labels", () => {
    it("normalizeStatus maps aggregate batch status strings", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("awaiting approval")).toBe("Awaiting Approval");
      expect(wrapper.vm.normalizeStatus("all approved")).toBe("All Approved");
      expect(wrapper.vm.normalizeStatus("all declined")).toBe("All Declined");
    });

    it("isWaitingForApproval accepts compact waitingforapproval", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isWaitingForApproval({ status: "waitingforapproval" })).toBe(true);
    });

    it("getStatusBadgeColor falls back to default for unknown status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getStatusBadgeColor("totally unknown")).toBe("#667085");
    });

    it("formatApprovalStatusCellLabel matches getDataTableFieldLabel", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.formatApprovalStatusCellLabel("approved")).toBe(getDataTableFieldLabel("approved"));
    });
  });

  describe("getApprovalCountForDialog when batch pending is zero", () => {
    it("uses row waitingCount when selection matches but batch waitingCount is zero", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 0, title: "B" }],
        selectedBatchId: "b1",
        pagedTableData: []
      });
      expect(
        wrapper.vm.getApprovalCountForDialog({
          batchResourceId: "b1",
          waitingCount: 8
        })
      ).toBe(8);
    });
  });

  describe("syncBatchFilterOptions and buildBatchRequestPayload", () => {
    it("merges unique activity types and statuses into filter option lists", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchTypeFilterOptions: ["Phishing"],
        batchStatusFilterOptions: ["Pending"]
      });
      wrapper.vm.syncBatchFilterOptions([
        { activityTypeName: "Phishing", status: "Approved" },
        { activityTypeName: "Quishing", status: "Approved" }
      ]);
      expect(wrapper.vm.batchTypeFilterOptions).toEqual(expect.arrayContaining(["Phishing", "Quishing"]));
      expect(wrapper.vm.batchStatusFilterOptions).toEqual(expect.arrayContaining(["Pending", "Approved"]));
    });

    it("includes ActivityType filter, BatchStatusName, and OR search fields when filters are set", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        leftSearch: "  q ",
        leftTypeFilter: "Phishing",
        leftStatusFilter: "Pending"
      });
      const payload = wrapper.vm.buildBatchRequestPayload(2);
      expect(payload.pageNumber).toBe(2);
      expect(payload.isGroupedByBatch).toBe(true);
      expect(payload.filter.SearchInputTextValue).toBe("q");
      const andItems = payload.filter.FilterGroups[0].FilterItems;
      expect(andItems.find((i) => i.FieldName === "ActivityType")?.Value).toBe("1");
      expect(andItems.find((i) => i.FieldName === "BatchStatusName")?.Value).toBe("Pending");
      const orItems = payload.filter.FilterGroups[1].FilterItems;
      expect(orItems.length).toBeGreaterThan(0);
      expect(orItems.some((i) => i.FieldName === "batchName")).toBe(true);
    });
  });

  describe("buildRequestPayload and normalizeFilterItem", () => {
    it("adds BatchResourceId when a batch is selected", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        selectedBatchId: "batch-99",
        axiosPayload: wrapper.vm.createDefaultPayload(10, false)
      });
      const out = wrapper.vm.buildRequestPayload();
      const andItems = out.filter.FilterGroups[0].FilterItems;
      expect(andItems.some((i) => i.FieldName === "BatchResourceId" && i.Value === "batch-99")).toBe(true);
    });

    it("normalizeFilterItem maps FieldName aliases and coalesces value", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeFilterItem({ FieldName: "firstName", Value: "Ann" }).FieldName).toBe(
        "targetUserFirstName"
      );
      expect(wrapper.vm.normalizeFilterItem({ FieldName: "firstName", value: "Bob" }).Value).toBe("Bob");
    });
  });

  describe("normalizeRejectPayload and buildAgenticRejectBody", () => {
    it("normalizeRejectPayload trims string reason and declineForRetry follows action", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeRejectPayload("  nope  ", "retry")).toEqual({
        reason: "nope",
        declineForRetry: true
      });
      expect(wrapper.vm.normalizeRejectPayload("x", "decline")).toEqual({
        reason: "x",
        declineForRetry: false
      });
    });

    it("normalizeRejectPayload accepts object payload", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeRejectPayload({ reason: "  z " }, "retry")).toEqual({
        reason: "z",
        declineForRetry: true
      });
    });

    it("buildAgenticRejectBody passes through ids, reason, and declineForRetry", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.buildAgenticRejectBody({
          resourceIds: ["a"],
          reason: "r",
          declineForRetry: true
        })
      ).toEqual({
        resourceIds: ["a"],
        reason: "r",
        declineForRetry: true
      });
      expect(wrapper.vm.buildAgenticRejectBody({ batchResourceId: "b" })).toEqual({ batchResourceId: "b" });
      expect(
        wrapper.vm.buildAgenticRejectBody({
          resourceIds: ["a"],
          reason: "r",
          declineForRetry: false
        })
      ).toEqual({
        resourceIds: ["a"],
        reason: "r",
        declineForRetry: false
      });
    });
  });

  describe("Additional branching: activities fetch, batch selection, handlers, scroll", () => {
    it("fetchActivities ignores stale response when a newer request completes first", async () => {
      let resolveSlow;
      const slowPromise = new Promise((resolve) => {
        resolveSlow = resolve;
      });
      CompanyAPI.searchAgenticAIActivities.mockImplementationOnce(() => slowPromise).mockResolvedValueOnce(
        mockActivityResponse([{ resourceId: "r-new", statusName: "executed" }])
      );

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      const pendingSlow = wrapper.vm.fetchActivities();
      await wrapper.vm.fetchActivities();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.pagedTableData[0].resourceId).toBe("r-new");

      resolveSlow(mockActivityResponse([{ resourceId: "r-old", statusName: "executed" }]));
      await pendingSlow;
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.pagedTableData[0].resourceId).toBe("r-new");
    });

    it("fetchActivities resets pageNumber when it exceeds totalNumberOfPages from API", async () => {
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue({
        data: { data: { results: [], totalNumberOfRecords: 0, totalNumberOfPages: 1 } }
      });
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      wrapper.vm.serverSideProps.pageNumber = 5;
      await wrapper.vm.fetchActivities();
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
    });

    it("fetchActivities uses first row totalRowCount when totalNumberOfRecords is absent", async () => {
      CompanyAPI.searchAgenticAIActivities.mockResolvedValue({
        data: {
          data: {
            results: [{ resourceId: "a1", statusName: "executed", totalRowCount: 77 }],
            totalNumberOfRecords: undefined,
            totalNumberOfPages: 1
          }
        }
      });
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchActivities();
      expect(wrapper.vm.serverSideProps.totalNumberOfRecords).toBe(77);
    });

    it("fetchBatches on first-page error clears list, selection, and totals", async () => {
      CompanyAPI.searchAgenticAIActivities.mockRejectedValue(new Error("batch failed"));
      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      expect(wrapper.vm.batchList).toEqual([]);
      expect(wrapper.vm.selectedBatchId).toBeNull();
      expect(wrapper.vm.batchListTotalRecords).toBe(0);
      expect(wrapper.vm.batchListLoading).toBe(false);
    });

    it("fetchBatches preserveSelection keeps selected batch when it still exists in results", async () => {
      CompanyAPI.searchAgenticAIActivities
        .mockResolvedValueOnce(mockBatchGroupedResponse([makeGroupedBatchApiRow("b1"), makeGroupedBatchApiRow("b2")], 2))
        .mockResolvedValueOnce(
          mockBatchGroupedResponse([makeGroupedBatchApiRow("b1"), makeGroupedBatchApiRow("b3")], 2)
        );

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      expect(wrapper.vm.selectedBatchId).toBe("b1");

      await wrapper.vm.fetchBatches({ preserveSelection: true });
      expect(wrapper.vm.selectedBatchId).toBe("b1");
    });

    it("fetchBatches preserveSelection falls back to first batch when previous id is absent", async () => {
      CompanyAPI.searchAgenticAIActivities
        .mockResolvedValueOnce(mockBatchGroupedResponse([makeGroupedBatchApiRow("b1"), makeGroupedBatchApiRow("b2")], 2))
        .mockResolvedValueOnce(
          mockBatchGroupedResponse([makeGroupedBatchApiRow("b9"), makeGroupedBatchApiRow("b10")], 2)
        );

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      wrapper.setData({ selectedBatchId: "b1" });

      await wrapper.vm.fetchBatches({ preserveSelection: true });
      expect(wrapper.vm.selectedBatchId).toBe("b9");
    });

    it("handleBatchSelect returns early when batch is missing id or already selected", async () => {
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchActivities });
      wrapper.setData({
        batchList: [makeGroupedBatchApiRow("b1")],
        selectedBatchId: "b1"
      });

      fetchActivities.mockClear();
      wrapper.vm.handleBatchSelect({ batchResourceId: "b1" });
      wrapper.vm.handleBatchSelect({});
      expect(fetchActivities).not.toHaveBeenCalled();
    });

    it("handleSortChange sets descending order and defaults orderBy to CreateTime", async () => {
      const wrapper = mountFactory({ value: true });
      wrapper.vm.handleSortChange({ prop: "email", order: "descending" });
      expect(wrapper.vm.axiosPayload.ascending).toBe(false);
      expect(wrapper.vm.axiosPayload.orderBy).toBe("email");

      wrapper.vm.handleSortChange({ order: "descending" });
      expect(wrapper.vm.axiosPayload.orderBy).toBe("CreateTime");
    });

    it("handleSearchChange copies server search text and OR FilterGroup items", () => {
      const wrapper = mountFactory({ value: true });
      const orItems = [{ FieldName: "batchName", Value: "needle" }];
      wrapper.vm.handleSearchChange({
        filter: {
          SearchInputTextValue: "needle",
          FilterGroups: [{ FilterItems: orItems }]
        }
      });
      expect(wrapper.vm.axiosPayload.filter.SearchInputTextValue).toBe("needle");
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual(orItems);
    });

    it("handleViewReport maps Quishing, Smishing, and Training routes", () => {
      const openSpy = jest.spyOn(window, "open").mockImplementation(() => {});
      const wrapper = mountFactory();
      const resolve = jest.fn((cfg) => ({ href: `/r/${cfg.name}` }));
      wrapper.vm.$router.resolve = resolve;

      wrapper.vm.handleViewReport({
        status: "Approved",
        activityType: 2,
        campaignResourceId: "c2",
        instanceGroup: 1
      });
      expect(resolve).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Quishing Report", params: { id: "c2", instanceGroup: 1 } })
      );

      wrapper.vm.handleViewReport({ status: "Approved", activityType: 3, campaignResourceId: "c3" });
      expect(resolve).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Smishing Report", params: { id: "c3", instanceGroup: 1 } })
      );

      wrapper.vm.handleViewReport({
        status: "Approved",
        activityType: 4,
        enrollmentResourceId: "en1",
        batchResourceId: "b-fallback"
      });
      expect(resolve).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Training Report", params: { id: "en1" } })
      );

      resolve.mockClear();
      wrapper.vm.handleViewReport({ status: "Approved", activityType: 4, batchResourceId: "b-only" });
      expect(resolve).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Training Report", params: { id: "b-only" } })
      );

      openSpy.mockRestore();
    });

    it("handlePreviewApprove does nothing when previewActivityRow is null", async () => {
      const wrapper = mountFactory({ value: true });
      const exec = jest.spyOn(wrapper.vm, "executeApproveReject").mockResolvedValue(undefined);
      wrapper.setData({ previewActivityRow: null });
      await wrapper.vm.handlePreviewApprove();
      expect(exec).not.toHaveBeenCalled();
      exec.mockRestore();
    });

    it("loadMoreBatchesIfNearBottom skips fetch when not within threshold of bottom", () => {
      const fetchBatches = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchBatches });
      wrapper.setData({
        batchListLoading: false,
        batchListLoadingMore: false,
        batchListTotalPages: 2,
        batchListPageNumber: 1,
        batchList: [makeGroupedBatchApiRow("b1")]
      });
      wrapper.vm.loadMoreBatchesIfNearBottom({
        scrollHeight: 1000,
        scrollTop: 0,
        clientHeight: 800
      });
      expect(fetchBatches).not.toHaveBeenCalled();
    });

    it("loadMoreBatchesIfNearBottom calls fetchBatches when within threshold of bottom", () => {
      const fetchBatches = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchBatches });
      wrapper.setData({
        batchListLoading: false,
        batchListLoadingMore: false,
        batchListTotalPages: 2,
        batchListPageNumber: 1,
        batchList: [makeGroupedBatchApiRow("b1")]
      });
      wrapper.vm.loadMoreBatchesIfNearBottom({
        scrollHeight: 500,
        scrollTop: 350,
        clientHeight: 100
      });
      expect(fetchBatches).toHaveBeenCalledWith({ preserveSelection: true, append: true });
    });

    it("handleBatchListScroll does not schedule load when currentTarget is missing", () => {
      const wrapper = mountFactory();
      const loadSpy = jest.spyOn(wrapper.vm, "loadMoreBatchesIfNearBottom");
      wrapper.vm.handleBatchListScroll({ currentTarget: null });
      expect(loadSpy).not.toHaveBeenCalled();
      loadSpy.mockRestore();
    });

    it("cancelBatchListScrollRaf is a no-op when no frame id is set", () => {
      const wrapper = mountFactory();
      wrapper.vm.batchListScrollRafId = null;
      const spy = jest.spyOn(window, "cancelAnimationFrame");
      wrapper.vm.cancelBatchListScrollRaf();
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    it("handleLeftFiltersChanged clears table rows when selection becomes empty after refetch", async () => {
      const wrapper = mountFactory({ value: true });
      const fetchBatches = jest.spyOn(wrapper.vm, "fetchBatches").mockImplementation(async () => {
        wrapper.setData({ selectedBatchId: null });
      });
      const fetchActivities = jest.spyOn(wrapper.vm, "fetchActivities").mockResolvedValue(undefined);
      wrapper.setData({
        selectedBatchId: "b1",
        pagedTableData: [{ resourceId: "x", status: "Pending" }]
      });

      await wrapper.vm.handleLeftFiltersChanged();
      await wrapper.vm.$nextTick();

      expect(wrapper.vm.pagedTableData).toEqual([]);
      expect(fetchActivities).not.toHaveBeenCalled();
      fetchBatches.mockRestore();
      fetchActivities.mockRestore();
    });

    it("handleLeftFiltersChanged does not refetch activities when batch selection is unchanged", async () => {
      const wrapper = mountFactory({ value: true });
      const fetchBatches = jest.spyOn(wrapper.vm, "fetchBatches").mockResolvedValue(undefined);
      const fetchActivities = jest.spyOn(wrapper.vm, "fetchActivities").mockResolvedValue(undefined);
      wrapper.setData({ selectedBatchId: "b-stable" });

      await wrapper.vm.handleLeftFiltersChanged();
      await wrapper.vm.$nextTick();

      expect(fetchActivities).not.toHaveBeenCalled();
      fetchBatches.mockRestore();
      fetchActivities.mockRestore();
    });

    it("executeApproveReject resets actionInProgress when approve API throws", async () => {
      CompanyAPI.approveAgenticAIBatch.mockRejectedValue(new Error("network"));
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches: jest.fn().mockResolvedValue(), fetchActivities: jest.fn().mockResolvedValue() }
      );
      wrapper.setData({ actionInProgress: false });
      await wrapper.vm.executeApproveReject("approve", { batchResourceId: "b1" });
      expect(wrapper.vm.actionInProgress).toBe(false);
    });

    it("normalizeStatus returns raw empty string for empty input", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("")).toBe("");
    });
  });

  describe("Column filters, layout, snackbar, and drawer chrome", () => {
    it("handleColumnFilterChanged merges filter into AND group and refetches", async () => {
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchActivities });
      wrapper.vm.handleColumnFilterChanged({
        FieldName: "Status",
        Value: "4",
        Operator: "="
      });
      await wrapper.vm.$nextTick();
      const items = wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems;
      expect(items.some((i) => i.FieldName === "Status" && i.Value === "4")).toBe(true);
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
      expect(fetchActivities).toHaveBeenCalled();
    });

    it("handleColumnFilterCleared removes filter field and refetches", async () => {
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchActivities });
      wrapper.setData({
        axiosPayload: {
          ...wrapper.vm.axiosPayload,
          filter: {
            ...wrapper.vm.axiosPayload.filter,
            FilterGroups: [
              {
                Condition: "AND",
                FilterItems: [
                  { FieldName: "Status", Value: "1", Operator: "=" },
                  { FieldName: "email", Value: "x@y.com", Operator: "Contains" }
                ],
                FilterGroups: []
              },
              wrapper.vm.axiosPayload.filter.FilterGroups[1]
            ]
          }
        }
      });
      wrapper.vm.handleColumnFilterCleared("Status");
      await wrapper.vm.$nextTick();
      const items = wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems;
      expect(items.some((i) => i.FieldName === "Status")).toBe(false);
      expect(items.some((i) => i.FieldName === "email")).toBe(true);
      expect(fetchActivities).toHaveBeenCalled();
    });

    it("handleClearFilters resets page number and refetches on next tick", async () => {
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchActivities });
      wrapper.setData({
        selectedBatchId: "RSjdR5NXzhes",
        serverSideProps: { ...wrapper.vm.serverSideProps, pageNumber: 4 },
        axiosPayload: {
          ...wrapper.vm.axiosPayload,
          filter: {
            ...wrapper.vm.axiosPayload.filter,
            SearchInputTextValue: "john",
            FilterGroups: [
              {
                Condition: "AND",
                FilterItems: [{ FieldName: "Status", Value: "1", Operator: "=" }],
                FilterGroups: []
              },
              wrapper.vm.axiosPayload.filter.FilterGroups[1]
            ]
          }
        }
      });

      wrapper.vm.handleClearFilters();
      expect(wrapper.vm.serverSideProps.pageNumber).toBe(1);
      expect(wrapper.vm.isClearingActivitiesFilters).toBe(true);
      expect(wrapper.vm.axiosPayload.filter.SearchInputTextValue).toBe("");
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([]);
      expect(wrapper.vm.axiosPayload.filter.FilterGroups[1].FilterItems).toEqual([]);
      expect(fetchActivities).not.toHaveBeenCalled();

      await wrapper.vm.$nextTick();
      expect(fetchActivities).toHaveBeenCalled();
      await Promise.resolve();
      expect(wrapper.vm.isClearingActivitiesFilters).toBe(false);

      const requestPayload = wrapper.vm.buildRequestPayload();
      expect(requestPayload.filter.FilterGroups[0].FilterItems).toEqual([
        {
          FieldName: "BatchResourceId",
          Operator: "=",
          Value: "RSjdR5NXzhes"
        }
      ]);
      expect(requestPayload.filter.FilterGroups[1].FilterItems).toEqual([]);
    });

    it("handleRefresh skips stale refresh while clear-filters flow is pending", async () => {
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchActivities });
      wrapper.setData({ isClearingActivitiesFilters: true });

      const refreshPromise = wrapper.vm.handleRefresh();
      await wrapper.vm.$nextTick();
      await refreshPromise;

      expect(fetchActivities).not.toHaveBeenCalled();
    });

    it("refreshTableLayout calls elTableRef.doLayout when ref chain exists", () => {
      const wrapper = mountFactory();
      const doLayout = jest.fn();
      wrapper.vm.$refs.activitiesTable = {
        lastColFixed: false,
        actionFixed: "left",
        $refs: { elTableRef: { doLayout } }
      };
      wrapper.vm.refreshTableLayout();
      expect(wrapper.vm.$refs.activitiesTable.lastColFixed).toBe(true);
      expect(wrapper.vm.$refs.activitiesTable.actionFixed).toBe("right");
      expect(doLayout).toHaveBeenCalled();
    });

    it("showSnackbar dispatches common/createSnackBar with payload", () => {
      const wrapper = mountFactory();
      wrapper.vm.showSnackbar("Saved", "orange", "mdi-alert");
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith("common/createSnackBar", {
        message: "Saved",
        color: "orange",
        icon: "mdi-alert"
      });
    });

    it("getNavigationDrawerClass uses preview drawer modifier", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getNavigationDrawerClass).toEqual({
        "k-navigation-drawer k-navigation-drawer--preview-dialog": true
      });
    });

    it("mapActivityToBatch prefers campaignName for title when batchName absent", () => {
      const wrapper = mountFactory();
      const mapped = wrapper.vm.mapActivityToBatch({
        campaignName: "Summer phish",
        activities: [
          {
            batchResourceId: "b-camp",
            activityType: 1,
            activityTypeName: "Phishing",
            statusName: "executed"
          }
        ]
      });
      expect(mapped.title).toBe("Summer phish");
      expect(mapped.campaignName).toBe("");
    });

    it("mapActivityToBatch maps lastActivityTime from batch root", () => {
      const wrapper = mountFactory();
      const mapped = wrapper.vm.mapActivityToBatch({
        batchResourceId: "b1",
        activities: [],
        lastActivityTime: "2025-01-02T00:00:00Z"
      });
      expect(mapped.lastActivityTime).toBe("2025-01-02T00:00:00Z");
    });

    it("getSortFieldName returns property as-is for unknown column", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getSortFieldName("customColumn")).toBe("customColumn");
    });

    it("handleBatchListScroll returns early when a RAF is already scheduled", () => {
      const wrapper = mountFactory();
      wrapper.vm.batchListScrollRafId = 99;
      const rafSpy = jest.spyOn(window, "requestAnimationFrame");
      wrapper.vm.handleBatchListScroll({
        currentTarget: { scrollHeight: 100, scrollTop: 0, clientHeight: 50 }
      });
      expect(rafSpy).not.toHaveBeenCalled();
      rafSpy.mockRestore();
    });
  });

  describe("Stronger branching coverage", () => {
    it("handleApprove sets singular message when pending count is 1", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 1, title: "B" }],
        selectedBatchId: "b1",
        pagedTableData: []
      });
      wrapper.vm.handleApprove({ batchResourceId: "b1", waitingCount: 1 });
      expect(wrapper.vm.confirmDialog.message).toBe(
        "1 pending recommendation will be approved and launched immediately."
      );
    });

    it("handleApprove sets plural message when pending count is not 1", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 4, title: "B" }],
        selectedBatchId: "b1",
        pagedTableData: []
      });
      wrapper.vm.handleApprove({ batchResourceId: "b1", waitingCount: 4 });
      expect(wrapper.vm.confirmDialog.message).toContain("4 pending recommendations");
    });

    it("getApprovalCountForDialog falls through to row status when batch id matches but batch pending is 0 and no waitingCount", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 0, title: "B" }],
        selectedBatchId: "b1",
        pagedTableData: []
      });
      expect(
        wrapper.vm.getApprovalCountForDialog({
          batchResourceId: "b1",
          status: "Pending"
        })
      ).toBe(1);
      expect(
        wrapper.vm.getApprovalCountForDialog({
          batchResourceId: "b1",
          status: "Approved"
        })
      ).toBe(0);
    });

    it("handleView opens Quishing preview when scenarioResourceId is set", async () => {
      const wrapper = mountFactory();
      await wrapper.vm.handleView({
        activityType: 2,
        resourceId: "r1",
        scenarioResourceId: "sc-q",
        scenarioName: "Q scenario"
      });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.previewType).toBe("Quishing");
      expect(wrapper.vm.previewSelectedRow).toEqual({ resourceId: "sc-q", name: "Q scenario" });
    });

    it("handleView opens Smishing preview when scenarioResourceId is set", async () => {
      const wrapper = mountFactory();
      await wrapper.vm.handleView({
        activityType: 3,
        resourceId: "r1",
        scenarioResourceId: "sc-s",
        scenarioName: "S scenario"
      });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.previewType).toBe("Smishing");
      expect(wrapper.vm.previewSelectedRow).toEqual({ resourceId: "sc-s", name: "S scenario" });
    });

    it("handleView opens Training preview when trainingResourceId is set", async () => {
      const wrapper = mountFactory();
      await wrapper.vm.handleView({
        activityType: 4,
        resourceId: "r1",
        trainingResourceId: "t-99",
        scenarioResourceId: "ignored-for-training"
      });
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.previewType).toBe("Training");
      expect(wrapper.vm.previewSelectedRow).toEqual({ trainingId: "t-99" });
    });

    it("executeApproveReject retry uses training action for activityType 4 and phishing fallback for unknown type", async () => {
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      AgenticAIService.retryAutonomous.mockResolvedValue(undefined);
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches: jest.fn().mockResolvedValue(), fetchActivities: jest.fn().mockResolvedValue() }
      );
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
        "go"
      );
      expect(AgenticAIService.retryAutonomous).toHaveBeenCalledWith(
        expect.objectContaining({ actions: ["training"] })
      );

      jest.clearAllMocks();
      await wrapper.vm.executeApproveReject(
        "retry",
        {
          resourceId: "r2",
          batchResourceId: "b1",
          activityType: 99,
          targetUserStatus: "Active",
          targetUserResourceId: "u1",
          firstName: "A",
          lastName: "B",
          department: "D",
          preferredLanguage: "en",
          scenarioResourceId: "sc1"
        },
        "go"
      );
      expect(AgenticAIService.retryAutonomous).toHaveBeenCalledWith(
        expect.objectContaining({ actions: ["phishing"] })
      );
    });

    it("fetchBatches append error does not clear existing batch list", async () => {
      CompanyAPI.searchAgenticAIActivities
        .mockResolvedValueOnce(mockBatchGroupedResponse([makeGroupedBatchApiRow("b1")], 10, 2))
        .mockRejectedValueOnce(new Error("append failed"));

      const wrapper = mountFactory({ value: true }, { refreshTableLayout: jest.fn() });
      await wrapper.vm.fetchBatches({ preserveSelection: false });
      expect(wrapper.vm.batchList.length).toBe(1);

      await wrapper.vm.fetchBatches({ append: true, preserveSelection: true });

      expect(wrapper.vm.batchList.length).toBe(1);
      expect(wrapper.vm.batchList[0].batchResourceId).toBe("b1");
      expect(wrapper.vm.batchListLoadingMore).toBe(false);
    });

    it("getStableFilterItems returns list unchanged when selectedValue is empty string", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getStableFilterItems(["a", "b"], "")).toEqual(["a", "b"]);
    });

    it("handleColumnFilterChanged supports array filter payload from column helper", async () => {
      const fetchActivities = jest.fn().mockResolvedValue(undefined);
      const wrapper = mountFactory({ value: true }, { fetchActivities });
      wrapper.vm.handleColumnFilterChanged([
        { FieldName: "Status", Value: "3", Operator: "=" },
        { FieldName: "email", Value: "z", Operator: "Contains" }
      ]);
      await wrapper.vm.$nextTick();
      const items = wrapper.vm.axiosPayload.filter.FilterGroups[0].FilterItems;
      expect(items.filter((i) => i.FieldName === "Status").length).toBeGreaterThan(0);
      expect(fetchActivities).toHaveBeenCalled();
    });

    it("buildAgenticRejectBody omits reason and declineForRetry when not provided", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.buildAgenticRejectBody({ resourceIds: ["x"] })).toEqual({ resourceIds: ["x"] });
      expect(wrapper.vm.buildAgenticRejectBody({ batchResourceId: "b", reason: "" })).toEqual({
        batchResourceId: "b"
      });
    });

    it("pendingApprovalText uses plural form for zero approvals waiting", () => {
      const wrapper = mountFactory();
      wrapper.setData({
        batchList: [{ batchResourceId: "b1", waitingCount: 0, title: "B" }],
        selectedBatchId: "b1",
        pagedTableData: []
      });
      expect(wrapper.vm.pendingApprovalText).toBe("0 approvals are waiting");
    });
  });

  describe("Extended branching", () => {
    it("executeApproveReject shows orange snackbar when approveActivity returns errorCount", async () => {
      CompanyAPI.approveAgenticAIActivity.mockResolvedValue({
        data: { data: { errorCount: 2 } }
      });
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches: jest.fn().mockResolvedValue(), fetchActivities: jest.fn().mockResolvedValue() }
      );
      await wrapper.vm.executeApproveReject("approveActivity", {
        resourceId: "r1",
        batchResourceId: "b1",
        targetUserStatus: "Active"
      });
      expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
        "common/createSnackBar",
        expect.objectContaining({
          message: "Approval failed. Please try again.",
          color: "orange",
          icon: "mdi-alert-circle"
        })
      );
    });

    it("refreshTableLayout does not throw when activities table ref is missing", () => {
      const wrapper = mountFactory();
      wrapper.vm.$refs.activitiesTable = undefined;
      expect(() => wrapper.vm.refreshTableLayout()).not.toThrow();
    });

    it("refreshTableLayout skips doLayout when elTableRef chain is missing", () => {
      const wrapper = mountFactory();
      const doLayout = jest.fn();
      wrapper.vm.$refs.activitiesTable = { lastColFixed: false, $refs: {} };
      wrapper.vm.refreshTableLayout();
      expect(doLayout).not.toHaveBeenCalled();
    });

    it("getBatchSegmentWidth returns 0% for unknown segment type key", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.getBatchSegmentWidth(
          { userCount: 50, statusCounts: { Approved: 50 } },
          "unknownSegment"
        )
      ).toBe("0%");
    });

    it("clearLeftSearchDebounce clears timeout when debounce id is set", () => {
      const wrapper = mountFactory();
      const spy = jest.spyOn(window, "clearTimeout").mockImplementation(() => {});
      wrapper.vm.leftSearchDebounceId = 123;
      wrapper.vm.clearLeftSearchDebounce();
      expect(spy).toHaveBeenCalledWith(123);
      expect(wrapper.vm.leftSearchDebounceId).toBeNull();
      spy.mockRestore();
    });

    it("mapActivityToRow preserves instanceGroup from activity payload", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.mapActivityToRow({
          resourceId: "r1",
          instanceGroup: 3,
          statusName: "executed"
        }).instanceGroup
      ).toBe(3);
    });

    it("isExecuted returns true for Approved capitalized status", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isExecuted({ status: "Approved" })).toBe(true);
    });

    it("normalizeStatus title-cases unknown multi-word status strings", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.normalizeStatus("custom workflow status")).toBe("Custom Workflow Status");
    });

    it("handleRejectConfirm decline with string payload calls reject API with trimmed reason", async () => {
      CompanyAPI.rejectAgenticAIActivity.mockResolvedValue({ data: { data: {} } });
      const wrapper = mountFactory(
        { value: true },
        { fetchBatches: jest.fn().mockResolvedValue(), fetchActivities: jest.fn().mockResolvedValue() }
      );
      wrapper.setData({
        actionInProgress: false,
        rejectDialog: {
          status: true,
          action: "decline",
          row: { resourceId: "r1", batchResourceId: "b1", targetUserStatus: "Active" },
          loading: false
        }
      });
      await wrapper.vm.handleRejectConfirm("  No thanks  ");
      expect(CompanyAPI.rejectAgenticAIActivity).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceIds: ["r1"],
          reason: "No thanks",
          declineForRetry: false
        })
      );
    });

    it("buildAgenticRejectBody includes declineForRetry false when explicitly set", () => {
      const wrapper = mountFactory();
      expect(
        wrapper.vm.buildAgenticRejectBody({
          batchResourceId: "b1",
          reason: "x",
          declineForRetry: false
        })
      ).toEqual({
        batchResourceId: "b1",
        reason: "x",
        declineForRetry: false
      });
    });
  });
});
