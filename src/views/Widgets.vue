<template>
  <div class="k-widget__container">
    <app-modal
      v-if="showPlaybookModal"
      title-id="text--create-playbook-title"
      :status="showPlaybookModal"
      :icon-name="'mdi-pencil'"
      :title="'Edit Rule'"
      :show-footer="false"
      class-name="incident-responder__playbook"
    >
      <template v-slot:overlay-body>
        <CreateOrEditRule
          v-if="showPlaybookModal"
          :playbookId="selectedPlaybookId"
          @cancelForm="togglePlaybookModal"
          @closeFormWithUpdate="closePlaybookWithUpdate"
        />
      </template>
    </app-modal>
    <div class="k-widget__header" id="available-widgets">
      <available-widgets
        :edit-mode="editMode"
        :available-widgets="availableWidgets"
        :permissions="permissions"
        @handleEdit="handleEditMode"
        @handleCancel="handleCancelEditMode"
        @handleSave="handleSaveChanges"
        @addWidget="addWidget"
        @handleOpenMenu="handleOpenMenu"
      />
    </div>
    <k-smart-grid
      ref="refGrid"
      :layout="layout"
      :col-num="colNum"
      :is-static="!editMode"
      :row-height="50"
      @breakpointChanged="breakpointChanged"
      @layout-updated="layoutUpdated"
      @layout-mounted="layoutMounted"
    >
      <smart-widget
        v-for="(item, index) in layout"
        :key="item.i"
        :slot="item.i"
        :padding="[0, 0]"
        :ref="`ref${item.i}`"
        :shadow="'never'"
        :simple="true"
      >
        <component
          :id="item.key"
          :is="getComponent(item.key)"
          :resizable="false"
          :editMode="editMode"
          :card="item.card"
          :is-dashboard-widget="item.isDashboardWidget"
          @deleteWidget="deleteWidget(item, index)"
          @on-delete="deleteWidget(item, index)"
          @handleSelectPlaybookId="handleSelectedPlaybook"
        />
      </smart-widget>
    </k-smart-grid>
  </div>
</template>

<script>
import RecentCampaigns from "@/components/Common/Widget/WidgetComponents/RecentCampaigns";
import AvailableWidgets from "@/components/Common/Widget/AvailableWidgets";
import RecentInvestigations from "@/components/Common/Widget/WidgetComponents/RecentInvestigations";
import Reporters from "@/components/Common/Widget/WidgetComponents/Reporters";
import TopRules from "@/components/Common/Widget/WidgetComponents/TopRules";
import PhishingReporterIrHeader from "@/components/Common/Widget/WidgetComponents/PhishingReporterIrHeader";
import TopPosts from "@/components/Common/Widget/WidgetComponents/TopPosts";
import RecentlyPostedThreats from "@/components/Common/Widget/WidgetComponents/RecentlyPostedThreats";
import RecentlyReportedIncidents from "@/components/Common/Widget/WidgetComponents/RecentlyReportedIncidents";
import ReportedEmailTrends from "@/components/Common/Widget/WidgetComponents/ReportedEmailTrends";
import KSmartGrid from "@/components/Common/Widget/KSmartGrid";
import IncidentAnalysisIrHeader from "@/components/Common/Widget/WidgetComponents/IncidentAnalysisIrHeader";
import InvestigationsIrHeader from "@/components/Common/Widget/WidgetComponents/InvestigationsIrHeader";
import RoiSummaryIrHeader from "@/components/Common/Widget/WidgetComponents/RoiSummaryIrHeader";
import { postWidgets } from "@/api/widgets";
import CreateOrEditRule from "@/components/Playbook/CreateOrEditRule";
import AppModal from "@/components/AppModal";
import MostPhishedUsers from "@/components/Common/Widget/WidgetComponents/MostPhishedUsers";
import MostEngagedCampaigns from "@/components/Common/Widget/WidgetComponents/MostEngagedCampaigns";
import PhishingCampaignTrends from "@/components/Common/Widget/WidgetComponents/PhishingCampaignTrends";
import TopPhishingSimulationReporters from "@/components/Common/Widget/WidgetComponents/TopPhishingSimulationReporters";
import {
  createRandomCryptStringNumber,
  getTimeZoneForMoment
} from "@/utils/functions";
import ExecutiveReportsSimulationCoverageBar from "@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsSimulationCoverageBar.vue";
import ExecutiveReportsTrainingCompletionBar from "@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTrainingCompletionBar.vue";
import ExecutiveReportsIndustryPhishingRiskScore from "@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsIndustryPhishingRiskScore.vue";
import ExecutiveReportsImpactOfPhishingAwarenessTraining from "@/components/ExecutiveReports/ExecutiveReportsImpactOfPhishingAwarenessTraining.vue";
import ExecutiveReportAvgPhishingSimClickerRate from "@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportAvgPhishingSimClickerRate.vue";
import AgenticAIStatusWidget from "@/components/Common/Widget/WidgetComponents/AgenticAIStatusWidget.vue";
export default {
  name: "Widgets",
  components: {
    KSmartGrid,
    AvailableWidgets,
    AppModal,
    CreateOrEditRule,
    AgenticAIStatusWidget
  },
  props: {
    permissions: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      activeBreakpoint: "lg",
      initialLayout: [],
      initialAvailableWidgets: [],
      layout: [],
      showPlaybookModal: false,
      selectedPlaybookId: null,
      newItemY: 0,
      colNum: 12,
      editMode: false,
      allWidgets: {
        RecentInvestigations: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Recent Investigations",
          key: "RecentInvestigations",
          isAllowed: this?.permissions?.runningInvestigation
        },
        PhishingReporterIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: createRandomCryptStringNumber(),
          key: "PhishingReporterIrHeader",
          title: "Phishing Reporter Ir Header",
          isAllowed: this?.permissions?.phishingReporterCard
        },
        IncidentAnalysisIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: createRandomCryptStringNumber(),
          key: "IncidentAnalysisIrHeader",
          title: "Incident Analysis Ir Header",
          isAllowed: this?.permissions?.irSummary
        },
        InvestigationsIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: createRandomCryptStringNumber(),
          key: "InvestigationsIrHeader",
          title: "Investigations Ir Header",
          isAllowed: this?.permissions?.irSummary
        },
        ROISummaryIrHeader: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: createRandomCryptStringNumber(),
          key: "ROISummaryIrHeader",
          title: "ROI Summary Ir Header",
          isAllowed: this?.permissions?.roiSettingCard
        },
        RecentlyReportedIncidents: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Recently Reported Incidents",
          key: "RecentlyReportedIncidents",
          isAllowed: this?.permissions?.notifiedEmail
        },
        RecentlyPostedThreats: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Recently Posted Threats",
          key: "RecentlyPostedThreats",
          isAllowed: this?.permissions?.communityPosts
        },
        TopRules: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "TopRules",
          title: "Top Rules",
          isAllowed: this?.permissions?.topRules
        },
        // TopPosts: {
        //   x: 0,
        //   y: 0,
        //   w: 3,
        //   minW: 3,
        //   defaultW: 3,
        //   midW: 6,
        //   h: 6,
        //   defaultH: 6,
        //   minH: 6,
        //   maxH: 6,
        //   i: createRandomCryptStringNumber(),
        //   key: 'TopPosts',
        //   title: 'Top Posts',
        //   isAllowed: this?.permissions?.topPosts
        // },
        Reporters: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "Reporters",
          title: "Reporters",
          isAllowed: this?.permissions?.reporters
        },
        ReportedEmailTrends: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "ReportedEmailTrends",
          title: "Reported Email Trends",
          isAllowed: this?.permissions?.reportedEmailTrends
        },
        PhishingCampaignTrends: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "PhishingCampaignTrends",
          title: "Phishing Campaign Trends",
          isAllowed: this?.permissions?.phishingCampaignTrendsCard
        },
        RecentCampaigns: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "RecentCampaigns",
          title: "Recent Campaigns",
          isAllowed: this?.permissions?.recentCampaignsCard
        },
        MostPhishedUsers: {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "MostPhishedUsers",
          title: "Most Phished Users",
          isAllowed: this?.permissions?.mostPhishedUsersCard
        },
        MostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 3,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "MostEngagedCampaigns",
          title: "Most Engaged Campaigns",
          isAllowed: this?.permissions?.mostEngagedCampaignsCard
        },
        AgenticAIStatusWidget: {
          x: 0,
          y: 0,
          w: 4,
          minW: 6,
          defaultW: 4,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "AgenticAIStatusWidget",
          title: "Agentic AI Status",
          isAllowed: true
        },
        TopPhishingSimulationReporters: {
          x: 0,
          y: 0,
          w: 6,
          minW: 3,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "TopPhishingSimulationReporters",
          title: "Top Phishing Simulation Reporters",
          isAllowed: this?.permissions?.topPhishingSimulationReportersCard
        },
        SimulationCoverageWidget: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          card: {
            title: "Simulation Coverage",
            parentKey:
              "Simulation proportion of simulated versus non-simulated users",
            key: "SimulationCoverageWidget",
            resourceId: "k8PWY03vDPke"
          },
          i: createRandomCryptStringNumber(),
          title: "Simulation Coverage",
          key: "SimulationCoverageWidget",
          isAllowed: true,
          parentKey: "Phishing Metrics",
          chartType: "pie",
          dateInterval: "month",
          startDate: this.$moment(Date.now())
            .subtract(3, "months")
            .format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          isDashboardWidget: true
        },
        TrainingCompletionWidget: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Training Completion",
          key: "TrainingCompletionWidget",
          isAllowed: true,
          parentKey: "Phishing Metrics",
          chartType: "bar",
          dateInterval: "month",
          card: {
            title: "Training Completion",
            parentKey: "Measure the training coverage across the company",
            key: "TrainingCompletionWidget",
            resourceId: "MY5C2U34WAgw"
          },
          startDate: this.$moment(Date.now())
            .subtract(3, "months")
            .format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          isDashboardWidget: true
        },
        IndustryPhishingRiskScoreWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 12,
          defaultW: 12,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Industry Phishing Risk Score",
          key: "IndustryPhishingRiskScoreWidget",
          isAllowed: true,
          parentKey: "Phishing Metrics",
          chartType: "stackedBar",
          dateInterval: "month",
          card: {
            title: "Industry Phishing Risk Score",
            parentKey:
              "Phishing risk score comparing user responses and report rates against an industry average",
            key: "IndustryPhishingRiskScoreWidget",
            resourceId: "uyzuHENtMZU0"
          },
          startDate: this.$moment(Date.now())
            .subtract(3, "months")
            .format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          isDashboardWidget: true
        },
        ImpactOfPhishingAwarenessTrainingWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 12,
          defaultW: 12,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Impact of Phishing Awareness Training",
          key: "ImpactOfPhishingAwarenessTrainingWidget",
          card: {
            title: "Impact of Phishing Awareness Training",
            parentKey:
              "Phishing risk scores across a diverse user base, following a 12-month cybersecurity training program",
            key: "ImpactOfPhishingAwarenessTrainingWidget",
            resourceId: "9c29GEAMmurS"
          },
          isAllowed: true,
          parentKey: "Phishing Metrics",
          chartType: "stackedBar",
          dateInterval: "month",
          startDate: this.$moment(Date.now())
            .subtract(3, "months")
            .format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          isDashboardWidget: true
        },
        RepeatOffendersUsersRateWidget: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Phishing Simulation Repeat Offenders Rate",
          key: "RepeatOffendersUsersRateWidget",
          card: {
            title: "Phishing Simulation Repeat Offenders Rate",
            parentKey:
              "Reduce external phishing attack risk by lowering repeat clickers.",
            key: "RepeatOffendersUsersRateWidget",
            resourceId: "mpdEh10N5E4d"
          },
          isAllowed: true,
          parentKey: "Phishing Metrics",
          chartType: "stackedBar",
          dateInterval: "month",
          startDate: this.$moment(Date.now())
            .subtract(3, "months")
            .format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          isDashboardWidget: true
        }
      },
      availableWidgets: [
        {
          name: "Most Phished Users",
          key: "MostPhishedUsers",
          isAllowed: this?.permissions?.mostPhishedUsersCard
        },
        {
          name: "Most Engaged Campaigns",
          key: "MostEngagedCampaigns",
          isAllowed: this?.permissions?.mostEngagedCampaignsCard
        },
        {
          name: "Recent Campaigns",
          key: "RecentCampaigns",
          isAllowed: this?.permissions?.recentCampaignsCard
        },
        {
          name: "Recent Investigations",
          key: "RecentInvestigations",
          isAllowed: this?.permissions?.runningInvestigation
        },
        {
          name: "Top Rules",
          key: "TopRules",
          isAllowed: this?.permissions?.topRules
        },
        // {
        //   name: 'Top Posts',
        //   key: 'TopPosts',
        //   isAllowed: this?.permissions?.topPosts
        // },
        {
          name: "Reporters",
          key: "Reporters",
          isAllowed: this?.permissions?.reporters
        },
        {
          name: "Recently Posted Threats",
          key: "RecentlyPostedThreats",
          isAllowed: this?.permissions?.communityPosts
        },
        {
          name: "Recently Reported Incidents",
          key: "RecentlyReportedIncidents",
          isAllowed: this?.permissions?.notifiedEmail
        },
        {
          name: "Reported Email Trends",
          key: "ReportedEmailTrends",
          isAllowed: this?.permissions?.reportedEmailTrends
        },
        {
          name: "Phishing Campaign Trends",
          key: "PhishingCampaignTrends",
          isAllowed: this?.permissions?.phishingCampaignTrendsCard
        },
        {
          name: "Phishing Reporter Ir Header",
          key: "PhishingReporterIrHeader",
          isAllowed: this?.permissions?.phishingReporterCard
        },
        {
          name: "Incident Analysis Ir Header",
          key: "IncidentAnalysisIrHeader",
          isAllowed: this?.permissions?.irSummary
        },
        {
          name: "Investigations Ir Header",
          key: "InvestigationsIrHeader",
          isAllowed: this?.permissions?.irSummary
        },
        {
          name: "ROI Summary Ir Header",
          key: "ROISummaryIrHeader",
          isAllowed: this?.permissions?.roiSettingCard
        },
        {
          name: "Top Phishing Simulation Reporters",
          key: "TopPhishingSimulationReporters",
          isAllowed: this?.permissions?.topPhishingSimulationReportersCard
        },
        {
          name: "Simulation Coverage",
          key: "SimulationCoverageWidget",
          isAllowed: true
        },
        {
          name: "Training Completion",
          key: "TrainingCompletionWidget",
          isAllowed: true
        },
        {
          name: "Industry Phishing Risk Score",
          key: "IndustryPhishingRiskScoreWidget",
          isAllowed: true
        },
        {
          name: "Impact of Phishing Awareness Training",
          key: "ImpactOfPhishingAwarenessTrainingWidget",
          isAllowed: true
        },
        {
          name: "Phishing Simulation Repeat Offenders Rate",
          key: "RepeatOffendersUsersRateWidget",
          isAllowed: true
        },
        {
          name: "Agentic AI Status",
          key: "AgenticAIStatusWidget",
          isAllowed: true
        }
      ],
      style:
        ".vue-grid-layout.smartwidget {box-shadow:none;" +
        "background:transparent ;" +
        " border:none}",
      callbackOfPlaybook: null
    };
  },
  watch: {
    editMode(val) {
      if (val) {
        this.initialLayout = JSON.parse(JSON.stringify(this.layout));
        this.handleAddShadows();
      }
    }
  },
  async created() {
    if (this?.permissions?.widgets) {
      try {
        const response = await this.$store.dispatch("widgets/callForWidgets");
        const settings =
          response.data["dashboardWidgetsOrdering"].data.settings;
        if (settings.length) {
          this.layout = settings.reduce((acc, item) => {
            const widget = { ...this.allWidgets[item.key], ...item };
            this.removeAvailableWidget(item);
            if (widget.isAllowed) acc.push(widget);
            return acc;
          }, []);
          this.ensureAgenticAIWidget(this.layout);
          this.newItemY = this.layout.reduce((acc, item) => {
            acc += item.h;
            return acc;
          }, 0);
          setTimeout(() => {
            this.handleDeleteShadows();
            this.breakpointChanged({ newBreakpoint: this.activeBreakpoint });
          }, 20);
        }
      } catch (e) {
        this.layout = this.getDefaultLayoutObject();
        setTimeout(() => {
          this.handleDeleteShadows();
          this.breakpointChanged({ newBreakpoint: this.activeBreakpoint });
        }, 20);
      } finally {
        if (
          !this.layout.find(
            (widget) => widget.key === "RepeatOffendersUsersRateWidget"
          )
        ) {
          const isAvailable = this.availableWidgets.find(
            (widget) => widget.key === "RepeatOffendersUsersRateWidget"
          );
          if (!isAvailable) {
            this.availableWidgets.push({
              name: "Phishing Simulation Repeat Offenders Rate",
              key: "RepeatOffendersUsersRateWidget",
              isAllowed: true
            });
          }
        }
      }
    }
  },
  methods: {
    breakpointChanged({ newBreakpoint }) {
      this.activeBreakpoint = newBreakpoint;
      const bdCol = this.getBdCol(newBreakpoint);
      let x = 0,
        xValue = 0,
        y = 0;
      this.layout.sort((a, b) => {
        if (a.y > b.y) {
          return 1;
        } else if (a.y === b.y) {
          if (a.x > b.x) {
            return 1;
          } else if (a.x < b.x) {
            return -1;
          }
          return 0;
        } else {
          return -1;
        }
      });
      this.layout = this.layout.map((item) => {
        let itemWidth = item.w;
        if (item.key === "AgenticAIStatusWidget") {
          if (newBreakpoint === "sm" || newBreakpoint === "xs") {
            const desiredWidth = item.midW || item.defaultW || itemWidth;
            itemWidth = Math.min(desiredWidth, bdCol);
          } else if (newBreakpoint === "lg") {
            itemWidth = item.defaultW || itemWidth;
          }
        }
        xValue = x;
        x += itemWidth;
        if (x > bdCol) {
          x = itemWidth;
          y += item.h;
          xValue = 0;
        }

        return { ...item, w: itemWidth, x: xValue, y };
      });
    },
    getBdCol(newBreakpoint = "") {
      if (newBreakpoint === "xs") return 6;
      return newBreakpoint === "xxs" ? 2 : 12;
    },
    layoutUpdated(newLayout) {},
    togglePlaybookModal() {
      this.showPlaybookModal = !this.showPlaybookModal;
    },
    handleSelectedPlaybook({ resourceId, callback }) {
      this.selectedPlaybookId = resourceId;
      this.callbackOfPlaybook = callback;
      this.togglePlaybookModal();
    },
    closePlaybookWithUpdate() {
      this.callbackOfPlaybook();
      this.togglePlaybookModal();
    },
    deleteWidget(item, index) {
      this.layout.splice(index, 1);
      this.availableWidgets.push({
        key: item.key,
        name: item.title,
        isAllowed: item.isAllowed
      });
    },
    handleOpenMenu() {
      this.editMode = true;
    },
    addWidget(widget) {
      this.removeAvailableWidget(widget);
      let newItem;
      const widgetObj = { ...this.allWidgets[widget.key] };
      if (window.innerWidth < 1100 && window.innerWidth > 900) {
        widgetObj.w = 6;
      } else if (window.innerWidth < 900) {
        widgetObj.w = 6;
      } else {
        this.allWidgets[widget.key].w = this.allWidgets[widget.key].defaultW;
      }
      newItem = widgetObj;
      newItem["y"] = this.newItemY;
      this.newItemY += newItem.h;
      this.layout.push(widgetObj);
    },
    removeAvailableWidget(widget) {
      this.availableWidgets.splice(
        this.availableWidgets.findIndex((item) => {
          return item.key === widget.key;
        }),
        1
      );
    },
    handleEditMode() {
      this.initialAvailableWidgets = JSON.parse(
        JSON.stringify(this.availableWidgets)
      );
      this.editMode = true;
    },
    handleCancelEditMode() {
      this.availableWidgets = JSON.parse(
        JSON.stringify(this.initialAvailableWidgets)
      );
      this.editMode = false;
      this.layout = JSON.parse(JSON.stringify(this.initialLayout));
    },
    layoutMounted() {
      this.handleDeleteShadows();
    },
    collapse(item, index, ref) {
      if (this.layout[index].h === 1) {
        this.$refs[ref][0].$el.querySelector(".widget-body").style.display =
          "block";
        this.layout[index].h = this.allWidgets[item.key].defaultH;
      } else {
        this.$refs[ref][0].$el.querySelector(".widget-body").style.display =
          "none";
        this.layout[index].h = 1;
      }
      this.layout = [...this.layout];
    },

    getComponent(componentString) {
      switch (componentString) {
        case "RecentInvestigations":
          return RecentInvestigations;
        case "RecentCampaigns":
          return RecentCampaigns;
        case "MostPhishedUsers":
          return MostPhishedUsers;
        case "MostEngagedCampaigns":
          return MostEngagedCampaigns;
        case "Reporters":
          return Reporters;
        case "TopRules":
          return TopRules;
        case "TopPosts":
          return TopPosts;
        case "RecentlyPostedThreats":
          return RecentlyPostedThreats;
        case "RecentlyReportedIncidents":
          return RecentlyReportedIncidents;
        case "ReportedEmailTrends":
          return ReportedEmailTrends;
        case "PhishingCampaignTrends":
          return PhishingCampaignTrends;
        case "PhishingReporterIrHeader":
          return PhishingReporterIrHeader;
        case "IncidentAnalysisIrHeader":
          return IncidentAnalysisIrHeader;
        case "InvestigationsIrHeader":
          return InvestigationsIrHeader;
        case "ROISummaryIrHeader":
          return RoiSummaryIrHeader;
        case "TopPhishingSimulationReporters":
          return TopPhishingSimulationReporters;
        case "SimulationCoverageWidget":
          return ExecutiveReportsSimulationCoverageBar;
        case "TrainingCompletionWidget":
          return ExecutiveReportsTrainingCompletionBar;
        case "IndustryPhishingRiskScoreWidget":
          return ExecutiveReportsIndustryPhishingRiskScore;
        case "ImpactOfPhishingAwarenessTrainingWidget":
          return ExecutiveReportsImpactOfPhishingAwarenessTraining;
        case "RepeatOffendersUsersRateWidget":
          return ExecutiveReportAvgPhishingSimClickerRate;
        case "AgenticAIStatusWidget":
          return AgenticAIStatusWidget;
        default:
          return;
      }
    },
    handleDeleteShadows() {
      document.querySelectorAll(".smartwidget").forEach((item) => {
        item.style.boxShadow = "none";
        item.style.backgroundColor = "transparent";
        item.style.border = "none";
        item.setAttribute("title", "");
      });
      document.querySelectorAll(".vue-grid-item").forEach((item) => {
        item.setAttribute("title", "");
      });
    },
    handleAddShadows() {
      document.querySelectorAll(".smartwidget").forEach((item) => {
        item.style.boxShadow = "";
        item.style.backgroundColor = "";
        item.style.border = "";
        item.setAttribute("title", "");
      });
      document.querySelectorAll(".vue-grid-item").forEach((item) => {
        item.setAttribute("title", "");
      });
    },

    ensureAgenticAIWidget(layoutArray) {
      if (
        !layoutArray.find((widget) => widget.key === "AgenticAIStatusWidget")
      ) {
        this.removeAvailableWidget({ key: "AgenticAIStatusWidget" });
        this.availableWidgets = this.availableWidgets.filter(
          (widget) => widget.key !== "AgenticAIStatusWidget"
        );
        const widget = {
          ...this.allWidgets.AgenticAIStatusWidget,
          i: createRandomCryptStringNumber(),
          x: 0,
          y: 0
        };
        layoutArray.unshift(widget);
      }
    },

    getDefaultLayoutObject() {
      let widgets = [
        {
          x: 8,
          y: 0,
          w: 4,
          minW: 6,
          defaultW: 4,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "AgenticAIStatusWidget",
          title: "Agentic AI Status",
          isAllowed: true
        },
        {
          x: 0,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: "0.36222415873736824",
          key: "PhishingReporterIrHeader",
          title: "Phishing Reporter Ir Header",
          isAllowed: this?.permissions?.phishingReporterCard
        },
        {
          x: 3,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: "0.4439548718965418",
          key: "IncidentAnalysisIrHeader",
          title: "Incident Analysis Ir Header",
          isAllowed: this?.permissions?.irSummary
        },
        {
          x: 6,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: "0.955736738495951",
          key: "InvestigationsIrHeader",
          title: "Investigations Ir Header",
          isAllowed: this?.permissions?.irSummary
        },
        {
          x: 9,
          y: 0,
          w: 3,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: "0.8129690089605317",
          key: "ROISummaryIrHeader",
          title: "ROI Summary Ir Header",
          isAllowed: this?.permissions?.roiSettingCard
        },
        {
          x: 0,
          y: 3,
          w: 12,
          minW: 12,
          defaultW: 12,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "IndustryPhishingRiskScoreWidget",
          card: {
            title: "Industry Phishing Risk Score",
            parentKey:
              "Phishing risk score comparing user responses and report rates against an industry average",
            key: "TrainingCompletionWidget",
            resourceId: "uyzuHENtMZU0"
          },
          isDashboardWidget: true,
          isAllowed: true
        },
        {
          x: 0,
          y: 6,
          w: 12,
          minW: 12,
          defaultW: 12,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Impact of Phishing Awareness Training",
          key: "ImpactOfPhishingAwarenessTrainingWidget",
          card: {
            title: "Impact of Phishing Awareness Training",
            parentKey:
              "Phishing risk scores across a diverse user base, following a 12-month cybersecurity training program",
            key: "ImpactOfPhishingAwarenessTrainingWidget",
            resourceId: "9c29GEAMmurS"
          },
          isAllowed: true,
          parentKey: "Phishing Metrics",
          chartType: "stackedBar",
          dateInterval: "month",
          isDashboardWidget: true,
          startDate: this.$moment(Date.now())
            .subtract(3, "months")
            .format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        /*
        {
          x: 0,
          y: 9,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Repeat Offenders Users Threshold',
          key: 'RepeatOffendersUsersThresholdWidget',
          card: {
            title: 'Repeat Offenders Users (Threshold: 2)',
            parentKey: 'Percentage of users who are repeat offenders',
            key: 'RepeatOffendersUsersThresholdWidget',
            resourceId: 'NtjzN0TxgXWT'
          },
          isAllowed: true,
          isDashboardWidget: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },

         */
        /*
        {
          x: 0,
          y: 3,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: '0.9531283031364617',
          key: 'IncidentClusters',
          title: 'Incident Clusters'
        },

         */
        {
          x: 0,
          y: 12,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: "0.5602556581402198",
          key: "ReportedEmailTrends",
          title: "Reported Email Trends",
          isAllowed: this?.permissions?.reportedEmailTrends
        },
        // {
        //   x: 6,
        //   y: 12,
        //   w: 6,
        //   minW: 3,
        //   defaultW: 3,
        //   midW: 6,
        //   h: 6,
        //   defaultH: 6,
        //   minH: 6,
        //   maxH: 6,
        //   i: '0.1349604029153395',
        //   key: 'TopPosts',
        //   title: 'Top Posts',
        //   isAllowed: this?.permissions?.topPosts
        // },
        {
          x: 0,
          y: 15,
          w: 6,
          minW: 6,
          defaultW: 6,
          h: 6,
          midW: 12,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: "0.5602556581402199",
          key: "PhishingCampaignTrends",
          title: "Phishing Campaign Trends",
          isAllowed: this?.permissions?.phishingCampaignTrendsCard
        },
        {
          x: 0,
          y: 9,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: "0.30768881243195656",
          title: "Recent Investigations",
          key: "RecentInvestigations",
          isAllowed: this?.permissions?.runningInvestigation
        },
        {
          x: 0,
          y: 15,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: "0.6104982760663944",
          title: "Recently Reported Incidents",
          key: "RecentlyReportedIncidents",
          isAllowed: this?.permissions?.notifiedEmail
        },
        {
          x: 6,
          y: 15,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: "0.15876452855409506",
          title: "Recently Posted Threats",
          key: "RecentlyPostedThreats",
          isAllowed: this?.permissions?.communityPosts
        },
        {
          x: 0,
          y: 21,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: "0.3901775633662319",
          key: "Reporters",
          title: "Reporters",
          isAllowed: this?.permissions?.reporters
        },
        {
          x: 6,
          y: 21,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: "0.8761474288298772",
          key: "TopRules",
          title: "Top Rules",
          isAllowed: this?.permissions?.topRules
        },
        {
          x: 0,
          y: 24,
          w: 6,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "RecentCampaigns",
          title: "Recent Campaigns",
          isAllowed: this?.permissions?.recentCampaignsCard
        },
        {
          x: 0,
          y: 27,
          w: 4,
          minW: 3,
          defaultW: 3,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "MostPhishedUsers",
          title: "Most Phished Users",
          isAllowed: this?.permissions?.mostPhishedUsersCard
        },
        {
          x: 0,
          y: 27,
          w: 4,
          minW: 3,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "MostEngagedCampaigns",
          title: "Most Engaged Campaigns",
          isAllowed: this?.permissions?.mostEngagedCampaignsCard
        },
        {
          x: 0,
          y: 27,
          w: 4,
          minW: 3,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          key: "TopPhishingSimulationReporters",
          title: "Top Phishing Simulation Reporters",
          isAllowed: true,
          isDashboardWidget: true
        },
        {
          x: 0,
          y: 30,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 12,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: "Phishing Simulation Repeat Offenders Rate",
          key: "RepeatOffendersUsersRateWidget",
          card: {
            title: "Phishing Simulation Repeat Offenders Rate",
            parentKey:
              "Reduce external phishing attack risk by lowering repeat clickers.",
            key: "RepeatOffendersUsersRateWidget",
            resourceId: "mpdEh10N5E4d"
          },
          isAllowed: true,
          parentKey: "Phishing Metrics",
          chartType: "stackedBar",
          dateInterval: "month",
          startDate: this.$moment(Date.now())
            .subtract(3, "months")
            .format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          isDashboardWidget: true
        }
      ];
      widgets = widgets.reduce((acc, widget) => {
        this.removeAvailableWidget(widget);
        if (widget.isAllowed) {
          acc.push(widget);
        }
        return acc;
      }, []);
      return widgets;
    },
    callForPostWidgets() {
      const payload = this.layout.reduce(
        (acc, widget) => {
          const { settings } = acc;
          const { x, y, w, h, title, key } = widget;
          settings.push({ x, y, w, h, title, key });
          return acc;
        },
        { settings: [] }
      );
      postWidgets(payload).finally(() => {
        this.editMode = false;
      });
    },
    handleSaveChanges() {
      this.handleDeleteShadows();
      this.callForPostWidgets();
    }
  }
};
</script>
