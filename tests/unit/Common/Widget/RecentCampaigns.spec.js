import { createLocalVue, shallowMount } from "@vue/test-utils";
import RecentCampaigns from "@/components/Common/Widget/WidgetComponents/RecentCampaigns.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("RecentCampaigns widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(RecentCampaigns, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getRecentCampaignsCard": [],
            ...gettersOverrides
          }
        }
      },
      stubs: [
        "WidgetLoading",
        "WidgetContainer",
        "WidgetHeader",
        "WidgetBody",
        "WidgetList",
        "DataTableChart"
      ]
    });
  };

  it("uses title from labels", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTitle).toBe(labels.RecentCampaigns);
  });

  it("exposes table data from store getter", () => {
    const data = [{ name: "Campaign 1" }];
    const wrapper = mountFactory({
      "widgets/getRecentCampaignsCard": data
    });
    expect(wrapper.vm.tableData).toEqual(data);
  });

  it("returns chart options for Click-Only method", () => {
    const wrapper = mountFactory();
    const options = wrapper.vm.getChartOptionsForRow({ method: "Click-Only" });
    expect(options.labels).toEqual([labels.NoResponse, labels.Clicked, labels.Opened]);
  });

  it("returns chart options for MFA method", () => {
    const wrapper = mountFactory();
    const options = wrapper.vm.getChartOptionsForRow({ method: "MFA" });
    expect(options.labels).toContain(labels.SubmittedMFACode);
  });
});
