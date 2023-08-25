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
        v-bind="commonRules"
        v-model.trim="formData.frequency"
        id="input--company-manager-advanced-settings-frequency"
        dense
        outlined
        placeholder="Select Option"
        no-data-text="No frequency configuration available"
        :items="frequencyItems"
      />
    </FormGroup>
    <FormGroup
      v-if="isSelectedEmailDeliveryIsSmtp"
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
      v-if="isSelectedEmailDeliveryIsSmtp"
      class="mt-6"
      :title="labels.Distribution"
      :sub-title="labels.DistributionSub"
    >
      <div class="campaign-manager-advanced-settings__distribution-item">
        <label for="input--campaign-manager-advanced-settings-time">Sending limit per batch</label>
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
          >Send emails with delay every
        </label>
        <v-text-field
          v-model="formData.distributionDelayEvery"
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
          v-model.trim="formData.distributionDelayTimeTypeId"
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
import { createRandomCryptStringNumber, getTimeZone, scrollToComponent } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import { EMAIL_DELIVERY_TYPES } from '@/components/CampaignManager/AdvancedSettings/utils'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'CampaignManagerDeliverySettings',
  components: {
    InputDate,
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
      frequencyItems: [
        { text: 'One Time', value: '0' },
        { text: 'Weekly', value: '1' },
        { text: 'Every two weeks', value: '2' },
        { text: 'Monthly', value: '3' },
        { text: 'Quarterly', value: '4' }
      ],
      formData: {
        frequency: '0',
        smtpSettingResourceId: '',
        directEmailSettingResourceId: '',
        emailDeliverySettingType: '',
        distributionTypeId: '1',
        distributionDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionEmailOver: 8,
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
          (v) => Validations.startsWith(v, 'Cannot start with 0', '0'),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      },
      radioItems: [
        { text: 'Send now', value: SCHEDULE_TYPES.SEND_NOW },
        { text: 'Save for later', value: SCHEDULE_TYPES.SAVE_FOR_LATER }
      ]
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
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
      if (this.totalTargetUserCount === 1)
        return `Sending an email will start immediately for a single user.`
      return this.formData.distributionTypeId === '1'
        ? `Sending ${this.formData.sendingLimit} emails every ${this.formData.distributionDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take approximately ${this.getApproximatedTime}.`
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
            (item) => item.value === this.formData.distributionDelayTimeTypeId
          )?.text
        : ''
    },
    getDistributionTextRenderStatus() {
      if (!this.isSelectedEmailDeliveryIsSmtp) return
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
    timezoneFormat: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.parsedFormat = getTimeZone(false, val)
        }
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
    },
    totalTargetUserCount() {
      this.callForCalculateSendingInfo()
    }
  },
  created() {
    this.callForGetTimeZones()
    if (!this.isEdit) this.getSelectedTimeZone()
    this.callForDefaultSmtpSetting()
    this.callForEmailDeliveries()
  },
  methods: {
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
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
