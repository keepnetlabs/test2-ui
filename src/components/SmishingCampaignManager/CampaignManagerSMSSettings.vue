<template>
  <v-form ref="refForm">
    <InputCallerPhoneNumber
      title="Sender Phone Number"
      subTitle="Select the SMS sender phone number"
      is-smishing
      :defaultPhoneNumbers="phoneNumbers"
      :value="formData.phoneNumber"
      @input="handlePhoneNumberChange"
    />
    <FormGroup
      class="mb-6"
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
    <FormGroup :title="labels.Distribution" :sub-title="labels.DistributionSub">
      <div class="campaign-manager-advanced-settings__distribution-item">
        <label for="input--campaign-manager-advanced-settings-time">Sending Limit</label>
        <VTextField
          v-model="formData.sendingLimit"
          v-mask="'###########'"
          id="input--campaign-manager-advanced-settings-sending-limit"
          class="ml-6"
          outlined
          hide-details
          placeholder="Enter number"
          style="max-width: 128px;"
          :rules="rules.number"
          @input="callForCalculateSendingInfo"
        />
      </div>
      <div class="campaign-manager-advanced-settings__distribution-item mt-3">
        <label for="input--campaign-manager-advanced-settings-time"
          >Send SMS with delay every
        </label>
        <v-text-field
          v-model="formData.distributionDelayEvery"
          v-mask="'###'"
          id="input--campaign-manager-advanced-settings-time"
          outlined
          class="edit-name-textfield edit-select standard-height ml-2"
          hide-details
          style="max-width: 48px;"
          :rules="rules.number"
          @input="callForCalculateSendingInfo"
        ></v-text-field>
        <KSelect
          v-model.trim="formData.distributionDelayTimeTypeId"
          id="input--campaign-manager-advanced-settings-time-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :items="formDetails['distributionDelayTimeTypes']"
          @change="callForCalculateSendingInfo"
        />
      </div>
    </FormGroup>
    <div
      v-if="formData.smsProviderNumberResourceId"
      class="campaign-manager-advanced-settings__distribution-text mt-6"
    >
      {{ getDistributionText }}
    </div>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import KSelect from '@/components/Common/Inputs/KSelect'
import SmishingService from '@/api/smishing'
import { createRandomCryptStringNumber, getTimeZone } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber.vue'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'CampaignManagerDeliverySettings',
  components: {
    InputDate,
    KSelect,
    FormGroup,
    InputCallerPhoneNumber
  },
  mixins: [useDebounce],
  props: {
    formDetails: {
      type: Object
    },
    defaultValues: {
      type: Object
    },
    selectedPhishingScenario: {
      type: Object
    },
    isEdit: {
      type: Boolean
    },
    targetGroupResourceIds: {
      type: Array,
      default: () => []
    },
    userTargetAudienceData: {
      type: Object,
      default: () => ({
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
      })
    },
    totalTargetUserCount: {
      type: Number,
      default: 0
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
      isTestingConnection: false,
      isShowSmtpErrorDialog: false,
      isUsersOnline: false,
      totalSendSecond: 77720,
      batchEverySendSecond: 0,
      isTestMailSend: false,
      emailDeliveryItems: [],
      buttonKey: createRandomCryptStringNumber(),
      isShowSmtpInputError: false,
      testEmailErrorMessage: '',
      emailDelivery: null,
      phoneNumbers: [],
      phoneNumberItems: [],
      radioItems: [
        { text: 'Send now', value: SCHEDULE_TYPES.SEND_NOW },
        { text: 'Save for later', value: SCHEDULE_TYPES.SAVE_FOR_LATER }
      ],
      formData: {
        phoneNumber: '',
        smsProviderNumberResourceId: '',
        distributionTypeId: 3,
        distributionDelayEvery: 20,
        distributionDelayTimeTypeId: '1',
        sendingLimit: 50,
        scheduleTypeId: SCHEDULE_TYPES.SEND_NOW,
        scheduledDate: '',
        scheduledDateTimeZoneId: ''
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [(v) => Validations.required(v, labels.Required)]
      },
      rules: {
        number: [
          (v) => Validations.required(v, 'Enter a number higher than 0'),
          (v) => Validations.startsWith(v, 'Cannot start with 0', 0),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      }
    }
  },
  created() {
    this.callForPhoneNumbers()
    this.callForGetTimeZones()
    if (!this.isEdit) this.getSelectedTimeZone()
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    getDistributionText() {
      if (this.totalTargetUserCount === 1)
        return `Sending an SMS will start immediately for a single user.`
      return `Sending ${this.formData.sendingLimit} SMS every ${this.formData.distributionDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take approximately ${this.getApproximatedTime}.`
    },
    getEmailOverMinutes() {
      let seconds = this.batchEverySendSecond
      seconds = seconds.toFixed()
      if (seconds < 1) seconds = 1
      let minutes = 0
      if (seconds > 60) {
        minutes = seconds % 60
        seconds = seconds / 60
      }
      minutes = minutes.toString()
      seconds = seconds.toString()
      const singleDigitMinutes = `0${minutes}`
      const singleDigitSeconds = `0${seconds}`
      return `${minutes.length === 1 ? singleDigitMinutes : minutes}:${
        seconds.length === 1 ? singleDigitSeconds : seconds
      }`
    },
    getSelectedSmtpDelayOverTimeType() {
      return this.formDetails['distributionDelayTimeTypes']
        ? this.formDetails['distributionDelayTimeTypes']?.find(
            (item) => item.value === this.formData.distributionDelayTimeTypeId
          )?.text
        : ''
    },
    getDistributionTextRenderStatus() {
      return this.formData.distributionTypeId === '1'
        ? this.formData.sendingLimit && this.formData.distributionDelayEvery
        : this.formData.sendingLimit && this.formData.distributionEmailOver
    },
    getApproximatedTime() {
      let seconds = this.totalSendSecond
      let minutes = 0
      let hours = 0
      if (seconds > 60) {
        minutes = Math.floor(seconds / 60)
        seconds = seconds % 60
      }
      if (minutes > 60) {
        hours = Math.floor(minutes / 60)
        minutes = minutes % 60
      }
      seconds = Math.floor(seconds)
      if (minutes === 0 && hours === 0 && seconds === 0) {
        seconds = 1
      }
      const hoursText = hours > 1 ? 'hours' : 'hour'
      const minutesText = minutes > 1 ? 'minutes' : 'minute'
      const secondsText = seconds > 1 ? 'seconds' : 'second'
      const leftSideHours = `${hours} ${hoursText} `
      let leftSideText = '',
        rightSideText = ''
      if (hours !== 0) {
        leftSideText = leftSideHours
      }
      if (minutes !== 0) {
        leftSideText += `${minutes} ${minutesText} `
      }

      if (seconds !== 0) {
        if (hours !== 0 || minutes !== 0) rightSideText = `and ${seconds} ${secondsText}`
        else rightSideText = `${seconds} ${secondsText}`
      }

      return `${leftSideText}${rightSideText}`
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
    defaultValues: {
      deep: true,
      handler(val) {
        this.formData = { ...this.formData, ...val }
      }
    },
    totalTargetUserCount() {
      this.callForCalculateSendingInfo()
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
    handlePhoneNumberChange(phoneNumber) {
      const phoneNumberIndex = this.phoneNumberItems.findIndex(
        (item) => item.phoneNumber === phoneNumber
      )
      if (phoneNumberIndex !== -1) {
        this.formData.smsProviderNumberResourceId = this.phoneNumberItems[
          phoneNumberIndex
        ].resourceId
        this.formData.phoneNumber = phoneNumber
      }
    },
    callForPhoneNumbers() {
      SmishingService.getSmishingPhoneNumbers().then((response) => {
        this.phoneNumberItems = response.data.data
        this.phoneNumbers = response.data.data.map((item) => item.phoneNumber)
      })
    },
    validateForm() {
      return this.$refs.refForm.validate()
    },
    getTestConnectionButtonStyle() {
      return {
        fontWeight: 600,
        pointerEvents: this.isTestMailSend ? 'none' : 'cursor'
      }
    },
    handleOnConfirmSmtpErrorDialog() {
      this.toggleShowSmtpErrorDialog()
      this.$emit('on-increment-step')
    },
    toggleShowSmtpErrorDialog() {
      this.isShowSmtpErrorDialog = !this.isShowSmtpErrorDialog
    },
    callForCalculateSendingInfo() {
      if (
        !this.targetGroupResourceIds.length ||
        !this.totalTargetUserCount ||
        this.totalTargetUserCount === 1
      )
        return
      if (!this.formData.distributionDelayEvery) return
      this.debounce(() => {
        const payload = {
          targetGroupResourceIds: this.targetGroupResourceIds,
          distributionTypeId: this.formData.distributionTypeId,
          distributionDelayEvery: this.formData.distributionDelayEvery,
          distributionDelayTimeTypeId: this.formData.distributionDelayTimeTypeId,
          distributionEmailOver: this.formData.distributionEmailOver,
          distributionEmailOverTimeTypeId: this.formData.distributionEmailOverTimeTypeId,
          sendingLimit: this.formData.sendingLimit,
          sendOnlyActiveUsers: this.userTargetAudienceData.sendOnlyActiveUsers,
          sendRandomlyUsers: this.userTargetAudienceData.sendRandomlyUsers,
          sendRandomlyUsersCount: this.userTargetAudienceData.sendRandomlyUsersCount,
          sendRandomlyUsersCalculateTypeId: this.userTargetAudienceData
            .sendRandomlyUsersCalculateTypeId,
          totalTargetUserCount: this.totalTargetUserCount
        }
        if (payload.distributionDelayEvery) {
          SmishingService.calculateSendingInfo(payload).then((response) => {
            const {
              data: { data }
            } = response
            const { totalSendSecond, batchEverySendSecond } = data
            this.totalSendSecond = totalSendSecond
            this.batchEverySendSecond = batchEverySendSecond
          })
        }
      }, 500)
    }
  }
}
</script>
