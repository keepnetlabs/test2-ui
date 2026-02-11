<template>
  <div>
    <WidgetLoading :loading="false">
      <template #skeleton-content>
        <ExecutiveWidgetContainer class="agentic-ai-widget">
          <div class="agentic-ai-widget__header-wrapper">
            <ExecutiveWidgetHeader
              :title="statusTitle"
              :subtitle="subtitle"
              :edit-mode="false"
            />
            <div class="agentic-ai-widget__actions">
              <button
                class="agentic-ai-widget__chat"
                type="button"
                @click="handleChatWithAgenticAI"
              >
                <v-icon size="20" color="#2196f3">mdi-creation</v-icon>
                <span>Chat With Agentic AI</span>
              </button>
              <v-tooltip bottom opacity="1" v-if="showSettingsIcon">
                <template #activator="{ on }">
                  <button
                    class="agentic-ai-widget__settings"
                    type="button"
                    v-on="on"
                    @click="navigateToAgenticAISettings"
                  >
                    <v-icon size="20" color="#2196f3">mdi-cog</v-icon>
                  </button>
                </template>
                <span class="tooltip-span">Agentic AI Settings</span>
              </v-tooltip>
            </div>
          </div>
          <ExecutiveWidgetBody>
            <div class="agentic-ai-widget__body">
              <div class="agentic-ai-widget__status-row">
                <div
                  class="agentic-ai-widget__icon"
                  :style="{ background: iconBackgroundColor }"
                >
                  <v-icon :size="24" :color="statusIconColor">{{
                    statusIcon
                  }}</v-icon>
                </div>
                <div>
                  <p class="agentic-ai-widget__status">
                    {{ currentStatusText }}
                  </p>
                  <p class="agentic-ai-widget__description">
                    {{ currentDescription }}
                  </p>
                </div>
              </div>
              <div class="agentic-ai-widget__stat-cards">
                <div
                  v-for="card in visibleStatCards"
                  :key="card.title"
                  class="agentic-ai-widget__stat-card"
                  :class="{
                    'agentic-ai-widget__stat-card--highlighted': highlightedCardTitles.includes(
                      card.title
                    )
                  }"
                >
                  <div class="agentic-ai-widget__stat-card__header">
                    <span class="agentic-ai-widget__stat-card__title">{{
                      card.title
                    }}</span>
                    <div class="agentic-ai-widget__stat-card__subtitle">
                      <span>{{ card.subtitle }}</span>
                      <v-menu
                        v-if="card.hasMenu"
                        offset-y
                        transition="scale-transition"
                      >
                        <template #activator="{ on, attrs }">
                          <v-btn
                            v-bind="attrs"
                            v-on="on"
                            icon
                            class="agentic-ai-widget__stat-card__subtitle-button"
                          >
                            <v-icon small>mdi-menu-down</v-icon>
                          </v-btn>
                        </template>
                        <v-list dense>
                          <v-list-item
                            v-for="option in card.menuOptions"
                            :key="option"
                            @click="selectSubtitle(card, option)"
                          >
                            <v-list-item-title>{{ option }}</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </div>
                  <div class="agentic-ai-widget__stat-card__value">
                    {{ card.value }}
                  </div>
                </div>
              </div>
            </div>
            <div class="agentic-ai-widget__footer">
              <v-btn
                class="agentic-ai-widget__button"
                :class="{
                  'agentic-ai-widget__button--approval': isApprovalReviewState
                }"
                color="#2196f3"
                :outlined="actionButtonOutlinedComputed"
                rounded
                block
                @click="openActivitiesDrawer"
              >
                {{ actionButtonLabelComputed }}
              </v-btn>
            </div>
          </ExecutiveWidgetBody>
        </ExecutiveWidgetContainer>
      </template>
    </WidgetLoading>
    <AgenticAIActivitiesDrawer
      :value="isActivitiesDrawerOpen"
      :columns="activitiesTableColumns"
      :row-actions="activitiesTableRowActions"
      :table-data="activitiesTableData"
      @on-close="closeActivitiesDrawer"
    />
  </div>
</template>

<script>
import WidgetLoading from "@/components/SkeletonLoading/WidgetLoading.vue";
import ExecutiveWidgetContainer from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue";
import ExecutiveWidgetHeader from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue";
import ExecutiveWidgetBody from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue";
import AgenticAIActivitiesDrawer from "./AgenticAIActivitiesDrawer.vue";
import { mapGetters } from 'vuex';

export default {
  name: "AgenticAIStatusWidget",
  components: {
    WidgetLoading,
    ExecutiveWidgetContainer,
    ExecutiveWidgetHeader,
    ExecutiveWidgetBody,
    AgenticAIActivitiesDrawer
  },
  data() {
    return {
      isActivitiesDrawerOpen: false,
      statCards: [
        {
          title: "Actions Executed",
          subtitle: "Last 30 days",
          value: 12,
          hasMenu: true,
          menuOptions: ["Last 30 days", "Last 7 days", "Last 24 hours"]
        },
        {
          title: "Pending Approvals",
          subtitle: "",
          value: 3,
          hasMenu: false
        }
      ],
      activitiesTableColumns: [
        {
          label: "First Name",
          property: "firstName",
          type: "text",
          show: true,
          filterableType: "text",
          minWidth: 140,
          width: 140,
          fixed: false
        },
        {
          label: "Last Name",
          property: "lastName",
          type: "text",
          show: true,
          filterableType: "text",
          minWidth: 140,
          width: 140,
          fixed: false
        },
        {
          label: "Email",
          property: "email",
          type: "text",
          show: true,
          filterableType: "text",
          minWidth: 240,
          width: 240,
          fixed: false
        },
        {
          label: "Department",
          property: "department",
          type: "text",
          show: true,
          filterableType: "text",
          minWidth: 160,
          width: 160,
          fixed: false
        },
        {
          label: "Content Type",
          property: "contentType",
          type: "text",
          show: true,
          filterableType: "text",
          minWidth: 180,
          width: 180,
          fixed: false
        },
        {
          label: "Content Category",
          property: "contentCategory",
          type: "text",
          show: true,
          filterableType: "text",
          minWidth: 180,
          width: 180,
          fixed: false
        },
        {
          label: "Status",
          property: "status",
          type: "status",
          show: true,
          minWidth: 280,
          width: 280,
          align: "center",
          fixed: false,
          filterableType: "select",
          filterableItems: ["Executed", "Waiting for Approval", "Rejected"],
          fullWidth: false,
          props: {
            outlined: false,
            size: "auto",
            style: {
              color: "#ffffff"
            }
          }
        },
        {
          label: "Start Date",
          property: "startDate",
          type: "text",
          show: true,
          filterableType: "text",
          minWidth: 160,
          width: 160,
          fixed: false
        }
      ],
      activitiesTableRowActions: [
        {
          name: "View",
          id: "btn-agentic-ai-activity-view",
          icon: "mdi-eye",
          action: "view"
        },
        {
          name: "More",
          id: "btn-agentic-ai-activity-more",
          icon: "mdi-dots-vertical",
          action: "more"
        }
      ],
      activitiesTableData: [
        {
          firstName: "Colleen",
          lastName: "Hawkins",
          email: "collen@example.com",
          department: "Marketing",
          contentType: "Phishing Simulation",
          contentCategory: "Cloud Security",
          status: "Waiting for Approval",
          startDate: ""
        },
        {
          firstName: "Darrell",
          lastName: "Warren",
          email: "darrell@example.com",
          department: "Accounts",
          contentType: "Phishing Simulation",
          contentCategory: "GDPR",
          status: "Rejected",
          startDate: ""
        },
        {
          firstName: "Mitchell",
          lastName: "Edwards",
          email: "mitchell@example.com",
          department: "IT",
          contentType: "Quishing Simulation",
          contentCategory: "Malware",
          status: "Executed",
          startDate: "13/01/2026 14:00"
        },
        {
          firstName: "Arlene",
          lastName: "Richards",
          email: "arlene@example.com",
          department: "Sales",
          contentType: "Training",
          contentCategory: "Password Security",
          status: "Executed",
          startDate: "13/01/2026 14:00"
        },
        {
          firstName: "Victoria",
          lastName: "Lane",
          email: "victoria@example.com",
          department: "Welding",
          contentType: "Training",
          contentCategory: "Cyber Spying",
          status: "Rejected",
          startDate: ""
        }
      ]
    };
  },
  props: {
    actionButtonLabel: {
      type: String,
      default: "VIEW ACTIVITIES"
    },
    actionButtonOutlined: {
      type: Boolean,
      default: true
    },
    approvalActionButtonLabel: {
      type: String,
      default: "REVIEW APPROVALS"
    },
    approvalActionButtonOutlined: {
      type: Boolean,
      default: false
    },
    isAgenticAllyActive: {
      type: Boolean,
      default: true
    },
    isAutonomous: {
      type: Boolean,
      default: true
    },
    subtitle: {
      type: String,
      default: ""
    },
    statusTitle: {
      type: String,
      default: "Agentic AI Status"
    }
  },
  computed: {
    ...mapGetters({
      isAgenticAIEnabledStore: 'login/getAgenticAIEnabled',
      executionModeStore: 'login/getAgenticAIExecutionMode'
    }),
    isAgenticAllyActiveComputed() {
      // Use store state if available, otherwise fallback to prop
      return this.isAgenticAIEnabledStore;
    },
    isAutonomousComputed() {
      // Use store state
      return this.executionModeStore === 'Autonomous';
    },
    currentStatusText() {
      if (!this.isAgenticAllyActiveComputed) {
        return "Agentic AI is disabled";
      }
      if (this.isApprovalGatedNoPendingState) {
        return "There are no pending AI actions for approval";
      }
      if (
        this.isAgenticAllyActiveComputed &&
        !this.isAutonomousComputed &&
        this.hasPendingApprovals
      ) {
        return "AI actions are waiting for your approval";
      }
      return this.isAutonomousComputed
        ? "Agentic AI is running autonomously"
        : "Agentic AI is enabled - approval-gated";
    },
    currentDescription() {
      if (!this.isAgenticAllyActiveComputed) {
        return "No actions will run until you enable it, and you can change modes anytime.";
      }
      if (this.isApprovalGatedNoPendingState) {
        return "AI suggests actions for review before they are executed.";
      }
      return this.isAutonomousComputed
        ? "Actions run automatically based on your policies."
        : "Review and approve AI-recommended actions before they are executed.";
    },
    showSettingsIcon() {
      return !this.isAutonomousComputed || !this.isAgenticAllyActiveComputed;
    },
    statusIcon() {
      if (this.isAgenticAllyActiveComputed) {
        return "mdi-check-circle-outline";
      }
      return "mdi-creation";
    },
    statusIconColor() {
      if (this.isAgenticAllyActiveComputed) {
        return "#2196f3";
      }
      return "#6b7280";
    },
    iconBackgroundColor() {
      if (this.isAgenticAllyActiveComputed) {
        return "#F1F8FE";
      }
      return "#e5e7eb";
    },
    pendingApprovalsCard() {
      return this.statCards.find((card) => card.title === "Pending Approvals");
    },
    hasPendingApprovals() {
      const card = this.pendingApprovalsCard;
      return card && card.value > 0;
    },
    isApprovalReviewState() {
      return (
        this.isAgenticAllyActiveComputed &&
        !this.isAutonomousComputed &&
        this.hasPendingApprovals
      );
    },
    isApprovalGatedNoPendingState() {
      return (
        this.isAgenticAllyActiveComputed &&
        !this.isAutonomousComputed &&
        !this.hasPendingApprovals
      );
    },
    actionButtonLabelComputed() {
      return this.isApprovalReviewState
        ? this.approvalActionButtonLabel
        : this.actionButtonLabel;
    },
    actionButtonOutlinedComputed() {
      return this.isApprovalReviewState
        ? this.approvalActionButtonOutlined
        : this.actionButtonOutlined;
    },
    visibleStatCards() {
      if (this.isAutonomousComputed) {
        return this.statCards.filter(
          (card) => card.title === "Actions Executed"
        );
      }
      return this.statCards;
    },
    highlightedCardTitles() {
      const titles = [];
      if (this.isAutonomousComputed) {
        titles.push("Actions Executed");
      }
      if (this.hasPendingApprovals) {
        titles.push("Pending Approvals");
      }
      return titles;
    }
  },
  methods: {
    selectSubtitle(card, option) {
      card.subtitle = option;
    },
    isPendingApprovalsCard(card) {
      return card.title === "Pending Approvals";
    },
    openActivitiesDrawer() {
      this.isActivitiesDrawerOpen = true;
    },
    closeActivitiesDrawer() {
      this.isActivitiesDrawerOpen = false;
    },
    navigateToAgenticAISettings() {
      if (this.$router) {
        this.$router.push({
          name: "Company Settings",
          query: { tab: "agentic-ai-settings" }
        });
      }
    },
    handleChatWithAgenticAI() {
      window.dispatchEvent(new CustomEvent("open-agentic-ai-chat"));
    }
  }
};
</script>
