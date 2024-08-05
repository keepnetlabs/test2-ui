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
            @input="dateRange = ''"
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
                    :format="parsedFormat"
                    :valueFormat="parsedFormat"
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
                  >Created on {{ editData.date || getCreatedDate }}
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
            :cols="{ lg: 12, sm: 12, xs: 12, xxs: 2 }"
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
                :is="getComponent(item.key, item.name, item)"
                :resizable="false"
                :edit-mode="!getIsStatic"
                :card="item"
                :date-range="formData.executiveReportDateRange"
                :default-widget-data="defaultWidgetData[item.key]"
                :default-widget-table-definitions="defaultWidgetTableDefinitions[item.key]"
                :date-period="formData.datePeriod"
                :date-format="dateFormat"
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
import {
  createRandomCryptStringNumber,
  getTimeZone,
  getTimeZoneForMoment,
  fileToBase64
} from '@/utils/functions'
import KFileUpload from '@/components/Common/FileUpload/FileUpload.vue'
import ExecutiveReportScheduleReportDialog from '@/components/ExecutiveReports/ExecutiveReportScheduleReportDialog.vue'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import ExecutiveReportCustomizeWidgetDialog from '@/components/ExecutiveReports/ExecutiveReportCustomizeWidgetDialog.vue'
import KSmartGrid from '@/components/Common/Widget/KSmartGrid.vue'
import ExecutiveReportsWidget from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveReportsWidget.vue'
import {
  getExecutiveReport,
  saveExecutiveReport,
  updateExecutiveReport,
  uploadExecutiveReportPdf
} from '@/api/reports'
import html2PDF from 'jspdf-html2canvas'
import ExecutiveReportDownloadModal from '@/components/ExecutiveReports/ExecutiveReportDownloadModal.vue'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading.vue'
import { DATE_PERIOD_ENUMS } from '@/components/ExecutiveReports/ExecutiveReportsWidget/utils'
import * as Validations from '@/utils/validations'
import ExecutiveReportsRiskScoreTrendAcrossIndustries from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsRiskScoreTrendAcrossIndustries.vue'
import ExecutiveReportsPhishingSimulationEngagement from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsPhishingSimulationEngagement.vue'
import { mapGetters } from 'vuex'
import ExecutiveReportsTopRiskiestUsers from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTopRiskiestUsers.vue'
import ExecutiveReportsIndustryPhishingRiskScore from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsIndustryPhishingRiskScore.vue'
import ExecutiveReportsRepeatOffendersUsers from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsRepeatOffendersUsers.vue'
import ExecutiveReportRepeatOffendersUsersBar from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportRepeatOffendersUsersBar.vue'
import ExecutiveReportsImpactOfPhishingAwarenessTraining from '@/components/ExecutiveReports/ExecutiveReportsImpactOfPhishingAwarenessTraining.vue'
import ExecutiveReportsTopRiskiestDepartments from './ExecutiveReportsCharts/ExecutiveReportsTopRiskiestDepartments.vue'
import ExecutiveReportsTrainingCompletion from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTrainingCompletion.vue'
import ExecutiveReportsTrainingCompletionBar from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTrainingCompletionBar.vue'
import ExecutiveReportsTrainingCompletionPie from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTrainingCompletionPie.vue'
import ExecutiveReportsEmptyWidget from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsEmptyWidget.vue'
import ExecutiveReportsTopRiskiestCompanies from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsTopRiskiestCompanies.vue'
import ExecutiveReportsSimulationCoverage from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsSimulationCoverage.vue'
import ExecutiveReportsSimulationCoverageBar from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsSimulationCoverageBar.vue'
import ExecutiveReportPhishingAndQuickResponseTime from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportPhishingAndQuickResponseTime.vue'
import ExecutiveReportsPhishingDwellTimeDistribution from '@/components/ExecutiveReports/ExecutiveReportsCharts/ExecutiveReportsPhishingDwellTimeDistribution.vue'
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
      dateFormat: null,
      dateRange: '',
      activatePreview: this.isPreview,
      forcePreview: false,
      editMode: !this.isPreview,
      isActionButtonDisabled: false,
      isPreviewDownload: false,
      isPdfDownload: false,
      isReportCreated: false,
      justDownload: false,
      parsedFormat: getTimeZone(false),
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
          this.formData.datePeriod = 5
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
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
              this.formData.datePeriod = 3
            }
          },
          {
            text: 'This Year',
            onClick: (picker) => {
              const today = new Date()
              const year = today.getFullYear()
              const firstDayOfYear = new Date(year, 0, 1)
              const lastDayOfYear = new Date(year, today.getMonth(), today.getDate())
              picker.$emit('pick', [firstDayOfYear, lastDayOfYear])
              this.formData.datePeriod = 4
            }
          }
        ],
        disabledDate: this.disabledDates
      },
      selectedRow: {},
      allWidgets: {
        PhishingRiskScoreAcrossIndustriesWidget: {
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
          title: 'Phishing Risk Score Across Industries',
          key: 'PhishingRiskScoreAcrossIndustriesWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        PhishingDwellTimeAndQuickestResponseTimeWidget: {
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
          title: 'Phishing dwell time and quickest response time',
          key: 'PhishingDwellTimeAndQuickestResponseTimeWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        PhishingDwellTimeDistributionWidget: {
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
          title: 'Phishing dwell time and quickest response time',
          key: 'PhishingDwellTimeDistributionWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        PhishingSimulationEngagementReportingTrendsWidget: {
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
          title: 'Phishing Simulation Reporting Trends',
          key: 'PhishingSimulationEngagementReportingTrendsWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
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
          title: 'Industry Phishing Risk Score: 62%',
          key: 'IndustryPhishingRiskScoreWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        HumanRiskScoreforHighestRiskUsersWidget: {
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
          title: 'Users with Highest Risk Scores',
          key: 'HumanRiskScoreforHighestRiskUsersWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        HumanRiskScoreforHighestRiskDepartmentsWidget: {
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
          title: 'Department with Highest Risk Scores',
          key: 'HumanRiskScoreforHighestRiskDepartmentsWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        HumanRiskScoreforHighestRiskCompaniesWidget: {
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
          title: 'Companies with Highest Risk Scores',
          key: 'HumanRiskScoreforHighestRiskCompaniesWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        RepeatOffendersUsersThresholdWidget: {
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
          title: 'Repeat Offenders Users Threshold',
          key: 'RepeatOffendersUsersThresholdWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
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
          i: createRandomCryptStringNumber(),
          title: 'Simulation Coverage',
          key: 'SimulationCoverageWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'pie',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
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
          title: 'Impact of Phishing Awareness Training',
          key: 'ImpactOfPhishingAwarenessTrainingWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
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
          title: 'Training Completion',
          key: 'TrainingCompletionWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'bar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        EmptyWidget: {
          x: 0,
          y: 0,
          w: 12,
          minW: 12,
          defaultW: 12,
          midW: 12,
          h: 2,
          defaultH: 2,
          minH: 2,
          maxH: 2,
          i: createRandomCryptStringNumber(),
          title: 'EmptyWidget',
          key: 'EmptyWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
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
    getCreatedDate() {
      return this?.formData?.dateCreated?.split(' ')[0]
    },
    getDownloadPdfStyle() {
      const style = {
        padding: '4px',
        width: '1088px'
      }

      if (this.isScheduledReport) return style
      return this.isPdfDownload ? style : null
    },
    getSaveButtonClasses() {
      let classes = ['training-library-new-btn']
      if (!this.formData.name || !this.layout.length || this.isActionButtonDisabled)
        classes.push('new-executive-report-button-disabled')
      return classes
    },
    getPreviewPdfButtonClasses() {
      return ['training-library-new-btn ml-2']
    },
    isShowPreview() {
      return this.isPreview || this.activatePreview
    },
    getIsStatic() {
      if (this.$route.name === 'Preview Executive Report')
        return !this.editMode || this.forcePreview
      return this.isShowPreview ? this.isShowPreview : !this.editMode
    },
    getIsShowEditTopFields() {
      if (this.$route.name === 'Preview Executive Report')
        return this.isPreviewDownload ? false : this.editMode
      return !this.isShowPreview
    },
    getDateRangeText() {
      if (this.dateRange) return this.dateRange
      if (this.formData.executiveReportDateRange.length < 2) return
      const firstDateLeft = this.formData.executiveReportDateRange[0].split(' ')[0]
      const lastDateLeft = this.formData.executiveReportDateRange[1].split(' ')[0]
      return `${firstDateLeft} - ${lastDateLeft}`
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
        if (dateFormat) this.dateFormat = dateFormat
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
        } else if (this.formData.datePeriod === 4) {
          const firstDayOfYear = new Date(start.getFullYear(), 0, 1)
          const lastDayOfYear = new Date(start.getFullYear(), 11, 31)
          this.formData.executiveReportDateRange = [
            this.$moment(firstDayOfYear).format(getTimeZoneForMoment()),
            this.$moment(lastDayOfYear).format(getTimeZoneForMoment())
          ]
        } else {
          this.formData.executiveReportDateRange = [data.startDate, data.endDate]
        }
        this.formData.description = data.description
        this.formData.name = this.isDuplicate ? `${data.name} - Copy` : data.name
        data.widgets.forEach((widget) => {
          if (
            widget.widgetType === 'IndustryPhishingRiskScoreWidget' ||
            widget.widgetType === 'PhishingSimulationEngagementReportingTrendsWidget' ||
            widget.widgetType === 'HumanRiskScoreforHighestRiskUsersWidget' ||
            widget.widgetType === 'RepeatOffendersUsersThresholdWidget' ||
            widget.widgetType === 'ImpactOfPhishingAwarenessTrainingWidget' ||
            widget.widgetType === 'HumanRiskScoreforHighestRiskDepartmentsWidget' ||
            widget.widgetType === 'HumanRiskScoreforHighestRiskCompaniesWidget' ||
            widget.widgetType === 'ExecutiveReportPhishingAndQuickResponseTime' ||
            widget.widgetType === 'TrainingCompletionWidget' ||
            widget.widgetType === 'SimulationCoverageWidget' ||
            widget.widgetType === 'PhishingDwellTimeDistributionWidget'
          ) {
            this.defaultWidgetData[widget.widgetType] = [widget]
          } else {
            this.defaultWidgetData[widget.widgetType] = widget.widgetDatas
          }
        })
        this.layout = JSON.parse(data.widgetLayout)
        this.dateRange = data.dateRange
        if (this.isScheduledReport) {
          setTimeout(() => {
            this.handleDownloadClick()
          }, 5000)
        }
      }
      setTimeout(() => {
        this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
      }, 20)
    } catch (e) {
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
      if (bdCol > 2) return
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
      this.forcePreview = true
      this.toggleShowDownloadModal()
    },
    async handleSaveReportClick() {
      if (!this.$refs.refForm.validate()) return
      const payload = {
        executiveReport: {
          name: this.formData.name,
          dateCreated: this.formData.dateCreated,
          startDate: '',
          endDate: '',
          description: this.formData.description,
          datePeriod: this.formData.datePeriod,
          companyName: this.formData.companyName
        },
        widgetLayouts: this.layout
      }
      if (this.formData.datePeriod === 5) {
        payload.executiveReport.startDate = this.formData.executiveReportDateRange[0]
        payload.executiveReport.endDate = this.formData.executiveReportDateRange[1]
      }
      payload.scheduling = Object.keys(this.schedulingFormData).length
        ? this.schedulingFormData
        : null
      this.isActionButtonDisabled = true
      const logo = await fileToBase64(this.formData.executiveReportLogo)
      payload.executiveReport.companyLogo = logo.split(',')[1]
      if (this.isEdit || this.$route.name === 'Preview Executive Report' || this.isReportSaved) {
        const id = this.$route.params.id || this.savedReportResourceId
        updateExecutiveReport(payload, id)
          .then(() => {
            this.activatePreview = true
            this.editMode = false
            this.$emit('on-edit-cancel')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        saveExecutiveReport(payload)
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
      let emptyWidgetIndex = this.addEmptyWidget()
      this.isPdfDownload = true
      const justDownload = this.justDownload
      const isShowDownloadModalFromStart = this.$route.params.showDownloadModal
      const isScheduledReport = this.isScheduledReport
      const { params, query } = this.$route
      const { id } = params
      const { token, companyResourceId } = query
      const updateReportCreated = () => {
        this.isReportCreated = true
      }
      const removeEmptyWidget = () => {
        if (!emptyWidgetIndex) return
        this.layout.splice(emptyWidgetIndex, 1)
      }
      const brandName = this.brandName
      this.$nextTick(async () => {
        setTimeout(async () => {
          let page = document.querySelector('#executive-report-new-card-container')
          const pdf = await html2PDF(page, {
            html2canvas: {
              useCORS: true,
              scale: window.devicePixelRatio * 2 > 4 ? 4 : window.devicePixelRatio * 2,
              logging: false
            },
            jsPDF: {
              format: 'a4'
            },
            success(pdf) {
              if ((activatePreview && !justDownload) || isScheduledReport) {
                pdf.setProperties({
                  title: fileName
                })
                const blob = pdf.output('blob')
                const file = new File([blob], `${fileName}.pdf`, {
                  type: 'application/pdf'
                })
                if (isScheduledReport) {
                  const formData = new FormData()
                  formData.append('ExecutiveReportPdf', file)
                  uploadExecutiveReportPdf(formData, id, token, companyResourceId)
                } else {
                  updateReportCreated()
                  setTimeout(() => {
                    window.open(`${URL.createObjectURL(file)}#toolbar=0`)
                  }, 1000)
                }
              } else {
                updateReportCreated()
                setTimeout(() => {
                  pdf.save(this.output)
                }, 1000)
              }
            },
            watermark: ({ pdf, pageNumber, totalPageNumber }) => {
              const lastY = this.layout[this.layout.length - 1]?.y
              if (lastY === 18 && lastY % 18 === 0 && totalPageNumber > 1)
                pdf.deletePage(totalPageNumber)
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
            imageQuality: 1.0,
            output: `${fileName}.pdf`
          })
          setTimeout(() => {
            if (isShowDownloadModalFromStart)
              return this.$router.push({ name: 'Executive Reports' })
            if (emptyWidgetIndex) removeEmptyWidget()
            this.isPdfDownload = false
            this.activatePreview = false
            this.isPreviewDownload = false
            this.justDownload = false
            this.isShowDownloadModal = false
            this.isReportCreated = false
            this.forcePreview = false
          }, 1000)
        }, 2000)
      })
    },
    addEmptyWidget() {
      let updatedIndex = 0
      let maxY = 0
      this.layout.sort((a, b) => a.y - b.y)
      this.layout.forEach((item, index) => {
        if (item.y === 42 && updatedIndex === 0) {
          updatedIndex = index
        }
        maxY = item.y
      })
      if (updatedIndex && maxY > 42) {
        this.layout.splice(updatedIndex, 0, {
          x: 0,
          y: 48,
          w: 12,
          minW: 12,
          defaultW: 12,
          midW: 12,
          h: 3,
          defaultH: 3,
          minH: 3,
          maxH: 3,
          i: createRandomCryptStringNumber(),
          title: 'EmptyWidget',
          key: 'EmptyWidget',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        })
      }
      return updatedIndex
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
      if (newBreakpoint === 'xs') return 12
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
        parentKey: widget.description,
        name: widget.name,
        chartType: widget.chartType
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
    getComponent(componentString, name, item) {
      switch (componentString) {
        case 'PhishingRiskScoreAcrossIndustriesWidget':
          return ExecutiveReportsRiskScoreTrendAcrossIndustries
        case 'PhishingSimulationEngagementReportingTrendsWidget':
          return ExecutiveReportsPhishingSimulationEngagement
        case 'HumanRiskScoreforHighestRiskUsersWidget':
          return ExecutiveReportsTopRiskiestUsers
        case 'HumanRiskScoreforHighestRiskDepartmentsWidget':
          return ExecutiveReportsTopRiskiestDepartments
        case 'HumanRiskScoreforHighestRiskCompaniesWidget':
          return ExecutiveReportsTopRiskiestCompanies
        case 'IndustryPhishingRiskScoreWidget':
          return ExecutiveReportsIndustryPhishingRiskScore
        case 'RepeatOffendersUsersThresholdWidget':
          if (item?.chartType?.toLowerCase()?.includes('bar'))
            return ExecutiveReportRepeatOffendersUsersBar
          return ExecutiveReportsRepeatOffendersUsers
        case 'ImpactOfPhishingAwarenessTrainingWidget':
          return ExecutiveReportsImpactOfPhishingAwarenessTraining
        case 'TrainingCompletionWidget':
          if (item?.chartType?.toLowerCase()?.includes('bar'))
            return ExecutiveReportsTrainingCompletionBar
          else if (item?.chartType?.toLowerCase()?.includes('pie'))
            return ExecutiveReportsTrainingCompletionPie
          return ExecutiveReportsTrainingCompletion
        case 'SimulationCoverageWidget':
          if (item?.chartType?.toLowerCase()?.includes('bar'))
            return ExecutiveReportsSimulationCoverageBar
          return ExecutiveReportsSimulationCoverage
        case 'PhishingDwellTimeAndQuickestResponseTimeWidget':
          return ExecutiveReportPhishingAndQuickResponseTime
        case 'PhishingDwellTimeDistributionWidget':
          return ExecutiveReportsPhishingDwellTimeDistribution
        case 'EmptyWidget':
          return ExecutiveReportsEmptyWidget
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
    },
    disabledDates(date) {
      const lastYear = new Date()
      lastYear.setFullYear(lastYear.getFullYear() - 1)
      return date.getTime() < lastYear.getTime() || date.getTime() > new Date().getTime()
    }
  }
}
</script>
