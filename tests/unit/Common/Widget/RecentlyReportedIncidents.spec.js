import { createLocalVue, shallowMount } from "@vue/test-utils";
import RecentlyReportedIncidents from "@/components/Common/Widget/WidgetComponents/RecentlyReportedIncidents.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";
import { searchNotifiedMail } from "@/api/incidentResponder";

jest.mock("@/api/incidentResponder", () => ({
  searchNotifiedMail: jest.fn()
}));

jest.mock("@/utils/functions", () => ({
  getBtnStatusColor: jest.fn((val) => `color-${val}`),
  getDataTableFieldLabel: jest.fn((val) => `label-${val}`)
}));

describe("RecentlyReportedIncidents widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (propsData = {}, methodMocks = {}) => {
    return shallowMount(RecentlyReportedIncidents, {
      localVue,
      vuetify,
      propsData,
      methods: {
        ...methodMocks
      },
      stubs: [
        "WidgetLoading",
        "WidgetContainer",
        "WidgetHeader",
        "WidgetBody",
        "WidgetList",
        "badge",
        "router-link",
        "v-btn"
      ]
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    searchNotifiedMail.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: "r1", subject: "Test" }]
        }
      }
    });
  });

  describe("Component Structure", () => {
    it("has correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("RecentlyReportedIncidents");
    });

    it("has required subcomponents", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.components).toHaveProperty("Badge");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetLoading");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetContainer");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetList");
    });

    it("has correct props", () => {
      const wrapper = mountFactory({ editMode: true, hasLink: false });
      expect(wrapper.vm.editMode).toBe(true);
      expect(wrapper.vm.hasLink).toBe(false);
    });
  });

  describe("Component Title", () => {
    it("uses title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.RecentIncidents);
    });

    it("returns string title", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getTitle).toBe("string");
    });
  });

  describe("Link Property", () => {
    it("returns link when hasLink is true", () => {
      const wrapper = mountFactory({ hasLink: true });
      expect(wrapper.vm.getLink).toEqual({
        href: "/incident-responder",
        text: "All"
      });
    });

    it("returns null when hasLink is false", () => {
      const wrapper = mountFactory({ hasLink: false });
      expect(wrapper.vm.getLink).toBeNull();
    });

    it("link href points to incident-responder", () => {
      const wrapper = mountFactory({ hasLink: true });
      expect(wrapper.vm.getLink.href).toBe("/incident-responder");
    });

    it("link text is 'All'", () => {
      const wrapper = mountFactory({ hasLink: true });
      expect(wrapper.vm.getLink.text).toBe("All");
    });
  });

  describe("Data Initialization", () => {
    it("initializes with correct data structure", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true);
      expect(wrapper.vm.tableData.length).toBe(0);
    });

    it("initializes columns with correct properties", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.columns[0].property).toBeDefined();
      expect(wrapper.vm.columns[0].label).toBeDefined();
    });

    it("initializes empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBe(labels.EmptyRecentlyReportedIncidents);
    });

    it("has subject column with 60% width", () => {
      const wrapper = mountFactory();
      const subjectColumn = wrapper.vm.columns[0];
      expect(subjectColumn.thStyle.width).toBe("60%");
      expect(subjectColumn.tdStyle.width).toBe("60%");
    });

    it("has result column with center alignment", () => {
      const wrapper = mountFactory();
      const resultColumn = wrapper.vm.columns[1];
      expect(resultColumn.thStyle.textAlign).toBe("center");
      expect(resultColumn.tdStyle.textAlign).toBe("center");
    });
  });

  describe("API Integration", () => {
    it("loads data on created", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(searchNotifiedMail).toHaveBeenCalled();
    });

    it("calls searchNotifiedMail with correct payload", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      const expectedPayload = {
        pageNumber: 1,
        clusteredBy: "",
        pageSize: 5,
        orderBy: "createTime",
        ascending: false
      };

      expect(searchNotifiedMail).toHaveBeenCalledWith(expectedPayload);
    });

    it("loads data and updates tableData", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([
        { resourceId: "r1", subject: "Test" }
      ]);
    });

    it("updates loading state after data loads", async () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("API Error Handling", () => {
    it("handles API failure gracefully", async () => {
      searchNotifiedMail.mockRejectedValueOnce(new Error("API Error"));
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("keeps tableData empty on API failure", async () => {
      searchNotifiedMail.mockRejectedValueOnce(new Error("fail"));
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("clears loading state even when API fails", async () => {
      searchNotifiedMail.mockRejectedValueOnce(new Error("Network error"));
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("Single Result Handling", () => {
    it("handles single result from API", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: [{ resourceId: "id1", subject: "Subject 1" }]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(1);
      expect(wrapper.vm.tableData[0].subject).toBe("Subject 1");
    });
  });

  describe("Multiple Results Handling", () => {
    it("handles multiple results from API", async () => {
      const results = [
        { resourceId: "id1", subject: "Subject 1", status: "Phishing" },
        { resourceId: "id2", subject: "Subject 2", status: "Undetected" },
        { resourceId: "id3", subject: "Subject 3", status: "Malicious" },
        { resourceId: "id4", subject: "Subject 4", status: "Legitimate" },
        { resourceId: "id5", subject: "Subject 5", status: "Phishing" }
      ];

      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: { results }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(5);
    });

    it("maintains result order from API", async () => {
      const results = [
        { resourceId: "id1", subject: "First" },
        { resourceId: "id2", subject: "Second" },
        { resourceId: "id3", subject: "Third" }
      ];

      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: { results }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].subject).toBe("First");
      expect(wrapper.vm.tableData[1].subject).toBe("Second");
      expect(wrapper.vm.tableData[2].subject).toBe("Third");
    });
  });

  describe("Empty Results Handling", () => {
    it("handles empty results from API", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: []
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("handles undefined results in response", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {}
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("handles null results in response", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: null
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      // When results is null, it gets assigned directly due to the default parameter
      // The component sets tableData = results (which is null in this case)
      expect(wrapper.vm.tableData).toBe(null);
    });
  });

  describe("Methods", () => {
    it("has getDataTableFieldLabel method", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getDataTableFieldLabel).toBe("function");
    });

    it("has getBtnStatusColor method", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getBtnStatusColor).toBe("function");
    });

    it("callForRecentlyReportedIncidents method calls searchNotifiedMail", () => {
      const wrapper = mountFactory();
      wrapper.vm.callForRecentlyReportedIncidents();

      expect(searchNotifiedMail).toHaveBeenCalled();
    });

    it("getDataTableFieldLabel delegates to utility function", () => {
      const wrapper = mountFactory();
      const result = wrapper.vm.getDataTableFieldLabel("TestLabel");

      expect(result).toBe("label-TestLabel");
    });

    it("getBtnStatusColor delegates to utility function", () => {
      const wrapper = mountFactory();
      const result = wrapper.vm.getBtnStatusColor("TestColor");

      expect(result).toBe("color-TestColor");
    });
  });

  describe("Props Variations", () => {
    it("handles editMode true", () => {
      const wrapper = mountFactory({ editMode: true });
      expect(wrapper.vm.editMode).toBe(true);
    });

    it("handles editMode false", () => {
      const wrapper = mountFactory({ editMode: false });
      expect(wrapper.vm.editMode).toBe(false);
    });

    it("handles hasLink with default true", () => {
      const wrapper = mountFactory({});
      expect(wrapper.vm.hasLink).toBe(true);
    });

    it("handles both editMode and hasLink props together", () => {
      const wrapper = mountFactory({ editMode: true, hasLink: false });
      expect(wrapper.vm.editMode).toBe(true);
      expect(wrapper.vm.hasLink).toBe(false);
      expect(wrapper.vm.getLink).toBeNull();
    });
  });

  describe("Event Emission", () => {
    it("emits deleteWidget event", async () => {
      const wrapper = mountFactory();

      wrapper.vm.$emit("deleteWidget");
      await wrapper.vm.$nextTick();

      expect(wrapper.emitted("deleteWidget")).toBeTruthy();
    });
  });

  describe("Data Results with Various Statuses", () => {
    it("handles results with Phishing status", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              { resourceId: "id1", subject: "Phishing Email", status: "Phishing" }
            ]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].status).toBe("Phishing");
    });

    it("handles results with Undetected status", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              { resourceId: "id1", subject: "Undetected Email", status: "Undetected" }
            ]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].status).toBe("Undetected");
    });

    it("handles results with Malicious status", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              { resourceId: "id1", subject: "Malicious Email", status: "Malicious" }
            ]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].status).toBe("Malicious");
    });
  });

  describe("Data with Various Result Values", () => {
    it("handles data with resourceId property", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: [{ resourceId: "resource-123", subject: "Test" }]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].resourceId).toBe("resource-123");
    });

    it("handles data with special characters in subject", async () => {
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: [{ resourceId: "id1", subject: "Test & Special <chars>" }]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].subject).toBe("Test & Special <chars>");
    });

    it("handles data with very long subject", async () => {
      const longSubject = "A".repeat(500);
      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: {
            results: [{ resourceId: "id1", subject: longSubject }]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].subject).toBe(longSubject);
    });
  });

  describe("Multiple Calls", () => {
    it("handles calling callForRecentlyReportedIncidents twice", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(1);

      const newResults = [
        { resourceId: "id2", subject: "New Subject 1" },
        { resourceId: "id3", subject: "New Subject 2" }
      ];

      searchNotifiedMail.mockResolvedValueOnce({
        data: {
          data: { results: newResults }
        }
      });

      wrapper.vm.callForRecentlyReportedIncidents();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(2);
    });
  });

  describe("Loading State Management", () => {
    it("starts with loading true", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);
    });

    it("sets loading false after successful load", async () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("sets loading false after failed load", async () => {
      searchNotifiedMail.mockRejectedValueOnce(new Error("Failed"));
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });
  });
});
