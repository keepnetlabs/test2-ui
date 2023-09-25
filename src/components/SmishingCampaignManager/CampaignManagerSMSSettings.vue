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
    <InputSchedule v-model="inputScheduleFormData" ref="inputSchedule" class="mb-6" />
    <InputDistribution
      v-model="inputDistributionFormData"
      :distribution-delay-time-items="getDistributionDelayTimeItems"
      @call-for-calculate-sending-info="callForCalculateSendingInfo"
    />
    <div
      v-if="formData.smsProviderNumberResourceId"
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
import { createRandomCryptStringNumber, getTimeZone } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import InputSchedule from '@/components/Common/Inputs/InputSchedule'
import InputDistribution from '@/components/Common/Inputs/InputDistribution'
import { DISTRIBUTION_TYPES } from '@/components/SmishingCampaignManager/utils'

export default {
  name: 'CampaignManagerDeliverySettings',
  components: {
    InputDistribution,
    InputSchedule,
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
      formData: {
        phoneNumber: '',
        smsProviderNumberResourceId: ''
      },
      inputScheduleFormData: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
        scheduledDate: '',
        scheduledDateTimeZoneId: ''
      },
      inputDistributionFormData: {
        distributionTypeId: DISTRIBUTION_TYPES.SMISHING,
        distributionDelayEvery: 20,
        distributionDelayTimeTypeId: '1',
        sendingLimit: 50
      },
      commonRules: {
        hint: '*Required',
        persistentHint: true,
        rules: [(v) => Validations.required(v, labels.Required)]
      }
    }
  },
  created() {
    this.callForPhoneNumbers()
  },
  computed: {
    getDistributionDelayTimeItems() {
      return this.formDetails['distributionSmtpDelayTimeTypes'] || []
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
          } else {
            this.formData[key] = val[key]
          }
        }
      }
    },
    totalTargetUserCount() {
      this.callForCalculateSendingInfo()
    }
  },
  methods: {
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
