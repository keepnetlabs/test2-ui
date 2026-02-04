import { createLocalVue, shallowMount } from "@vue/test-utils";
import RoiSummaryIrHeader from "@/components/Common/Widget/WidgetComponents/RoiSummaryIrHeader.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("RoiSummaryIrHeader widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(RoiSummaryIrHeader, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getROISummaryCard": { revenue: "0", time: "0" },
            "widgets/getIsLoading": false,
            ...gettersOverrides
          }
        }
      },
      stubs: ["CardLoading", "v-icon"]
    });
  };

  it("uses labels from constants", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.labels).toBe(labels);
  });

  it("returns true when ROI summary is empty", () => {
    const wrapper = mountFactory({
      "widgets/getROISummaryCard": { revenue: "0", time: "0" }
    });
    expect(wrapper.vm.isRoiSummaryEmpty()).toBe(true);
  });

  it("returns false when ROI summary has values", () => {
    const wrapper = mountFactory({
      "widgets/getROISummaryCard": { revenue: "120", time: "5" }
    });
    expect(wrapper.vm.isRoiSummaryEmpty()).toBe(false);
  });
});
