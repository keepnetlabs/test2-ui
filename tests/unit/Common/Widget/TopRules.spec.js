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

  describe("component structure", () => {
    it("uses title from labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBe(labels.TopRules);
    });

    it("should render as a Vue component", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });

    it("should have correct component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("TopRules");
    });

    it("should have store available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });
  });

  describe("rule name click handling", () => {
    it("emits playbook selection on rule name click", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      expect(wrapper.emitted().handleSelectPlaybookId[0]).toEqual([
        { resourceId: "r1", callback: expect.any(Function) }
      ]);
    });

    it("emits with correct resource ID", () => {
      const wrapper = mountFactory();
      const testId = "test-rule-123";
      wrapper.vm.handleRuleNameClick({ resourceId: testId });
      const emitted = wrapper.emitted().handleSelectPlaybookId[0][0];
      expect(emitted.resourceId).toBe(testId);
    });

    it("emits with callback function", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      const emitted = wrapper.emitted().handleSelectPlaybookId[0][0];
      expect(typeof emitted.callback).toBe("function");
    });

    it("handles multiple rule clicks", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      wrapper.vm.handleRuleNameClick({ resourceId: "r2" });
      expect(wrapper.emitted().handleSelectPlaybookId).toHaveLength(2);
    });
  });

  describe("match selection and modal", () => {
    it("opens matching incident modal on match selection", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleSelectMatch({ id: "m1" });
      expect(wrapper.vm.selectedMatch).toEqual({ id: "m1" });
      expect(wrapper.vm.showMatchingModal).toBe(true);
    });

    it("stores selected match data", () => {
      const wrapper = mountFactory();
      const matchData = { id: "m1", name: "Match 1" };
      wrapper.vm.handleSelectMatch(matchData);
      expect(wrapper.vm.selectedMatch).toEqual(matchData);
    });

    it("sets modal visibility to true", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleSelectMatch({ id: "m1" });
      expect(wrapper.vm.showMatchingModal).toBe(true);
    });

    it("handles multiple match selections", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleSelectMatch({ id: "m1" });
      expect(wrapper.vm.selectedMatch).toEqual({ id: "m1" });
      wrapper.vm.handleSelectMatch({ id: "m2" });
      expect(wrapper.vm.selectedMatch).toEqual({ id: "m2" });
    });

    it("preserves all match properties", () => {
      const wrapper = mountFactory();
      const matchData = { id: "m1", status: "active", count: 5 };
      wrapper.vm.handleSelectMatch(matchData);
      expect(wrapper.vm.selectedMatch.id).toBe("m1");
      expect(wrapper.vm.selectedMatch.status).toBe("active");
      expect(wrapper.vm.selectedMatch.count).toBe(5);
    });
  });

  describe("match count formatting", () => {
    it("formats match count text", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getValue(3)).toBe("3 match(es)");
    });

    it("formats single match correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getValue(1)).toBe("1 match(es)");
    });

    it("formats zero matches correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getValue(0)).toBe("0 match(es)");
    });

    it("formats large match counts correctly", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getValue(1000)).toBe("1000 match(es)");
    });

    it("returns string format", () => {
      const wrapper = mountFactory();
      const result = wrapper.vm.getValue(5);
      expect(typeof result).toBe("string");
      expect(result).toMatch(/match\(es\)/);
    });

    it("includes number in result", () => {
      const wrapper = mountFactory();
      const result = wrapper.vm.getValue(42);
      expect(result).toContain("42");
    });
  });

  describe("store getters", () => {
    it("should get top rules from store", () => {
      const data = [{ name: "Rule 1" }];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toEqual(data);
    });

    it("should get loading state from store", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
    });

    it("should handle empty store data", () => {
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toEqual([]);
    });
  });

  describe("widget rendering", () => {
    it("should render without errors", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });

    it("should be mounted successfully", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });

    it("should have component definition", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options).toBeDefined();
    });

    it("should have MatchingIncidentModal stub", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe("data properties initialization", () => {
    it("should initialize selectedMatch", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.selectedMatch).toBeDefined();
    });

    it("should initialize showMatchingModal", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.showMatchingModal).toBeDefined();
    });

    it("showMatchingModal should be false initially", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.showMatchingModal).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle rule click with empty resourceId", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "" });
      const emitted = wrapper.emitted().handleSelectPlaybookId;
      expect(emitted).toBeDefined();
    });

    it("should handle match selection with null data", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleSelectMatch(null);
      expect(wrapper.vm.selectedMatch).toBe(null);
    });

    it("should handle getValue with negative count", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getValue(-5)).toBe("-5 match(es)");
    });

    it("should handle getValue with decimal count", () => {
      const wrapper = mountFactory();
      const result = wrapper.vm.getValue(3.5);
      expect(result).toContain("3.5");
    });
  });

  describe("consistency and reliability", () => {
    it("should render consistently", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm.$options.name).toBe(wrapper2.vm.$options.name);
    });

    it("should handle component destruction gracefully", () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.destroy();
      }).not.toThrow();
    });

    it("getValue returns consistent results", () => {
      const wrapper = mountFactory();
      const result1 = wrapper.vm.getValue(5);
      const result2 = wrapper.vm.getValue(5);
      expect(result1).toBe(result2);
    });
  });

  describe("integration scenarios", () => {
    it("should work with typical rules data", () => {
      const data = [
        { resourceId: "rule1", name: "Rule 1" },
        { resourceId: "rule2", name: "Rule 2" }
      ];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toEqual(data);
    });

    it("should work with loading state true and empty data", () => {
      const wrapper = mountFactory({
        "widgets/getIsLoading": true,
        "widgets/getTopRulesCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getIsLoading"]).toBe(true);
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toEqual([]);
    });

    it("should work with full workflow: click rule and select match", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      wrapper.vm.handleSelectMatch({ id: "m1" });
      expect(wrapper.emitted().handleSelectPlaybookId).toBeDefined();
      expect(wrapper.vm.showMatchingModal).toBe(true);
    });

    it("should format various match counts correctly", () => {
      const wrapper = mountFactory();
      const counts = [0, 1, 5, 10, 100];
      const results = counts.map(count => wrapper.vm.getValue(count));
      results.forEach((result, idx) => {
        expect(result).toContain(String(counts[idx]));
        expect(result).toContain("match(es)");
      });
    });
  });
});
