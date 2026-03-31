import AgenticAIRejectDialog from "@/components/Common/Widget/WidgetComponents/AgenticAIRejectDialog.vue";

describe("AgenticAIRejectDialog", () => {
  describe("computed", () => {
    it("returns four retry suggestion options", () => {
      const suggestions = AgenticAIRejectDialog.computed.suggestedReasons.call({});

      expect(suggestions).toHaveLength(4);
      expect(suggestions[0].label).toBe("Delivery / technical issue");
      expect(suggestions[0].key).toBe("delivery-or-technical");
      expect(suggestions.map((s) => s.key)).toEqual([
        "delivery-or-technical",
        "language-or-locale",
        "audience-or-risk-fit",
        "regenerate-quality"
      ]);
    });

    it("isValid is true only when trimmed reason has at least 15 characters", () => {
      expect(
        AgenticAIRejectDialog.computed.isValid.call({ reason: "12345678901234" })
      ).toBe(false);
      expect(
        AgenticAIRejectDialog.computed.isValid.call({ reason: "  123456789012345  " })
      ).toBe(true);
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

    it("uses neutral gray chip colors (not orange) for selected and unselected states", () => {
      const selectedCtx = {
        selectedSuggestedReasonKey: "delivery-or-technical",
        isSuggestedReasonSelected: AgenticAIRejectDialog.methods.isSuggestedReasonSelected
      };
      const unselectedCtx = {
        selectedSuggestedReasonKey: null,
        isSuggestedReasonSelected: AgenticAIRejectDialog.methods.isSuggestedReasonSelected
      };

      expect(
        AgenticAIRejectDialog.methods.getSuggestedReasonColor.call(selectedCtx, "delivery-or-technical")
      ).toBe("#98A2B3");
      expect(
        AgenticAIRejectDialog.methods.getSuggestedReasonColor.call(unselectedCtx, "delivery-or-technical")
      ).toBe("#D0D5DD");
      expect(AgenticAIRejectDialog.methods.getSuggestedReasonTextColor.call(selectedCtx)).toBe("#475467");
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

    it("handleChangeStatus emits cancel when dialog closes", () => {
      const $emit = jest.fn();
      const ctx = { $emit };
      AgenticAIRejectDialog.methods.handleChangeStatus.call(ctx, false);
      expect($emit).toHaveBeenCalledWith("cancel");
    });

    it("handleChangeStatus does not emit when value is true", () => {
      const $emit = jest.fn();
      const ctx = { $emit };
      AgenticAIRejectDialog.methods.handleChangeStatus.call(ctx, true);
      expect($emit).not.toHaveBeenCalled();
    });

    it("handleSuggestedReasonClick returns early when reasonOption is missing", () => {
      const ctx = {
        reason: "unchanged",
        selectedSuggestedReasonKey: null
      };
      AgenticAIRejectDialog.methods.handleSuggestedReasonClick.call(ctx, null);
      expect(ctx.reason).toBe("unchanged");
      expect(ctx.selectedSuggestedReasonKey).toBeNull();
    });

    it("isSuggestedReasonSelected reflects selectedSuggestedReasonKey", () => {
      expect(
        AgenticAIRejectDialog.methods.isSuggestedReasonSelected.call(
          { selectedSuggestedReasonKey: "delivery-or-technical" },
          "delivery-or-technical"
        )
      ).toBe(true);
      expect(
        AgenticAIRejectDialog.methods.isSuggestedReasonSelected.call(
          { selectedSuggestedReasonKey: null },
          "delivery-or-technical"
        )
      ).toBe(false);
    });

    it("getSuggestedReasonTextColor returns a single neutral text color", () => {
      expect(AgenticAIRejectDialog.methods.getSuggestedReasonTextColor.call({})).toBe("#475467");
    });
  });

  describe("props", () => {
    it("defaults action to retry", () => {
      const prop = AgenticAIRejectDialog.props.action;
      const defaultVal = typeof prop.default === "function" ? prop.default() : prop.default;
      expect(defaultVal).toBe("retry");
    });
  });

  describe("watch", () => {
    it("resets dialog state when status becomes false", () => {
      const resetDialogState = jest.fn();
      const ctx = { resetDialogState };

      AgenticAIRejectDialog.watch.status.call(ctx, false);

      expect(resetDialogState).toHaveBeenCalled();
    });

    it("does not reset dialog state when status becomes true", () => {
      const resetDialogState = jest.fn();
      const ctx = { resetDialogState };

      AgenticAIRejectDialog.watch.status.call(ctx, true);

      expect(resetDialogState).not.toHaveBeenCalled();
    });

    it("resets dialog state when action changes", () => {
      const resetDialogState = jest.fn();
      const ctx = { resetDialogState };

      AgenticAIRejectDialog.watch.action.call(ctx);

      expect(resetDialogState).toHaveBeenCalled();
    });
  });
});
