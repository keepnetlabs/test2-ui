import { createLocalVue, mount } from "@vue/test-utils";
import TargetUsersSummaryCards from "@/components/TargetUsers/TargetUsersSummaryCards";
import { customVuetify as vuetify } from "./utils";

describe("TargetUsersSummaryCards", () => {
  const localVue = createLocalVue();
  const items = [
    {
      key: "active",
      title: "Active Users",
      value: 120,
      tooltip: "Active users tooltip",
      color: "success",
      icon: "mdi-account-check",
      disabled: false
    },
    {
      key: "inactive",
      title: "Inactive Users",
      value: 0,
      tooltip: "Inactive users tooltip",
      color: "warning",
      icon: "mdi-account-off",
      disabled: true
    }
  ];

  it("renders the provided cards", () => {
    const wrapper = mount(TargetUsersSummaryCards, {
      localVue,
      vuetify,
      propsData: { items }
    });
    expect(wrapper.findAll(".target-users-summary-card").length).toBe(
      items.length
    );
  });

  it("emits select when a card is clicked", async () => {
    const wrapper = mount(TargetUsersSummaryCards, {
      localVue,
      vuetify,
      propsData: { items }
    });
    await wrapper.findAll(".target-users-summary-card").at(0).trigger("click");
    expect(wrapper.emitted().select[0]).toEqual(["active"]);
  });

  it("does not emit select when card is disabled", async () => {
    const wrapper = mount(TargetUsersSummaryCards, {
      localVue,
      vuetify,
      propsData: { items }
    });
    await wrapper.findAll(".target-users-summary-card").at(1).trigger("click");
    expect(wrapper.emitted().select).toBeUndefined();
  });

  it("displays card titles correctly", () => {
    const wrapper = mount(TargetUsersSummaryCards, {
      localVue,
      vuetify,
      propsData: { items }
    });
    expect(wrapper.text()).toContain("Active Users");
    expect(wrapper.text()).toContain("Inactive Users");
  });

  it("displays card values correctly", () => {
    const wrapper = mount(TargetUsersSummaryCards, {
      localVue,
      vuetify,
      propsData: { items }
    });
    expect(wrapper.text()).toContain("120");
    expect(wrapper.text()).toContain("0");
  });

  it("renders correct number of cards", () => {
    const wrapper = mount(TargetUsersSummaryCards, {
      localVue,
      vuetify,
      propsData: { items }
    });
    const cards = wrapper.findAll(".target-users-summary-card");
    expect(cards.length).toBe(2);
  });

  it("handles card with different colors", () => {
    const customItems = [
      { key: "test1", title: "Test 1", value: 50, color: "primary", disabled: false },
      { key: "test2", title: "Test 2", value: 30, color: "error", disabled: false }
    ];
    const wrapper = mount(TargetUsersSummaryCards, {
      localVue,
      vuetify,
      propsData: { items: customItems }
    });
    expect(wrapper.findAll(".target-users-summary-card").length).toBe(2);
  });
});
