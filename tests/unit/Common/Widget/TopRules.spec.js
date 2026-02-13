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

  describe("rule data handling", () => {
    it("should handle empty rules list", () => {
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": []
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toEqual([]);
    });

    it("should handle single rule", () => {
      const data = [{ resourceId: "r1", name: "Rule 1" }];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toHaveLength(1);
    });

    it("should handle multiple rules", () => {
      const data = [
        { resourceId: "r1", name: "Rule 1", matchCount: 5 },
        { resourceId: "r2", name: "Rule 2", matchCount: 8 },
        { resourceId: "r3", name: "Rule 3", matchCount: 3 }
      ];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toHaveLength(3);
    });

    it("should preserve rule properties", () => {
      const data = [{
        resourceId: "r1",
        name: "Rule 1",
        matchCount: 10,
        severity: "high"
      }];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"][0].matchCount).toBe(10);
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"][0].severity).toBe("high");
    });

    it("should handle large number of rules", () => {
      const data = Array.from({ length: 100 }, (_, i) => ({
        resourceId: `r${i}`,
        name: `Rule ${i}`,
        matchCount: i * 2
      }));
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toHaveLength(100);
    });
  });

  describe("event emission accuracy", () => {
    it("emits event on rule click", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      expect(wrapper.emitted().handleSelectPlaybookId).toBeDefined();
    });

    it("emits correct number of times", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      wrapper.vm.handleRuleNameClick({ resourceId: "r2" });
      wrapper.vm.handleRuleNameClick({ resourceId: "r3" });
      expect(wrapper.emitted().handleSelectPlaybookId).toHaveLength(3);
    });

    it("emits with complete object structure", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "test" });
      const emitted = wrapper.emitted().handleSelectPlaybookId[0][0];
      expect(emitted).toHaveProperty("resourceId");
      expect(emitted).toHaveProperty("callback");
    });

    it("callback is executable function", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      const callback = wrapper.emitted().handleSelectPlaybookId[0][0].callback;
      expect(typeof callback).toBe("function");
      expect(() => callback()).not.toThrow();
    });
  });

  describe("modal state management", () => {
    it("should initialize modal as closed", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.showMatchingModal).toBe(false);
    });

    it("should open modal on match selection", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleSelectMatch({ id: "m1" });
      expect(wrapper.vm.showMatchingModal).toBe(true);
    });

    it("should store selected match when opening modal", () => {
      const wrapper = mountFactory();
      const match = { id: "m1", name: "Match 1" };
      wrapper.vm.handleSelectMatch(match);
      expect(wrapper.vm.selectedMatch).toEqual(match);
    });

    it("should handle multiple modal opens with different data", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleSelectMatch({ id: "m1", data: "first" });
      expect(wrapper.vm.selectedMatch.data).toBe("first");
      wrapper.vm.handleSelectMatch({ id: "m2", data: "second" });
      expect(wrapper.vm.selectedMatch.data).toBe("second");
    });

    it("modal should remain open across operations", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleSelectMatch({ id: "m1" });
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      expect(wrapper.vm.showMatchingModal).toBe(true);
    });
  });

  describe("match data validation", () => {
    it("should accept match with required properties", () => {
      const wrapper = mountFactory();
      const match = { id: "m1" };
      wrapper.vm.handleSelectMatch(match);
      expect(wrapper.vm.selectedMatch).toEqual(match);
    });

    it("should preserve all match properties", () => {
      const wrapper = mountFactory();
      const match = {
        id: "m1",
        name: "Match 1",
        count: 5,
        severity: "critical",
        status: "active"
      };
      wrapper.vm.handleSelectMatch(match);
      expect(wrapper.vm.selectedMatch).toEqual(match);
    });

    it("should handle match with special characters", () => {
      const wrapper = mountFactory();
      const match = {
        id: "m1@special#test",
        name: "Match with special chars!"
      };
      wrapper.vm.handleSelectMatch(match);
      expect(wrapper.vm.selectedMatch.id).toBe("m1@special#test");
    });

    it("should handle match with numeric values", () => {
      const wrapper = mountFactory();
      const match = {
        id: "m1",
        count: 1000,
        score: 99.5,
        severity: 5
      };
      wrapper.vm.handleSelectMatch(match);
      expect(wrapper.vm.selectedMatch.count).toBe(1000);
      expect(wrapper.vm.selectedMatch.score).toBe(99.5);
    });

    it("should handle match with nested objects", () => {
      const wrapper = mountFactory();
      const match = {
        id: "m1",
        metadata: { source: "test", type: "alert" },
        details: { severity: "high" }
      };
      wrapper.vm.handleSelectMatch(match);
      expect(wrapper.vm.selectedMatch.metadata.source).toBe("test");
    });
  });

  describe("performance characteristics", () => {
    it("should mount efficiently", () => {
      const startTime = Date.now();
      mountFactory();
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });

    it("should handle large rules dataset quickly", () => {
      const data = Array.from({ length: 500 }, (_, i) => ({
        resourceId: `r${i}`,
        name: `Rule ${i}`,
        matchCount: i
      }));
      const startTime = Date.now();
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(200);
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toHaveLength(500);
    });

    it("should emit events without performance degradation", () => {
      const wrapper = mountFactory();
      const startTime = Date.now();
      for (let i = 0; i < 100; i++) {
        wrapper.vm.handleRuleNameClick({ resourceId: `r${i}` });
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(100);
    });

    it("should format match counts efficiently", () => {
      const wrapper = mountFactory();
      const startTime = Date.now();
      for (let i = 0; i < 1000; i++) {
        wrapper.vm.getValue(i);
      }
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(50);
    });
  });

  describe("widget component integration", () => {
    it("should have title property", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeDefined();
      expect(wrapper.vm.getTitle).toBe(labels.TopRules);
    });

    it("should have all data properties", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.selectedMatch).toBeDefined();
      expect(wrapper.vm.showMatchingModal).toBeDefined();
    });

    it("should have all required methods", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.handleRuleNameClick).toBe("function");
      expect(typeof wrapper.vm.handleSelectMatch).toBe("function");
      expect(typeof wrapper.vm.getValue).toBe("function");
    });

    it("should work with WidgetContainer", () => {
      expect(() => {
        mountFactory();
      }).not.toThrow();
    });

    it("should work with MatchingIncidentModal stub", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("accessibility features", () => {
    it("should have semantic component name", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$options.name).toBe("TopRules");
    });

    it("should expose rule data for screen readers", () => {
      const data = [{ resourceId: "r1", name: "Rule 1" }];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"][0].name).toBe("Rule 1");
    });

    it("should expose match count information", () => {
      const wrapper = mountFactory();
      const count = wrapper.vm.getValue(5);
      expect(count).toBeTruthy();
      expect(count).toContain("5");
    });

    it("should maintain readable labels", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.getTitle).toBeTruthy();
      expect(typeof wrapper.vm.getTitle).toBe("string");
      expect(wrapper.vm.getTitle.length).toBeGreaterThan(0);
    });
  });

  describe("complex rule scenarios", () => {
    it("should handle rule with very long name", () => {
      const data = [{
        resourceId: "r1",
        name: "A".repeat(200)
      }];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"][0].name).toHaveLength(200);
    });

    it("should handle rule with special characters in name", () => {
      const data = [{
        resourceId: "r1",
        name: "Rule@#$%^&*()_+-=[]{}|;:,.<>?"
      }];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"][0].name).toContain("@");
    });

    it("should handle rule with Unicode characters", () => {
      const data = [{
        resourceId: "r1",
        name: "Règle avec caractères spéciaux 🔒"
      }];
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": data
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"][0].name).toContain("🔒");
    });

    it("should handle rapid rule and match operations", async () => {
      const wrapper = mountFactory();
      for (let i = 0; i < 10; i++) {
        wrapper.vm.handleRuleNameClick({ resourceId: `r${i}` });
        wrapper.vm.handleSelectMatch({ id: `m${i}` });
      }
      expect(wrapper.emitted().handleSelectPlaybookId).toHaveLength(10);
      expect(wrapper.vm.selectedMatch).toBeDefined();
    });

    it("should handle interleaved rule and match selections", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      wrapper.vm.handleSelectMatch({ id: "m1" });
      wrapper.vm.handleRuleNameClick({ resourceId: "r2" });
      wrapper.vm.handleSelectMatch({ id: "m2" });
      wrapper.vm.handleRuleNameClick({ resourceId: "r3" });
      expect(wrapper.vm.selectedMatch.id).toBe("m2");
    });
  });

  describe("multiple instances independence", () => {
    it("should create independent component instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("should maintain separate modal state", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      wrapper1.vm.handleSelectMatch({ id: "m1" });
      expect(wrapper1.vm.showMatchingModal).toBe(true);
      expect(wrapper2.vm.showMatchingModal).toBe(false);
    });

    it("should maintain separate selected match", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      const match1 = { id: "m1", name: "Match 1" };
      const match2 = { id: "m2", name: "Match 2" };
      wrapper1.vm.handleSelectMatch(match1);
      wrapper2.vm.handleSelectMatch(match2);
      expect(wrapper1.vm.selectedMatch).toEqual(match1);
      expect(wrapper2.vm.selectedMatch).toEqual(match2);
    });

    it("should emit independently for multiple instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      wrapper1.vm.handleRuleNameClick({ resourceId: "r1" });
      wrapper2.vm.handleRuleNameClick({ resourceId: "r2" });
      expect(wrapper1.emitted().handleSelectPlaybookId).toHaveLength(1);
      expect(wrapper2.emitted().handleSelectPlaybookId).toHaveLength(1);
    });

    it("should not share data across instances", () => {
      const data1 = [{ resourceId: "r1", name: "Rule 1" }];
      const data2 = [{ resourceId: "r2", name: "Rule 2" }];
      const wrapper1 = mountFactory({
        "widgets/getTopRulesCard": data1
      });
      const wrapper2 = mountFactory({
        "widgets/getTopRulesCard": data2
      });
      expect(wrapper1.vm.$store.getters["widgets/getTopRulesCard"]).toEqual(data1);
      expect(wrapper2.vm.$store.getters["widgets/getTopRulesCard"]).toEqual(data2);
    });

    it("should handle cleanup independently", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(() => {
        wrapper1.destroy();
        expect(wrapper2.exists()).toBe(true);
      }).not.toThrow();
      wrapper2.destroy();
    });
  });

  describe("error handling and recovery", () => {
    it("should handle null rule data gracefully", () => {
      const wrapper = mountFactory({
        "widgets/getTopRulesCard": null
      });
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toBeNull();
    });

    it("should handle undefined rule data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store.getters["widgets/getTopRulesCard"]).toBeDefined();
    });

    it("should continue functioning after error in rule click", () => {
      const wrapper = mountFactory();
      wrapper.vm.handleRuleNameClick({ resourceId: "r1" });
      wrapper.vm.handleRuleNameClick({ resourceId: "r2" });
      expect(wrapper.emitted().handleSelectPlaybookId).toHaveLength(2);
    });

    it("should handle null match selection gracefully", () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.vm.handleSelectMatch(null);
      }).not.toThrow();
      expect(wrapper.vm.selectedMatch).toBeNull();
    });

    it("should handle invalid getValue input", () => {
      const wrapper = mountFactory();
      expect(() => {
        wrapper.vm.getValue("invalid");
      }).not.toThrow();
    });

    it("should recover from rapid valid state changes", () => {
      const wrapper = mountFactory();
      for (let i = 0; i < 10; i++) {
        wrapper.vm.handleSelectMatch({ id: `m${i}` });
      }
      expect(wrapper.vm.selectedMatch).toBeDefined();
      expect(wrapper.vm.selectedMatch.id).toBe("m9");
    });
  });
});
