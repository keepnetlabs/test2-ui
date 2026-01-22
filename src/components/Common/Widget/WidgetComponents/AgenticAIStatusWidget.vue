<template>
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
              @click="navigateToAgenticAISettings"
            >
              <v-icon size="20" color="#2196f3">mdi-creation</v-icon>
              <span>Chat With Agentic AI</span>
            </button>
            <button
              v-if="showSettingsIcon"
              class="agentic-ai-widget__settings"
              type="button"
              @click="navigateToAgenticAISettings"
            >
              <v-icon size="20" color="#2196f3">mdi-cog</v-icon>
            </button>
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
                <p class="agentic-ai-widget__status">{{ currentStatusText }}</p>
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
                  'agentic-ai-widget__stat-card--highlighted':
                    highlightedCardTitles.includes(card.title)
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
              @click="navigateToAgenticAISettings"
            >
              {{ actionButtonLabelComputed }}
            </v-btn>
          </div>
        </ExecutiveWidgetBody>
      </ExecutiveWidgetContainer>
    </template>
  </WidgetLoading>
</template>

<script>
import WidgetLoading from "@/components/SkeletonLoading/WidgetLoading.vue";
import ExecutiveWidgetContainer from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetContainer.vue";
import ExecutiveWidgetHeader from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetHeader.vue";
import ExecutiveWidgetBody from "@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveWidgetBody.vue";

export default {
  name: "AgenticAIStatusWidget",
  components: {
    WidgetLoading,
    ExecutiveWidgetContainer,
    ExecutiveWidgetHeader,
    ExecutiveWidgetBody
  },
  data() {
    return {
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
          subtitle: "Now",
          value: 3,
          hasMenu: false
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
    currentStatusText() {
      if (!this.isAgenticAllyActive) {
        return "Agentic AI is disabled";
      }
      if (
        this.isAgenticAllyActive &&
        !this.isAutonomous &&
        this.hasPendingApprovals
      ) {
        return "Agentic AI is awaiting approval-gated";
      }
      return this.isAutonomous
        ? "Agentic AI is enabled - autonomous"
        : "Agentic AI is enabled - approval-gated";
    },
    currentDescription() {
      if (!this.isAgenticAllyActive) {
        return "No actions will run until you enable it, and you can change modes anytime.";
      }
      return this.isAutonomous
        ? "Agentic AI executes actions automatically while still keeping you in the loop."
        : "AI suggests actions for review before they are executed.";
    },
    showSettingsIcon() {
      return this.isAgenticAllyActive && !this.isAutonomous;
    },
    statusIcon() {
      if (this.isAgenticAllyActive) {
        return "mdi-check-circle-outline";
      }
      return "mdi-creation";
    },
    statusIconColor() {
      if (this.isAgenticAllyActive && !this.isAutonomous) {
        return "#2196f3";
      }
      return "#6b7280";
    },
    iconBackgroundColor() {
      if (this.isAgenticAllyActive) {
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
        this.isAgenticAllyActive &&
        !this.isAutonomous &&
        this.hasPendingApprovals
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
      if (this.isAutonomous) {
        return this.statCards.filter((card) => card.title === "Actions Executed");
      }
      return this.statCards;
    },
    highlightedCardTitles() {
      const titles = [];
      if (this.isAutonomous) {
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
    navigateToAgenticAISettings() {
      if (this.$router) {
        this.$router.push({
          name: "Company Settings",
          query: { tab: "agentic-ai-settings" }
        });
      }
    }
  }
};
</script>

<style lang="scss" src="./AgenticAIStatusWidget.scss"></style>
