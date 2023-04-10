<template>
  <v-form ref="refForm">
    <CampaignManagerSmtpErrorDialog
      v-if="isShowSmtpErrorDialog"
      :status="isShowSmtpErrorDialog"
      :message="testEmailErrorMessage"
      @on-close="toggleShowSmtpErrorDialog"
      @on-confirm="handleOnConfirmSmtpErrorDialog"
    />
    <FormGroup
      class="mt-8 campaign-manager-smtp-settings"
      :title="labels.EmailDelivery"
      :sub-title="labels.EmailDeliverySub"
      has-hint
    >
      <KSelect
        v-bind="commonRules"
        v-model.trim="emailDelivery"
        id="input--company-manager-advanced-settings-smtp"
        class="new-integration__select"
        dense
        outlined
        item-text="name"
        placeholder="Select Option"
        no-data-text="No Email Delivery configuration available"
        return-object
        :items="emailDeliveryItems"
        :error="isShowSmtpInputError"
        :error-messages="getSmtpInputErrorMessage"
        :disabled="isTestingConnection"
        @change="handleChangeEmailDelivery"
      >
      </KSelect>
      <v-btn
        v-if="isSelectedEmailDeliveryIsSmtp"
        :key="buttonKey"
        class="ml-4"
        text
        color="#2196f3"
        :style="getTestConnectionButtonStyle()"
        :loading="isTestingConnection"
        :disabled="!formData.smtpSettingResourceId"
        @click="handleTestConnectionChange"
        ><span
          v-if="isTestMailSend"
          style="
            color: rgb(67, 160, 71) !important;
            display: flex;
            align-items: center;
            text-transform: capitalize;
          "
        >
          <v-icon>mdi-check</v-icon>
          <span class="ml-2"> {{ labels.Connected }}</span>
        </span>
        <span v-else> {{ labels.TestConnection }}</span>
        <template #loader>
          <img
            src="../../../assets/img/spinner-blue.svg"
            class="add-in-settings__spinner"
            alt="spinner"
          />
          <span class="ml-1" style="font-size: 14px; text-transform: capitalize;">
            {{ labels.TestingConnection }}
          </span>
        </template>
      </v-btn>
    </FormGroup>
    <FormGroup
      v-if="isSelectedEmailDeliveryIsSmtp"
      :title="labels.Distribution"
      :sub-title="labels.DistributionSub"
    >
      <div class="campaign-manager-advanced-settings__distribution-item">
        <label for="input--campaign-manager-advanced-settings-time"
          >Send emails with SMTP Delay every
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
    <FormGroup
      v-if="isSelectedEmailDeliveryIsSmtp"
      :title="labels.SendingLimit"
      :sub-title="labels.SendingLimitSub"
    >
      <v-text-field
        v-model="formData.sendingLimit"
        v-mask="'###########'"
        id="input--campaign-manager-advanced-settings-sending-limit"
        outlined
        persistent-hint
        placeholder="Enter number"
        hint="*Required"
        :rules="rules.number"
        @input="callForCalculateSendingInfo"
      ></v-text-field>
    </FormGroup>
    <div
      v-if="getDistributionTextRenderStatus"
      class="campaign-manager-advanced-settings__distribution-text"
    >
      {{ getDistributionText }}
    </div>
    <FormGroup
      style="max-width: 640px;"
      :class="isSelectedEmailDeliveryIsSmtp ? 'mt-6' : ''"
      :title="labels.OtherSettings"
    >
      <div>
        <v-checkbox
          v-model="formData.excludeFromReports"
          id="input--campaign-manager-advanced-settings-exclude-from-reports"
          color="#2196f3"
        >
          <template #label> Exclude from reports</template>
        </v-checkbox>
        <v-checkbox
          v-model="formData.sendOnlyActiveUsers"
          id="input--campaign-manager-advanced-settings-only-active-users"
          color="#2196f3"
          :disabled="!isUsersOnline"
        >
          <template #label> Send only to active users on phishing reporter add-in</template>
        </v-checkbox>
        <div class="campaign-manager-advanced-settings__other-settings-last">
          <v-checkbox
            v-model="formData.sendRandomlyUsers"
            id="input--campaign-manager-advanced-settings-randomly-selected"
            color="#2196f3"
            hide-details
          >
          </v-checkbox>
          <span>Send this campaign to randomly selected</span>
          <v-text-field
            v-model="formData.sendRandomlyUsersCount"
            v-mask="'#######'"
            id="input--campaign-manager-advanced-settings-other-settings-number"
            placeholder="Enter number"
            outlined
            class="edit-name-textfield edit-select standard-height ml-2 absolute-text-input-error absolute-text-input-error--max-width"
            style="max-width: 64px;"
            :disabled="getDisabledStatusOfRandomlySelected"
            :rules="formData.sendRandomlyUsers ? [...rules.number, userCountValidation] : []"
          ></v-text-field>
          <KSelect
            v-model.trim="formData.sendRandomlyUsersCalculateTypeId"
            id="input--campaign-manager-advanced-settings-other-settings-percent"
            class="ml-2"
            outlined
            dense
            hide-details
            placeholder="Select a item"
            style="max-width: 118px;"
            :items="formDetails['sendRandomlyUsersCalculateTypes']"
            :disabled="getDisabledStatusOfRandomlySelected"
            @change="validateForm"
          />
          <span class="ml-2">of target users</span>
        </div>
      </div>
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getSmtpSettings, testConnection } from '@/api/smtpSettings'
import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog'
import {
  calculateSendingInfo,
  getDefaultCompanySmtpSetting,
  getEmailDeliveries
} from '@/api/phishingsimulator'
import { createRandomCryptStringNumber } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
export default {
  name: 'CampaignManagerAdvancedSettings',
  components: {
    CampaignManagerSmtpErrorDialog,
    KSelect,
    FormGroup
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
      targetGroupResourceIds: [],
      isTestMailSend: false,
      totalTargetUserCount: 0,
      emailDeliveryItems: [],
      buttonKey: createRandomCryptStringNumber(),
      isShowSmtpInputError: false,
      testEmailErrorMessage: '',
      emailDelivery: null,
      formData: {
        smtpSettingResourceId: '',
        directEmailSettingResourceId: '',
        emailDeliverySettingType: '',
        excludeFromReports: false,
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        distributionTypeId: '1',
        distributionSmtpDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionSmtpDelayTimeTypeId: '1',
        sendingLimit: 50,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
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
    isSelectedEmailDeliveryIsSmtp() {
      if (!this.emailDelivery) return false
      return this.emailDelivery.type === EMAIL_DELIVERY_TYPES.SMTP
    },
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    distributionEmailOverTimeDisableStatus() {
      return this.formData.distributionTypeId === '1'
    },
    getDistributionText() {
      return this.formData.distributionTypeId === '1'
        ? `Sending ${this.formData.sendingLimit} emails every ${this.formData.distributionSmtpDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take approximately ${this.getApproximatedTime}.`
        : `Sending  ${this.formData.sendingLimit} emails every ${this.getEmailOverMinutes} minutes to ${this.totalTargetUserCount} targets users will take ${this.getApproximatedTime}.`
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
      if (!this.isSelectedEmailDeliveryIsSmtp) return
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
    },
    getDisabledStatusOfRandomlySelected() {
      return !this.formData.sendRandomlyUsers
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
    }
  },
  created() {
    this.callForDefaultSmtpSetting()
    this.callForEmailDeliveries()
  },
  methods: {
    getTestConnectionButtonStyle() {
      return {
        fontWeight: 600,
        pointerEvents: this.isTestMailSend ? 'none' : 'cursor'
      }
    },
    validateForm() {
      this.$refs.refForm.validate()
    },
    userCountValidation(v) {
      const { sendRandomlyUsersCalculateTypeId } = this.formData
      //that means percent
      const val = parseInt(v)
      if (sendRandomlyUsersCalculateTypeId === '1') {
        return (val <= 100 && val >= 0) || 'This number cannot be higher than 100 percent'
      } else {
        return (
          this.totalTargetUserCount >= val ||
          'This number cannot be higher than number of total target users.'
        )
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
      if (!this.targetGroupResourceIds.length) return
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
          sendOnlyActiveUsers: this.formData.sendOnlyActiveUsers,
          sendRandomlyUsers: this.formData.sendRandomlyUsers,
          sendRandomlyUsersCount: this.formData.sendRandomlyUsersCount,
          sendRandomlyUsersCalculateTypeId: this.formData.sendRandomlyUsersCalculateTypeId
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
    }
  }
}
</script>
