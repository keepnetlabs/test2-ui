import { createLocalVue, shallowMount } from "@vue/test-utils";
import MostPhishedUsers from "@/components/Common/Widget/WidgetComponents/MostPhishedUsers.vue";
import { customVuetify as vuetify } from "../../utils";
import labels from "@/model/constants/labels";

describe("MostPhishedUsers widget", () => {
  const localVue = createLocalVue();

  const mountFactory = (gettersOverrides = {}) => {
    return shallowMount(MostPhishedUsers, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          getters: {
            "widgets/getIsLoading": false,
            "widgets/getMostPhishedUsersCard": [
              { email: "a@example.com", count: 3 }
            ],
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
    expect(wrapper.vm.getTitle).toBe(labels.MostPhishedUsers);
  });

  it("exposes table data from store getter", () => {
    const data = [{ email: "test@example.com", count: 5 }];
    const wrapper = mountFactory({
      "widgets/getMostPhishedUsersCard": data
    });
    expect(wrapper.vm.tableData).toEqual(data);
  });

  it("defines columns and empty message", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.columns.length).toBe(2);
    expect(wrapper.vm.empty.message).toBe(labels.EmptyMostPhishedUsersWidget);
  });
});
