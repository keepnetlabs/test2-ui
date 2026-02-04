import { createLocalVue, shallowMount } from "@vue/test-utils";
import PhishingCampaignTrends from "@/components/Common/Widget/WidgetComponents/PhishingCampaignTrends.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("PhishingCampaignTrends widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(PhishingCampaignTrends, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getPhishingCampaignTrendsCard": [],
            ...gettersOverrides
          }
        }
      },
      stubs: [
        "WidgetLoading",
        "WidgetContainer",
        "WidgetHeader",
        "WidgetBody",
        "line-chart"
      ]
    });
  };

  it("uses title from labels", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTitle).toBe(labels.PhishingCampaignTrends);
  });

  it("builds chart data from trends", () => {
    const data = [
      {
        date: "2025-01",
        attachmentOpenedCount: 1,
        clickedCount: 2,
        submittedCount: 3
      }
    ];
    const wrapper = mountFactory({
      "widgets/getPhishingCampaignTrendsCard": data
    });

    wrapper.vm.updatePhishingCampaignTrends(data);

    expect(wrapper.vm.chartData.datasets.length).toBe(3);
    expect(wrapper.vm.chartData.datasets[0].data.length).toBe(1);
  });

  it("keeps chart data empty when no results", () => {
    const wrapper = mountFactory({
      "widgets/getPhishingCampaignTrendsCard": []
    });

    wrapper.vm.updatePhishingCampaignTrends([]);

    expect(wrapper.vm.chartData).toEqual({});
  });
});
