/**
 * Shared computed for approval footers (CommonSimulatorPreviewDialog, TrainingLibraryDrawer).
 * Expects props: approvalActionsDisabled, approvalActionsDisabledTooltip (optional; fallback below)
 */
export const DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP =
  "Approve and retry are unavailable when the target user status is not Active.";

export const approvalFooterActionsComputed = {
  /** Single class map for Retry (outlined) — avoids splitting `class` / `:class` on the same node. */
  approvalFooterRetryBtnClass() {
    return {
      "elevation-0": true,
      "fw-600": true,
      "approval-footer-action--restricted": this.approvalActionsDisabled
    };
  },
  /** Single class map for Approve (primary). */
  approvalFooterApproveBtnClass() {
    return {
      "white--text": true,
      "elevation-0": true,
      "fw-600": true,
      "approval-footer-action--restricted": this.approvalActionsDisabled
    };
  },
  approvalFooterTooltipText() {
    const t = this.approvalActionsDisabledTooltip;
    if (typeof t === "string" && t.trim()) {
      return t.trim();
    }
    return DEFAULT_APPROVAL_ACTIONS_DISABLED_TOOLTIP;
  },
  /** VTooltip `disabled`: hide tooltip when actions are not restricted. */
  approvalFooterTooltipDisabled() {
    return !this.approvalActionsDisabled;
  }
};
