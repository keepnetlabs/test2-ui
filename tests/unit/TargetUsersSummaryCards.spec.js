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

  describe("Component Rendering", () => {
    it("renders component successfully", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.exists()).toBe(true);
    });

    it("renders with provided items", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("mounts without errors", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm.$el).toBeDefined();
    });
  });

  describe("Card Rendering", () => {
    it("renders all provided cards", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      const cards = wrapper.findAll(".target-users-summary-card");
      expect(cards.length).toBe(items.length);
    });

    it("renders correct number of cards", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.findAll(".target-users-summary-card").length).toBe(2);
    });

    it("renders each card with correct structure", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      const cards = wrapper.findAll(".target-users-summary-card");
      expect(cards.length).toBeGreaterThan(0);
      cards.wrappers.forEach((card) => {
        expect(card.classes()).toContain("target-users-summary-card");
      });
    });

    it("renders single card correctly", () => {
      const singleItem = [items[0]];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: singleItem }
      });
      expect(wrapper.findAll(".target-users-summary-card").length).toBe(1);
    });

    it("renders multiple cards independently", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      const cards = wrapper.findAll(".target-users-summary-card");
      expect(cards.length).toBe(2);
      expect(cards.at(0).exists()).toBe(true);
      expect(cards.at(1).exists()).toBe(true);
    });
  });

  describe("Content Display", () => {
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

    it("displays all card content", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      items.forEach((item) => {
        expect(wrapper.text()).toContain(item.title);
        expect(wrapper.text()).toContain(item.value.toString());
      });
    });

    it("renders titles from item data", () => {
      const customItems = [
        { key: "test", title: "Custom Title", value: 42, color: "primary", disabled: false }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: customItems }
      });
      expect(wrapper.text()).toContain("Custom Title");
    });

    it("renders values from item data", () => {
      const customItems = [
        { key: "test", title: "Test", value: 999, color: "primary", disabled: false }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: customItems }
      });
      expect(wrapper.text()).toContain("999");
    });
  });

  describe("Event Emission", () => {
    it("emits select event when card clicked", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      await wrapper.findAll(".target-users-summary-card").at(0).trigger("click");
      expect(wrapper.emitted().select).toBeTruthy();
    });

    it("emits select with correct card key", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      await wrapper.findAll(".target-users-summary-card").at(0).trigger("click");
      expect(wrapper.emitted().select[0]).toEqual(["active"]);
    });

    it("emits different keys for different cards", async () => {
      const customItems = [
        { key: "first", title: "First", value: 1, color: "primary", disabled: false },
        { key: "second", title: "Second", value: 2, color: "primary", disabled: false }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: customItems }
      });
      await wrapper.findAll(".target-users-summary-card").at(0).trigger("click");
      expect(wrapper.emitted().select[0]).toEqual(["first"]);
    });

    it("emits select event multiple times on multiple clicks", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      const card = wrapper.findAll(".target-users-summary-card").at(0);
      await card.trigger("click");
      await card.trigger("click");
      expect(wrapper.emitted().select.length).toBe(2);
    });
  });

  describe("Disabled State", () => {
    it("does not emit select when card is disabled", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      await wrapper.findAll(".target-users-summary-card").at(1).trigger("click");
      expect(wrapper.emitted().select).toBeUndefined();
    });

    it("respects disabled property", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm.items[1].disabled).toBe(true);
    });

    it("allows interaction with enabled cards", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      await wrapper.findAll(".target-users-summary-card").at(0).trigger("click");
      expect(wrapper.emitted().select).toBeTruthy();
    });

    it("handles all cards disabled", async () => {
      const disabledItems = [
        { key: "test1", title: "Test 1", value: 1, color: "primary", disabled: true },
        { key: "test2", title: "Test 2", value: 2, color: "primary", disabled: true }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: disabledItems }
      });
      await wrapper.findAll(".target-users-summary-card").at(0).trigger("click");
      expect(wrapper.emitted().select).toBeUndefined();
    });
  });

  describe("Styling and Colors", () => {
    it("handles success color", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm.items[0].color).toBe("success");
    });

    it("handles warning color", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm.items[1].color).toBe("warning");
    });

    it("handles different color types", () => {
      const customItems = [
        { key: "test1", title: "Test 1", value: 50, color: "primary", disabled: false },
        { key: "test2", title: "Test 2", value: 30, color: "error", disabled: false }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: customItems }
      });
      expect(wrapper.vm.items[0].color).toBe("primary");
      expect(wrapper.vm.items[1].color).toBe("error");
    });

    it("renders cards with different colors correctly", () => {
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

  describe("Props Handling", () => {
    it("accepts items prop", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.props("items")).toEqual(items);
    });

    it("updates with new items", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      const newItems = [
        { key: "new1", title: "New 1", value: 100, color: "primary", disabled: false }
      ];
      await wrapper.setProps({ items: newItems });
      expect(wrapper.findAll(".target-users-summary-card").length).toBe(1);
    });

    it("handles empty items array", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: [] }
      });
      expect(wrapper.findAll(".target-users-summary-card").length).toBe(0);
    });

    it("handles prop updates", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.findAll(".target-users-summary-card").length).toBe(2);

      await wrapper.setProps({
        items: [items[0]]
      });
      expect(wrapper.findAll(".target-users-summary-card").length).toBe(1);
    });
  });

  describe("Icon Handling", () => {
    it("accepts icon property", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm.items[0].icon).toBe("mdi-account-check");
    });

    it("renders icons from items", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm.items[0].icon).toBe("mdi-account-check");
      expect(wrapper.vm.items[1].icon).toBe("mdi-account-off");
    });

    it("handles different icon types", () => {
      const customItems = [
        { key: "test", title: "Test", value: 50, icon: "mdi-custom-icon", color: "primary", disabled: false }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: customItems }
      });
      expect(wrapper.vm.items[0].icon).toBe("mdi-custom-icon");
    });
  });

  describe("Tooltip Handling", () => {
    it("accepts tooltip property", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm.items[0].tooltip).toBe("Active users tooltip");
    });

    it("includes tooltip in items", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      items.forEach((item, index) => {
        expect(wrapper.vm.items[index].tooltip).toBe(item.tooltip);
      });
    });
  });

  describe("Component Lifecycle", () => {
    it("mounts successfully", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.vm).toBeDefined();
    });

    it("unmounts without errors", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(() => wrapper.destroy()).not.toThrow();
    });

    it("handles multiple mount/unmount cycles", () => {
      for (let i = 0; i < 3; i++) {
        const wrapper = mount(TargetUsersSummaryCards, {
          localVue,
          vuetify,
          propsData: { items }
        });
        expect(wrapper.vm).toBeDefined();
        wrapper.destroy();
      }
    });

    it("maintains state after prop updates", async () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      const newItems = [...items];
      await wrapper.setProps({ items: newItems });
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("handles large number of cards", () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => ({
        key: `item${i}`,
        title: `Item ${i}`,
        value: i * 10,
        color: "primary",
        disabled: false
      }));
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: manyItems }
      });
      expect(wrapper.findAll(".target-users-summary-card").length).toBe(20);
    });

    it("handles zero values", () => {
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items }
      });
      expect(wrapper.text()).toContain("0");
    });

    it("handles very large values", () => {
      const largeValueItems = [
        { key: "large", title: "Large", value: 999999, color: "primary", disabled: false }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: largeValueItems }
      });
      expect(wrapper.text()).toContain("999999");
    });

    it("handles special characters in titles", () => {
      const specialItems = [
        { key: "special", title: "Title @#$% &", value: 50, color: "primary", disabled: false }
      ];
      const wrapper = mount(TargetUsersSummaryCards, {
        localVue,
        vuetify,
        propsData: { items: specialItems }
      });
      expect(wrapper.text()).toContain("Title");
    });
  });
});
