import { createLocalVue, shallowMount } from "@vue/test-utils";
import ReportedEmailTrends from "@/components/Common/Widget/WidgetComponents/ReportedEmailTrends.vue";
import { customVuetify as vuetify } from "../../utils";

jest.mock("@/utils/functions", () => ({
  getDataTableFieldLabel: jest.fn((val) => `label-${val}`)
}));

describe("ReportedEmailTrends widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}, propsData = {}) => {
    return shallowMount(ReportedEmailTrends, {
      localVue,
      vuetify,
      propsData,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getReportedEmailTrendsCard": [],
            ...gettersOverrides
          }
        }
      },
      stubs: ["WidgetLoading", "WidgetContainer", "WidgetHeader", "WidgetBody", "line-chart"]
    });
  };

  it("returns link only when hasLink is true", () => {
    const wrapper = mountFactory({}, { hasLink: true });
    expect(wrapper.vm.getLink).toEqual({
      href: "/incident-responder",
      text: "Incident Responder"
    });

    const noLinkWrapper = mountFactory({}, { hasLink: false });
    expect(noLinkWrapper.vm.getLink).toBeNull();
  });

  it("builds chart data from reported email trends", () => {
    const data = [
      { month: "2025-01", result: "Phishing", emailCount: 10 },
      { month: "2025-02", result: "Undetected", emailCount: 5 }
    ];
    const wrapper = mountFactory({
      "widgets/getReportedEmailTrendsCard": data
    });

    wrapper.vm.updateReportedEmailTrends(data);

    expect(wrapper.vm.chartData.datasets.length).toBe(2);
    expect(wrapper.vm.chartData.datasets[0].label).toContain("label-");
  });

  it("keeps chart data empty when no results", () => {
    const wrapper = mountFactory({
      "widgets/getReportedEmailTrendsCard": []
    });

    wrapper.vm.updateReportedEmailTrends([]);

    expect(wrapper.vm.chartData).toEqual({});
  });
});
