import AgenticAIRejectDialog from "@/components/Common/Widget/WidgetComponents/AgenticAIRejectDialog.vue";

describe("AgenticAIRejectDialog", () => {
  describe("computed", () => {
    it("returns retry suggestions for retry action", () => {
      const suggestions = AgenticAIRejectDialog.computed.suggestedReasons.call({ action: "retry" });

      expect(suggestions).toHaveLength(4);
      expect(suggestions[0].label).toBe("Temporary issue");
    });

    it("returns no suggestions for reject action", () => {
      const suggestions = AgenticAIRejectDialog.computed.suggestedReasons.call({ action: "reject" });

      expect(suggestions).toEqual([]);
    });
  });

  describe("methods", () => {
    it("fills textarea when a suggestion is selected", () => {
      const ctx = {
        reason: "",
        selectedSuggestedReasonKey: null
      };

      AgenticAIRejectDialog.methods.handleSuggestedReasonClick.call(ctx, {
        key: "temporary-issue",
        template: "Please retry this action because the previous attempt failed."
      });

      expect(ctx.selectedSuggestedReasonKey).toBe("temporary-issue");
      expect(ctx.reason).toBe("Please retry this action because the previous attempt failed.");
    });

    it("resets reason and selection together", () => {
      const ctx = {
        reason: "Some reason",
        selectedSuggestedReasonKey: "temporary-issue"
      };

      AgenticAIRejectDialog.methods.resetDialogState.call(ctx);

      expect(ctx.reason).toBe("");
      expect(ctx.selectedSuggestedReasonKey).toBeNull();
    });

    it("emits trimmed reason on confirm", () => {
      const $emit = jest.fn();
      const ctx = {
        reason: "  Valid rejection reason  ",
        isValid: true,
        $emit
      };

      AgenticAIRejectDialog.methods.handleConfirm.call(ctx);

      expect($emit).toHaveBeenCalledWith("confirm", "Valid rejection reason");
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
