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
});
