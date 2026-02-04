import { createLocalVue, shallowMount } from "@vue/test-utils";
import PhishingReporterIrHeader from "@/components/Common/Widget/WidgetComponents/PhishingReporterIrHeader.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("PhishingReporterIrHeader widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(PhishingReporterIrHeader, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getPhishingReporterCard": null,
            "widgets/getIsLoading": false,
            ...gettersOverrides
          }
        },
        $router: { push: jest.fn() }
      },
      stubs: ["CardLoading", "router-link", "v-icon"]
    });
  };

  it("uses labels from constants", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.labels).toBe(labels);
  });

  it("returns true for empty phishing status", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.isPhishingEmpty(null)).toBe(true);
    expect(wrapper.vm.isPhishingEmpty({ onlineUsersCount: 0, offlineUsersCount: 0 })).toBe(true);
  });

  it("returns false when any count exists", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.isPhishingEmpty({ onlineUsersCount: 1, offlineUsersCount: 0 })).toBe(false);
  });
});
