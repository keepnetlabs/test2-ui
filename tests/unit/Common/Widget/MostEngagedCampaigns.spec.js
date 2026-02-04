import { createLocalVue, shallowMount } from "@vue/test-utils";
import MostEngagedCampaigns from "@/components/Common/Widget/WidgetComponents/MostEngagedCampaigns.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("MostEngagedCampaigns widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(MostEngagedCampaigns, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getMostEngagedCampaignsCard": [],
            ...gettersOverrides
          }
        },
        $router: { push: jest.fn() }
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

  it("uses title from labels", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTitle).toBe(labels.MostEngagedCampaigns);
  });

  it("exposes table data from store getter", () => {
    const data = [{ name: "Campaign 1", phishedUsersCount: 10 }];
    const wrapper = mountFactory({
      "widgets/getMostEngagedCampaignsCard": data
    });
    expect(wrapper.vm.tableData).toEqual(data);
  });

  it("defines columns and empty message", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.columns.length).toBe(2);
    expect(wrapper.vm.empty.message).toBe(labels.EmptyMostEngagedCampaignsWidget);
  });
});
