import { createLocalVue, shallowMount } from "@vue/test-utils";
import Reporters from "@/components/Common/Widget/WidgetComponents/Reporters.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

jest.mock("@/utils/functions", () => ({
  getTextColor: jest.fn((val) => `color-${val}`)
}));

describe("Reporters widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(Reporters, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getReportersCard": [],
            ...gettersOverrides
          }
        }
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
    expect(wrapper.vm.getTitle).toBe(labels.Reporters);
  });

  it("exposes table data from store getter", () => {
    const data = [{ reporterEmail: "a@b.com", reliability: "high" }];
    const wrapper = mountFactory({
      "widgets/getReportersCard": data
    });
    expect(wrapper.vm.tableData).toEqual(data);
  });

  it("maps text color via utility", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTextColor("high")).toBe("color-high");
  });
});
