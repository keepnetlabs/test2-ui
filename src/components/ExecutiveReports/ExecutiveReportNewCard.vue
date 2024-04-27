<template>
  <div class="executive-report-new-card">
    <ExecutiveReportScheduleReportDialog
      v-if="isShowScheduleReportDialog"
      :status="isShowScheduleReportDialog"
      :selected-row="selectedRow"
      :is-new="!isPreview"
      @on-close="toggleShowScheduleReportDialog"
    />
    <ExecutiveReportCustomizeWidgetDialog
      v-if="isShowCustomizeWidgetDialog"
      :status="isShowCustomizeWidgetDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowCustomizeWidgetDialog"
    />
    <div class="executive-report-new-card__header">
      <div class="executive-report-new-card__header-left">
        <VBtn
          v-if="isPreview"
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
          v-if="isPreview && !editMode"
          color="#2196f3"
          class="executive-reports-card__right-btn mr-2"
          small
          @click="editMode = true"
          >mdi-pencil</VIcon
        >
        <VIcon
          v-if="isPreview && !editMode"
          color="#2196f3"
          class="executive-reports-card__right-btn"
          small
          @click="handleDownloadClick"
          >mdi-download</VIcon
        >
      </div>
    </div>
    <div class="executive-report-new-card__body">
      <div v-if="!isPreview" class="executive-report-new-card__body-new">
        <div>
          <div>
            <VTextField
              v-model="formData.executiveReportName"
              ref="refFiltersInput"
              id="input--training-library-sorting"
              label="Executive Report Name"
              style="max-width: 448px;"
              outlined
              hide-details
              autocomplete="off"
              placeholder="Enter an executive report name"
            />
          </div>
          <div class="d-flex mt-2 gap-2">
            <div class="position-relative" @click="handleExecutiveReportDateClick">
              <VTextField
                v-model="formData.executiveReportDate"
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
                v-model="formData.executiveReportDate"
                id="input--executive-report-date"
                type="date"
                ref="refInputExecutiveReportDate"
                style="visibility: hidden; position: absolute; min-width: 124px; top: 0;"
                :format="parsedFormatWithoutTime"
                :valueFormat="parsedFormatWithoutTime"
              />
            </div>
            <VTextField
              v-model="formData.executiveReportCompanyName"
              ref="refFiltersInput"
              id="input--training-library-sorting"
              label="Company Name"
              style="max-width: 320px;"
              outlined
              hide-details
              autocomplete="off"
              placeholder="Company Name"
            />
          </div>
        </div>
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
          <img :src="formData.executiveReportLogo" alt="logo" />
        </div>
      </div>
      <div v-else class="executive-report-new-card__body-preview">
        <div class="d-flex flex-column">
          <div class="executive-report-new-card__body-preview-name">
            {{ editData.name }}
          </div>
          <div>
            <span class="executive-report-new-card__body-preview-text"
              >Created on {{ editData.date }}
            </span>
            <span class="executive-report-new-card__body-preview-text">
              by {{ editData.companyName }}</span
            >
          </div>
        </div>
        <img class="executive-report-new-card__body-preview-img" :src="editData.logo" alt="Logo" />
      </div>
      <div v-if="!isPreview && !layout.length" class="executive-report-new-card__empty">
        Choose items from left side
      </div>
      <k-smart-grid
        class="executive-report-grid"
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
            :edit-mode="editMode"
            :card="item"
            @on-delete="deleteWidget(item, index)"
            @on-edit="toggleShowCustomizeWidgetDialog"
          />
        </smart-widget>
      </k-smart-grid>
    </div>
  </div>
</template>

<script>
import { createRandomCryptStringNumber, getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import KFileUpload from '@/components/Common/FileUpload/FileUpload.vue'
import ExecutiveReportScheduleReportDialog from '@/components/ExecutiveReports/ExecutiveReportScheduleReportDialog.vue'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import ExecutiveReportCustomizeWidgetDialog from '@/components/ExecutiveReports/ExecutiveReportCustomizeWidgetDialog.vue'
import KSmartGrid from '@/components/Common/Widget/KSmartGrid.vue'
import PhishingCampaignTrends from '@/components/Common/Widget/WidgetComponents/PhishingCampaignTrends.vue'
import ExecutiveReportsWidget from '@/components/ExecutiveReports/ExecutiveReportsWidget/ExecutiveReportsWidget.vue'
import { getExecutiveReport, saveExecutiveReport } from '@/api/reports'

export default {
  name: 'ExecutiveReportNewCard',
  components: {
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
    }
  },
  data() {
    console.log('isPreview', this.isPreview)
    return {
      activeBreakpoint: 'lg',
      layout: [],
      initialLayout: [],
      colNum: 12,
      newItemY: 0,
      editMode: !this.isPreview,
      parsedFormat: getTimeZone(false),
      parsedFormatWithoutTime: getTimeZone(true),
      isShowScheduleReportDialog: false,
      isShowCustomizeWidgetDialog: false,
      pickerOptions: {
        onPick: (date) => {
          const { minDate, maxDate } = date
          const refPicker = this.$refs.refInputDate
          if (maxDate && minDate) {
            this.date = refPicker.formatToValue([minDate, maxDate])
          }
        },
        shortcuts: [
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 6 months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last Year',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 360)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'All time',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3600)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      selectedRow: {},
      allWidgets: {
        PhishingCampaignTrends: {
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
          key: 'PhishingCampaignTrends',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'line',
          dateInterval: 'month',
          startDate: this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          endDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        },
        ReportedEmailTrends: {
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
          key: 'ReportedEmailTrends',
          isAllowed: true,
          parentKey: 'Phishing Metrics',
          chartType: 'stackedBar',
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
        QuishingCampaignTrends: {
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
          title: 'Quishing Campaign Trends',
          key: 'QuishingCampaignTrends',
          isAllowed: true,
          parentKey: 'Quishing Metrics',
          chartType: 'line',
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
        CallbackCampaignTrends: {
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
          title: 'Callback Campaign Trends',
          key: 'CallbackCampaignTrends',
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
        SmishingCampaignTrends: {
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
          title: 'Smishing Campaign Trends',
          key: 'SmishingCampaignTrends',
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
      availableWidgets: [
        {
          name: 'Phishing Campaign Trends',
          key: 'PhishingCampaignTrends',
          isAllowed: true
        }
      ],
      formData: {
        executiveReportDateRange: [
          this.$moment(Date.now()).subtract(3, 'months').format(getTimeZoneForMoment()),
          this.$moment(Date.now()).format(getTimeZoneForMoment())
        ],
        executiveReportName: '',
        executiveReportDate: this.$moment(Date.now()).format(getTimeZoneForMoment()).split(' ')[0],
        executiveReportCompanyName: localStorage.getItem('selectedCompanyName'),
        executiveReportLogo:
          localStorage.getItem('isSelectCompany') === 'true'
            ? this.$store.state.dashboard.selectedCompanyObject.logoUrl
            : this.$store.state.auth.logoUrl,
        executiveReportLogoUrl: ''
      }
    }
  },
  computed: {
    getSaveButtonClasses() {
      let classes = ['training-library-new-btn']
      if (!this.formData.executiveReportName || !this.layout.length)
        classes.push('new-executive-report-button-disabled')
      return classes
    },
    getPreviewPdfButtonClasses() {
      let classes = ['training-library-new-btn ml-2']
      if (!this.formData.executiveReportName) classes.push('new-executive-report-button-disabled')
      return classes
    }
  },
  watch: {
    editMode(val) {
      if (val) {
        this.initialLayout = JSON.parse(JSON.stringify(this.layout))
      }
    }
  },
  async created() {
    try {
      /*
      this.layout.push(this.allWidgets.PhishingCampaignTrends)
      this.newItemY = this.layout.reduce((acc, item) => {
        acc += item.h
        return acc
      }, 0)

       */
      if (this.isEdit || this.isPreview) {
        const report = await getExecutiveReport()
        this.layout = report.data.data
      }
      setTimeout(() => {
        this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
      }, 20)
    } catch (e) {
      this.layout = this.getDefaultLayoutObject()
      setTimeout(() => {
        this.breakpointChanged({ newBreakpoint: this.activeBreakpoint })
      }, 20)
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
      this.$router.push('/reports/executive-reports')
    },
    toggleShowScheduleReportDialog() {
      this.selectedRow = this.isPreview ? this.editData : {}
      this.isShowScheduleReportDialog = !this.isShowScheduleReportDialog
    },
    toggleShowCustomizeWidgetDialog(item) {
      this.selectedRow = item
      this.isShowCustomizeWidgetDialog = !this.isShowCustomizeWidgetDialog
    },
    handleDateRangeClick() {
      this.$refs.refInputDate.showPicker()
    },
    handleExecutiveReportDateClick() {
      this.$refs.refInputExecutiveReportDate.showPicker()
    },
    handlePreviewClick() {},
    handleSaveReportClick() {
      saveExecutiveReport(this.layout)
    },
    handleDownloadClick() {},
    handleCancelClick() {
      if (this.isPreview) this.editMode = false
      else this.routeToExecutiveReports()
    },
    handleLogoChange(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formData.executiveReportLogo = null
        return
      }
      this.formData.executiveReportLogo = file
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
      this.removeAvailableWidget(widget)
      let newItem
      const widgetObj = { ...this.allWidgets[widget.key], i: createRandomCryptStringNumber() }
      if (window.innerWidth < 1100 && window.innerWidth > 900) {
        widgetObj.w = 6
      } else if (window.innerWidth < 900) {
        widgetObj.w = 6
      } else {
        this.allWidgets[widget.key].w = this.allWidgets[widget.key].defaultW
      }
      newItem = widgetObj
      newItem['y'] = this.newItemY
      this.newItemY += newItem.h
      this.layout.push(widgetObj)
    },
    removeAvailableWidget(widget) {
      this.availableWidgets.splice(
        this.availableWidgets.findIndex((item) => {
          return item.key === widget.key
        }),
        1
      )
    },
    deleteWidget(item, index) {
      this.layout.splice(index, 1)
      this.availableWidgets.push({
        key: item.key,
        name: item.title,
        isAllowed: item.isAllowed
      })
      this.$emit('on-delete', item)
    },
    getComponent(componentString) {
      switch (componentString) {
        default:
          return ExecutiveReportsWidget
      }
    }
  }
}
</script>
