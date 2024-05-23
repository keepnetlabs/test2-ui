<template>
  <div class="executive-report-new-card">
    <ExecutiveReportScheduleReportDialog
      v-if="isShowScheduleReportDialog"
      :status="isShowScheduleReportDialog"
      :selected-row="selectedRow"
      :is-new="isEdit ? false : !isShowPreview"
      :is-report-saved="isReportSaved"
      :saved-report-resource-id="savedReportResourceId"
      @on-close="toggleShowScheduleReportDialog"
      @on-submit="handleScheduleReportSubmit"
    />
    <ExecutiveReportDownloadModal
      v-if="isShowDownloadModal"
      :status="isShowDownloadModal"
      :is-downloading="isPdfDownload"
      :is-created="isReportCreated"
      :is-preview="isPreviewDownload"
      :is-parent-loading="isLoading"
      @on-close="toggleShowDownloadModal"
      @on-submit="handleDownloadClick"
    />
    <ExecutiveReportCustomizeWidgetDialog
      v-if="isShowCustomizeWidgetDialog"
      :status="isShowCustomizeWidgetDialog"
      :selected-row="selectedRow"
      :default-date-range="formData.executiveReportDateRange"
      @on-close="toggleShowCustomizeWidgetDialog"
    />
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <template v-else>
      <div v-if="!isScheduledReport" class="executive-report-new-card__header">
        <div class="executive-report-new-card__header-left">
          <VBtn
            v-if="isShowPreview"
            id="btn-back--campaign-manager-clustered-table"
            text
            color="#2196f3"
            class="clustered-table-back-btn mr-2"
            @click="routeToExecutiveReports"
          >
            <VIcon left>mdi-arrow-left</VIcon>Back</VBtn
          >
          <InputDate
            v-model="formData.executiveReportDateRange"
            id="input--investigation-email-date-range"
            type="datetimerange"
            ref="refInputDate"
            style="visibility: hidden; position: absolute; min-width: 128px;"
            :format="parsedFormat"
            :valueFormat="parsedFormat"
            :picker-options="pickerOptions"
            :prefix-icon="'el-icon-date'"
          />
          <VBtn
            class="training-library-card__footer-btn"
            color="#fff"
            rounded
            :ripple="false"
            @click="handleDateRangeClick"
          >
            <VIcon class="mr-1" left>mdi-calendar-range</VIcon>
            DATE RANGE
          </VBtn>
          <VBtn
            class="training-library-card__footer-btn"
            color="#fff"
            rounded
            :ripple="false"
            @click="toggleShowScheduleReportDialog"
          >
            <VIcon class="mr-1" left>mdi-calendar-clock</VIcon>
            SCHEDULE
          </VBtn>
        </div>
        <div class="executive-report-new-card__header-right">
          <template v-if="editMode">
            <VBtn
              class="training-library-card__footer-btn"
              color="#fff"
              rounded
              :ripple="false"
              @click="handleCancelClick"
            >
              CANCEL
            </VBtn>
            <VBtn
              id="btn-add--training-library"
              rounded
              color="#2196f3"
              :class="getPreviewPdfButtonClasses"
              @click="handlePreviewClick"
            >
              <span class="training-library-new-btn__text">PREVIEW PDF</span>
            </VBtn>
            <VBtn
              id="btn-add--training-library"
              :class="getSaveButtonClasses"
              rounded
              color="#2196f3"
              @click="handleSaveReportClick"
            >
              <span class="training-library-new-btn__text">SAVE REPORT</span>
            </VBtn>
          </template>
          <VIcon
            v-if="isShowPreview && !editMode"
            color="#2196f3"
            class="executive-reports-card__right-btn mr-2"
            small
            @click="handleEditModeClick"
            >mdi-pencil</VIcon
          >
          <VIcon
            v-if="isShowPreview && !editMode"
            color="#2196f3"
            class="executive-reports-card__right-btn"
            small
            @click="handleDownloadButton"
            >mdi-download</VIcon
          >
        </div>
      </div>
      <div id="executive-report-new-card-container" :style="getDownloadPdfStyle">
        <div class="executive-report-new-card__body">
          <div v-if="getIsShowEditTopFields" class="executive-report-new-card__body-new">
            <VForm ref="refForm">
              <div>
                <VTextField
                  v-model="formData.name"
                  ref="refFiltersInput"
                  id="input--training-library-sorting"
                  label="Executive Report Name"
                  style="max-width: 448px;"
                  outlined
                  hide-details
                  autocomplete="off"
                  placeholder="Enter an executive report name"
                  :rules="[rules.required]"
                />
              </div>
              <div class="d-flex mt-2 gap-2">
                <div class="position-relative" @click="handleExecutiveReportDateClick">
                  <VTextField
                    v-model="formData.dateCreated"
                    id="input--training-library-sorting"
                    label="Date Created"
                    class="pointer-none"
                    style="max-width: 124px;"
                    outlined
                    hide-details
                    autocomplete="off"
                    placeholder="Date Created"
                    append-icon="mdi-menu-down"
                  />
                  <InputDate
                    v-model="formData.dateCreated"
                    id="input--executive-report-date"
                    type="date"
                    ref="refInputExecutiveReportDate"
                    style="visibility: hidden; position: absolute; min-width: 124px; top: 0;"
                    :format="parsedFormatWithoutTime"
                    :valueFormat="parsedFormatWithoutTime"
                  />
                </div>
                <VTextField
                  v-model="formData.companyName"
                  ref="refFiltersInput"
                  id="input--training-library-sorting"
                  label="Company Name"
                  style="max-width: 320px;"
                  outlined
                  hide-details
                  autocomplete="off"
                  placeholder="Company Name"
                  :rules="[rules.required]"
                />
              </div>
            </VForm>
            <div class="executive-report-new-card__body-new-image">
              <KFileUpload
                ref="refInputLogo"
                id="input--new-training-image"
                class="d-none"
                show-image-preview
                hint="Only jpg, png files. Max. file size 2MB"
                :extensions="['jpg', 'png']"
                :size="2"
                :show-file-size="false"
                @inputFile="handleLogoChange"
                @on-clear="handleLogoClear"
              />
              <VIcon color="#757575" small @click="handleLogoIconClick">mdi-pencil</VIcon>
              <img
                :src="
                  formData.executiveReportLogoUrl
                    ? formData.executiveReportLogoUrl
                    : formData.executiveReportLogo
                "
                :key="imgPreviewKey"
                alt="logo"
              />
            </div>
          </div>
          <div v-else class="executive-report-new-card__body-preview">
            <div class="d-flex flex-column">
              <div class="executive-report-new-card__body-preview-name">
                {{ editData.name || formData.name }}
              </div>
              <div>
                <span class="executive-report-new-card__body-preview-text"
                  >Created on {{ editData.date || formData.dateCreated }}
                </span>
                <span class="executive-report-new-card__body-preview-text">
                  by {{ editData.companyName || formData.companyName }}</span
                >
              </div>
              <div>
                <span class="executive-report-new-card__body-preview-text">
                  Date Range: {{ getDateRangeText }}
                </span>
              </div>
            </div>
            <img
              class="executive-report-new-card__body-preview-img"
              :src="
                formData.executiveReportLogoUrl
                  ? formData.executiveReportLogoUrl
                  : formData.executiveReportLogo
              "
              alt="Logo"
            />
          </div>
          <div v-if="!isShowPreview && !layout.length" class="executive-report-new-card__empty">
            Choose items from left side
          </div>
          <k-smart-grid
            class="executive-report-grid"
            ref="refGrid"
            :layout="layout"
            :col-num="colNum"
            :is-static="getIsStatic"
            :row-height="50"
            @breakpointChanged="breakpointChanged"
            @layout-updated="layoutUpdated"
            @layout-mounted="layoutMounted"
          >
            <smart-widget
              v-for="(item, index) in layout"
              :key="item.i + index"
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
                :edit-mode="!getIsStatic"
                :card="item"
                :date-range="formData.executiveReportDateRange"
                :default-widget-data="defaultWidgetData[item.key]"
                :default-widget-table-definitions="defaultWidgetTableDefinitions[item.key]"
                :date-period="formData.datePeriod"
                @on-delete="deleteWidget(item, index)"
                @on-edit="toggleShowCustomizeWidgetDialog"
              />
            </smart-widget>
          </k-smart-grid>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { createRandomCryptStringNumber, getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import KFileUpload from '@/components/Common/FileUpload/FileUpload.vue'
import ExecutiveReportScheduleReportDialog from '@/components/ExecutiveReports/ExecutiveReportScheduleReportDialog.vue'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import ExecutiveReportCustomizeWidgetDialog from '@/components/ExecutiveReports/ExecutiveReportCustomizeWidgetDialog.vue'
import KSmartGrid from '@/components/Common/Widget/KSmartGrid.vue'
import ExecutiveReportsWidget from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveReportsWidget.vue'
import { getExecutiveReport, saveExecutiveReport, updateExecutiveReport } from '@/api/reports'
import html2PDF from 'jspdf-html2canvas'
import ExecutiveReportsConsolidatedPhishingSimulation from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsConsolidatedPhishingSimulation.vue'
import ExecutiveReportDownloadModal from '@/components/ExecutiveReports/ExecutiveReportDownloadModal.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import {
  createExecutiveReportChartData,
  DATE_PERIOD_ENUMS
} from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'
import * as Validations from '@/utils/validations'
import { mapGetters } from 'vuex'
export default {
  name: 'ExecutiveReportNewCard',
  components: {
    DatatableLoading,
    ExecutiveReportDownloadModal,
    KSmartGrid,
    ExecutiveReportCustomizeWidgetDialog,
    InputDate,
    ExecutiveReportScheduleReportDialog,
    KFileUpload
  },
  props: {
    isSaveButtonDisabled: {
      type: Boolean,
      default: true
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default: () => ({})
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    isScheduledReport: {
      type: Boolean,
      default: false
    },
    defaultCompanyLogo: {
      type: File,
      default: () => null
    }
  },
  data() {
    return {
      activeBreakpoint: 'lg',
      layout: [],
      initialLayout: [],
      colNum: 12,
      newItemY: 0,
      isReportSaved: false,
      savedReportResourceId: '',
      activatePreview: this.isPreview,
      editMode: !this.isPreview,
      isActionButtonDisabled: false,
      isPreviewDownload: false,
      isPdfDownload: false,
      isReportCreated: false,
      justDownload: false,
      parsedFormat: getTimeZone(false),
      parsedFormatWithoutTime: getTimeZone(true),
      isShowScheduleReportDialog: false,
      isShowCustomizeWidgetDialog: false,
      isShowDownloadModal: false,
      isLoading: false,
      schedulingFormData: {},
      rules: {
        required: (v) => Validations.required(v)
      },
      imgPreviewKey: `key-${createRandomCryptStringNumber()}`,
      pickerOptions: {
        onPick: (date) => {
          const { minDate, maxDate } = date
          const refPicker = this.$refs.refInputDate
          if (maxDate && minDate) {
            this.date = refPicker.formatToValue([minDate, maxDate])
          }
          this.formData.datePeriod = 4
        },
        shortcuts: [
          {
            text: 'Last month',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
              this.formData.datePeriod = 0
            }
          },
          {
            text: 'Last 3 months',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
              this.formData.datePeriod = 1
            }
          },
          {
            text: 'Last 6 months',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
              this.formData.datePeriod = 2
            }
          },
          {
            text: 'Last Year',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
              this.formData.datePeriod = 3
            }
          },
          {
            text: 'All time',
            onClick: (picker) => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3600)
              picker.$emit('pick', [start, end])
              this.formData.datePeriod = 4
            }
          }
        ]
      },
      selectedRow: {},
      allWidgets: {
        PhishingOverview: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Phishing Overview',
          key: 'PhishingOverview',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        PhishingCampaignTrendWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Phishing Campaign Trends',
          subtitle: '(Phishing)',
          key: 'PhishingCampaignTrendWidget',
          name: 'Phishing Campaign Trend',
          widgetType: 'PhishingCampaignTrendWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        PhishingCampaignRiskiestUsersTableWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Phishing Campaign Riskiest Users',
          key: 'PhishingCampaignRiskiestUsersTableWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'table',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        'ReportedEmailThreats(Phishing)': {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Reported Email Threats (Phishing)',
          key: 'ReportedEmailThreats(Phishing)',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'bar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        MostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Most Engaged Campaigns',
          key: 'MostEngagedCampaigns',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        RecentlyPostedThreats: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Recently Posted Threats',
          key: 'RecentlyPostedThreats',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'bar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        ConsolidatedPhishingSimulationMetrics: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Consolidated PhishingSimulation Metrics',
          key: 'ConsolidatedPhishingSimulationMetrics',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'bar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        CountOfPhishedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Count Of Phished Campaigns',
          key: 'CountOfPhishedCampaigns',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'area',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        RiskScore: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Risk Score',
          key: 'RiskScore',
          isAllowed: true,
          parentKey: 'Risk Score',
          chartType: 'gauge',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        TrainingCompletion: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Training Completion',
          key: 'TrainingCompletion',
          isAllowed: true,
          parentKey: 'Training Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        TopRiskiestUsers: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Top Riskiest Users',
          key: 'TopRiskiestUsers',
          isAllowed: true,
          parentKey: 'Training Metrics',
          chartType: 'table',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        TrainingEnrollments: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Training Enrollments',
          key: 'TrainingEnrollments',
          isAllowed: true,
          parentKey: 'Training Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        VishingCampaignTrends: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Vishing Campaign Trends',
          key: 'VishingCampaignTrends',
          isAllowed: true,
          parentKey: 'Vishing Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        VishingMostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Most Engaged Campaigns',
          key: 'VishingMostEngagedCampaigns',
          isAllowed: true,
          parentKey: 'Vishing Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        QuishingCampaignTrendWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Quishing Campaign Trend',
          key: 'QuishingCampaignTrendWidget',
          isAllowed: true,
          parentKey: 'Quishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        QuishingMostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Most Engaged Campaigns',
          key: 'QuishingMostEngagedCampaigns',
          isAllowed: true,
          parentKey: 'Quishing Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        CallbackCampaignTrendWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Callback Campaign Trend',
          key: 'CallbackCampaignTrendWidget',
          isAllowed: true,
          parentKey: 'Callback Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        CallbackMostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Most Engaged Campaigns',
          key: 'CallbackMostEngagedCampaigns',
          isAllowed: true,
          parentKey: 'Callback Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        SmishingCampaignTrendWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Smishing Campaign Trend',
          key: 'SmishingCampaignTrendWidget',
          isAllowed: true,
          parentKey: 'Smishing Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        SmishingMostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Most Engaged Campaigns',
          key: 'SmishingMostEngagedCampaigns',
          isAllowed: true,
          parentKey: 'Smishing Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        PhishingReporterTrends: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Phishing Campaign Trends',
          key: 'PhishingReporterTrends',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        PhishingReporterMostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Most Engaged Campaigns',
          key: 'PhishingReporterMostEngagedCampaigns',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        IncidentResponderPhishingCampaignTrends: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Phishing Campaign Trends',
          key: 'IncidentResponderPhishingCampaignTrends',
          isAllowed: true,
          parentKey: 'Incident Responder Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        IncidentResponderReportedEmailTrends: {
          x: 0,
          y: 0,
          w: 12,
          minW: 6,
          defaultW: 12,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Reported Email Trends',
          key: 'IncidentResponderReportedEmailTrends',
          isAllowed: true,
          parentKey: 'Incident Responder Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        IncidentResponderMostEngagedCampaigns: {
          x: 0,
          y: 0,
          w: 6,
          minW: 6,
          defaultW: 6,
          midW: 6,
          h: 6,
          defaultH: 6,
          minH: 6,
          maxH: 6,
          i: createRandomCryptStringNumber(),
          title: 'Most Engaged Campaigns',
          key: 'IncidentResponderMostEngagedCampaigns',
          isAllowed: true,
          parentKey: 'Incident Responder Metrics',
          chartType: 'doughnut',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        }
      },
      formData: {
        executiveReportDateRange: [
          this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          this.$moment(Date.now()).format(getTimeZoneForMoment())
        ],
        name: '',
        datePeriod: 1,
        dateCreated: this.$moment(Date.now()).format(getTimeZoneForMoment()),
        companyName: localStorage.getItem('selectedCompanyName'),
        description: 'Description',
        executiveReportLogo: ''
      },
      defaultWidgetData: {},
      defaultWidgetTableDefinitions: {}
    }
  },
  computed: {
    ...mapGetters({
      brandName: 'whitelabel/getBrandName'
    }),
    getDownloadPdfStyle() {
      return this.isPdfDownload
        ? {
            padding: '4px',
            width: '1088px'
          }
        : null
    },
    getSaveButtonClasses() {
      let classes = ['training-library-new-btn']
      if (!this.formData.name || !this.layout.length)
        classes.push('new-executive-report-button-disabled')
      return classes
    },
    getPreviewPdfButtonClasses() {
      let classes = ['training-library-new-btn ml-2']
      //if (!this.formData.name) classes.push('new-executive-report-button-disabled')
      return classes
    },
    isShowPreview() {
      return this.isPreview || this.activatePreview
    },
    getIsStatic() {
      if (this.$route.name === 'Preview Executive Report') return !this.editMode
      return this.isShowPreview ? this.isShowPreview : !this.editMode
    },
    getIsShowEditTopFields() {
      if (this.$route.name === 'Preview Executive Report')
        return this.isPreviewDownload ? false : this.editMode
      return !this.isShowPreview
    },
    getDateRangeText() {
      const datePeriod = this.formData.datePeriod
      if (datePeriod === 0) {
        return 'Last Month'
      } else if (datePeriod === 1) {
        return 'Last 3 Months'
      } else if (datePeriod === 2) {
        return 'Last 6 Months'
      } else if (datePeriod === 3) {
        return 'Last Year'
      }
      return `${this.formData.executiveReportDateRange[0]} - ${this.formData.executiveReportDateRange[1]}`
    }
  },
  watch: {
    editMode(val) {
      if (val) {
        this.initialLayout = JSON.parse(JSON.stringify(this.layout))
      }
    },
    defaultCompanyLogo(file) {
      this.handleLogoChange(file)
    }
  },
  async created() {
    try {
      if (this.isEdit || this.activatePreview || this.isDuplicate) {
        this.isLoading = true
        const { params, query } = this.$route
        const { id } = params
        const { token, companyResourceId, dateFormat } = query
        if (this.isScheduledReport && (!id || !token || !companyResourceId)) return
        const report = await getExecutiveReport(id, token, companyResourceId)
        const {
          data: { data }
        } = report
        this.selectedRow = data
        this.formData.companyName = data.companyName
        this.formData.dateCreated = data.dateCreated
        this.formData.datePeriod = DATE_PERIOD_ENUMS[data.datePeriod]
        const end = new Date()
        const start = new Date()
        if (this.formData.datePeriod === 0) {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          this.formData.executiveReportDateRange = [
            this.$moment(start).format(getTimeZoneForMoment()),
            this.$moment(end).format(getTimeZoneForMoment())
          ]
        } else if (this.formData.datePeriod === 1) {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          this.formData.executiveReportDateRange = [
            this.$moment(start).format(getTimeZoneForMoment()),
            this.$moment(end).format(getTimeZoneForMoment())
          ]
        } else if (this.formData.datePeriod === 2) {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
          this.formData.executiveReportDateRange = [
            this.$moment(start).format(getTimeZoneForMoment()),
            this.$moment(end).format(getTimeZoneForMoment())
          ]
        } else if (this.formData.datePeriod === 3) {
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
          this.formData.executiveReportDateRange = [
            this.$moment(start).format(getTimeZoneForMoment()),
            this.$moment(end).format(getTimeZoneForMoment())
          ]
        } else {
          this.formData.executiveReportDateRange = [data.startDate, data.endDate]
        }
        this.formData.description = data.description
        this.formData.name = this.isDuplicate ? `${data.name} - Copy` : data.name
        data.widgets.forEach((widget) => {
          if (
            widget.widgetDatas &&
            widget.widgetDatas &&
            widget.widgetDatas[0] &&
            widget.widgetDatas[0].tableValues
          ) {
            const definitions = widget.widgetDatas[0].tableDefinitions
            const values = widget.widgetDatas[0].tableValues.slice(0, 5)
            this.defaultWidgetTableDefinitions[widget.widgetType] = definitions.map(
              (definition) => ({
                property: definition.name,
                label: definition.label,
                align: 'left'
              })
            )
            this.defaultWidgetData[widget.widgetType] = values
            this.isTypeTable = true
          } else {
            this.defaultWidgetData[widget.widgetType] = createExecutiveReportChartData(
              widget.widgetDatas,
              dateFormat
            )
          }
        })
        this.layout = JSON.parse(data.widgetLayout)
      }
      setTimeout(() => {
        this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
      }, 20)
    } catch (e) {
      this.layout = this.getDefaultLayoutObject()
      setTimeout(() => {
        this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
      }, 20)
    } finally {
      this.isLoading = false
    }
  },
  mounted() {
    if (this.$route.params.showDownloadModal) {
      this.isShowDownloadModal = true
      this.justDownload = true
    }
  },
  methods: {
    breakpointChanged({ newBreakpoint }) {
      this.activeBreakpoint = newBreakpoint
      const bdCol = this.getBdCol(newBreakpoint)
      let x = 0,
        xValue = 0,
        y = 0
      this.layout.sort((a, b) => {
        if (a.y > b.y) {
          return 1
        } else if (a.y === b.y) {
          if (a.x > b.x) {
            return 1
          } else if (a.x < b.x) {
            return -1
          }
          return 0
        } else {
          return -1
        }
      })
      this.layout = this.layout.map((item) => {
        const itemWidth = item.w
        xValue = x
        x += itemWidth
        if (x > bdCol) {
          x = itemWidth
          y += item.h
          xValue = 0
        }

        return { ...item, w: itemWidth, x: xValue, y }
      })
    },
    layoutUpdated(newLayout) {},
    layoutMounted() {},
    routeToExecutiveReports() {
      if (this.$route.params.isFromScheduledReport)
        return this.$router.push({ name: 'Scheduled Reports' })
      this.$router.push('/reports/executive-reports')
    },
    toggleShowScheduleReportDialog() {
      this.isShowScheduleReportDialog = !this.isShowScheduleReportDialog
    },
    toggleShowCustomizeWidgetDialog(item) {
      this.selectedRow = item
      this.isShowCustomizeWidgetDialog = !this.isShowCustomizeWidgetDialog
    },
    toggleShowDownloadModal() {
      if (this.isShowDownloadModal && this.$route.params.showDownloadModal)
        return this.$router.push({ name: 'Executive Reports' })
      this.isShowDownloadModal = !this.isShowDownloadModal
    },
    handleDateRangeClick() {
      this.$refs.refInputDate.showPicker()
    },
    handleExecutiveReportDateClick() {
      this.$refs.refInputExecutiveReportDate.showPicker()
    },
    handlePreviewClick() {
      if (!this.$refs.refForm.validate()) return
      this.activatePreview = true
      this.isPreviewDownload = true
      this.toggleShowDownloadModal()
    },
    handleSaveReportClick() {
      if (!this.$refs.refForm.validate()) return
      const payload = {
        executiveReport: {
          name: this.formData.name,
          dateCreated: this.formData.dateCreated,
          startDate: '',
          endDate: '',
          description: this.formData.description,
          datePeriod: this.formData.datePeriod,
          companyName: this.formData.companyName,
          companyLogo: this.formData.executiveReportLogo
        },
        widgetLayouts: this.layout
      }
      if (this.formData.datePeriod === 4) {
        payload.executiveReport.startDate = this.formData.executiveReportDateRange[0]
        payload.executiveReport.endDate = this.formData.executiveReportDateRange[1]
      }
      payload.scheduling = Object.keys(this.schedulingFormData).length
        ? this.schedulingFormData
        : null
      this.isActionButtonDisabled = true
      const formData = new FormData()
      formData.append('ExecutiveReport.Name', payload.executiveReport.name)
      formData.append('ExecutiveReport.DateCreated', payload.executiveReport.dateCreated)
      formData.append('ExecutiveReport.StartDate', payload.executiveReport.startDate)
      formData.append('ExecutiveReport.EndDate', payload.executiveReport.endDate)
      formData.append('ExecutiveReport.Description', payload.executiveReport.description)
      formData.append('ExecutiveReport.DatePeriod', payload.executiveReport.datePeriod)
      formData.append('ExecutiveReport.CompanyName', payload.executiveReport.companyName)
      formData.append('ExecutiveReport.CompanyLogo', payload.executiveReport.companyLogo)
      payload.widgetLayouts.forEach((layout, index) => {
        Object.keys(layout).forEach((key) => {
          formData.append(`WidgetLayouts[${index}].${key}`, layout[key])
        })
      })
      if (payload.scheduling) {
        formData.append('Scheduling.Name', payload.scheduling.name)
        formData.append('Scheduling.Frequency', payload.scheduling.frequency)
        formData.append('Scheduling.Schedule', payload.scheduling.schedule)
        formData.append(
          'Scheduling.ScheduledDateTimeZoneId',
          payload.scheduling.scheduledDateTimeZoneId
        )
        formData.append(
          'Scheduling.IsRegionAwareTimeZone',
          payload.scheduling.isRegionAwareTimeZone
        )
        payload.scheduling.emailAddresses.forEach((email, index) => {
          formData.append(`Scheduling.EmailAddresses[${index}]`, email)
        })
        formData.delete('Scheduling.EmailAddresses')
      }
      if (this.isEdit || this.$route.name === 'Preview Executive Report' || this.isReportSaved) {
        const id = this.$route.params.id || this.savedReportResourceId
        updateExecutiveReport(formData, id)
          .then(() => {
            this.activatePreview = true
            this.editMode = false
            this.$emit('on-edit-cancel')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        saveExecutiveReport(formData)
          .then((response) => {
            this.isReportSaved = true
            this.savedReportResourceId = response?.data?.data.resourceId
            this.activatePreview = true
            this.editMode = false
            this.$emit('on-edit-cancel')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    },
    async handleDownloadClick(
      fileName = this.formData.name,
      activatePreview = this.activatePreview
    ) {
      this.isPdfDownload = true
      const justDownload = this.justDownload
      const isShowDownloadModalFromStart = this.$route.params.showDownloadModal
      const updateReportCreated = () => {
        this.isReportCreated = true
      }
      const brandName = this.brandName
      this.$nextTick(async () => {
        setTimeout(async () => {
          let page = document.querySelector('#executive-report-new-card-container')
          const pdf = await html2PDF(page, {
            html2canvas: {
              useCORS: true
            },
            jsPDF: {
              format: 'a4'
            },
            success(pdf) {
              if (activatePreview && !justDownload) {
                pdf.setProperties({
                  title: fileName
                })
                const blob = pdf.output('blob')
                const file = new File([blob], `${fileName}.pdf`, {
                  type: 'application/pdf'
                })
                updateReportCreated()
                setTimeout(() => {
                  window.open(`${URL.createObjectURL(file)}#toolbar=0`)
                }, 1000)
              } else {
                updateReportCreated()
                setTimeout(() => {
                  pdf.save(this.output)
                }, 1000)
              }
            },
            watermark: ({ pdf, pageNumber, totalPageNumber }) => {
              const lastY = this.layout[this.layout.length - 1]?.y
              if (lastY % 18 === 0 && totalPageNumber > 1) pdf.deletePage(totalPageNumber)
              pdf.setTextColor('#383B41')
              pdf.setFontSize(8)
              let width, height
              try {
                width = pdf?.internal?.pageSize?.width || 297
                height = pdf?.internal?.pageSize?.height || 841
              } catch (e) {
                width = 297
                height = 841
              }
              try {
                pdf.text(`Powered By ${brandName}`, width / 2 - 40, height - 16, {})
              } catch (e) {}
            },
            margin: {
              top: 24,
              right: 24,
              bottom: 24,
              left: 24
            },

            imageType: 'image/jpeg',
            output: `./pdf/${fileName}.pdf`,
            autoResize: true
          })
          setTimeout(() => {
            if (isShowDownloadModalFromStart)
              return this.$router.push({ name: 'Executive Reports' })
            this.isPdfDownload = false
            this.activatePreview = false
            this.isPreviewDownload = false
            this.justDownload = false
            this.isShowDownloadModal = false
            this.isReportCreated = false
          }, 1000)
        }, 1000)
      })
    },
    handleCancelClick() {
      if (
        this.activatePreview &&
        !['Duplicate Executive Report', 'Edit Executive Report'].includes(this.$route.name)
      ) {
        this.editMode = false
        this.$emit('on-edit-cancel')
      } else this.routeToExecutiveReports()
    },
    handleLogoChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formData.executiveReportLogo = null
        return
      }
      this.formData.executiveReportLogo = file
      this.formData.executiveReportLogoUrl = URL.createObjectURL(file)
      this.imgPreviewKey = `key-${createRandomCryptStringNumber()}`
    },
    handleLogoClear() {
      this.coverImageFilePreview = []
      this.formData.executiveReportLogo = ''
      this.formData.executiveReportLogoUrl = ''
    },
    handleLogoIconClick() {
      const containerEl = this.$refs.refInputLogo.$refs.upload.$el
      containerEl.querySelector('input').click()
    },
    getBdCol(newBreakpoint = '') {
      if (newBreakpoint === 'xs') return 6
      return newBreakpoint === 'xxs' ? 2 : 12
    },
    addWidget(widget) {
      let newItem
      const widgetObj = {
        ...this.allWidgets[widget.widgetType],
        i: createRandomCryptStringNumber(),
        startDate: this.formData.executiveReportDateRange[0],
        endDate: this.formData.executiveReportDateRange[1],
        resourceId: widget.resourceId,
        title: widget.name,
        parentKey: widget.description
      }
      if (window.innerWidth < 1100 && window.innerWidth > 900) {
        widgetObj.w = 6
      } else if (window.innerWidth < 900) {
        widgetObj.w = 6
      } else {
        this.allWidgets[widget.widgetType].w = this.allWidgets[widget.widgetType].defaultW
      }
      newItem = widgetObj
      newItem['y'] = this.newItemY
      this.newItemY += newItem.h
      this.layout.push(widgetObj)
    },
    deleteWidget(item, index) {
      this.layout.splice(index, 1)
      this.$emit('on-delete', item)
    },
    getComponent(componentString) {
      switch (componentString) {
        case 'ConsolidatedPhishingSimulationMetrics':
          return ExecutiveReportsConsolidatedPhishingSimulation
        default:
          return ExecutiveReportsWidget
      }
    },
    handleDownloadButton() {
      this.justDownload = true
      this.toggleShowDownloadModal()
    },
    handleEditModeClick() {
      this.editMode = true
      this.activatePreview = false
      this.$emit('on-edit')
    },
    handleScheduleReportSubmit(data) {
      this.isShowScheduleReportDialog = false
      this.schedulingFormData = data
    }
  }
}
</script>
