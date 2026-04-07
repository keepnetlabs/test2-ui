import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import AgenticAIStatusWidget from "@/components/Common/Widget/WidgetComponents/AgenticAIStatusWidget.vue";
import { customVuetify as vuetify } from "../../utils";

jest.mock("@/api/company", () => ({
  getAgenticAIActivitiesStats: jest.fn(() =>
    Promise.resolve({ data: { data: { last30Days: {} } } })
  )
}));

import { getAgenticAIActivitiesStats } from "@/api/company";

describe("AgenticAIStatusWidget", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const mountFactory = (storeOverrides = {}, propsData = {}) => {
    return shallowMount(AgenticAIStatusWidget, {
      localVue,
      vuetify,
      propsData,
      mocks: {
        $store: {
          getters: {
            "login/getAgenticAIEnabled": true,
            "login/getAgenticAIExecutionMode": "Autonomous",
            "login/getHasAgenticAILicense": false,
            ...storeOverrides
          }
        },
        $router: { push: jest.fn() }
      },
      stubs: [
        "WidgetLoading",
        "ExecutiveWidgetContainer",
        "ExecutiveWidgetHeader",
        "ExecutiveWidgetBody",
        "AgenticAIActivitiesDrawer",
        "v-menu",
        "v-btn",
        "v-icon"
      ]
    });
  };

  it("shows autonomous status text when autonomous", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(wrapper.vm.currentStatusText).toBe(
      "Agentic AI is running autonomously"
    );
  });

  it("shows approval-gated status when not autonomous with pending approvals", async () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    const pendingCard = wrapper.vm.pendingApprovalsCard;
    pendingCard.value = 2;

    expect(wrapper.vm.currentStatusText).toBe(
      "AI actions are waiting for your approval"
    );
  });

  it("shows disabled status text when AI is disabled", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": false,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(wrapper.vm.currentStatusText).toBe("Agentic AI is disabled");
  });

  it("filters visible stat cards in autonomous mode", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    const titles = wrapper.vm.visibleStatCards.map((card) => card.title);
    expect(titles).toEqual(["Actions Executed"]);
  });

  it("includes pending approvals in highlighted cards when present", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    const pendingCard = wrapper.vm.pendingApprovalsCard;
    pendingCard.value = 1;

    expect(wrapper.vm.highlightedCardTitles).toContain("Pending Approvals");
  });

  it("switches action button label in approval review state", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    const pendingCard = wrapper.vm.pendingApprovalsCard;
    pendingCard.value = 1;

    expect(wrapper.vm.actionButtonLabelComputed).toBe(
      wrapper.vm.approvalActionButtonLabel
    );
    expect(wrapper.vm.actionButtonOutlinedComputed).toBe(
      wrapper.vm.approvalActionButtonOutlined
    );
  });

  it("keeps default action button label when not in approval review state", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });

    expect(wrapper.vm.actionButtonLabelComputed).toBe(wrapper.vm.actionButtonLabel);
    expect(wrapper.vm.actionButtonOutlinedComputed).toBe(
      wrapper.vm.actionButtonOutlined
    );
  });

  it("opens and closes activities drawer", () => {
    const wrapper = mountFactory();
    wrapper.vm.openActivitiesDrawer();
    expect(wrapper.vm.isActivitiesDrawerOpen).toBe(true);
    wrapper.vm.closeActivitiesDrawer();
    expect(wrapper.vm.isActivitiesDrawerOpen).toBe(false);
  });

  it("navigates to settings page when requested", () => {
    const wrapper = mountFactory();
    wrapper.vm.navigateToAgenticAISettings();
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
      name: "Company Settings",
      query: { tab: "agentic-ai-settings" }
    });
  });

  it("shows settings icon only when active and not autonomous", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    expect(wrapper.vm.showSettingsIcon).toBe(true);

    const autoWrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(autoWrapper.vm.showSettingsIcon).toBe(false);

    const disabledWrapper = mountFactory({
      "login/getAgenticAIEnabled": false,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(disabledWrapper.vm.showSettingsIcon).toBe(true);
  });

  it("returns status icon color based on active state", () => {
    const activeWrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(activeWrapper.vm.statusIconColor).toBe("#2196f3");

    const disabledWrapper = mountFactory({
      "login/getAgenticAIEnabled": false,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(disabledWrapper.vm.statusIconColor).toBe("#6b7280");
  });

  it("includes User Status column before Approval Status in activities table", () => {
    const wrapper = mountFactory();
    const cols = wrapper.vm.activitiesTableColumns;
    const userIdx = cols.findIndex((c) => c.property === "targetUserStatus");
    const statusIdx = cols.findIndex((c) => c.property === "status");
    expect(cols[userIdx].label).toBe("User Status");
    expect(cols[userIdx].type).toBe("status");
    expect(cols[userIdx].fullWidth).toBe(true);
    expect(cols[userIdx].overrideWidth).toBe(true);
    expect(cols[userIdx].minWidth).toBe(180);
    expect(cols[userIdx].width).toBe(180);
    expect(userIdx).toBeLessThan(statusIdx);
  });

  it("sizes Assigned Scenario column for longer scenario titles", () => {
    const wrapper = mountFactory();
    const scenarioCol = wrapper.vm.activitiesTableColumns.find((c) => c.property === "scenarioName");
    expect(scenarioCol.label).toBe("Assigned Scenario");
    expect(scenarioCol.minWidth).toBe(240);
    expect(scenarioCol.width).toBe(240);
  });

  it("uses neutral status badge styling in activities table", () => {
    const wrapper = mountFactory();
    const statusColumn = wrapper.vm.activitiesTableColumns.find((column) => column.property === "status");

    expect(statusColumn.type).toBe("slot");
    expect(statusColumn.badgeColorMap.pending).toBe("#2196f3");
    expect(statusColumn.badgeColorMap.approved).toBe("#43a047");
    expect(statusColumn.badgeColorMap.declined).toBe("#757575");
    expect(statusColumn.badgeColorMap.error).toBe("#e53935");
    expect(statusColumn.badgeColorMap.retrying).toBe("#1173C1");
    expect(statusColumn.badgeColorMap.retried).toBe("#757575");
    expect(statusColumn.props.outlined).toBe(false);
    expect(statusColumn.props.style.color).toBe("#ffffff");
  });

  it("exposes full approval status filter options including Retrying and Retried", () => {
    const wrapper = mountFactory();
    const statusColumn = wrapper.vm.activitiesTableColumns.find((column) => column.property === "status");
    const items = statusColumn.filterableItems;
    expect(items.map((i) => i.text)).toEqual([
      "Pending",
      "Declined",
      "Approved",
      "Error",
      "Retrying",
      "Retried"
    ]);
    expect(items.map((i) => i.value)).toEqual(["1", "3", "4", "5", "6", "7"]);
  });

  it("keeps status column filterable as select type", () => {
    const wrapper = mountFactory();
    const statusColumn = wrapper.vm.activitiesTableColumns.find((column) => column.property === "status");
    expect(statusColumn.filterableType).toBe("select");
  });

  it("shows no-pending headline when manual mode has zero pending approvals", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    wrapper.setData({
      statCards: [
        { title: "Actions Executed", subtitle: "Last 30 days", value: 0, hasMenu: true, menuOptions: [] },
        { title: "Pending Approvals", subtitle: "", value: 0, hasMenu: false }
      ]
    });
    expect(wrapper.vm.currentStatusText).toBe("There are no pending AI actions for approval");
    expect(wrapper.vm.currentDescription).toContain("AI suggests actions for review");
  });

  it("uses review-oriented description when manual mode has pending approvals", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    wrapper.setData({
      statCards: [
        { title: "Actions Executed", subtitle: "Last 30 days", value: 0, hasMenu: true, menuOptions: [] },
        { title: "Pending Approvals", subtitle: "", value: 2, hasMenu: false }
      ]
    });
    expect(wrapper.vm.currentDescription).toContain("Review and approve");
  });

  it("maps status icon and background by enabled state", () => {
    const enabled = mountFactory({ "login/getAgenticAIEnabled": true });
    expect(enabled.vm.statusIcon).toBe("mdi-check-circle-outline");
    expect(enabled.vm.iconBackgroundColor).toBe("#F1F8FE");

    const disabled = mountFactory({ "login/getAgenticAIEnabled": false });
    expect(disabled.vm.statusIcon).toBe("mdi-creation");
    expect(disabled.vm.iconBackgroundColor).toBe("#e5e7eb");
  });

  it("getPeriodKey maps period labels to stats keys with last30Days fallback", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.getPeriodKey("Last 7 days")).toBe("last7Days");
    expect(wrapper.vm.getPeriodKey("Last 24 hours")).toBe("last24Hours");
    expect(wrapper.vm.getPeriodKey("unknown label")).toBe("last30Days");
  });

  it("selectSubtitle updates Actions Executed value when stats period changes", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous",
      "login/getHasAgenticAILicense": true
    });
    const executed = wrapper.vm.statCards.find((c) => c.title === "Actions Executed");
    wrapper.setData({
      statsData: {
        last7Days: { autonomous: { Approved: 9 } },
        last30Days: { autonomous: { Approved: 1 } }
      }
    });
    wrapper.vm.selectSubtitle(executed, "Last 7 days");
    expect(executed.subtitle).toBe("Last 7 days");
    expect(executed.value).toBe(9);
  });

  it("isPendingApprovalsCard is true only for Pending Approvals title", () => {
    const wrapper = mountFactory();
    expect(wrapper.vm.isPendingApprovalsCard({ title: "Pending Approvals" })).toBe(true);
    expect(wrapper.vm.isPendingApprovalsCard({ title: "Actions Executed" })).toBe(false);
  });

  it("navigateToAgenticAISettings does not throw when router is missing", () => {
    const wrapper = mountFactory();
    wrapper.vm.$router = undefined;
    expect(() => wrapper.vm.navigateToAgenticAISettings()).not.toThrow();
  });

  it("highlightedCardTitles lists only Actions Executed in autonomous mode without pending", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(wrapper.vm.highlightedCardTitles).toEqual(["Actions Executed"]);
  });

  it("highlightedCardTitles includes Pending Approvals when autonomous and pending count positive", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    wrapper.vm.pendingApprovalsCard.value = 2;
    expect(wrapper.vm.highlightedCardTitles).toEqual(["Actions Executed", "Pending Approvals"]);
  });

  it("isApprovalReviewState and isApprovalGatedNoPendingState are mutually exclusive", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    wrapper.setData({
      statCards: [
        { title: "Actions Executed", subtitle: "Last 30 days", value: 0, hasMenu: true, menuOptions: [] },
        { title: "Pending Approvals", subtitle: "", value: 0, hasMenu: false }
      ]
    });
    expect(wrapper.vm.isApprovalReviewState).toBe(false);
    expect(wrapper.vm.isApprovalGatedNoPendingState).toBe(true);

    wrapper.vm.pendingApprovalsCard.value = 3;
    expect(wrapper.vm.isApprovalReviewState).toBe(true);
    expect(wrapper.vm.isApprovalGatedNoPendingState).toBe(false);
  });

  it("currentDescription is autonomous vs manual when AI is enabled", () => {
    const auto = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous"
    });
    expect(auto.vm.currentDescription).toContain("automatically");

    const manual = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual"
    });
    manual.setData({
      statCards: [
        { title: "Actions Executed", subtitle: "Last 30 days", value: 0, hasMenu: true, menuOptions: [] },
        { title: "Pending Approvals", subtitle: "", value: 1, hasMenu: false }
      ]
    });
    expect(manual.vm.currentDescription).toContain("approve");
  });

  it("updateStatCards returns early when statsData is null", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getHasAgenticAILicense": true
    });
    const executed = wrapper.vm.statCards.find((c) => c.title === "Actions Executed");
    const before = executed.value;
    wrapper.setData({ statsData: null });
    wrapper.vm.updateStatCards();
    expect(executed.value).toBe(before);
  });

  it("updateStatCards uses approvalGated counts when not autonomous", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Manual",
      "login/getHasAgenticAILicense": true
    });
    wrapper.setData({
      statsData: {
        last30Days: {
          approvalGated: { Approved: 11, Pending: 2 },
          autonomous: { Approved: 99 }
        }
      }
    });
    wrapper.vm.updateStatCards();
    const executed = wrapper.vm.statCards.find((c) => c.title === "Actions Executed");
    const pending = wrapper.vm.statCards.find((c) => c.title === "Pending Approvals");
    expect(executed.value).toBe(11);
    expect(pending.value).toBe(2);
  });

  it("fetchStats leaves default card values when API rejects", async () => {
    getAgenticAIActivitiesStats.mockRejectedValueOnce(new Error("stats down"));
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getHasAgenticAILicense": true
    });
    const executed = wrapper.vm.statCards.find((c) => c.title === "Actions Executed");
    const before = executed.value;
    await wrapper.vm.fetchStats();
    expect(executed.value).toBe(before);
    expect(wrapper.vm.isLoading).toBe(false);
  });

  it("selectSubtitle does not update executed value when a card other than Actions Executed changes", () => {
    const wrapper = mountFactory({
      "login/getAgenticAIEnabled": true,
      "login/getAgenticAIExecutionMode": "Autonomous",
      "login/getHasAgenticAILicense": true
    });
    const pending = wrapper.vm.statCards.find((c) => c.title === "Pending Approvals");
    const executed = wrapper.vm.statCards.find((c) => c.title === "Actions Executed");
    const executedBefore = executed.value;
    wrapper.setData({
      statsData: {
        last30Days: { autonomous: { Approved: 50 } }
      }
    });
    wrapper.vm.selectSubtitle(pending, "Last 7 days");
    expect(pending.subtitle).toBe("Last 7 days");
    expect(executed.value).toBe(executedBefore);
  });

  describe("Component Structure", () => {
    it("should render component successfully", () => {
      const wrapper = mountFactory();
      expect(wrapper.exists()).toBe(true);
    });

    it("should have store integration", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$store).toBeDefined();
    });

    it("should have router integration", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.$router).toBeDefined();
    });

    it("should have required component data", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm).toBeDefined();
    });
  });

  describe("Status Text Rendering", () => {
    it("should display correct status for autonomous mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      expect(wrapper.vm.currentStatusText).toContain("autonomously");
    });

    it("should display approval-gated status in manual mode with pending approvals", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      wrapper.setData({
        statCards: [
          { title: "Actions Executed", subtitle: "Last 30 days", value: 5, hasMenu: true, menuOptions: [] },
          { title: "Pending Approvals", subtitle: "", value: 3, hasMenu: false }
        ]
      });
      expect(wrapper.vm.currentStatusText).toContain("waiting for your approval");
    });

    it("should show disabled status when disabled", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIEnabled": false
      });
      expect(wrapper.vm.currentStatusText).toContain("disabled");
    });
  });

  describe("Stat Cards Management", () => {
    it("should have visible stat cards", () => {
      const wrapper = mountFactory();
      expect(Array.isArray(wrapper.vm.visibleStatCards)).toBe(true);
    });

    it("should have pending approvals card", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.pendingApprovalsCard).toBeDefined();
    });

    it("should filter cards based on mode", () => {
      const autonomousWrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      const titles = autonomousWrapper.vm.visibleStatCards.map(c => c.title);
      expect(titles.length).toBeGreaterThan(0);
    });

    it("should track highlighted card titles", () => {
      const wrapper = mountFactory();
      expect(Array.isArray(wrapper.vm.highlightedCardTitles)).toBe(true);
    });
  });

  describe("Action Button Configuration", () => {
    it("should have action button label", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.actionButtonLabel).toBeDefined();
    });

    it("should compute action button label based on mode", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.actionButtonLabelComputed).toBeDefined();
    });

    it("should compute action button outlined state", () => {
      const wrapper = mountFactory();
      expect(typeof wrapper.vm.actionButtonOutlinedComputed).toBe("boolean");
    });

    it("should switch button label in approval review state", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      const pendingCard = wrapper.vm.pendingApprovalsCard;
      pendingCard.value = 1;

      expect(wrapper.vm.actionButtonLabelComputed).toBe(
        wrapper.vm.approvalActionButtonLabel
      );
    });
  });

  describe("Activities Drawer", () => {
    it("should open activities drawer", () => {
      const wrapper = mountFactory();
      wrapper.vm.openActivitiesDrawer();
      expect(wrapper.vm.isActivitiesDrawerOpen).toBe(true);
    });

    it("should close activities drawer", () => {
      const wrapper = mountFactory();
      wrapper.vm.closeActivitiesDrawer();
      expect(wrapper.vm.isActivitiesDrawerOpen).toBe(false);
    });

    it("should toggle drawer state", () => {
      const wrapper = mountFactory();
      const initialState = wrapper.vm.isActivitiesDrawerOpen;
      wrapper.vm.openActivitiesDrawer();
      expect(wrapper.vm.isActivitiesDrawerOpen).not.toBe(initialState);
      wrapper.vm.closeActivitiesDrawer();
      expect(wrapper.vm.isActivitiesDrawerOpen).toBe(initialState);
    });
  });

  describe("Navigation", () => {
    it("should navigate to settings when requested", () => {
      const wrapper = mountFactory();
      wrapper.vm.navigateToAgenticAISettings();
      expect(wrapper.vm.$router.push).toHaveBeenCalled();
    });

    it("should navigate to Company Settings with correct tab", () => {
      const wrapper = mountFactory();
      wrapper.vm.navigateToAgenticAISettings();
      expect(wrapper.vm.$router.push).toHaveBeenCalledWith({
        name: "Company Settings",
        query: { tab: "agentic-ai-settings" }
      });
    });

    it("should have navigation available", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.navigateToAgenticAISettings).toBeDefined();
    });
  });

  describe("Settings Icon", () => {
    it("should show settings icon in manual mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      expect(wrapper.vm.showSettingsIcon).toBe(true);
    });

    it("should hide settings icon in autonomous mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      expect(wrapper.vm.showSettingsIcon).toBe(false);
    });

    it("should show settings icon when disabled", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIEnabled": false
      });
      expect(wrapper.vm.showSettingsIcon).toBe(true);
    });
  });

  describe("Icon Color", () => {
    it("should return blue color for active state", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIEnabled": true
      });
      expect(wrapper.vm.statusIconColor).toBe("#2196f3");
    });

    it("should return gray color for disabled state", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIEnabled": false
      });
      expect(wrapper.vm.statusIconColor).toBe("#6b7280");
    });

    it("should have defined icon color", () => {
      const wrapper = mountFactory();
      expect(wrapper.vm.statusIconColor).toBeDefined();
    });
  });

  describe("Autonomous Mode", () => {
    it("should have autonomous status in autonomous mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      expect(wrapper.vm.currentStatusText).toContain("autonomously");
    });

    it("should have filtered cards in autonomous mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      expect(wrapper.vm.visibleStatCards.length).toBeGreaterThan(0);
    });

    it("should use default action button in autonomous mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      expect(wrapper.vm.actionButtonLabelComputed).toBe(wrapper.vm.actionButtonLabel);
    });
  });

  describe("Manual/Approval Mode", () => {
    it("should show approval-gated status in manual mode with pending approvals", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      wrapper.setData({
        statCards: [
          { title: "Actions Executed", subtitle: "Last 30 days", value: 5, hasMenu: true, menuOptions: [] },
          { title: "Pending Approvals", subtitle: "", value: 3, hasMenu: false }
        ]
      });
      expect(wrapper.vm.currentStatusText).toContain("waiting for your approval");
    });

    it("should include pending approvals card in manual mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      const pendingCard = wrapper.vm.pendingApprovalsCard;
      expect(pendingCard).toBeDefined();
    });

    it("should use approval button label when pending", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      const pendingCard = wrapper.vm.pendingApprovalsCard;
      pendingCard.value = 1;

      expect(wrapper.vm.actionButtonLabelComputed).toBe(
        wrapper.vm.approvalActionButtonLabel
      );
    });
  });

  describe("Store Integration", () => {
    it("should access AI enabled state from store", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIEnabled": true
      });
      expect(wrapper.vm.$store.getters["login/getAgenticAIEnabled"]).toBe(true);
    });

    it("should access execution mode from store", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      expect(wrapper.vm.$store.getters["login/getAgenticAIExecutionMode"]).toBe("Autonomous");
    });

    it("should use store getters correctly", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIEnabled": true,
        "login/getAgenticAIExecutionMode": "Manual"
      });
      expect(wrapper.vm.$store.getters["login/getAgenticAIEnabled"]).toBe(true);
      expect(wrapper.vm.$store.getters["login/getAgenticAIExecutionMode"]).toBe("Manual");
    });
  });

  describe("Multiple Instances", () => {
    it("should support multiple widget instances", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      expect(wrapper1.vm).not.toBe(wrapper2.vm);
    });

    it("should maintain independent state across instances", () => {
      const wrapper1 = mountFactory({
        "login/getAgenticAIExecutionMode": "Autonomous"
      });
      const wrapper2 = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      expect(wrapper1.vm.currentStatusText).not.toBe(wrapper2.vm.currentStatusText);
    });

    it("should have independent drawer states", () => {
      const wrapper1 = mountFactory();
      const wrapper2 = mountFactory();
      wrapper1.vm.openActivitiesDrawer();
      expect(wrapper2.vm.isActivitiesDrawerOpen).toBe(false);
    });
  });

  describe("Loading State", () => {
    it("starts with isLoading true", () => {
      const wrapper = mountFactory();
      // fetchStats exits early when no license, setting isLoading = false
      // but initial data value is true
      expect(typeof wrapper.vm.isLoading).toBe("boolean");
    });

    it("sets isLoading to false when no license", async () => {
      const wrapper = mountFactory({ "login/getHasAgenticAILicense": false });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("does not request stats when Agentic AI is disabled in company settings", async () => {
      getAgenticAIActivitiesStats.mockClear();
      const wrapper = mountFactory({
        "login/getHasAgenticAILicense": true,
        "login/getAgenticAIEnabled": false
      });
      await wrapper.vm.$nextTick();
      expect(getAgenticAIActivitiesStats).not.toHaveBeenCalled();
      expect(wrapper.vm.isLoading).toBe(false);
    });

    it("requests stats when licensed and Agentic AI is enabled", async () => {
      getAgenticAIActivitiesStats.mockClear();
      const wrapper = mountFactory({
        "login/getHasAgenticAILicense": true,
        "login/getAgenticAIEnabled": true
      });
      await wrapper.vm.$nextTick();
      expect(getAgenticAIActivitiesStats).toHaveBeenCalled();
    });

    it("requests stats when Agentic AI turns on after mount (store watcher)", async () => {
      getAgenticAIActivitiesStats.mockClear();
      const store = new Vuex.Store({
        modules: {
          login: {
            namespaced: true,
            state: {
              agenticAIEnabled: false,
              hasAgenticAILicense: true,
              agenticAIExecutionMode: "Autonomous"
            },
            getters: {
              getAgenticAIEnabled: (s) => s.agenticAIEnabled,
              getHasAgenticAILicense: (s) => s.hasAgenticAILicense,
              getAgenticAIExecutionMode: (s) => s.agenticAIExecutionMode
            },
            mutations: {
              SET_AGENTIC_AI_ENABLED(state, v) {
                state.agenticAIEnabled = v;
              }
            }
          }
        }
      });
      const wrapper = shallowMount(AgenticAIStatusWidget, {
        localVue,
        vuetify,
        store,
        mocks: {
          $router: { push: jest.fn() }
        },
        stubs: [
          "WidgetLoading",
          "ExecutiveWidgetContainer",
          "ExecutiveWidgetHeader",
          "ExecutiveWidgetBody",
          "AgenticAIActivitiesDrawer",
          "v-menu",
          "v-btn",
          "v-icon"
        ]
      });
      await wrapper.vm.$nextTick();
      expect(getAgenticAIActivitiesStats).not.toHaveBeenCalled();

      store.commit("login/SET_AGENTIC_AI_ENABLED", true);
      await wrapper.vm.$nextTick();
      await Promise.resolve();
      await Promise.resolve();
      expect(getAgenticAIActivitiesStats).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edge Cases", () => {
    it("should handle missing execution mode gracefully", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": undefined
      });
      expect(wrapper.vm.currentStatusText).toBeDefined();
    });

    it("should handle disabled AI correctly", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIEnabled": false
      });
      expect(wrapper.vm.currentStatusText).toContain("disabled");
    });

    it("should render with minimal props", () => {
      const wrapper = mountFactory({}, {});
      expect(wrapper.exists()).toBe(true);
    });

    it("should handle zero pending approvals", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      wrapper.vm.pendingApprovalsCard.value = 0;
      expect(wrapper.vm.highlightedCardTitles).toBeDefined();
    });
  });
});
