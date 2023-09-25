<template>
  <FormGroup :title="labels.Schedule" :sub-title="labels.ScheduleSub">
    <v-radio-group
      v-model="value.scheduleTypeId"
      class="mt-0 pt-0 campaign-manager-target-groups-radio"
      hide-details
    >
      <div class="campaign-manager-advanced-settings__distribution-item gap-2 mb-4">
        <v-radio
          :id="`input--campaign-manager-radio-schedule-to`"
          class="mb-0"
          label="Start time"
          color="#2196f3"
          value="3"
        />
        <div :class="[!isDateValid && 'date-picker-error mb-n3']">
          <InputDate
            v-model="value.scheduledDate"
            class="date-picker-height-40 w-100"
            type="datetime"
            ref="refPicker"
            placeholder="Select Date Select Time"
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
          v-model.trim="value.scheduledDateTimeZoneId"
          type="autocomplete"
          id="input--campaign-manager-campaign-info-time-type"
          style="max-width: 233px;"
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
      <v-radio
        v-for="item in radioItems"
        :key="item.text"
        color="#2196f3"
        :id="`input--campaign-manager-radio-${item.text}`"
        :value="item.value"
        :label="item.text"
      ></v-radio>
    </v-radio-group>
  </FormGroup>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import InputDate from '@/components/Common/Inputs/InputDate'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { getTimeZone } from '@/utils/functions'
import { mapGetters } from 'vuex'
export default {
  name: 'InputSchedule',
  components: { FormGroup, InputDate, KSelect },
  props: {
    value: {
      type: Object,
      default: () => ({
        scheduleTypeId: 1,
        scheduledDate: '',
        scheduledDateTimeZoneId: ''
      })
    }
  },
  data() {
    return {
      labels,
      isDateValid: true,
      parsedFormat: getTimeZone(false),
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      radioItems: [{ text: 'Save for later', value: SCHEDULE_TYPES.SAVE_FOR_LATER }]
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    isScheduledTimeDisabled() {
      return this.value.scheduleTypeId !== SCHEDULE_TYPES.SCHEDULE_TO
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
    'value.scheduledDate'(val) {
      this.isDateValid =
        this.value.scheduleTypeId === SCHEDULE_TYPES.SCHEDULE_TO ? val && val.length > 0 : true
    },
    selectedTimeZone(val) {
      this.value.scheduledDateTimeZoneId = val
    },
    'value.scheduleTypeId'(val) {
      if (val !== SCHEDULE_TYPES.SCHEDULE_TO) {
        this.isDateValid = val !== SCHEDULE_TYPES.SCHEDULE_TO
      }
    }
  },
  created() {
    this.callForGetTimeZones()
    if (!this.isEdit) this.getSelectedTimeZone()
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
        this.value.scheduledDateTimeZoneId = this.$store?.getters['common/getSelectedTimeZone']
      } else {
        this.$store.dispatch('common/callForSettings')
      }
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    validateInput() {
      if (this.value.scheduleTypeId !== SCHEDULE_TYPES.SCHEDULE_TO) return true
      this.isDateValid = !!this.value.scheduledDate
      return !!(this.value.scheduledDate && this.value.scheduledDateTimeZoneId && this.isDateValid)
    }
  }
}
</script>
