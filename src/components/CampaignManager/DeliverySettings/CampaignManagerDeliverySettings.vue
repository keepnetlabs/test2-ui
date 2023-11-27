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
    <FormGroup :title="labels.Frequency" :sub-title="labels.FrequencySub" has-hint>
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
        :disabled="isEdit"
      />
    </FormGroup>
    <InputSchedule v-model="inputScheduleFormData" ref="inputSchedule" />
    <InputDistribution
      v-model="inputDistributionFormData"
      :distribution-delay-time-items="getDistributionDelayTimeItems"
      :selected-time-zone-text="selectedTimeZoneText"
      @call-for-calculate-sending-info="callForCalculateSendingInfo"
    />
    <div
      v-if="getDistributionTextRenderStatus"
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
import CampaignManagerSmtpErrorDialog from '@/components/CampaignManager/AdvancedSettings/CampaignManagerSmtpErrorDialog'
import {
  calculateSendingInfo,
  getDefaultCompanySmtpSetting,
  getEmailDeliveries
} from '@/api/phishingsimulator'
import CallbackService from '@/api/callback'
import { createRandomCryptStringNumber, scrollToComponent } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import { frequencyItems, SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import InputSchedule from '@/components/Common/Inputs/InputSchedule'
import InputDistribution from '@/components/Common/Inputs/InputDistribution'
import {
  DISTRIBUTION_START_TYPES,
  DISTRIBUTION_TYPES
} from '@/components/SmishingCampaignManager/utils'
import { mapGetters } from 'vuex'
import useDistributionComputed from '@/hooks/awareness-educator/useDistributionComputed'
import { SCENARIO_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
export default {
  name: 'CampaignManagerDeliverySettings',
  components: {
    InputDistribution,
    InputSchedule,
    CampaignManagerSmtpErrorDialog,
    KSelect,
    FormGroup
  },
  mixins: [useDebounce, useDistributionComputed],
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
    },
    type: {
      type: String,
      default: SCENARIO_TYPES.PHISHING
    }
  },
  data() {
    return {
      selectedTimeZoneText: '',
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
      frequencyItems,
      formData: {
        frequency: 0,
        smtpSettingResourceId: '',
        directEmailSettingResourceId: '',
        emailDeliverySettingType: ''
      },
      inputDistributionFormData: {
        distributionTypeId: DISTRIBUTION_TYPES.PHISHING,
        distributionDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionDelayTimeTypeId: '1',
        sendingLimit: 50,
        sendCallsOnDays: [1, 2, 4, 8, 16],
        distributionStartTime: '09:00',
        distributionEndTime: '17:00',
        distributionDays: 31,
        distributionStartTypeId: DISTRIBUTION_START_TYPES.NOW
      },
      inputScheduleFormData: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
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
          (v) => Validations.startsWith(v, 'Cannot start with 0', '0'),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ],
        frequency: [(v) => v >= 0 || labels.Required]
      }
    }
  },
  computed: {
    ...mapGetters({
      timeZones: 'common/getTimezones'
    }),
    getDistributionDelayTimeItems() {
      return this.formDetails['distributionSmtpDelayTimeTypes'] || []
    },
    isSelectedEmailDeliveryIsSmtp() {
      if (!this.emailDelivery) return false
      return this.emailDelivery.type === EMAIL_DELIVERY_TYPES.SMTP
    },
    getSmtpInputErrorMessage() {
      return this.isShowSmtpInputError ? 'You cannot use this scenario with this SMTP setting.' : ''
    },
    getSelectedSmtpDelayOverTimeType() {
      return this.formDetails['distributionSmtpDelayTimeTypes']
        ? this.formDetails['distributionSmtpDelayTimeTypes']?.find(
            (item) => item.value === this.inputDistributionFormData.distributionDelayTimeTypeId
          )?.text
        : ''
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
          this.inputDistributionFormData.distributionTypeId = DISTRIBUTION_TYPES.PHISHING
        } else if (['scheduleTypeId', 'scheduledDate', 'scheduledDateTimeZoneId'].includes(key)) {
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
    handleOnConfirmSmtpErrorDialog() {
      this.toggleShowSmtpErrorDialog()
      this.$emit('on-increment-step')
    },
    toggleShowSmtpErrorDialog() {
      this.isShowSmtpErrorDialog = !this.isShowSmtpErrorDialog
    },
    callForEmailDeliveries() {
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING
          ? getEmailDeliveries
          : this.type === SCENARIO_TYPES.CALLBACK
          ? CallbackService.getEmailDeliverySettings
          : QuishingService.getEmailDeliveries
      apiFunc().then((res) => {
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
      if (this.type === SCENARIO_TYPES.CALLBACK) return
      const apiFunc =
        this.type === SCENARIO_TYPES.PHISHING
          ? getDefaultCompanySmtpSetting
          : QuishingService.getDefaultCompanySmtpSetting
      apiFunc().then((response) => {
        const {
          data: { data }
        } = response
        this.formData.smtpSettingResourceId = data.resourceId
        this.formData.emailDeliverySettingType = EMAIL_DELIVERY_TYPES.SMTP
      })
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
          const apiFunc =
            this.type === SCENARIO_TYPES.PHISHING
              ? calculateSendingInfo
              : this.type === SCENARIO_TYPES.CALLBACK
              ? CallbackService.calculateSendingInfo
              : QuishingService.calculateSendingInfo
          apiFunc(payload).then((response) => {
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
    }
  }
}
</script>
