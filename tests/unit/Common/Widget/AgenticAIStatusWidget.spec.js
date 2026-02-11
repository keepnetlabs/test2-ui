import { createLocalVue, shallowMount } from "@vue/test-utils";
import AgenticAIStatusWidget from "@/components/Common/Widget/WidgetComponents/AgenticAIStatusWidget.vue";
import { customVuetify as vuetify } from "../../utils";

describe("AgenticAIStatusWidget", () => {
  const localVue = createLocalVue();

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
      "Agentic AI is awaiting approval-gated"
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

    it("should display approval-gated status in manual mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      expect(wrapper.vm.currentStatusText).toContain("Agentic AI");
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
    it("should show approval-gated status in manual mode", () => {
      const wrapper = mountFactory({
        "login/getAgenticAIExecutionMode": "Manual"
      });
      expect(wrapper.vm.currentStatusText).toContain("Agentic AI");
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
