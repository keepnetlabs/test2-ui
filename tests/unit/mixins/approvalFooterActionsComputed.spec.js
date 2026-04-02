import {
  approvalFooterActionsComputed,
  DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP
} from "@/mixins/approvalFooterActionsComputed";

function ctx(overrides = {}) {
  return {
    approvalActionsDisabled: false,
    approvalActionsDisabledTooltip: "",
    ...overrides
  };
}

describe("approvalFooterActionsComputed", () => {
  describe("approvalFooterRetryBtnClass", () => {
    it("includes elevation-0, fw-600, and no restricted when actions allowed", () => {
      const result = approvalFooterActionsComputed.approvalFooterRetryBtnClass.call(ctx());
      expect(result["elevation-0"]).toBe(true);
      expect(result["fw-600"]).toBe(true);
      expect(result["approval-footer-action--restricted"]).toBe(false);
    });

    it("sets restricted modifier when approvalActionsDisabled is true", () => {
      const result = approvalFooterActionsComputed.approvalFooterRetryBtnClass.call(
        ctx({ approvalActionsDisabled: true })
      );
      expect(result["approval-footer-action--restricted"]).toBe(true);
    });
  });

  describe("approvalFooterApproveBtnClass", () => {
    it("includes white--text, elevation-0, fw-600, and no restricted when allowed", () => {
      const result = approvalFooterActionsComputed.approvalFooterApproveBtnClass.call(ctx());
      expect(result["white--text"]).toBe(true);
      expect(result["elevation-0"]).toBe(true);
      expect(result["fw-600"]).toBe(true);
      expect(result["approval-footer-action--restricted"]).toBe(false);
    });

    it("sets restricted when approvalActionsDisabled is true", () => {
      const result = approvalFooterActionsComputed.approvalFooterApproveBtnClass.call(
        ctx({ approvalActionsDisabled: true })
      );
      expect(result["approval-footer-action--restricted"]).toBe(true);
    });
  });

  describe("approvalFooterTooltipText", () => {
    it("trims and returns parent tooltip when non-empty", () => {
      const text = approvalFooterActionsComputed.approvalFooterTooltipText.call(
        ctx({ approvalActionsDisabledTooltip: "  Custom message  " })
      );
      expect(text).toBe("Custom message");
    });

    it("falls back to DEFAULT when prop is empty or whitespace", () => {
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipText.call(ctx({ approvalActionsDisabledTooltip: "" }))
      ).toBe(DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP);
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipText.call(ctx({ approvalActionsDisabledTooltip: "   " }))
      ).toBe(DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP);
    });

    it("falls back to DEFAULT when prop is not a string", () => {
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipText.call(ctx({ approvalActionsDisabledTooltip: null }))
      ).toBe(DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP);
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipText.call(
          ctx({ approvalActionsDisabledTooltip: undefined })
        )
      ).toBe(DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP);
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipText.call(ctx({ approvalActionsDisabledTooltip: 0 }))
      ).toBe(DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP);
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipText.call(ctx({ approvalActionsDisabledTooltip: {} }))
      ).toBe(DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP);
    });
  });

  describe("approvalFooterTooltipDisabled", () => {
    it("is true when actions are not restricted (hide VTooltip)", () => {
      expect(approvalFooterActionsComputed.approvalFooterTooltipDisabled.call(ctx())).toBe(true);
    });

    it("is false when actions are restricted (show VTooltip)", () => {
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipDisabled.call(ctx({ approvalActionsDisabled: true }))
      ).toBe(false);
    });

    it("treats undefined approvalActionsDisabled as not restricted (same as false)", () => {
      expect(
        approvalFooterActionsComputed.approvalFooterTooltipDisabled.call(
          ctx({ approvalActionsDisabled: undefined })
        )
      ).toBe(true);
    });
  });
});
