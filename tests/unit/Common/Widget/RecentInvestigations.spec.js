import { createLocalVue, shallowMount } from "@vue/test-utils";
import RecentInvestigations from "@/components/Common/Widget/WidgetComponents/RecentInvestigations.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("RecentInvestigations widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(RecentInvestigations, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getRecentInvestigationsCard": [],
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
        "router-link",
        "v-progress-linear"
      ]
    });
  };

  it("uses title from labels", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTitle).toBe(labels.RecentInvestigations);
  });

  it("exposes table data from store getter", () => {
    const data = [{ resourceId: "r1", status: "Open" }];
    const wrapper = mountFactory({
      "widgets/getRecentInvestigationsCard": data
    });
    expect(wrapper.vm.tableData).toEqual(data);
  });

  it("defines columns and empty message", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.columns.length).toBe(2);
    expect(wrapper.vm.empty.message).toBe(
      "You do not have any recent investigations"
    );
  });
});
