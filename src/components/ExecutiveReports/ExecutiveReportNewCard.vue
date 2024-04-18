<template>
  <div class="executive-report-new-card">
    <ExecutiveReportScheduleReportDialog
      v-if="isShowScheduleReportDialog"
      :status="isShowScheduleReportDialog"
      :selected-row="selectedRow"
      :is-new="!isPreview"
      @on-close="toggleShowScheduleReportDialog"
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
          :rules="[]"
          :defaultTime="['00:00:00', '23:59:00']"
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
          class="training-library-card__footer-btn ml-2"
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
        <template v-if="!isPreview">
          <VBtn
            class="training-library-card__footer-btn"
            color="#fff"
            rounded
            :ripple="false"
            @click="routeToExecutiveReports"
          >
            CANCEL
          </VBtn>
          <VBtn
            id="btn-add--training-library"
            class="training-library-new-btn ml-2"
            rounded
            color="#2196f3"
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
          v-else
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
              placeholder="Executive Report Name"
            />
          </div>
          <div class="d-flex mt-2 gap-2">
            <VTextField
              v-model="formData.executiveReportDate"
              id="input--training-library-sorting"
              label="Date"
              style="max-width: 120px;"
              class="pointer-none"
              outlined
              hide-details
              autocomplete="off"
              placeholder="Date"
            />
            <VTextField
              v-model="formData.executiveReportCompanyName"
              ref="refFiltersInput"
              id="input--training-library-sorting"
              label="Company Name"
              class="pointer-none"
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
          <div class="executive-report-new-card__body-preview-name">{{ previewData.name }}</div>
          <div>
            <span class="executive-report-new-card__body-preview-text">{{ previewData.date }}</span>
            <span class="executive-report-new-card__body-preview-text ml-6">{{
              previewData.companyName
            }}</span>
          </div>
        </div>
        <img
          class="executive-report-new-card__body-preview-img"
          :src="previewData.logo"
          alt="Logo"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import KFileUpload from '@/components/Common/FileUpload/FileUpload.vue'
import ExecutiveReportScheduleReportDialog from '@/components/ExecutiveReports/ExecutiveReportScheduleReportDialog.vue'
import InputDate from '@/components/Common/Inputs/InputDate.vue'

export default {
  name: 'ExecutiveReportNewCard',
  components: { InputDate, ExecutiveReportScheduleReportDialog, KFileUpload },
  props: {
    isSaveButtonDisabled: {
      type: Boolean,
      default: true
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    previewData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      parsedFormat: getTimeZone(false),
      isShowScheduleReportDialog: false,
      pickerOptions: {
        onPick: (date) => {
          const { minDate, maxDate } = date
          const refPicker = this.$refs.refPicker
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
          }
        ]
      },
      selectedRow: {},
      formData: {
        executiveReportDateRange: this.$moment(Date.now()).format(getTimeZoneForMoment()),
        executiveReportName: 'Report Name',
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
      return 'training-library-new-btn ml-2'
    }
  },
  methods: {
    routeToExecutiveReports() {
      this.$router.push('/reports/executive-reports')
    },
    toggleShowScheduleReportDialog() {
      this.selectedRow = this.isPreview ? this.previewData : {}
      this.isShowScheduleReportDialog = !this.isShowScheduleReportDialog
    },
    handleDateRangeClick() {
      this.$refs.refInputDate.showPicker()
    },
    handlePreviewClick() {},
    handleSaveReportClick() {},
    handleDownloadClick() {},
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
    }
  }
}
</script>
