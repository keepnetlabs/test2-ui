<template>
  <v-form ref="refForm">
    <FormGroup :title="labels.CampaignName" has-hint>
      <InputEntityName
        v-model.trim="formData.name"
        id="input--campaign-info-name"
        entity-name="campaign name"
        initial-placeholder="Enter a name"
        :initial-rules="rules.name"
      />
    </FormGroup>
    <FormGroup
      v-if="showSchedule"
      :title="labels.Schedule"
      :sub-title="labels.ScheduleSub"
      style="max-width: 600px;"
    >
      <v-radio-group
        v-model="formData.scheduleTypeId"
        class="mt-0 campaign-manager-target-groups-radio"
        hide-details
      >
        <v-radio
          v-for="item in radioItems"
          :key="item.text"
          style="margin-bottom: 16px;"
          color="#2196f3"
          :id="`input--campaign-manager-radio-${item.text}`"
          :value="item.value"
          :label="item.text"
        ></v-radio>
        <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
          <v-radio
            :id="`input--campaign-manager-radio-schedule-to`"
            style="margin-bottom: 0;"
            label="Schedule to"
            color="#2196f3"
            value="3"
          />
          <div :class="[!isDateValid && 'date-picker-error mb-n3']">
            <InputDate
              v-model="formData.scheduledDate"
              class="date-picker-height-40 ml-2"
              type="datetime"
              ref="refPicker"
              placeholder="Select Date Select Time"
              style="width: 100%; max-width: 222px;"
              :format="parsedFormat"
              :valueFormat="parsedFormat"
              :disabled="isScheduledTimeDisabled"
              :picker-options="datePickerOptions"
            />
            <div class="v-text-field__details checkbox-error" v-if="!isDateValid">
              <transition appear name="bounce">
                <div class="v-messages theme--light error--text" role="alert">
                  <div class="v-messages__wrapper">
                    <div class="v-messages__message" style="padding-left: 10px;">
                      Date is required
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>

          <KSelect
            v-model.trim="formData.scheduledDateTimeZoneId"
            type="autocomplete"
            id="input--campaign-manager-campaign-info-time-type"
            class="ml-2"
            style="max-width: 195px;"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            min-width-type="super"
            nudge-width="200"
            :items="scheduledTimeItems"
            :disabled="isScheduledTimeDisabled"
          />
        </div>
      </v-radio-group>
    </FormGroup>
    <FormGroup
      v-if="showDuration"
      class="mt-6"
      has-hint
      :title="labels.Duration"
      :sub-title="labels.DurationSub"
    >
      <v-text-field
        v-mask="'###'"
        :value="formData.duration"
        ref="refDurationTextField"
        id="input--campaign-manager-days"
        class="input-duration"
        outlined
        persistent-hint
        hint="*Required"
        :rules="rules.days"
        @input="handleDurationChange"
      ></v-text-field>
      <span style="position: absolute; top: 65px; left: 56px; font-size: 13px; color: #000;"
        >Days</span
      >
    </FormGroup>
    <FormGroup :title="labels.MarkAsTest">
      <div>
        <v-checkbox
          v-model="formData.excludeFromReports"
          id="input--campaign-manager-campaign-settings-exclude-from-reports"
          color="#2196f3"
        >
          <template #label>Exclude this campaign’s statistics from all generic reports</template>
        </v-checkbox>
      </div>
    </FormGroup>
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import * as validations from '@/utils/validations'
import InputDate from '@/components/Common/Inputs/InputDate'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import { mapGetters } from 'vuex'
import { getTimeZone, scrollToComponent } from '@/utils/functions'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
export default {
  name: 'CampaignManagerCampaignInfo',
  components: {
    InputDate,
    KSelect,
    FormGroup,
    InputEntityName
  },
  props: {
    defaultValues: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    showSchedule: {
      type: Boolean,
      default: true
    },
    showDuration: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isDateValid: true,
      parsedFormat: getTimeZone(false),
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      selectedTargetGroups: [],
      radioItems: [
        { text: 'Send now', value: SCHEDULE_TYPES.SEND_NOW },
        { text: 'Save for later', value: SCHEDULE_TYPES.SAVE_FOR_LATER }
      ],
      labels,
      formData: {
        name: '',
        scheduleTypeId: SCHEDULE_TYPES.SEND_NOW,
        duration: 365,
        scheduledDate: '',
        scheduledDateTimeZoneId: '',
        excludeFromReports: false
      },
      rules: {
        name: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' '),
          (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.CampaignName))
        ],
        select: [
          (v) => !!v.length || labels.Required,
          (v) => validations.startsWith(v, labels.CannotStartWithSpace, ' ')
        ],
        days: [
          (v) => validations.required(v, labels.Required),
          (v) => validations.startsWith(v, 'Cannot start with 0', 0)
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    getTargetGroupErrorMessage() {
      return this.formData.targetGroupResourceIds.length
        ? this.getTargetGroupErrorText
        : labels.TargetGroupSelectionRequiredError
    },
    getTargetGroupErrorText() {
      return this.isShowTargetGroupUsersError ? labels.TargetGroupUserRequiredError : 'Required'
    },
    isScheduledTimeDisabled() {
      return this.formData.scheduleTypeId !== SCHEDULE_TYPES.SCHEDULE_TO
    },
    scheduledTimeItems() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({ text: item.displayName, value: item.id }))
    }
  },
  watch: {
    timezoneFormat: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.parsedFormat = getTimeZone(false, val)
        }
      }
    },
    defaultValues(val) {
      for (const key of Object.keys(val)) {
        this.formData[key] = val[key]
      }
    },
    selectedTimeZone(val) {
      this.formData.scheduledDateTimeZoneId = val
    },
    'formData.scheduledDate'(val) {
      let isDateValid = true
      if (this.formData) {
        isDateValid =
          this.formData.scheduleTypeId === SCHEDULE_TYPES.SCHEDULE_TO ? val && val.length > 0 : true
      }
      this.isDateValid = isDateValid
    },
    'formData.scheduleTypeId'(val) {
      if (val !== SCHEDULE_TYPES.SCHEDULE_TO) {
        this.isDateValid = true
      }
    }
  },
  created() {
    this.callForGetTimeZones()
    if (!this.isEdit) this.getSelectedTimeZone()
    const initialFormValues = JSON.parse(JSON.stringify(this.formData))
    this.$emit('initialFormValues', initialFormValues)
  },
  methods: {
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    setInitialName(value) {
      this.formData.name = value
      const initialFormValues = JSON.parse(JSON.stringify(this.formData))
      this.$emit('initialFormValues', initialFormValues)
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
    handleDurationChange(val) {
      if (!val || /^\d{1,3}$/.test(val)) {
        this.formData.duration = val
      } else {
        this.$refs.refDurationTextField.initialValue = this.formData.duration
        this.$refs.refDurationTextField.lazyValue = this.formData.duration
      }
    },
    validateForm() {
      let isValid = this.$refs.refForm.validate()
      if (this.formData.scheduleTypeId === SCHEDULE_TYPES.SCHEDULE_TO) {
        this.isDateValid = !!this.formData.scheduledDate
        isValid =
          isValid &&
          this.formData.scheduledDate &&
          this.formData.scheduledDateTimeZoneId &&
          this.isDateValid
      }
      if (!isValid) {
        this.$nextTick(() => {
          const el = this.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
      return isValid
    }
  }
}
</script>
