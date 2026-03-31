import AgenticAIRejectDialog from "@/components/Common/Widget/WidgetComponents/AgenticAIRejectDialog.vue";

describe("AgenticAIRejectDialog", () => {
  describe("computed", () => {
    it("returns four retry suggestion options", () => {
      const suggestions = AgenticAIRejectDialog.computed.suggestedReasons.call({});

      expect(suggestions).toHaveLength(4);
      expect(suggestions[0].label).toBe("Delivery / technical issue");
      expect(suggestions[0].key).toBe("delivery-or-technical");
    });
  });

  describe("methods", () => {
    it("fills textarea and records selection when a suggestion is selected", () => {
      const ctx = {
        reason: "",
        selectedSuggestedReasonKey: null
      };

      AgenticAIRejectDialog.methods.handleSuggestedReasonClick.call(ctx, {
        key: "delivery-or-technical",
        template: "The previous attempt failed to deliver or render correctly."
      });

      expect(ctx.selectedSuggestedReasonKey).toBe("delivery-or-technical");
      expect(ctx.reason).toBe("The previous attempt failed to deliver or render correctly.");
    });

    it("resets reason and selection together", () => {
      const ctx = {
        reason: "Some reason",
        selectedSuggestedReasonKey: "delivery-or-technical"
      };

      AgenticAIRejectDialog.methods.resetDialogState.call(ctx);

      expect(ctx.reason).toBe("");
      expect(ctx.selectedSuggestedReasonKey).toBeNull();
    });

    it("emits trimmed reason on confirm", () => {
      const $emit = jest.fn();
      const ctx = {
        reason: "  Valid retry reason with enough length  ",
        isValid: true,
        $emit
      };

      AgenticAIRejectDialog.methods.handleConfirm.call(ctx);

      expect($emit).toHaveBeenCalledWith("confirm", "Valid retry reason with enough length");
    });

    it("does not emit confirm when invalid", () => {
      const $emit = jest.fn();
      const ctx = {
        reason: "short",
        isValid: false,
        $emit
      };

      AgenticAIRejectDialog.methods.handleConfirm.call(ctx);

      expect($emit).not.toHaveBeenCalled();
    });
  });

  describe("watch", () => {
    it("resets dialog state when status becomes false", () => {
      const resetDialogState = jest.fn();
      const ctx = { resetDialogState };

      AgenticAIRejectDialog.watch.status.call(ctx, false);

      expect(resetDialogState).toHaveBeenCalled();
    });

    it("resets dialog state when action changes", () => {
      const resetDialogState = jest.fn();
      const ctx = { resetDialogState };

      AgenticAIRejectDialog.watch.action.call(ctx);

      expect(resetDialogState).toHaveBeenCalled();
    });
  });
});
