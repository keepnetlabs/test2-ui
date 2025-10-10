<template>
  <v-form ref="refForm">
    <FormGroup
      has-hint
      class="mt-6"
      title="Sender Phone Number"
      sub-title="Select the SMS sender phone number"
    >
      <AlertBox
        class="bg-aqua-light my-2"
        icon-color="#2196F3"
        icon-name="mdi-information"
        text="When you select multiple numbers, messages will be sent from a randomly chosen number during delivery."
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <InputPhoneNumberComboBox
        is-smishing
        itemText="phoneNumber"
        itemValue="resourceId"
        :defaultPhoneNumbers="phoneNumberItems"
        :value="formData.smsProviderNumberResourceIds"
        :rules="[(v) => !!v.length || 'Required']"
        @input="handlePhoneNumberChange"
      />
    </FormGroup>
    <FormGroup :title="labels.Frequency" :sub-title="labels.FrequencySub" has-hint>
      <KSelect
        v-model.trim="formData.frequency"
        id="input--sms-campaign-manager-advanced-settings-frequency"
        dense
        outlined
        hint="*Required"
        persistent-hint
        placeholder="Select Option"
        no-data-text="No frequency configuration available"
        :rules="rules.frequency"
        :items="frequencyItems"
        :disabled="isEdit"
      />
    </FormGroup>
    <InputSchedule
      v-model="inputScheduleFormData"
      :isEditOrDuplicate="isEdit || isDuplicate"
      ref="inputSchedule"
      class="mb-6"
      isSmishing
    />
    <InputDistribution
      v-model="inputDistributionFormData"
      :type="DISTRIBUTION_TYPES.SMISHING"
      :distribution-delay-time-items="getDistributionDelayTimeItems"
      :selected-time-zone-text="selectedTimeZoneText"
      @call-for-calculate-sending-info="callForCalculateSendingInfo"
    />
    <div
      v-if="formData.smsProviderNumberResourceIds.length"
      class="campaign-manager-advanced-settings__distribution-text mt-6"
    >
      {{ getDistributionText }}
    </div>
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import SmishingService from '@/api/smishing'
import { createRandomCryptStringNumber, scrollToComponent } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import InputPhoneNumberComboBox from '@/components/Common/Inputs/InputPhoneNumberComboBox'
import { frequencyItems, SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import InputSchedule from '@/components/Common/Inputs/InputSchedule'
import InputDistribution from '@/components/Common/Inputs/InputDistribution'
import {
  DISTRIBUTION_START_TYPES,
  DISTRIBUTION_TYPES
} from '@/components/SmishingCampaignManager/utils'
import { mapGetters } from 'vuex'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import AlertBox from '@/components/AlertBox'

export default {
  name: 'CampaignManagerSMSSettings',
  components: {
    FormGroup,
    KSelect,
    InputDistribution,
    InputSchedule,
    AlertBox,
    InputPhoneNumberComboBox
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
    isDuplicate: {
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
      DISTRIBUTION_TYPES,
      isTestingConnection: false,
      isShowSmtpErrorDialog: false,
      totalSendSecond: 77720,
      batchEverySendSecond: 0,
      isTestMailSend: false,
      emailDeliveryItems: [],
      selectedTimeZoneText: '',
      buttonKey: createRandomCryptStringNumber(),
      isShowSmtpInputError: false,
      testEmailErrorMessage: '',
      emailDelivery: null,
      phoneNumberItems: [],
      formData: {
        frequency: 0,
        phoneNumbers: [],
        smsProviderNumberResourceIds: []
      },
      inputScheduleFormData: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
        scheduledDate: '',
        scheduledDateTimeZoneId: '',
        useTargetUserTimeZone: false
      },
      inputDistributionFormData: {
        distributionTypeId: DISTRIBUTION_TYPES.SMISHING,
        distributionDelayEvery: 20,
        distributionDelayTimeTypeId: '1',
        sendingLimit: 50,
        sendCallsOnDays: [1, 2, 4, 8, 16],
        distributionStartTime: '09:00',
        distributionEndTime: '17:00',
        distributionDays: 31,
        distributionStartTypeId: DISTRIBUTION_START_TYPES.NOW
      },
      frequencyItems,
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [(v) => Validations.required(v, labels.Required)]
      },
      rules: {
        frequency: [(v) => v >= 0 || labels.Required]
      }
    }
  },
  created() {
    this.callForPhoneNumbers()
  },
  computed: {
    ...mapGetters({
      timeZones: 'common/getTimezones'
    }),
    getDistributionDelayTimeItems() {
      return this.formDetails['distributionDelayTimeTypes'] || []
    },
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    getDistributionText() {
      if (this.totalTargetUserCount === 1)
        return `Sending an SMS will start immediately for a single user.`
      return `Sending ${this.inputDistributionFormData.sendingLimit} SMS every ${this.inputDistributionFormData.distributionDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take approximately ${this.getApproximatedTime}.`
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
            (item) => item.value === this.inputDistributionFormData.distributionDelayTimeTypeId
          )?.text
        : ''
    },
    getDistributionTextRenderStatus() {
      return this.inputDistributionFormData.distributionTypeId === DISTRIBUTION_TYPES.PHISHING
        ? this.inputDistributionFormData.sendingLimit &&
            this.inputDistributionFormData.distributionDelayEvery
        : this.inputDistributionFormData.sendingLimit &&
            this.inputDistributionFormData.distributionEmailOver
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
    }
  },
  watch: {
    defaultValues: {
      deep: true,
      handler(val) {
        for (const key of Object.keys(val)) {
          if (['scheduleTypeId', 'scheduledDate', 'scheduledDateTimeZoneId'].includes(key)) {
            this.inputScheduleFormData[key] = val[key]
          } else if (
            [
              'sendingLimit',
              'distributionTypeId',
              'distributionDelayEvery',
              'distributionEmailOverTimeTypeId',
              'distributionEmailOver',
              'distributionDelayTimeTypeId',
              'distributionStartTime',
              'distributionEndTime',
              'sendCallsOnDays',
              'distributionDays',
              'distributionStartTypeId'
            ].includes(key)
          ) {
            this.inputDistributionFormData[key] = val[key]
          } else {
            this.formData[key] = val[key]
          }
        }
      }
    },
    'inputScheduleFormData.scheduledDateTimeZoneId': {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectedTimeZoneText =
            this.timeZones?.timeZoneList?.find((item) => item.id === val)?.displayName || ''
        }
      }
    },
    'inputDistributionFormData.sendCallsOnDays': {
      deep: true,
      handler(val) {
        this.inputDistributionFormData.distributionDays = val.reduce((acc, val) => {
          return acc + val
        }, 0)
      }
    },
    totalTargetUserCount() {
      this.callForCalculateSendingInfo()
    }
  },
  methods: {
    handlePhoneNumberChange(phoneNumberResourceIds) {
      this.formData.phoneNumbers = this.phoneNumberItems
        .filter((pn) => phoneNumberResourceIds.includes(pn.resourceId))
        .map((pn) => pn.phoneNumber)
      this.formData.smsProviderNumberResourceIds = phoneNumberResourceIds
    },
    callForPhoneNumbers() {
      SmishingService.getSmishingPhoneNumbers().then((response) => {
        this.phoneNumberItems = response.data.data
      })
    },
    validateForm() {
      let isValid =
        this.$refs.refForm.validate() && (this?.$refs?.inputSchedule?.validateInput() ?? true)
      if (
        this.inputDistributionFormData.distributionStartTypeId ===
        DISTRIBUTION_START_TYPES.SCHEDULED
      ) {
        isValid =
          isValid &&
          this.inputDistributionFormData.distributionStartTime &&
          this.inputDistributionFormData.distributionEndTime &&
          this.inputDistributionFormData.distributionDays
      }
      if (!isValid) {
        this.$nextTick(() => {
          const el = this.$refs.refForm.$el.querySelector('.error--text')
          scrollToComponent(el)
        })
      }
      return isValid
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
      if (!this.inputDistributionFormData.distributionDelayEvery) return
      this.debounce(() => {
        const payload = {
          targetGroupResourceIds: this.targetGroupResourceIds,
          distributionTypeId: this.inputDistributionFormData.distributionTypeId,
          distributionDelayEvery: this.inputDistributionFormData.distributionDelayEvery,
          distributionDelayTimeTypeId: this.inputDistributionFormData.distributionDelayTimeTypeId,
          distributionEmailOver: this.inputDistributionFormData.distributionEmailOver,
          distributionEmailOverTimeTypeId: this.inputDistributionFormData
            .distributionEmailOverTimeTypeId,
          sendingLimit: this.inputDistributionFormData.sendingLimit,
          sendOnlyActiveUsers: this.userTargetAudienceData.sendOnlyActiveUsers,
          sendRandomlyUsers: this.userTargetAudienceData.sendRandomlyUsers,
          sendRandomlyUsersCount: this.userTargetAudienceData.sendRandomlyUsersCount,
          sendRandomlyUsersCalculateTypeId: this.userTargetAudienceData
            .sendRandomlyUsersCalculateTypeId,
          totalTargetUserCount: this.totalTargetUserCount,
          distributionDays: this.inputDistributionFormData.distributionDays,
          distributionStartTime: this.inputDistributionFormData.distributionStartTime,
          distributionEndTime: this.inputDistributionFormData.distributionEndTime
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
