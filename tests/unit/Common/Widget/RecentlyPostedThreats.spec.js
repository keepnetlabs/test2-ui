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
    getIncidentList.mockResolvedValue({
      data: {
        data: {
          results: [
            {
              title: "Post 1",
              communityName: "Community",
              communityResourceId: "c1",
              communityPostResourceId: "p1"
            }
          ]
        }
      }
    });
  });

  it("uses title from labels", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTitle).toBe(labels.RecentlyPostedThreats);
  });

  it("loads data on created and updates loading state", async () => {
    const wrapper = mountFactory();
    await Promise.resolve();

    expect(getIncidentList).toHaveBeenCalled();
    expect(wrapper.vm.tableData.length).toBe(1);
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("handles API failure by clearing loading state", async () => {
    getIncidentList.mockRejectedValueOnce(new Error("fail"));
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
});
