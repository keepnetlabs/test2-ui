<template>
  <div class="emailTemplatePreview">
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div
      v-show="!isLoading"
      class="emailTemplatePreview__container"
      style="padding-top: 13px !important"
    >
      <div
        class="emailTemplatePreview__container-main"
        :style="{
          minHeight: 'auto !important',
          border: isTargetGroupsValid ? '' : '1px solid #f56c6c !important',
          borderRadius: '12px',
        }"
      >
        <div class="emailTemplatePreview-content">
          <div class="emailTemplatePreview-content--search">
            <div class="d-flex justify-space-between" style="padding: 20px">
              <div class="d-flex">
                <div>
                  <v-text-field
                    v-model.trim="search"
                    placeholder="Search"
                    outlined
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    style="
                      max-width: 328px;
                      min-width: 328px;
                      width: 100%;
                      padding-right: 24px !important;
                    "
                  ></v-text-field>
                </div>
                <div>
                  <KSelect
                    v-model="scenarioType"
                    placeholder="Campaign Type"
                    clearable
                    outlined
                    persistent-hint
                    style="padding-right: 4px !important; max-width: 200px !important"
                    :items="scenarioTypeItems"
                  />
                </div>
                <div>
                  <KSelect
                    v-model="language"
                    placeholder="Language"
                    clearable
                    outlined
                    persistent-hint
                    style="
                      padding-right: 4px !important;
                      padding-left: 4px !important;
                      max-width: 200px !important;
                    "
                    :items="languageItems"
                  />
                </div>
              </div>
            </div>
          </div>
          <multipane class="vertical-panes" layout="vertical" :style="getStyle">
            <template v-if="getItems.length">
              <div
                class="pane"
                :style="{
                  maxWidth: '25% !important',
                  minWidth: '25% !important',
                  pointerEvents: isLoading ? 'none' : 'inherit',
                }"
                @scroll="handleScroll"
              >
                <div
                  v-for="(item, index) in getItems"
                  :key="index"
                  :class="[
                    'template-list',
                    { 'template-list--selected': item.resourceId === value },
                  ]"
                  @click="setSelectedTemplate(item, index)"
                >
                  <div class="d-flex justify-space-between mb-2">
                    <div class="d-flex flex-column wrapWord">
                      <div class="template-list--item template-list--item__header">
                        {{ item.name }}
                      </div>
                      <div
                        class="template-list--item template-list--item__sub-header"
                        style="overflow: hidden; text-overflow: ellipsis"
                      >
                        {{ item.methodType }}
                        &#8226;
                        <span class="template-list--item__sub-header--span">by</span>
                        {{ item["createdBy"] }}
                      </div>
                    </div>
                  </div>
                  <div class="d-flex justify-space-between mb-2">
                    <div
                      class="template-list--item template-list--item__sub-header"
                      style="overflow: hidden; text-overflow: ellipsis"
                    >
                      started on {{ item.createTime }} &#8226; ended on
                      {{ item.lastLaunch }}
                    </div>
                  </div>

                  <div class="template-list--item mt-2">
                    <ShowMoreTags :default-badges="item.tags" />
                  </div>
                  <div class="template-list--item mt-2">
                    <ShowMoreTags
                      :default-badges="item.failedPercentageTag"
                      badgeColor="#757575"
                    />
                  </div>
                </div>
              </div>
              <multipane-resizer></multipane-resizer>
              <div class="pane pl-3 mt-2" :style="{ flexGrow: 1 }">
                <ElTabs
                  v-model="selectedScenarioTab"
                  class="phishing-scenario-tab-container"
                  @tab-click="callForScenarioDetail"
                >
                  <ElTabPane
                    v-for="(template, index) in phishingScenarios"
                    :key="index"
                    :name="template.name"
                    :label="template.name"
                  />
                </ElTabs>
                <ElTabs v-model="tab" class="k-sub-tab" @tab-click="handleTabChange">
                  <ElTabPane
                    :label="labels.CampaignResults"
                    name="campaign-results"
                    id="send-training-campaign-results"
                  >
                    <div
                      class="send-training-campaign-results-container"
                      style="margin-top: -20px"
                    >
                      <FormGroupHorizontalContent
                        :label="labels.SelectInstance"
                        style="margin-top: 0 !important"
                      >
                        <KSelect
                          v-model.trim="phishingCampaignInstanceGroup"
                          id="input--campaign-manager-advanced-settings-other-settings-percent"
                          class="ml-2"
                          style="min-width: 80%"
                          outlined
                          dense
                          hide-details
                          :items="phishingCampaignReportItems"
                          @change="callForCampaignSummary"
                        />
                      </FormGroupHorizontalContent>
                    </div>
                    <DatatableLoading
                      v-if="isCampaignLoading"
                      :loading="isCampaignLoading"
                      class="mt-2"
                    />
                    <div v-show="!isCampaignLoading" style="margin-top: 24px">
                      <div
                        class="campaign-manager-target-user-groups-header"
                        style="margin-right: 16px; flex-direction: row"
                      >
                        <v-icon color="#000000">mdi-account-multiple</v-icon>
                        <span class="campaign-manager-target-user-groups-header__text"
                          >Total {{ totalCampaignUsers }} users from
                          {{ totalCampaignGroups }} groups</span
                        >
                      </div>
                    </div>
                    <div
                      v-if="!isCampaignLoading"
                      style="
                        margin-top: -64px;
                        margin-left: 20px;
                        max-height: 525px;
                        max-width: 525px;
                      "
                    >
                      <Pie :data="pieData" :chart-options="chartOptions" />
                    </div>
                  </ElTabPane>
                  <ElTabPane
                    name="email"
                    :label="labels.JustEmail"
                    id="send-training-email-page"
                  >
                    <div class="template-preview mt-n1 pt-0">
                      <div class="template-preview__text pl-2" v-if="!!emailTemplate">
                        <div>
                          <span class="template-preview__text--title">Name: </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.name
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title">Subject: </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.subject
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title">From Name: </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.fromName
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title"
                            >From Email Address:
                          </span>
                          <span class="template-preview__text--body">{{
                            emailTemplateParams.fromAddress
                          }}</span>
                        </div>
                      </div>
                      <hr class="mt-2" v-if="!!emailTemplate" />
                      <KEmailPreview
                        v-if="!!emailTemplate"
                        :key="emailTemplate"
                        :html="emailTemplate"
                      />
                    </div>
                  </ElTabPane>
                  <ElTabPane
                    v-if="!isAttachmentBasedScenario"
                    :label="labels.LandingPage"
                    name="landing-page"
                    id="send-training-landing-page"
                  >
                    <ElTabs
                      v-if="isLandingPageTabsVisible"
                      v-model="selectedLandingPageTab"
                    >
                      <ElTabPane
                        v-for="(template, index) in landingPageTemplates"
                        :key="index"
                        :label="`Page ${index + 1}`"
                        :name="`${index + 1}`"
                      >
                        <div class="template-preview mt-n1 pt-0">
                          <div
                            v-if="!!template.content"
                            class="template-preview__text pl-2"
                          >
                            <div>
                              <span class="template-preview__text--title">Name: </span>
                              <span class="template-preview__text--body">{{
                                landingPageParams.name
                              }}</span>
                            </div>
                            <div>
                              <span class="template-preview__text--title"
                                >Phishing URL:
                              </span>
                              <span class="template-preview__text--body">{{
                                landingPageParams.urlTemplate
                              }}</span>
                            </div>
                          </div>
                          <hr class="mt-2" v-if="!!template.content" />
                          <KEmailPreview
                            v-if="!!template.content"
                            :html="template.content"
                          />
                        </div>
                      </ElTabPane>
                    </ElTabs>
                    <div v-else class="template-preview mt-n1 pt-0">
                      <div
                        class="template-preview__text pl-2"
                        v-if="!!getSingleTemplateDetails"
                      >
                        <div>
                          <span class="template-preview__text--title">Name: </span>
                          <span class="template-preview__text--body">{{
                            landingPageParams.name
                          }}</span>
                        </div>
                        <div>
                          <span class="template-preview__text--title"
                            >Phishing URL:
                          </span>
                          <span class="template-preview__text--body">{{
                            landingPageParams.urlTemplate
                          }}</span>
                        </div>
                      </div>
                      <hr class="mt-2" v-if="!!getSingleTemplateDetails" />
                      <KEmailPreview
                        v-if="!!getSingleTemplateDetails"
                        :html="getSingleTemplateDetails"
                      />
                    </div>
                  </ElTabPane>
                </ElTabs>
              </div>
            </template>
            <div
              class="custom-empty-table-message d-flex align-center"
              style="min-height: 60vh"
              v-else
            >
              <div class="empty-inline">
                <slot name="empty-table-inline">
                  <h2
                    :id="`text--empty-message-${Math.random().toString().substring(2)}`"
                  >
                    {{ getTableEmptyTextMessage }}
                  </h2>
                  <p
                    :id="`text--empty-sub-message-${Math.random()
                      .toString()
                      .substring(2)}`"
                  >
                    {{ getTableEmptySubMessage }}
                  </p>
                </slot>
              </div>
            </div>
          </multipane>
        </div>
      </div>
      <CustomError
        class="mb-6 ml-2"
        style="margin-top: 2px"
        :is-valid="isTargetGroupsValid"
        :error-message="getTargetGroupErrorMessage"
      />
    </div>
  </div>
</template>

<script>
import KSelect from "@/components/Common/Inputs/KSelect";
import DatatableLoading from "@/components/SkeletonLoading/DatatableLoading";
import ShowMoreTags from "@/components/ShowMoreTags";
import { Multipane, MultipaneResizer } from "vue-multipane";
import KEmailPreview from "@/components/KEmailPreview";
import { getDefaultAxiosPayload } from "@/utils/functions";
import { EMITS } from "../utils";
import {
  getCampaignJobSummaryForTraining,
  getCampaignJobSummaryTargetGroups,
  getCampaignManagerPreview,
  searchUnscheduledCampaigns,
  searchCampaignPhishingJob,
} from "@/api/phishingsimulator";
import { useLoading } from "@/hooks/useLoading";
import labels from "@/model/constants/labels";
import FormGroupHorizontalContent from "@/components/SmallComponents/FormGroupHorizontalContent";
import Pie from "@/components/Common/Charts/Pie";
import useDebounce from "@/hooks/useDebounce";
import CustomError from "@/components/CustomError.vue";
export default {
  name: "SendTrainingSelectUsersByCampaign",
  components: {
    CustomError,
    Pie,
    FormGroupHorizontalContent,
    KEmailPreview,
    ShowMoreTags,
    KSelect,
    Multipane,
    MultipaneResizer,
    DatatableLoading,
  },
  props: {
    value: {
      type: String,
    },
    isTargetGroupsValid: {
      type: Boolean,
      default: true,
    },
  },
  inject: {
    getLanguages: {
      type: Function,
    },
  },
  mixins: [useLoading, useDebounce],
  data() {
    return {
      labels,
      axiosPayload: getDefaultAxiosPayload(),
      search: "",
      scenarioType: "",
      language: "",
      isShowTargetGroupUsersError: false,
      scenarioTypeItems: [
        "Multiple Method",
        "Click-Only",
        "Data Submission",
        "Attachment",
        "MFA",
      ],
      tab: "campaign-results",
      phishingScenarios: [],
      campaignItems: [],
      campaignMethod: "Click-Only",
      totalCampaignUsers: 0,
      isCampaignLoading: false,
      totalCampaignGroups: 0,
      isAttachmentBasedScenario: false,
      selectedScenarioTab: "",
      methodTypeId: 1,
      emailTemplate: null,
      emailTemplateParams: null,
      landingPageTemplates: null,
      landingPageParams: null,
      selectedCampaign: null,
      phishingCampaignResourceId: "",
      selectedLandingPageTab: "1",
      phishingCampaignInstanceGroup: null,
      phishingCampaignReportItems: [],
      timeout: null,
      initial: true,
      pieData: [],
      chartOptions: {},
      searchCampaignReportAxiosPayload: getDefaultAxiosPayload({
        orderBy: "CreatedDate",
        pageSize: 100,
      }),
    };
  },
  computed: {
    getTargetGroupErrorMessage() {
      return "At least one target user must be selected";
    },
    languageItems() {
      return (
        this?.getLanguages()?.map((language) => ({
          text: language.name,
          value: language.code,
        })) || []
      );
    },
    getStyle() {
      const style = {};
      if (!this.getItems.length) {
        style.maxHeight = "360px";
        style.display = "flex";
        style.justifyContent = "center";
        style.alignItems = "center";
      }
      return style;
    },
    isLandingPageTabsVisible() {
      return this?.landingPageTemplates?.length > 1;
    },
    getItems() {
      return this.campaignItems;
    },
    getTableEmptyTextMessage() {
      return this.isFilterOrSearchActive
        ? "Sorry, that search and filter criteria has no results."
        : "You do not have any Campaigns yet.";
    },
    getTableEmptySubMessage() {
      return !this.isFilterOrSearchActive
        ? "Go to Phishing Simulator>Campaign Manager to create a new campaign"
        : "Please try adjusting your search or filter";
    },
    getSingleTemplateDetails() {
      return this?.landingPageTemplates?.[0]?.content || "";
    },
    isFilterOrSearchActive() {
      return this.search || this.language || this.scenarioType;
    },
  },
  watch: {
    search(val) {
      this.debounce(() => {
        this.axiosPayload.filter.FilterGroups[1].FilterItems = [
          { FieldName: "name", Operator: "Contains", Value: val },
          { FieldName: "status", Operator: "Contains", Value: val },
          { FieldName: "createdBy", Operator: "Contains", Value: val },
          { FieldName: "createTime", Operator: "Contains", Value: val },
          { FieldName: "lastLaunch", Operator: "Contains", Value: val },
          { FieldName: "method", Operator: "Contains", Value: val },
          { FieldName: "languageShortCode", Operator: "Contains", Value: val },
        ];
        this.callForData(true);
      }, 500);
    },
    language(val) {
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === "languageShortCode"
      );
      const obj = {
        Value: val || "",
        FieldName: "languageShortCode",
        Operator: "Include",
      };
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj;
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj);
      }
      this.callForData(true);
    },
    scenarioType(val) {
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === "method"
      );
      const obj = { Value: val || "", FieldName: "method", Operator: "Include" };
      if (index > -1) {
        this.axiosPayload.filter.FilterGroups[0].FilterItems[index] = obj;
      } else {
        this.axiosPayload.filter.FilterGroups[0].FilterItems.push(obj);
      }
      this.callForData(true);
    },
  },
  created() {
    this.callForData();
  },
  methods: {
    callForData(fromSearch = false) {
      if (fromSearch) this.setLoading(true);
      if (this.initial) this.setLoading(true);
      searchUnscheduledCampaigns(this.axiosPayload)
        .then((response) => {
          const {
            data: { data = [] },
          } = response;
          const { results = [] } = data;
          this.campaignItems = results.map((item) => {
            const newItem = JSON.parse(JSON.stringify(item));
            delete newItem["instanceCount"];
            newItem.targetUsers = Number(newItem.targetUsers);
            newItem.total = Number(item["instanceCount"]);
            newItem["failedPercentageTag"] = [newItem.failPercentageText];
            return newItem;
          });
          if (this.campaignItems.length) {
            this.setSelectedTemplate(this.campaignItems[0]);
          }
        })
        .finally(() => {
          if (fromSearch) this.setLoading();
          if (this.initial) this.setLoading();
          if (this.initial) this.initial = false;
        });
    },
    handleScroll(e) {
      const { scrollTop, scrollHeight, offsetHeight } = e.target;
      if (
        scrollTop - (scrollHeight - offsetHeight) < 10 &&
        scrollTop - (scrollHeight - offsetHeight) > -10
      ) {
        this.axiosPayload.pageSize += 10;
        this.debounce(() => {
          this.callForData();
        }, 500);
      }
    },
    setSelectedTemplate(row) {
      this.tab = "campaign-results";
      this.selectedCampaign = row;
      this.campaignMethod = row.methodType;
      getCampaignManagerPreview(row.resourceId).then((response) => {
        const { data: { data: { phishingScenarioPreviewList } = [] } = {} } = response;
        this.phishingScenarios = phishingScenarioPreviewList;
        const phishingScenarioPreviewDto = phishingScenarioPreviewList[0] || {};
        this.selectedScenarioTab = phishingScenarioPreviewDto?.name;
        this.setActiveScenario(phishingScenarioPreviewDto || {});
        this.isCampaignLoading = true;
        searchCampaignPhishingJob(this.searchCampaignReportAxiosPayload, row.resourceId)
          .then((response) => {
            const {
              data: { data = [] },
            } = response;
            const { results = [] } = data;
            this.phishingCampaignReportItems = results.map((result) => ({
              text: `${result.startDate}(${result.status})`,
              value: result.instanceGroup,
            }));
            if (this.phishingCampaignReportItems.length) {
              this.phishingCampaignResourceId = row.resourceId;
              this.phishingCampaignInstanceGroup = results[0].instanceGroup;
              getCampaignJobSummaryForTraining(
                this.phishingCampaignResourceId,
                this.phishingCampaignInstanceGroup
              ).then((response) => {
                const { data: { data = {} } = {} } = response;
                this.$emit(EMITS.ON_ITEM_CHANGE, {
                  ...row,
                  ...data,
                  emailTemplateParams: this.emailTemplateParams,
                  landingPageParams: this.landingPageParams,
                  methodTypeId: phishingScenarioPreviewDto.methodTypeId,
                });
                this.callForCampaignSummary();
              });
            }
          })
          .catch(() => {
            this.isCampaignLoading = false;
          });
      });
    },
    setActiveScenario(phishingScenarioPreviewDto = {}) {
      this.isAttachmentBasedScenario = phishingScenarioPreviewDto?.methodTypeId === 3;
      this.emailTemplate = phishingScenarioPreviewDto?.emailTemplate?.template || "";
      this.emailTemplateParams = {
        name: phishingScenarioPreviewDto?.emailTemplate?.name || "",
        fromName: phishingScenarioPreviewDto?.emailTemplate?.fromName || "",
        fromAddress: phishingScenarioPreviewDto?.emailTemplate?.fromAddress || "",
        subject: phishingScenarioPreviewDto?.emailTemplate?.subject || "",
        attachment: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName
          ? {
              name: phishingScenarioPreviewDto?.emailTemplate?.phishingFileName,
            }
          : null,
      };
      this.landingPageTemplates =
        phishingScenarioPreviewDto?.landingPageTemplate?.landingPages || [];
      this.landingPageParams = {
        name: phishingScenarioPreviewDto?.landingPageTemplate?.name || "",
        description: phishingScenarioPreviewDto?.landingPageTemplate?.description || "",
        urlTemplate: phishingScenarioPreviewDto?.landingPageTemplate?.urlTemplate || "",
      };
    },
    callForScenarioDetail(event) {
      this.setActiveScenario(this.phishingScenarios[event.index]);
    },
    handleTabChange({ label }) {
      this.selectedLandingPageTab = "1";
      if (label === "Campaign Results") {
        this.isCampaignLoading = true;
        searchCampaignPhishingJob(
          this.searchCampaignReportAxiosPayload,
          this.selectedCampaign.resourceId
        )
          .then((response) => {
            const {
              data: { data = [] },
            } = response;
            const { results = [] } = data;
            this.phishingCampaignReportItems = results.map((result) => ({
              text: `${result.startDate}(${result.status})`,
              value: result.instanceGroup,
            }));
            if (this.phishingCampaignReportItems.length) {
              this.phishingCampaignResourceId = this.selectedCampaign.resourceId;
              this.phishingCampaignInstanceGroup = results[0].instanceGroup;
              this.callForCampaignSummary();
            }
          })
          .catch(() => {
            this.isCampaignLoading = false;
          });
      }
    },
    callForCampaignSummary() {
      this.isCampaignLoading = true;
      getCampaignJobSummaryForTraining(
        this.phishingCampaignResourceId,
        this.phishingCampaignInstanceGroup
      )
        .then((response) => {
          const { data: { data = {} } = {} } = response;
          this.totalCampaignUsers = data?.campaignInfo?.totalTargetUserCount || 0;
          const chartOptions = {
            showLabels: true,
            legend: {
              display: true,
              position: "right",
              labels: {
                usePointStyle: true,
                color: "#383B41",
                font: "Open-sans,sans-serif",
                padding: 32,
                fontSize: 12,
                generateLabels: (chart = {}) => {
                  const { data } = chart;
                  return data.datasets[0].data.map((data, index) => {
                    return {
                      text: `${this.chartOptions.labels[index]} (${data} users)`,
                      fillStyle: this.chartOptions.backgroundColor[index],
                      lineWidth: 0,
                    };
                  });
                },
              },
            },
          };
          if (this.campaignMethod === "Multiple Method") {
            this.chartOptions = {
              ...chartOptions,
              backgroundColor: [
                "#217124",
                "#43A047",
                "#E6A23C",
                "#FF4433",
                "#913831",
                "#A52A2A",
                "#FF0000",
                "#F56C6C",
              ],
              labels: [
                labels.NoResponse,
                labels.ReportedAsSuspicious,
                labels.OpenedEmail,
                labels.ClickedThePhishingLink,
                labels.OpenedAttachment,
                labels.SubmittedData,
                labels.SubmittedMFACode,
                labels.EmailFailedToSend,
              ],
              showTooltipLine: true,
            };
          } else if (this.campaignMethod === "MFA") {
            const scenarioMethodTypeId =
              data?.scenarios[0]?.landingPageTemplateInfo?.methodTypeId;
            this.chartOptions = {
              ...chartOptions,
              backgroundColor: [
                "#217124",
                "#E6A23C",
                "#43A047",
                "#B6791D",
                "#B83A3A",
                "#F56C6C",
              ],
              labels: [
                labels.NoResponse,
                labels.OpenedEmail,
                labels.ReportedAsSuspicious,
                labels.ClickedThePhishingLink,
                labels.SubmittedMFACode,
                labels.EmailFailedToSend,
              ],
              showTooltipLine: true,
            };
            if (scenarioMethodTypeId === 2) {
              this.chartOptions.labels.splice(4, 0, labels.SubmittedData);
              this.chartOptions.backgroundColor.splice(4, 0, "#B83A3A");
            }
          } else if (this.isAttachmentBasedScenario) {
            this.chartOptions = {
              ...chartOptions,
              backgroundColor: ["#217124", "#E6A23C", "#43A047", "#B83A3A", "#F56C6C"],
              labels: [
                labels.NoResponse,
                labels.OpenedEmail,
                labels.ReportedAsSuspicious,
                labels.OpenedAttachment,
                labels.EmailFailedToSend,
              ],
              showTooltipLine: true,
            };
          } else if (this.campaignMethod === "Data Submission") {
            this.chartOptions = {
              ...chartOptions,
              backgroundColor: [
                "#217124",
                "#E6A23C",
                "#43A047",
                "#B6791D",
                "#B83A3A",
                "#F56C6C",
              ],
              labels: [
                labels.NoResponse,
                labels.OpenedEmail,
                labels.ReportedAsSuspicious,
                labels.ClickedThePhishingLink,
                labels.SubmittedData,
                labels.EmailFailedToSend,
              ],
              showTooltipLine: true,
            };
          } else {
            this.chartOptions = {
              ...chartOptions,
              backgroundColor: ["#217124", "#E6A23C", "#43A047", "#B6791D", "#F56C6C"],
              labels: [
                labels.NoResponse,
                labels.OpenedEmail,
                labels.ReportedAsSuspicious,
                labels.ClickedThePhishingLink,
                labels.EmailFailedToSend,
              ],
              showTooltipLine: true,
            };
          }
          const {
            attachmentOpenedEmail,
            clickedEmail,
            noResponseEmail,
            failedToSend,
            openedEmail,
            reportedEmail,
            submittedEmail,
            mfa,
          } = data?.scenarioStats || {};
          let pieData = [];
          pieData.push(noResponseEmail);
          pieData.push(openedEmail);
          pieData.push(reportedEmail);
          if (this.methodTypeId !== 3) pieData.push(clickedEmail);
          if (this.campaignMethod === "Data Submission") pieData.push(submittedEmail);
          if (this.methodTypeId === 3) pieData.push(attachmentOpenedEmail);
          pieData.push(failedToSend);
          if (this.campaignMethod === "Multiple Method") {
            pieData = [
              noResponseEmail,
              reportedEmail,
              openedEmail,
              clickedEmail,
              attachmentOpenedEmail,
              submittedEmail,
              mfa,
              failedToSend,
            ];
          }
          if (this.campaignMethod === "MFA") {
            const scenarioMethodTypeId =
              data?.scenarios[0]?.landingPageTemplateInfo?.methodTypeId;
            pieData = [
              noResponseEmail,
              openedEmail,
              reportedEmail,
              clickedEmail,
              mfa,
              failedToSend,
            ];
            if (scenarioMethodTypeId === 2) {
              pieData.splice(4, 0, submittedEmail);
            }
          }
          this.pieData = JSON.parse(JSON.stringify(pieData));
        })
        .finally(() => {
          this.isCampaignLoading = false;
        });
      getCampaignJobSummaryTargetGroups(
        this.phishingCampaignResourceId,
        this.phishingCampaignInstanceGroup
      ).then((response) => {
        this.totalCampaignGroups = response?.data?.data?.groups?.length || 0;
      });
    },
  },
};
</script>
