<template>
  <AppModal
    :status="status"
    icon-name="mdi-calendar-clock"
    :title="getTitle"
    :subtitle="getSubtitle"
    :custom-size="'480'"
    maxHeightSize="665"
    title-id="text--phishing-reporters-download-history-title"
    subtitle-id="text--phishing-reporters-download-history-subtitle"
    class-name="executive-report-schedule-dialog"
    @changeStatus="handleClose"
  >
    <template #overlay-body>
      <AppModalBodyHeader :title="getBodyTitle" :sub-title="getBodySubtitle" />
      <VForm ref="refForm" lazy-validation>
        <FormGroup title="Schedule Name" has-hint>
          <InputEntityName
            v-model.trim="formData.name"
            id="input--schedule-name"
            entity-name="schedule"
            initial-placeholder="Enter a name"
          />
        </FormGroup>
        <FormGroup
          has-hint
          :title="labels.Frequency"
          sub-title="Select how often you would like to send this report"
        >
          <KSelect
            v-model.trim="formData.frequency"
            id="input--executive-report-schedule-frequency"
            dense
            outlined
            hint="*Required"
            persistent-hint
            placeholder="Select Option"
            no-data-text="No frequency configuration available"
            :rules="rules.frequency"
            :items="frequencyItems"
          />
        </FormGroup>
        <FormGroup
          v-if="isScheduledPage"
          has-hint
          :title="labels.ReportType"
          sub-title="Select type of the report"
        >
          <KSelect
            v-model.trim="scheduledPageFormData.reportType"
            id="input--executive-report-schedule-report-type"
            dense
            outlined
            hint="*Required"
            persistent-hint
            placeholder="Select Option"
            :items="reportTypeItems"
          />
        </FormGroup>
        <FormGroup
          v-if="isScheduledPage"
          has-hint
          :title="labels.Report"
          sub-title="Select a report from the list"
        >
          <KSelect
            v-model.trim="scheduledPageFormData.reportResourceId"
            id="input--executive-report-schedule-report"
            dense
            outlined
            hint="*Required"
            persistent-hint
            placeholder="Select Option"
            :items="reportItems"
          />
        </FormGroup>
        <FormGroup
          class-name="executive-report-schedule"
          title="Schedule"
          sub-title="Sending date and time of this report"
        >
          <InputDate
            v-model="formData.schedule"
            class="date-picker-height-40 w-100"
            type="datetime"
            ref="refPicker"
            placeholder="Select Date Select Time"
            :format="parsedFormat"
            :valueFormat="parsedFormat"
            :picker-options="datePickerOptions"
          />
          <VAutocomplete
            v-model.trim="formData.scheduledDateTimeZoneId"
            id="input--campaign-manager-campaign-info-time-type"
            style="text-overflow: ellipsis;"
            outlined
            dense
            hide-details
            placeholder="Select an item"
            :items="scheduledTimeItems"
          />
        </FormGroup>
        <div class="mb-4">
          <div class="executive-report-schedule-timezone-container">
            <VSwitch
              v-model="formData.isRegionAwareTimeZone"
              hide-details
              :ripple="false"
              color="#2196f3"
              @click.stop
            >
              <template #label>
                <div class="executive-report-new-card-timezone">
                  <span>Enable Region-Aware Time Zone Delivery</span>
                  <span>Deliver emails based on the target users' time zone.</span>
                </div>
              </template>
            </VSwitch>
          </div>
          <div
            v-if="formData.isRegionAwareTimeZone"
            class="executive-report-schedule-timezone-container"
          >
            <div>
              <VIcon color="#2196f3">mdi-alert-circle</VIcon>
            </div>
            <div>
              <ul class="executive-report-schedule-timezone-container__list">
                <li>
                  Target users will receive the report at
                  <span class="fw-600">{{ getTime }}</span> local time.
                </li>
                <li>
                  If the local time has passed, the report will be sent at
                  <span class="fw-600">{{ getTime }}</span> the following day.
                </li>
                <li>
                  We'll use the company's time zone for users whose time zone is not specified.
                </li>
              </ul>
            </div>
          </div>
        </div>
        <template v-if="!shouldShowManagerSection">
          <FormGroup
            class-name="mb-0 mt-2"
            title="Send to Email"
            sub-title="Send report to multiple email addresses"
          >
            <KSelect
              v-model="formData.emailAddresses"
              id="input--threat-sharing-incident-share-email"
              type="combobox"
              :items="[]"
              placeholder="Enter email address"
              multiple
              dense
              deletable-chips
              autocomplete="disabled"
              small-chips
              outlined
              class="pop-up-card__invite-member"
              persistent-hint
              :hint="isEmailAddressesFocused ? 'Press enter to separate email addresses' : ''"
              @focus="isEmailAddressesFocused = true"
              @blur="isEmailAddressesFocused = false"
              :rules="[rules.email]"
            ></KSelect>
          </FormGroup>
          <FormGroup
            title="Send to Target Group"
            sub-title="Send report to multiple target groups "
          >
            <v-autocomplete
              v-model="formData.targetGroupResourceIds"
              id="input--schedule-report-target-group"
              type="select"
              placeholder="Select target group"
              auto-select-first
              multiple
              dense
              deletable-chips
              autocomplete="off"
              small-chips
              outlined
              class="pop-up-card__invite-member"
              persistent-hint
              position="top"
              :menu-props="{
                contentClass: 'scheduled-reports-send-to-target-group-menu',
                auto: true
              }"
              :items="targetGroupItems"
            />
          </FormGroup>
        </template>
        <FormGroup v-else title="Send to Manager" sub-title="Send Report to managers">
          <KSelect
            v-model="formData.managerEmails"
            id="input--schedule-report-manager"
            dense
            outlined
            placeholder="Select Option"
            multiple
            deletable-chips
            small-chips
            :items="managerItems"
          />
        </FormGroup>
      </VForm>
    </template>
    <template #overlay-footer>
      <AppModalFooter
        cancel-button-id="btn-cancel--scenario-popup"
        confirm-button-id="btn-delete--scenario-popup"
        action-button-text="SUBMIT"
        :action-button-disabled="isActionButtonDisabled"
        @on-cancel="handleClose"
        @on-save="handleConfirm"
      />
    </template>
  </AppModal>
</template>

<script>
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import labels from '@/model/constants/labels'
import { frequencyItems } from '@/components/CampaignManager/utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import { mapGetters } from 'vuex'
import * as Validations from '@/utils/validations'
import ReportsService, { createReportScheduling, getSchedulingReportManagers } from '@/api/reports'
import AppModal from '@/components/AppModal.vue'
import AppModalFooter from '@/components/AppModalFooter.vue'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'ExecutiveReportScheduleReportDialog',
  components: {
    AppModalBodyHeader,
    AppModalFooter,
    AppModal,
    InputDate,
    KSelect,
    FormGroup,
    InputEntityName
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => {}
    },
    isNew: {
      type: Boolean,
      default: false
    },
    isReportSaved: {
      type: Boolean,
      default: false
    },
    savedReportResourceId: {
      type: String
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isScheduledPage: {
      type: Boolean,
      default: false
    },
    isSupportManager: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      frequencyItems,
      reportTypeItems: [{ text: 'Executive Report', value: 2 }],
      reportItems: [],
      targetGroupItems: [],
      managerItems: [],
      isEmailAddressesFocused: false,
      scheduledPageFormData: {
        reportType: 2,
        reportResourceId: ''
      },
      formData: {
        name: '',
        frequency: 0,
        scheduledDateTimeZoneId: '',
        schedule: this.$moment(Date.now()).format(getTimeZoneForMoment()),
        isRegionAwareTimeZone: false,
        emailAddresses: [],
        targetGroupResourceIds: [],
        managerEmails: []
      },
      isActionButtonDisabled: false,
      rules: {
        frequency: [(v) => v >= 0 || labels.Required],
        email: Validations.isEmailChip,
        required: (v) => v.length > 0 || labels.Required
      },
      parsedFormat: getTimeZone(false),
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    getTitle() {
      if (this.isDuplicate) return 'Duplicate Schedule Report'
      if (this.isEdit) return 'Edit Schedule Report'
      return 'New Schedule Report'
    },
    getSubtitle() {
      return this.isScheduledPage ? '' : this?.selectedRow?.name
    },
    getBodyTitle() {
      if (this.isDuplicate) return 'Duplicate Schedule Report'
      if (this.isEdit) return 'Edit Schedule Report'
      return 'New Schedule Report'
    },
    getBodySubtitle() {
      if (this.isDuplicate) return 'Enter settings for the duplicated scheduled report'
      if (this.isEdit) return 'Enter settings for the scheduled report'
      return 'Enter settings for the new scheduled report'
    },
    scheduledTimeItems() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
    },
    getTime() {
      if (!this.formData.schedule) return ''
      const splittedDate = this.formData.schedule.split(' ')
      if (splittedDate.length > 2) return `${splittedDate[1]} ${splittedDate[2]}`
      return splittedDate[1]
    },
    selectedReportIsSupportManager() {
      if (!this.isScheduledPage || !this.scheduledPageFormData.reportResourceId) return false
      const selectedReport = this.reportItems.find(
        (item) => item.value === this.scheduledPageFormData.reportResourceId
      )
      return selectedReport?.isSupportManager || false
    },
    shouldShowManagerSection() {
      return this.isScheduledPage ? this.selectedReportIsSupportManager : this.isSupportManager
    }
  },
  watch: {
    selectedTimeZone() {
      this.formData.scheduledDateTimeZoneId = this.selectedTimeZone
    }
  },
  created() {
    if (this.isScheduledPage) {
      this.callForReports()
      if (this.isDuplicate || this.isEdit) this.callForSelectedSchedule()
    }
    this.callForManagers()
    this.callForGetTimeZones()
    this.getSelectedTimeZone()
    this.callForTargetGroups()
  },
  methods: {
    callForReports() {
      ReportsService.getExecutiveReports(this.search).then((response) => {
        const {
          data: { data }
        } = response || {}
        this.reportItems = data.map((item) => ({
          text: item.name,
          value: item.resourceId,
          isSupportManager: item.isSupportManager || false
        }))
      })
    },
    callForSelectedSchedule() {
      ReportsService.getReportScheduling(this.selectedRow.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        this.scheduledPageFormData.reportResourceId = data.reportResourceId
        this.scheduledPageFormData.reportType = data.reportTypeId
        this.formData.schedule = data.schedule
        this.formData.scheduledDateTimeZoneId = data.scheduledDateTimeZoneId
        this.formData.name = this.isDuplicate ? `${data.name} - Copy` : data.name
        this.formData.isRegionAwareTimeZone = data.isRegionAwareTimeZone
        this.formData.frequency = data.frequencyTypeId
        const emailAddresses = data.emailAddresses
        if (emailAddresses) {
          this.formData.emailAddresses = emailAddresses.includes(',')
            ? emailAddresses.split(',')
            : [emailAddresses]
        }
        const targetGroupResourceIds = data.targetGroupResourceIds
        if (targetGroupResourceIds) {
          this.formData.targetGroupResourceIds = targetGroupResourceIds.includes(',')
            ? targetGroupResourceIds.split(',')
            : [targetGroupResourceIds]
        }
        const managerEmails = data.managerEmails
        if (managerEmails) {
          this.formData.managerEmails = managerEmails.includes(',')
            ? managerEmails.split(',')
            : [managerEmails]
        }
      })
    },
    callForGetTimeZones() {
      if (
        this.$store?.getters['common/getTimezones'] &&
        !this.$store?.getters['common/getTimezones']?.timeZoneList?.length
      ) {
        this.$store.dispatch('common/getTimezone')
      }
    },
    getSelectedTimeZone() {
      if (this.$store?.getters['common/getSelectedTimeZone']) {
        this.formData.scheduledDateTimeZoneId = this.$store?.getters['common/getSelectedTimeZone']
      } else {
        this.$store.dispatch('common/callForSettings')
      }
    },
    callForTargetGroups() {
      ReportsService.getSchedulingReportTargetGroups().then((response) => {
        const {
          data: { data }
        } = response
        this.targetGroupItems = data.map((item) => ({
          text: item.name,
          value: item.resourceId
        }))
      })
    },
    callForManagers() {
      getSchedulingReportManagers()
        .then((response) => {
          const {
            data: { data }
          } = response || {}
          this.managerItems = (data || []).map((item) => ({
            text: item.fullName || item.email,
            value: item.email
          }))
        })
        .catch(() => {
          this.managerItems = []
        })
    },
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      if (
        !this.$refs.refForm.validate() ||
        !this.formData.schedule ||
        !this.formData.scheduledDateTimeZoneId
      )
        return
      if (this.shouldShowManagerSection) {
        if (!this.formData.managerEmails.length) {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-information',
            message: `Please select at least one manager.`
          })
          return
        }
      } else {
        if (!this.formData.emailAddresses.length && !this.formData.targetGroupResourceIds.length) {
          this.$store.dispatch('common/createSnackBar', {
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-information',
            message: `Please send the report either to email or to a target group. You must choose at least one of these options.`
          })
          return
        }
      }
      if (this.isScheduledPage) return this.submitScheduled()
      if (!this.isNew || this.isReportSaved) {
        this.isActionButtonDisabled = true
        createReportScheduling({
          reportType: 2,
          reportResourceId: this.savedReportResourceId
            ? this.savedReportResourceId
            : this.selectedRow.resourceId,
          ...this.formData
        })
          .then(() => this.handleClose())
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else this.$emit('on-submit', this.formData)
    },
    submitScheduled() {
      const payload = {
        ...this.formData,
        ...this.scheduledPageFormData
      }
      this.isActionButtonDisabled = true
      if (!this.isEdit || this.isDuplicate) {
        ReportsService.createReportScheduling(payload)
          .then(() => {
            this.$emit('on-save-close')
          })
          .finally(() => (this.isActionButtonDisabled = false))
      } else {
        ReportsService.updateReportScheduling(payload, this.selectedRow.resourceId)
          .then(() => {
            this.$emit('on-save-close')
          })
          .finally(() => (this.isActionButtonDisabled = false))
      }
    }
  }
}
</script>
