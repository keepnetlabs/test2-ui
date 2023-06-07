<template>
  <v-form ref="refForm">
    <InputCallerPhoneNumber
      v-model="formData.callerPhoneNumber"
      title="Sender Phone Number"
      subTitle="Select the SMS sender phone number"
    />
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
          v-model="formData.distributionSmtpDelayEvery"
          v-mask="'###'"
          id="input--campaign-manager-advanced-settings-time"
          outlined
          class="edit-name-textfield edit-select standard-height ml-2"
          hide-details
          style="max-width: 48px;"
          :disabled="!distributionEmailOverTimeDisableStatus"
          :rules="rules.number"
          @input="callForCalculateSendingInfo"
        ></v-text-field>
        <KSelect
          v-model.trim="formData.distributionSmtpDelayTimeTypeId"
          id="input--campaign-manager-advanced-settings-time-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          :items="formDetails['distributionSmtpDelayTimeTypes']"
          :disabled="!distributionEmailOverTimeDisableStatus"
          @change="callForCalculateSendingInfo"
        />
      </div>
    </FormGroup>
    <div
      v-if="formData.callerPhoneNumber"
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
import { getSmtpSettings, testConnection } from '@/api/smtpSettings'
import {
  calculateSendingInfo,
  getDefaultCompanySmtpSetting,
  getEmailDeliveries
} from '@/api/phishingsimulator'
import { createRandomCryptStringNumber } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber.vue'

export default {
  name: 'CampaignManagerDeliverySettings',
  components: {
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
      formData: {
        callerPhoneNumber: '',
        smtpSettingResourceId: '',
        directEmailSettingResourceId: '',
        emailDeliverySettingType: '',
        distributionTypeId: '1',
        distributionSmtpDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionSmtpDelayTimeTypeId: '1',
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
      }
    }
  },
  computed: {
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    distributionEmailOverTimeDisableStatus() {
      return this.formData.distributionTypeId === '1'
    },
    getDistributionText() {
      return this.formData.distributionTypeId === '1'
        ? `Sending ${this.formData.sendingLimit} SMS every ${this.formData.distributionSmtpDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take ${this.getApproximatedTime}.`
        : `Sending  ${this.formData.sendingLimit} SMS every ${this.getEmailOverMinutes} minutes to ${this.totalTargetUserCount} targets users will take ${this.getApproximatedTime}.`
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
      return this.formDetails['distributionSmtpDelayTimeTypes']
        ? this.formDetails['distributionSmtpDelayTimeTypes']?.find(
            (item) => item.value === this.formData.distributionSmtpDelayTimeTypeId
          )?.text
        : ''
    },
    getDistributionTextRenderStatus() {
      return this.formData.distributionTypeId === '1'
        ? this.formData.sendingLimit && this.formData.distributionSmtpDelayEvery
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
    defaultValues(val) {
      for (const key of Object.keys(val)) {
        if (key === 'smtpSetting' && val[key] && typeof val[key] === 'object') {
          this.formData.smtpSettingResourceId = val[key].value
          this.emailDelivery = {
            name: val[key].text,
            resourceId: val[key].value,
            type: EMAIL_DELIVERY_TYPES.SMTP
          }
        } else if (key === 'directEmailSetting' && val[key] && typeof val[key] === 'object') {
          this.formData.directEmailSettingResourceId = val[key].value
          this.emailDelivery = {
            name: val[key].text,
            resourceId: val[key].value,
            type: EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
          }
        } else if (key === 'distributionTypeId') {
          this.formData.distributionTypeId = '1'
        } else {
          this.formData[key] = val[key]
        }
      }
    },
    totalTargetUserCount() {
      this.callForCalculateSendingInfo()
    }
  },
  created() {
    this.callForDefaultSmtpSetting()
    this.callForEmailDeliveries()
  },
  methods: {
    validateForm() {
      let isValid = this.$refs.refForm.validate()
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
    callForEmailDeliveries() {
      getEmailDeliveries().then((res) => {
        const {
          data: { data: { results = [] } = {} }
        } = res || {}
        const deliveries = []
        const smtpItems = results.filter((item) => item.type === EMAIL_DELIVERY_TYPES.SMTP)
        if (smtpItems.length) {
          deliveries.push({ header: 'SMTP' })
          deliveries.push(...smtpItems)
        }
        const directEmailItems = results.filter(
          (item) => item.type === EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
        )
        if (directEmailItems.length) {
          deliveries.push({ header: 'Direct Email Creation' })
          deliveries.push(...directEmailItems)
        }
        this.emailDeliveryItems = deliveries
        this.$nextTick(() => {
          //setting default smtp setting
          if (this.isEdit || !this.formData.smtpSettingResourceId) return
          this.emailDelivery =
            deliveries.find((item) => item.resourceId === this.formData.smtpSettingResourceId) || {}
        })
      })
    },
    callForDefaultSmtpSetting() {
      if (this.isEdit) return
      getDefaultCompanySmtpSetting().then((response) => {
        const {
          data: { data }
        } = response
        this.formData.smtpSettingResourceId = data.resourceId
        this.formData.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.SMTP
      })
    },
    callForCalculateSendingInfo() {
      if (!this.targetGroupResourceIds.length || !this.totalTargetUserCount) return
      if (!this.formData.distributionSmtpDelayEvery) return
      this.debounce(() => {
        const payload = {
          targetGroupResourceIds: this.targetGroupResourceIds,
          distributionTypeId: this.formData.distributionTypeId,
          distributionSmtpDelayEvery: this.formData.distributionSmtpDelayEvery,
          distributionSmtpDelayTimeTypeId: this.formData.distributionSmtpDelayTimeTypeId,
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
        if (payload.distributionSmtpDelayEvery) {
          calculateSendingInfo(payload).then((response) => {
            const {
              data: { data }
            } = response
            const { totalSendSecond, batchEverySendSecond } = data
            this.totalSendSecond = totalSendSecond
            this.batchEverySendSecond = batchEverySendSecond
          })
        }
      }, 500)
    },
    handleTestConnectionChange() {
      try {
        this.callForTestConnection()
      } catch (e) {}
    },
    callForGetSmtpSetting() {
      return getSmtpSettings(this.formData.smtpSettingResourceId).then((response) => {
        const {
          data: {
            data: { password, serverAddress, serverPort, useAuthentication, useSSL, userName } = {}
          } = {}
        } = response
        return {
          serverAddress,
          port: serverPort,
          userName,
          password,
          resourceId: this.formData.smtpSettingResourceId,
          useAuthentication,
          useSSL
        }
      })
    },
    async callForTestConnection() {
      if (this?.emailDelivery?.type === EMAIL_DELIVERY_TYPES.DIRECT_EMAIL) return
      this.$emit('set-action-button-disability', true)
      try {
        this.isTestingConnection = true
        const smtpData = await this.callForGetSmtpSetting()
        const { fromAddress, fromName, template } = this.selectedPhishingScenario
        const payload = {
          ...smtpData,
          to: this.$store.state.auth.user.email,
          from: fromAddress,
          fromName,
          message: template
        }
        try {
          await testConnection(payload)
          this.isTestMailSend = true
          this.isShowSmtpInputError = false
          this.$nextTick(() => {
            this.testEmailErrorMessage = ''
          })
          return true
        } catch (error) {
          if (!error) return
          const { response } = error
          const { data: { message = '', Message = '' } = {} } = response
          const errorMessage = message || Message
          this.testEmailErrorMessage =
            errorMessage ||
            'You cannot use this scenario with this SMTP setting.If you are going to keep it like that, there will be some errors in the campaign.'
          this.isShowSmtpInputError = true
        } finally {
          this.isTestingConnection = false
        }
      } catch (e) {
      } finally {
        this.$emit('set-action-button-disability', false)
      }
    },
    handleChangeEmailDelivery(delivery = {}) {
      this.buttonKey = createRandomCryptStringNumber()
      this.isTestMailSend = false
      this.isShowSmtpInputError = false
      this.testEmailErrorMessage = ''
      if (delivery.type === EMAIL_DELIVERY_TYPES.SMTP) {
        this.formData.smtpSettingResourceId = delivery.resourceId
        this.formData.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.SMTP
        this.formData.directEmailSettingResourceId = ''
      } else {
        this.formData.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.DIRECT_EMAIL
        this.formData.directEmailSettingResourceId = delivery.resourceId
        this.formData.smtpSettingResourceId = ''
      }
    }
  }
}
</script>
