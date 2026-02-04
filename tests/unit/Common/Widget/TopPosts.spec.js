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
    getMyTopPosts.mockResolvedValue({
      data: {
        data: [
          { communityName: "A", communityPostResourceId: "p1" },
          { communityName: "B", communityPostResourceId: "p2" },
          { communityName: "C", communityPostResourceId: "p3" },
          { communityName: "D", communityPostResourceId: "p4" },
          { communityName: "E", communityPostResourceId: "p5" },
          { communityName: "F", communityPostResourceId: "p6" }
        ]
      }
    });
  });

  it("loads top posts and limits to 5 items", async () => {
    const wrapper = mountFactory();
    await Promise.resolve();

    expect(getMyTopPosts).toHaveBeenCalled();
    expect(wrapper.vm.tableData.length).toBe(5);
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("handles API failure by clearing loading state", async () => {
    getMyTopPosts.mockRejectedValueOnce(new Error("fail"));
    const wrapper = mountFactory();

    await Promise.resolve();

    expect(wrapper.vm.isLoading).toBe(false);
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
});
