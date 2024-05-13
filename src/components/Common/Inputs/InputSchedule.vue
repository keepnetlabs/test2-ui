<template>
  <FormGroup :title="labels.Schedule" :sub-title="labels.ScheduleSub">
    <v-radio-group
      v-model="value.scheduleTypeId"
      class="mt-0 pt-0 campaign-manager-target-groups-radio"
      hide-details
    >
      <div class="campaign-manager-advanced-settings__distribution-item gap-2">
        <v-radio
          :id="`input--campaign-manager-radio-schedule-to`"
          class="mb-0"
          label="Start time"
          color="#2196f3"
          style="min-width: 100px;"
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
          placeholder="Select an item"
          min-width-type="super"
          nudge-width="200"
          :items="scheduledTimeItems"
          :disabled="isScheduledTimeDisabled"
        />
      </div>
      <div class="send-training-settings__lms-switch mt-2">
        <VSwitch
          v-if="isPhishing"
          v-model="value.useTargetUserTimeZone"
          hide-details
          color="#2196f3"
          class="ml-2 mt-0"
          :disabled="value.scheduleTypeId !== '3'"
        >
          <template v-slot:label>
            <div class="d-flex flex-column ml-4 mt-0">
              <p class="mb-0" style="color: #383b41; font-size: 14px; font-weight: 600;">
                Enable Region-Aware Time Zone Delivery
              </p>
              <span style="color: #383b41; font-size: 12px; font-weight: 400;"
                >Deliver emails based on the target users' time zone.</span
              >
            </div>
          </template>
        </VSwitch>
      </div>
      <div v-if="value.useTargetUserTimeZone" class="alert-box d-block bg-aqua-light mt-2">
        <div class="alert-box__default-content justify-space-between w-100 d-flex">
          <div class="d-flex" style="align-items: flex-start;">
            <v-icon color="#2196f3">mdi-information</v-icon>
            <div class="ml-2">
              <p class="mb-0">
                &bull; Target users will receive the campaign at
                <span style="font-weight: 600;">{{ value.scheduledDate.split(' ')[1] }}</span>
                local time.
              </p>
              <p class="mb-0">
                &bull; If the local time has passed, the campaign will be sent at
                <span style="font-weight: 600;">{{ value.scheduledDate.split(' ')[1] }}</span>
                the following day..
              </p>
              <p class="mb-0">
                &bull; We'll use the company's time zone for users whose time zone is not specified.
              </p>
            </div>
          </div>
        </div>
      </div>
      <v-radio
        v-for="item in radioItems"
        :key="item.text"
        color="#2196f3"
        class="mt-4"
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
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import { mapGetters } from 'vuex'
import { getTimeByTimeZone } from '@/api/company'
export default {
  name: 'InputSchedule',
  components: { FormGroup, InputDate, KSelect },
  props: {
    value: {
      type: Object,
      default: () => ({
        scheduleTypeId: 1,
        scheduledDate: '',
        scheduledDateTimeZoneId: '',
        useTargetUserTimeZone: false
      })
    },
    isPhishing: {
      type: Boolean,
      default: false
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
    'value.scheduledDateTimeZoneId'(val) {
      if (val) {
        getTimeByTimeZone(val).then((res) => {
          if (res?.data?.data) {
            this.value.scheduledDate = res.data.data
          }
        })
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
      if (val === SCHEDULE_TYPES.SAVE_FOR_LATER) {
        this.value.useTargetUserTimeZone = false
      }
      if (val !== SCHEDULE_TYPES.SCHEDULE_TO) {
        this.isDateValid = val !== SCHEDULE_TYPES.SCHEDULE_TO
        if (!this.value.scheduledDate) {
          this.value.scheduledDate = this.$moment(Date.now()).format(getTimeZoneForMoment())
        }
        if (!this.value.scheduledDateTimeZoneId) {
          this.value.scheduledDateTimeZoneId = this.selectedTimeZone
        }
      }
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
