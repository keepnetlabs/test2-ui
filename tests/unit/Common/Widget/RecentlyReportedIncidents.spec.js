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
    searchNotifiedMail.mockResolvedValue({
      data: {
        data: {
          results: [{ resourceId: "r1", subject: "Test" }]
        }
      }
    });
  });

  it("uses title from labels", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTitle).toBe(labels.RecentIncidents);
  });

  it("returns link only when hasLink is true", () => {
    const wrapper = mountFactory({ hasLink: true });
    expect(wrapper.vm.getLink).toEqual({
      href: "/incident-responder",
      text: "All"
    });
    const noLinkWrapper = mountFactory({ hasLink: false });
    expect(noLinkWrapper.vm.getLink).toBeNull();
  });

  it("loads data on created and updates loading state", async () => {
    const wrapper = mountFactory();
    await Promise.resolve();

    expect(searchNotifiedMail).toHaveBeenCalled();
    expect(wrapper.vm.tableData).toEqual([
      { resourceId: "r1", subject: "Test" }
    ]);
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("handles API failure by clearing loading state", async () => {
    searchNotifiedMail.mockRejectedValueOnce(new Error("fail"));
    const wrapper = mountFactory();
    await Promise.resolve();
    expect(wrapper.vm.isLoading).toBe(false);
  });
});
