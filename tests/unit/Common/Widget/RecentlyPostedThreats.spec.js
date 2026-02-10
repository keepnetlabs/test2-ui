import { createLocalVue, shallowMount } from "@vue/test-utils";
import RecentlyPostedThreats from "@/components/Common/Widget/WidgetComponents/RecentlyPostedThreats.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";
import { getIncidentList } from "@/api/threatSharing";

jest.mock("@/api/threatSharing", () => ({
  getIncidentList: jest.fn()
}));

describe("RecentlyPostedThreats widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (methodMocks = {}) => {
    return shallowMount(RecentlyPostedThreats, {
      localVue,
      vuetify,
      mocks: {
        $router: { push: jest.fn() }
      },
      methods: {
        ...methodMocks
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

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    getIncidentList.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              title: "Post 1",
              communityName: "Community",
              communityResourceId: "c1",
              communityPostResourceId: "p1",
              harmfulItemCount: 5
            }
          ]
        }
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Component Structure", () => {
    it("has correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("RecentlyPostedThreats");
    });

    it("has required subcomponents", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetLoading");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetContainer");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetList");
    });
  });

  describe("Component Title", () => {
    it("uses title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.RecentlyPostedThreats);
    });

    it("returns string title", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getTitle).toBe("string");
    });
  });

  describe("Data Initialization", () => {
    it("initializes with correct data structure", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);
      expect(Array.isArray(wrapper.vm.tableData)).toBe(true);
    });

    it("initializes columns with correct properties", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
      expect(wrapper.vm.columns[0].property).toBeDefined();
    });

    it("initializes empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBeDefined();
    });

    it("has title column with 60% width", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns[0].thStyle.width).toBe("60%");
    });
  });

  describe("API Integration", () => {
    it("calls getIncidentList on created", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();
      expect(getIncidentList).toHaveBeenCalled();
    });

    it("calls API with correct payload structure", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      const callArgs = getIncidentList.mock.calls[0][0];
      expect(callArgs.pageNumber).toBe(1);
      expect(callArgs.pageSize).toBe(5);
      expect(callArgs.orderBy).toBe("PostedTime");
    });

    it("loads data on created and updates loading state", async () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.tableData.length).toBe(1);
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("handles empty results", async () => {
      getIncidentList.mockResolvedValueOnce({
        data: {
          data: { results: [] }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([]);
    });

    it("handles undefined results", async () => {
      getIncidentList.mockResolvedValueOnce({
        data: { data: {} }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([]);
    });
  });

  describe("Error Handling", () => {
    it("handles API failure by clearing loading state", async () => {
      getIncidentList.mockRejectedValueOnce(new Error("fail"));
      const wrapper = mountFactory();
      await Promise.resolve();
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("keeps tableData empty on failure", async () => {
      getIncidentList.mockRejectedValueOnce(new Error("Error"));
      const wrapper = mountFactory();
      await Promise.resolve();
      expect(wrapper.vm.tableData).toEqual([]);
    });
  });

  describe("handleTitleSelection Method", () => {
    it("navigates to community post on title selection", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handleTitleSelection(row);

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        path: "/threat-sharing/community/c1",
        query: {
          postId: "p1",
          communityName: "Community",
          communityId: "c1"
        }
      });
    });

    it("saves community name to localStorage", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "TestCommunity",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handleTitleSelection(row);

      expect(localStorage.getItem("communityName")).toBe("TestCommunity");
    });

    it("saves community resource ID to localStorage", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "resource-id-123",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handleTitleSelection(row);

      expect(localStorage.getItem("communityResourceIdForRedirect")).toBe("resource-id-123");
    });

    it("handles multiple title selections", () => {
      const wrapper = mountFactory();

      const row1 = {
        communityName: "Community1",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handleTitleSelection(row1);
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);

      const row2 = {
        communityName: "Community2",
        communityResourceId: "c2",
        communityPostResourceId: "p2"
      };

      wrapper.vm.handleTitleSelection(row2);
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(2);
    });

    it("handles post selection with special characters", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community & Partners <2025>",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handleTitleSelection(row);

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            communityName: "Community & Partners <2025>"
          })
        })
      );
    });
  });

  describe("handleCommunitySelection Method", () => {
    it("navigates to community on community selection", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "c1"
      };

      wrapper.vm.handleCommunitySelection(row);

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        path: "/threat-sharing/community/c1"
      });
    });

    it("saves community name to localStorage", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "TestCommunity",
        communityResourceId: "c1"
      };

      wrapper.vm.handleCommunitySelection(row);

      expect(localStorage.getItem("communityName")).toBe("TestCommunity");
    });

    it("saves community resource ID to localStorage", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "resource-id-456"
      };

      wrapper.vm.handleCommunitySelection(row);

      expect(localStorage.getItem("communityResourceIdForRedirect")).toBe("resource-id-456");
    });

    it("handles multiple community selections", () => {
      const wrapper = mountFactory();

      const row1 = {
        communityName: "Community1",
        communityResourceId: "c1"
      };

      wrapper.vm.handleCommunitySelection(row1);
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);

      const row2 = {
        communityName: "Community2",
        communityResourceId: "c2"
      };

      wrapper.vm.handleCommunitySelection(row2);
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(2);
    });

    it("constructs correct path without query parameters", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "TestCommunity",
        communityResourceId: "test-id-123"
      };

      wrapper.vm.handleCommunitySelection(row);

      const call = wrapper.vm.$router.push.mock.calls[0][0];
      expect(call.path).toBe("/threat-sharing/community/test-id-123");
      expect(call.query).toBeUndefined();
    });
  });

  describe("Multiple Results", () => {
    it("handles multiple threat posts", async () => {
      const results = [
        {
          title: "Threat 1",
          communityName: "Community1",
          communityResourceId: "c1",
          communityPostResourceId: "p1",
          harmfulItemCount: 3
        },
        {
          title: "Threat 2",
          communityName: "Community2",
          communityResourceId: "c2",
          communityPostResourceId: "p2",
          harmfulItemCount: 5
        },
        {
          title: "Threat 3",
          communityName: "Community3",
          communityResourceId: "c3",
          communityPostResourceId: "p3",
          harmfulItemCount: 0
        }
      ];

      getIncidentList.mockResolvedValueOnce({
        data: {
          data: { results }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(3);
    });
  });

  describe("Harmful Item Count", () => {
    it("displays harmfulItemCount in data", async () => {
      getIncidentList.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              {
                title: "Threat",
                communityName: "Community",
                communityResourceId: "c1",
                communityPostResourceId: "p1",
                harmfulItemCount: 42
              }
            ]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].harmfulItemCount).toBe(42);
    });

    it("handles zero harmful items", async () => {
      getIncidentList.mockResolvedValueOnce({
        data: {
          data: {
            results: [
              {
                title: "Threat",
                communityName: "Community",
                communityResourceId: "c1",
                communityPostResourceId: "p1",
                harmfulItemCount: 0
              }
            ]
          }
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].harmfulItemCount).toBe(0);
    });
  });

  describe("Props", () => {
    it("accepts editMode prop", () => {
      const wrapper = shallowMount(RecentlyPostedThreats, {
        localVue,
        vuetify,
        propsData: { editMode: true },
        stubs: ["WidgetLoading", "WidgetContainer", "WidgetHeader", "WidgetBody", "WidgetList"]
      });
      expect(wrapper.vm.editMode).toBe(true);
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

  describe("Loading State", () => {
    it("initializes with loading true", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);
    });

    it("sets loading false after successful load", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("sets loading false after failed load", async () => {
      getIncidentList.mockRejectedValueOnce(new Error("Error"));
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);
      await Promise.resolve();
      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("API Payload Filter Structure", () => {
    it("sends correct filter structure in payload", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      const payload = getIncidentList.mock.calls[0][0];
      expect(payload.filter).toBeDefined();
      expect(payload.filter.Condition).toBe("AND");
      expect(Array.isArray(payload.filter.FilterGroups)).toBe(true);
    });

    it("includes empty search filters", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      const payload = getIncidentList.mock.calls[0][0];
      const firstFilterGroup = payload.filter.FilterGroups[0];
      expect(Array.isArray(firstFilterGroup.FilterItems)).toBe(true);
      expect(firstFilterGroup.FilterItems.length).toBeGreaterThan(0);
    });
  });
});
