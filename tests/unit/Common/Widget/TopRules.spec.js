import { createLocalVue, shallowMount } from "@vue/test-utils";
import TopRules from "@/components/Common/Widget/WidgetComponents/TopRules.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("TopRules widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(TopRules, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getTopRulesCard": [],
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
        "MatchingIncidentModal"
      ]
    });
  };

  it("uses title from labels", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getTitle).toBe(labels.TopRules);
  });

  it("emits playbook selection on rule name click", () => {
    const wrapper = mountFactory();
    wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
    expect(wrapper.emitted().handleSelectPlaybookId[0]).toEqual([
      { resourceId: "r1", callback: expect.any(Function) }
    ]);
  });

  it("opens matching incident modal on match selection", () => {
    const wrapper = mountFactory();
    wrapper.vm.handleSelectMatch({ id: "m1" });
    expect(wrapper.vm.selectedMatch).toEqual({ id: "m1" });
    expect(wrapper.vm.showMatchingModal).toBe(true);
  });

  it("formats match count text", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getValue(3)).toBe("3 match(es)");
  });
});
