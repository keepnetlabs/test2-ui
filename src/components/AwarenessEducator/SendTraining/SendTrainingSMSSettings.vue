<template>
  <v-form ref="refForm">
    <InputCallerPhoneNumber
      title="Sender Phone Number"
      subTitle="Select the SMS sender phone number"
      is-smishing
      required
      :defaultPhoneNumbers="phoneNumbers"
      :value="formData.phoneNumber"
      @input="handlePhoneNumberChange"
    />
    <FormGroup
      class="mb-4"
      title="SMS Text"
      sub-title="SMS text to be sent to target users. Use the mandatory merge tag {TRAININGURL} for the link to be added to the SMS"
    >
      <InputMergeTag
        v-model.trim="formData.smsText"
        initialPlaceholder="Enter your text message"
        rows="5"
        height="160"
        hint="SMS supports the GSM-7 character set and can contain up to 160 characters"
        required
        :mergeTags="mergeTags"
        :initialRules="smsTextRules"
      />
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
          :items="distributionDelayTimeTypes"
          @change="callForCalculateSendingInfo"
        />
      </div>
    </FormGroup>
    <div class="campaign-manager-advanced-settings__distribution-text mt-6">
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
import { createRandomCryptStringNumber } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber'
import InputMergeTag from '@/components/Common/Inputs/InputMergeTag'
export default {
  name: 'SendTrainingSMSSettings',
  components: {
    KSelect,
    FormGroup,
    InputCallerPhoneNumber,
    InputMergeTag
  },
  mixins: [useDebounce],
  props: {
    distributionDelayTimeTypes: {
      type: Array
    },
    totalPhoneNumberUserCount: {
      type: Number
    },
    defaultValues: {
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
        smsText: `Dear {FULLNAME} {TRAININGNAME} assigned to you. Please enroll it on {TRAININGURL}`,
        phoneNumber: '',
        smsProviderNumberResourceId: '',
        distributionTypeId: 3,
        distributionDelayEvery: 20,
        distributionDelayTimeTypeId: '1',
        sendingLimit: 50
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
      },
      smsTextRules: [
        (v) => Validations.required(v, labels.Required),
        (v) => Validations.maxLength(v, 160, 'SMS cannot exceed 160 characters')
      ],
      mergeTags: [
        {
          text: 'Training URL',
          value: '{TRAININGURL}'
        },
        {
          text: 'Training Name',
          value: '{TRAININGNAME}'
        },
        {
          text: 'Full Name',
          value: '{FULLNAME}'
        },
        {
          text: 'First Name',
          value: '{FIRSTNAME}'
        },
        {
          text: 'Last Name',
          value: '{LASTNAME}'
        }
      ]
    }
  },
  created() {
    this.callForPhoneNumbers()
  },
  computed: {
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    getDistributionText() {
      if (this.totalTargetUserCount === 1)
        return `Sending an SMS will start immediately for a single user.`
      return `Sending ${this.formData.sendingLimit} SMS every ${this.formData.distributionDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalPhoneNumberUserCount} target users will take approximately ${this.getApproximatedTime}.`
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
      return this.distributionDelayTimeTypes
        ? this.distributionDelayTimeTypes.find(
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
      // TODO: Change api endpoint
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
          totalTargetUserCount: this.totalPhoneNumberUserCount
        }
        if (payload.distributionDelayEvery) {
          // TODO: Change api endpoint
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
