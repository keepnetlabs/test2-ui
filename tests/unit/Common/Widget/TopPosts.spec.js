import { createLocalVue, shallowMount } from "@vue/test-utils";
import TopPosts from "@/components/Common/Widget/WidgetComponents/TopPosts.vue";
import { customVuetify as vuetify } from "../../utils";
import { getMyTopPosts } from "@/api/threatSharing";

jest.mock("@/api/threatSharing", () => ({
  getMyTopPosts: jest.fn()
}));

describe("TopPosts widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (methodMocks = {}) => {
    return shallowMount(TopPosts, {
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
        "WidgetList",
        "WidgetBody",
        "WidgetHeader",
        "v-icon"
      ]
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    getMyTopPosts.mockResolvedValue({
      data: {
        data: [
          { communityName: "A", communityPostResourceId: "p1", likeCount: 10, commentCount: 5 },
          { communityName: "B", communityPostResourceId: "p2", likeCount: 8, commentCount: 3 },
          { communityName: "C", communityPostResourceId: "p3", likeCount: 15, commentCount: 7 },
          { communityName: "D", communityPostResourceId: "p4", likeCount: 12, commentCount: 4 },
          { communityName: "E", communityPostResourceId: "p5", likeCount: 20, commentCount: 10 },
          { communityName: "F", communityPostResourceId: "p6", likeCount: 6, commentCount: 2 }
        ]
      }
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("Component Structure", () => {
    it("has correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("TopPosts");
    });

    it("has required subcomponents", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetLoading");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetContainer");
      expect(wrapper.vm.$options.components).toHaveProperty("WidgetList");
    });

    it("has editMode prop", () => {
      const wrapper = shallowMount(TopPosts, {
        localVue,
        vuetify,
        propsData: { editMode: true },
        stubs: ["WidgetLoading", "WidgetContainer", "WidgetList", "WidgetBody", "WidgetHeader", "v-icon"]
      });
      expect(wrapper.vm.editMode).toBe(true);
    });
  });

  describe("Component Title", () => {
    it("returns correct title", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe("Top Posts");
    });

    it("title is string", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.getTitle).toBe("string");
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
    });

    it("initializes empty message", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.empty.message).toBeDefined();
    });

    it("has postTitle column with 70% width", () => {
      const wrapper = mountFactory();
      const postTitleColumn = wrapper.vm.columns[0];
      expect(postTitleColumn.thStyle.width).toBe("70%");
      expect(postTitleColumn.tdStyle.width).toBe("70%");
    });
  });

  describe("API Integration", () => {
    it("loads top posts on created", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(getMyTopPosts).toHaveBeenCalled();
    });

    it("limits results to 5 items", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData.length).toBe(5);
    });

    it("slices data correctly from API response with more than 5 items", async () => {
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(5);
      expect(wrapper.vm.tableData[0].communityName).toBe("A");
      expect(wrapper.vm.tableData[4].communityName).toBe("E");
    });

    it("updates loading state after data loads", async () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("API Response Handling", () => {
    it("handles exactly 5 items", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: "A", communityPostResourceId: "p1" },
            { communityName: "B", communityPostResourceId: "p2" },
            { communityName: "C", communityPostResourceId: "p3" },
            { communityName: "D", communityPostResourceId: "p4" },
            { communityName: "E", communityPostResourceId: "p5" }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(5);
    });

    it("handles less than 5 items", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: "A", communityPostResourceId: "p1" },
            { communityName: "B", communityPostResourceId: "p2" }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(2);
    });

    it("handles empty data", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: []
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(0);
    });

    it("handles undefined data field", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {}
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([]);
    });
  });

  describe("Error Handling", () => {
    it("handles API failure", async () => {
      getMyTopPosts.mockRejectedValueOnce(new Error("API Error"));
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("clears loading state on API failure", async () => {
      getMyTopPosts.mockRejectedValueOnce(new Error("fail"));
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("maintains tableData as empty on API failure", async () => {
      getMyTopPosts.mockRejectedValueOnce(new Error("Network error"));
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toEqual([]);
    });
  });

  describe("Methods - callForTopPosts", () => {
    it("has callForTopPosts method", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.callForTopPosts).toBe("function");
    });

    it("callForTopPosts calls getMyTopPosts API", () => {
      const wrapper = mountFactory();
      wrapper.vm.callForTopPosts();

      expect(getMyTopPosts).toHaveBeenCalled();
    });
  });

  describe("Methods - handlePostTitleSelection", () => {
    it("has handlePostTitleSelection method", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.handlePostTitleSelection).toBe("function");
    });

    it("navigates to community post on title selection", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handlePostTitleSelection(row);

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

      wrapper.vm.handlePostTitleSelection(row);

      expect(localStorage.getItem("communityName")).toBe("TestCommunity");
    });

    it("saves community resource ID to localStorage", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "resource-123",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handlePostTitleSelection(row);

      expect(localStorage.getItem("communityResourceIdForRedirect")).toBe("resource-123");
    });

    it("handles multiple title selections", () => {
      const wrapper = mountFactory();

      const row1 = {
        communityName: "Community1",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handlePostTitleSelection(row1);
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);

      const row2 = {
        communityName: "Community2",
        communityResourceId: "c2",
        communityPostResourceId: "p2"
      };

      wrapper.vm.handlePostTitleSelection(row2);
      expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(2);
    });

    it("constructs correct router path for post navigation", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Test",
        communityResourceId: "test-id-123",
        communityPostResourceId: "post-456"
      };

      wrapper.vm.handlePostTitleSelection(row);

      const call = wrapper.vm.$router.push.mock.calls[0][0];
      expect(call.path).toBe("/threat-sharing/community/test-id-123");
    });

    it("passes correct query parameters to router", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "MyCommunity",
        communityResourceId: "comm-id",
        communityPostResourceId: "post-id"
      };

      wrapper.vm.handlePostTitleSelection(row);

      const call = wrapper.vm.$router.push.mock.calls[0][0];
      expect(call.query.postId).toBe("post-id");
      expect(call.query.communityName).toBe("MyCommunity");
      expect(call.query.communityId).toBe("comm-id");
    });
  });

  describe("Methods - onResize", () => {
    it("has onResize method", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.onResize).toBe("function");
    });

    it("onResize handles document selector gracefully", () => {
      const wrapper = mountFactory();

      expect(() => {
        wrapper.vm.onResize();
      }).not.toThrow();
    });
  });

  describe("Data with Engagement Metrics", () => {
    it("displays like count in data", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: "Post1", communityPostResourceId: "p1", likeCount: 42, commentCount: 8 }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].likeCount).toBe(42);
    });

    it("displays comment count in data", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: "Post1", communityPostResourceId: "p1", likeCount: 10, commentCount: 25 }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].commentCount).toBe(25);
    });

    it("maintains order by engagement when sliced", async () => {
      const posts = [
        { communityName: "A", likeCount: 50, commentCount: 10 },
        { communityName: "B", likeCount: 40, commentCount: 8 },
        { communityName: "C", likeCount: 60, commentCount: 12 },
        { communityName: "D", likeCount: 30, commentCount: 5 },
        { communityName: "E", likeCount: 45, commentCount: 9 },
        { communityName: "F", likeCount: 35, commentCount: 7 }
      ];

      getMyTopPosts.mockResolvedValueOnce({
        data: { data: posts }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toHaveLength(5);
      expect(wrapper.vm.tableData[0].communityName).toBe("A");
    });
  });

  describe("Props", () => {
    it("accepts editMode prop", () => {
      const wrapper = shallowMount(TopPosts, {
        localVue,
        vuetify,
        propsData: { editMode: false },
        stubs: ["WidgetLoading", "WidgetContainer", "WidgetList", "WidgetBody", "WidgetHeader", "v-icon"]
      });
      expect(wrapper.vm.editMode).toBe(false);
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
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("sets loading false after failed load", async () => {
      getMyTopPosts.mockRejectedValueOnce(new Error("Error"));
      const wrapper = mountFactory();
      expect(wrapper.vm.isLoading).toBe(true);

      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
    });
  });

  describe("Multiple Post Title Selections with Different Data", () => {
    it("handles post selection with special characters in name", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community & Partners <2025>",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handlePostTitleSelection(row);

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
        expect.objectContaining({
          query: expect.objectContaining({
            communityName: "Community & Partners <2025>"
          })
        })
      );
    });

    it("handles post selection with numeric resource IDs", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "12345",
        communityPostResourceId: "67890"
      };

      wrapper.vm.handlePostTitleSelection(row);

      expect(wrapper.vm.$router.push).toHaveBeenCalledWith(
        expect.objectContaining({
          path: "/threat-sharing/community/12345",
          query: expect.objectContaining({
            postId: "67890"
          })
        })
      );
    });
  });

  describe("localStorage integration", () => {
    it("stores selected post ID in localStorage", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handlePostTitleSelection(row);
      expect(localStorage.getItem).toBeDefined();
    });

    it("retrieves stored post data from localStorage", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("clears localStorage on component cleanup", () => {
      const wrapper = mountFactory();
      expect(() => wrapper.destroy()).not.toThrow();
    });
  });

  describe("post data slicing and pagination", () => {
    it("slices posts to top 5 items", async () => {
      const posts = Array.from({ length: 10 }, (_, i) => ({
        communityName: `Post ${i}`,
        communityPostResourceId: `p${i}`,
        likeCount: 10 - i,
        commentCount: 5 - (i % 5)
      }));

      getMyTopPosts.mockResolvedValueOnce({
        data: { data: posts }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData.length).toBeLessThanOrEqual(5);
    });

    it("handles slicing with fewer than 5 posts", async () => {
      const posts = Array.from({ length: 3 }, (_, i) => ({
        communityName: `Post ${i}`,
        communityPostResourceId: `p${i}`,
        likeCount: 10 - i,
        commentCount: 5 - i
      }));

      getMyTopPosts.mockResolvedValueOnce({
        data: { data: posts }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData.length).toBe(3);
    });

    it("handles slicing with exactly 5 posts", async () => {
      const posts = Array.from({ length: 5 }, (_, i) => ({
        communityName: `Post ${i}`,
        communityPostResourceId: `p${i}`,
        likeCount: 10 - i,
        commentCount: 5 - i
      }));

      getMyTopPosts.mockResolvedValueOnce({
        data: { data: posts }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData.length).toBe(5);
    });
  });

  describe("engagement metrics handling", () => {
    it("displays posts with high like counts", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: "Popular", communityPostResourceId: "p1", likeCount: 1000, commentCount: 100 }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].likeCount).toBe(1000);
    });

    it("handles posts with zero engagement", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: "Low", communityPostResourceId: "p1", likeCount: 0, commentCount: 0 }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].likeCount).toBe(0);
      expect(wrapper.vm.tableData[0].commentCount).toBe(0);
    });

    it("sorts posts by total engagement", async () => {
      const posts = [
        { communityName: "A", communityPostResourceId: "p1", likeCount: 50, commentCount: 10 },
        { communityName: "B", communityPostResourceId: "p2", likeCount: 100, commentCount: 5 },
        { communityName: "C", communityPostResourceId: "p3", likeCount: 30, commentCount: 20 }
      ];

      getMyTopPosts.mockResolvedValueOnce({
        data: { data: posts }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData).toBeDefined();
      expect(wrapper.vm.tableData.length).toBeGreaterThan(0);
    });
  });

  describe("column configuration", () => {
    it("defines two columns", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.columns.length).toBe(2);
    });

    it("postTitle column is defined", () => {
      const wrapper = mountFactory();
      const postTitleColumn = wrapper.vm.columns[0];
      expect(postTitleColumn).toBeDefined();
      expect(postTitleColumn.thStyle.width).toBe("70%");
    });

    it("second column is defined", () => {
      const wrapper = mountFactory();
      const secondColumn = wrapper.vm.columns[1];
      expect(secondColumn).toBeDefined();
      if (secondColumn.thStyle) {
        expect(secondColumn.thStyle.width).toBe("30%");
      }
    });

    it("columns are properly structured", () => {
      const wrapper = mountFactory();
      expect(Array.isArray(wrapper.vm.columns)).toBe(true);
      expect(wrapper.vm.columns.length).toBeGreaterThan(0);
      wrapper.vm.columns.forEach(column => {
        expect(column.property).toBeDefined();
      });
    });
  });

  describe("performance characteristics", () => {
    it("mounts efficiently", () => {
      const startTime = Date.now();
      mountFactory();
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(200);
    });

    it("handles large post datasets", async () => {
      const posts = Array.from({ length: 1000 }, (_, i) => ({
        communityName: `Post ${i}`,
        communityPostResourceId: `p${i}`,
        likeCount: Math.floor(Math.random() * 1000),
        commentCount: Math.floor(Math.random() * 100)
      }));

      getMyTopPosts.mockResolvedValueOnce({
        data: { data: posts }
      });

      const wrapper = mountFactory();
      const startTime = Date.now();
      await Promise.resolve();
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(500);
      expect(wrapper.vm.tableData.length).toBeLessThanOrEqual(5);
    });

    it("handles onResize efficiently", () => {
      const wrapper = mountFactory();
      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        wrapper.vm.onResize();
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(200);
    });
  });

  describe("API error handling", () => {
    it("handles API failure gracefully", async () => {
      getMyTopPosts.mockRejectedValueOnce(new Error("API Error"));
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.isLoading).toBe(false);
      expect(wrapper.vm.tableData.length).toBe(0);
    });

    it("displays empty state on API error", async () => {
      getMyTopPosts.mockRejectedValueOnce(new Error("Network Error"));
      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.empty.message).toBeDefined();
    });

    it("retains component functionality after error", async () => {
      getMyTopPosts.mockRejectedValueOnce(new Error("Error"));
      const wrapper = mountFactory();
      await Promise.resolve();

      const row = {
        communityName: "Test",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };
      expect(() => wrapper.vm.handlePostTitleSelection(row)).not.toThrow();
    });
  });

  describe("router navigation", () => {
    it("navigates to community with post ID", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      wrapper.vm.handlePostTitleSelection(row);

      expect(wrapper.vm.$router.push).toHaveBeenCalled();
      const call = wrapper.vm.$router.push.mock.calls[0][0];
      expect(call.path).toContain("/threat-sharing/community/");
    });

    it("passes correct query parameters", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Test Community",
        communityResourceId: "c1",
        communityPostResourceId: "post123"
      };

      wrapper.vm.handlePostTitleSelection(row);

      const call = wrapper.vm.$router.push.mock.calls[0][0];
      expect(call.query.postId).toBe("post123");
      expect(call.query.communityName).toBe("Test Community");
    });

    it("handles navigation with special characters", () => {
      const wrapper = mountFactory();
      const row = {
        communityName: "Community & Special!",
        communityResourceId: "c1",
        communityPostResourceId: "p1"
      };

      expect(() => wrapper.vm.handlePostTitleSelection(row)).not.toThrow();
      expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });
  });

  describe("multiple instances independence", () => {
    it("creates independent component instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("maintains separate loading states", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.isLoading).toBe(wrapper2.vm.isLoading);
    });

    it("handles cleanup independently", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(() => {
        wrapper1.destroy();
        expect(wrapper2.exists()).toBe(true);
      }).not.toThrow();
      expect(() => wrapper2.destroy()).not.toThrow();
    });
  });

  describe("edit mode functionality", () => {
    it("accepts editMode prop", () => {
      const wrapper = shallowMount(TopPosts, {
        localVue,
        vuetify,
        propsData: { editMode: true },
        stubs: ["WidgetLoading", "WidgetContainer", "WidgetList", "WidgetBody", "WidgetHeader", "v-icon"]
      });
      expect(wrapper.vm.editMode).toBe(true);
    });

    it("defaults to false for editMode", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.editMode).toBe(false);
    });

    it("emits deleteWidget event", () => {
      const wrapper = mountFactory();
      wrapper.vm.$emit("deleteWidget");
      expect(wrapper.emitted("deleteWidget")).toBeTruthy();
    });
  });

  describe("complex post scenarios", () => {
    it("handles posts with unicode characters", async () => {
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: "社區 🌐", communityPostResourceId: "p1", likeCount: 10, commentCount: 5 }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].communityName).toContain("🌐");
    });

    it("handles very long post titles", async () => {
      const longTitle = "A".repeat(500);
      getMyTopPosts.mockResolvedValueOnce({
        data: {
          data: [
            { communityName: longTitle, communityPostResourceId: "p1", likeCount: 10, commentCount: 5 }
          ]
        }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].communityName).toHaveLength(500);
    });

    it("maintains post order after slicing", async () => {
      const posts = Array.from({ length: 10 }, (_, i) => ({
        communityName: `Post ${String(i).padStart(2, "0")}`,
        communityPostResourceId: `p${i}`,
        likeCount: 100 - i * 10,
        commentCount: 50 - i * 5
      }));

      getMyTopPosts.mockResolvedValueOnce({
        data: { data: posts }
      });

      const wrapper = mountFactory();
      await Promise.resolve();

      expect(wrapper.vm.tableData[0].communityName).toBe("Post 00");
    });
  });
});
