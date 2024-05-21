<template>
  <AppModal
    :status="status"
    icon-name="mdi-calendar-clock"
    title="Schedule Report"
    :subtitle="selectedRow.name"
    :custom-size="'480'"
    maxHeightSize="665"
    title-id="text--phishing-reporters-download-history-title"
    subtitle-id="text--phishing-reporters-download-history-subtitle"
    class-name="executive-report-schedule-dialog"
    @changeStatus="handleClose"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        title="New Scheduled Report"
        sub-title="Enter settings for the new scheduled report"
      />
      <VForm ref="refForm" lazy-validation>
        <div v-if="isNew && !isReportSaved" class="executive-report-schedule-dialog-is-new">
          Your report will be saved as it is to be scheduled
        </div>
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
            id="input--company-manager-advanced-settings-frequency"
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
            :hint="
              isEmailAddressesFocused ? 'Press enter to separate email addresses' : '*Required'
            "
            @focus="isEmailAddressesFocused = true"
            @blur="isEmailAddressesFocused = false"
            :rules="[rules.email, rules.required]"
          ></KSelect>
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
import { createReportScheduling } from '@/api/reports'
import AppModal from '@/components/AppModal.vue'
import AppModalFooter from '@/components/AppModalFooter.vue'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader.vue'
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
    }
  },
  data() {
    return {
      labels,
      frequencyItems,
      isEmailAddressesFocused: false,
      formData: {
        name: '',
        frequency: 0,
        scheduledDateTimeZoneId: '',
        schedule: this.$moment(Date.now()).format(getTimeZoneForMoment()),
        isRegionAwareTimeZone: false,
        emailAddresses: []
      },
      isActionButtonDisabled: false,
      rules: {
        frequency: [(v) => v >= 0 || labels.Required],
        email: (v) => {
          if (v.length > 0) {
            let booReturn = true
            for (let i = 0; i < v.length; i++) {
              const chip = document.getElementsByClassName('v-chip--select')[i]
              if (!Validations.email(v[i], '')) {
                booReturn = false
                chip.style.borderColor = '#ff5252'
                chip.style.color = '#ff5252'
                if (v.length === 1) {
                  return v[i] + ' email address is not valid'
                }
              } else {
                chip.style.borderColor = ''
                chip.style.color = 'rgba(0, 0, 0, 0.87)'
              }
            }
            return booReturn ? booReturn : 'One of the email addresses is not valid'
          } else {
            return true
          }
        },
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
    scheduledTimeItems() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({ text: item.displayName, value: item.id }))
    },
    getTime() {
      if (!this.formData.schedule) return ''
      const splittedDate = this.formData.schedule.split(' ')
      if (splittedDate.length > 2) return `${splittedDate[1]} ${splittedDate[2]}`
      return splittedDate[1]
    }
  },
  watch: {
    selectedTimeZone() {
      this.formData.scheduledDateTimeZoneId = this.selectedTimeZone
    }
  },
  created() {
    this.callForGetTimeZones()
    this.getSelectedTimeZone()
  },
  methods: {
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
    }
  }
}
</script>
