<template>
  <AppModal :status="status" icon-name="mdi-phone-in-talk" :title="getTitle">
    <template #overlay-body>
      <v-stepper light v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step class="k-stepper__step" :complete="step > 1" :step="1"
            >Campaign Settings</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 2" :step="2"
            >Vishing Templates</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 3" :step="3"
            >Target Audience</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 4" :step="4"
            >Call Settings</v-stepper-step
          >
          <v-divider class="k-stepper__divider" />
          <v-stepper-step class="k-stepper__step" :complete="step > 5" :step="5"
            >Campaign Summary</v-stepper-step
          >
        </v-stepper-header>

        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Campaign Info"
              subtitle="Enter basic information about this campaign"
            />
            <v-form ref="refFormStep1" lazy-validation>
              <FormGroup title="Campaign Name" has-hint>
                <InputEntityName
                  v-model.trim="formValues.name"
                  id="input--new-vishing-campaign-campaign-name"
                  entity-name="campaign name"
                  initial-placeholder="Enter a name"
                />
              </FormGroup>
              <FormGroup
                style="max-width: 600px;"
                title="Schedule"
                subTitle="Start time of this campaign"
              >
                <v-radio-group
                  v-model="formValues.scheduleType"
                  class="mt-0 campaign-manager-target-groups-radio"
                  hide-details
                >
                  <v-radio
                    :id="`input--campaign-manager-radio-send-now`"
                    style="margin-bottom: 16px;"
                    color="#2196f3"
                    value="1"
                    label="Send now"
                  ></v-radio>
                  <v-radio
                    :id="`input--campaign-manager-radio-save-for-later`"
                    style="margin-bottom: 16px;"
                    color="#2196f3"
                    value="2"
                    label="Save for later"
                  ></v-radio>
                  <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
                    <v-radio
                      :id="`input--campaign-manager-radio-schedule-to`"
                      style="margin-bottom: 0;"
                      color="#2196f3"
                      label="Schedule to:"
                      value="3"
                    />
                    <div :class="[!isDateValid && 'date-picker-error mb-n3']">
                      <InputDate
                        v-model="formValues.scheduleDate"
                        class="date-picker-height-40 ml-2 black-placeholder"
                        type="datetime"
                        ref="refPicker"
                        placeholder="Select Date and Time"
                        style="width: 100%; max-width: 220px;"
                        :format="parsedFormat"
                        :valueFormat="parsedFormat"
                        :picker-options="datePickerOptions"
                        :disabled="isScheduledTimeDisabled"
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
                    <span class="v-label theme--light mx-2" style="font-size: 14px;">in</span>
                    <div :class="[!isTimezoneValid && 'date-picker-error mb-n3']">
                      <InputTimezone
                        v-model="formValues.scheduledDateTimeZoneId"
                        class="black-placeholder"
                        :disabled="isScheduledTimeDisabled"
                        :rules="[(v) => Validations.required(v)]"
                      />
                      <div class="v-text-field__details checkbox-error" v-if="!isTimezoneValid">
                        <transition appear name="bounce">
                          <div class="v-messages theme--light error--text" role="alert">
                            <div class="v-messages__wrapper">
                              <div class="v-messages__message" style="padding-left: 10px;">
                                Timezone is required
                              </div>
                            </div>
                          </div>
                        </transition>
                      </div>
                    </div>
                  </div>
                </v-radio-group>
              </FormGroup>
              <FormGroup class="mt-6" title="Mark as Test">
                <v-checkbox
                  v-model="formValues.excludeFromReports"
                  hide-details
                  color="#2196f3"
                  label="Exclude from reports (Test campaign)"
                >
                </v-checkbox>
              </FormGroup>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Vishing Templates"
              subtitle="Select a template to use in this campaign"
            />
            <VishingTemplateSelectList
              ref="refVishingTemplateSelectList"
              :template-resource-id="formValues.templateResourceId"
              :languages="languages"
              @initialTemplateId="handleInitialTemplate"
              @selectedTemplateResourceId="handleSelectedTemplateResourceIdChange"
              @selectedTemplateChange="handleSelectedTemplateChange"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="3">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Target Audience"
              subtitle="Select target users for your campaign"
            />
            <CampaignManagerTargetGroups
              ref="refTargetAudience"
              class="mt-2"
              last-column-name="phoneNumber"
              :isShowCompanyColumn="false"
              :selected-target-groups="formValues.targetGroupResourceIds"
              :response-of-target-groups-items="responseOfTargetGroupsItems"
              :is-valid="isTargetGroupsValid"
              @handle-selection-change="handleTableSelectionChange"
            />
            <CustomError v-if="!isTargetGroupsValid" :error-message="getTargetGroupErrorMessage" />
            <template v-if="false">
              <FormGroup class="mt-6" title="Limit Recipients" />
              <div class="d-flex" style="align-items: center; gap: 8px;">
                <v-checkbox v-model="formValues.isLimitRecipients" hide-details color="#2196f3">
                  <template #label> </template>
                </v-checkbox>
                <span class="form-group-horizontal-content__label">
                  Send this campaign to randomly selected
                </span>
                <div style="position: relative;">
                  <v-text-field
                    ref="refRecipientValue"
                    :value="formValues.recipientValue"
                    :disabled="!formValues.isLimitRecipients"
                    style="max-width: 64px !important;"
                    outlined
                    placeholder=""
                    hide-details
                    :error="!!getRecipientValueErrorMessage"
                    @input="handleRecipientValueChange"
                  />
                  <CustomError
                    style="position: absolute; bottom: -16px; left: -8px; width: 500px;"
                    :error-message="getRecipientValueErrorMessage"
                  />
                </div>
                <KSelect
                  v-model="formValues.recipientType"
                  style="max-width: 120px !important;"
                  outlined
                  dense
                  hide-details
                  :return-object="false"
                  :items="recipientTypes"
                  :disabled="!formValues.isLimitRecipients"
                />
                <span class="form-group-horizontal-content__label"> of target users</span>
              </div>
            </template>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="4">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Call Settings"
              subtitle="Set call options"
            />
            <v-form ref="refFormStep4">
              <FormGroup
                has-hint
                class="mt-6"
                title="Caller Phone Number"
                sub-title="Select caller phone number for this campaign"
              >
                <KSelect
                  v-model="formValues.callerPhoneNumber"
                  outlined
                  dense
                  hint="*Required"
                  persistent-hint
                  placeholder="Select a phone number"
                  :items="phoneNumbers"
                  :rules="[(v) => Validations.required(v)]"
                />
              </FormGroup>
              <FormGroup
                title="Distribution"
                subTitle="Call target users with over a specified time period. Set days and hours of calls."
              >
                <div class="vishing-campaign-modal__send-calls">
                  <span>Send calls over</span>
                  <div style="position: relative;">
                    <v-text-field
                      ref="refSendCallsOver"
                      :value="formValues.distributionOverDays"
                      style="max-width: 125px !important; margin-right: 8px;"
                      outlined
                      placeholder="Enter a number"
                      hide-details
                      :error="!!getDistributionOverDaysValueErrorMessage"
                      @input="handleSendOverCallsValueChange"
                    />
                    <CustomError
                      style="position: absolute; bottom: -16px; left: -8px; width: 500px;"
                      :error-message="getDistributionOverDaysValueErrorMessage"
                    />
                  </div>
                  <span class="form-group-horizontal-content__label">
                    {{ formValues.distributionOverDays > 1 ? 'weeks' : 'week' }}
                  </span>
                  <!-- <KSelect
                    v-model="formValues.sendCallsOverType"
                    style="max-width: 137px !important;"
                    outlined
                    dense
                    hide-details
                    position="bottom"
                    :return-object="false"
                    :items="sendCallsOverTypes"
                  /> -->
                </div>
                <div class="vishing-campaign-modal__send-calls-on">
                  <div>
                    <div>Send calls on</div>
                  </div>
                  <div class="vishing-campaign-modal__send-calls-on__days">
                    <v-checkbox
                      v-for="day in sendCallsOnDaysOptions"
                      v-model="formValues.sendCallsOnDays"
                      color="#2196F3"
                      :label="day.text"
                      :value="day.value"
                      :key="day.value"
                    />
                  </div>
                </div>
                <div
                  class="vishing-campaign-modal__send-calls"
                  style="max-width: unset; width: 1000px;"
                >
                  <span>Send calls between</span>
                  <div
                    :class="[!formValues.distributionStartTime && 'date-picker-error']"
                    style="position: relative;"
                  >
                    <el-time-select
                      v-model="formValues.distributionStartTime"
                      style="max-width: 125px;"
                      placeholder="Start time"
                      :picker-options="{
                        start: '09:00',
                        end: '17:00'
                      }"
                      @change="callForCalculateSendingInfo"
                    />
                    <CustomError
                      style="
                        margin-left: -8px;
                        margin-top: 2px;
                        position: absolute;
                        bottom: -16px;
                        width: 200px;
                      "
                      :showValidMessage="false"
                      :is-valid="!!formValues.distributionStartTime"
                      error-message="Start Time is required"
                    />
                  </div>
                  <span class="mx-2">and</span>
                  <div
                    :class="[!formValues.distributionEndTime && 'date-picker-error']"
                    style="position: relative;"
                  >
                    <el-time-select
                      v-model="formValues.distributionEndTime"
                      style="max-width: 125px;"
                      placeholder="End time"
                      :picker-options="{
                        start: '09:00',
                        end: '17:00',
                        minTime: formValues.distributionStartTime
                      }"
                      @change="callForCalculateSendingInfo"
                    />
                    <CustomError
                      style="
                        margin-left: -8px;
                        margin-top: 2px;
                        position: absolute;
                        bottom: -16px;
                        width: 200px;
                      "
                      :showValidMessage="false"
                      :is-valid="!!formValues.distributionEndTime"
                      error-message="End Time is required"
                    />
                  </div>
                  <span
                    v-if="!!selectedTimeZoneText"
                    class="ml-2 form-group-horizontal-content__label"
                  >
                    {{ selectedTimeZoneText }}
                  </span>
                </div>
              </FormGroup>
              <div class="vishing-campaign-modal__send-calls-text">
                {{ getSendCallsText }}
              </div>
            </v-form>
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="5">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Summary of the campaign"
              subtitle="Preview what this campaign will look like"
            />
            <div class="vishing-campaign-modal__general-info">
              <CampaignManagerSummaryCard
                icon="mdi-information"
                :title="labels.CampaignInfo"
                :items="getCampaignInfoItems"
              />
              <CampaignManagerSummaryCard
                class="ml-4"
                icon="mdi-send"
                :title="labels.CampaignDelivery"
                :items="getCampaignDeliveryItems"
              />
            </div>
            <VishingCampaignModalSummaryVishingTemplate
              v-if="!!formValues.template"
              class="mt-4"
              :formValues="formValues"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <StepperFooter
        max-step="5"
        :step.sync="step"
        :saveButtonText="labels.Launch"
        :disabled-statuses="{
          submitButton: isActionButtonDisabled
        }"
        @on-cancel="changeVishingCampaignModalStatus"
        @on-back="backStep"
        @on-next="nextStep"
        @on-submit="submit"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import StepperFooter from '@/components/Stepper/StepperFooter'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputDate from '@/components/Common/Inputs/InputDate'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import { mapGetters } from 'vuex'
import {
  getDefaultAxiosPayload,
  getTimeZone,
  scrollToComponent,
  isDifferent
} from '@/utils/functions'
import VishingTemplateSelectList from '@/components/VishingCampaignManager/VishingTemplateSelectList'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
import KSelect from '@/components/Common/Inputs/KSelect'
import { searchTargetGroups } from '@/api/targetUsers'
import labels from '@/model/constants/labels'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import VishingCampaignModalSummaryVishingTemplate from '@/components/VishingCampaignManager/VishingCampaignModalSummaryVishingTemplate'
import * as Validations from '@/utils/validations'
import {
  getScheduleType,
  getSendCallOnDays,
  recipientTypes,
  sendCallsOnDaysOptions,
  sendCallsOverTypes
} from '@/components/VishingCampaignManager/utils'
import {
  createVishingCampaign,
  getPhoneNumbers,
  getVishingCampaign,
  updateVishingCampaign,
  getVishingCampaignDistributionCalculation
} from '@/api/vishing'

const initialFormValues = {
  name: '',
  scheduleType: '1',
  scheduleDate: '',
  scheduledDateTimeZoneId: '',
  excludeFromReports: false,
  templateResourceId: '',
  template: null,
  targetGroupResourceIds: [],
  isLimitRecipients: false,
  recipientType: 1,
  recipientValue: 0,
  callerPhoneNumber: '',
  distributionOverDays: 1,
  sendCallsOverType: 'weeks',
  distributionStartTime: '09:00',
  distributionEndTime: '17:00',
  sendCallsOnDays: [1, 2, 4, 8, 16]
}

export default {
  name: 'VishingCampaignModal',
  components: {
    AppModal,
    StepperFooter,
    ConfigureCompanyStepHeader,
    InputEntityName,
    FormGroup,
    InputDate,
    InputTimezone,
    VishingTemplateSelectList,
    CampaignManagerTargetGroups,
    CustomError,
    KSelect,
    CampaignManagerSummaryCard,
    VishingCampaignModalSummaryVishingTemplate
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    isDuplicate: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object
    },
    languages: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels,
      Validations,
      step: 1,
      selectedTemplateStepIndex: 0,
      delayBetweenEachCallInMinutes: 0,
      parsedFormat: getTimeZone(false),
      isDateValid: true,
      isTimezoneValid: true,
      selectedTimeZoneText: '',
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      initial: true,
      initialFormValues: JSON.parse(JSON.stringify(initialFormValues)),
      formValues: JSON.parse(JSON.stringify(initialFormValues)),
      selectedTargetGroups: [],
      totalTargetUserCount: 0,
      isTargetGroupsValid: true,
      responseOfTargetGroupsItems: {},
      isShowTargetGroupUsersError: false,
      axiosPayloadOfTargetGroups: getDefaultAxiosPayload(),
      recipientTypes,
      distributionDays: 31,
      phoneNumbers: [],
      sendCallsOverTypes,
      sendCallsOnDaysOptions,
      isActionButtonDisabled: false,
      distributionDayCount: 5
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timeZones: 'common/getTimezones',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    getSendCallsText() {
      return `${this.totalTargetUserCount} users will receive calls over ${
        this.formValues.distributionOverDays
      } ${this.getDistributionTimeText} between ${
        this.formValues.distributionStartTime ? this.formValues.distributionStartTime : ' '
      } and ${
        this.formValues.distributionEndTime ? this.formValues.distributionEndTime : ' '
      } and each user will receive a call approximately every ${
        this.delayBetweenEachCallInMinutes
      } minutes.`
    },
    getDistributionTimeText() {
      if (this.formValues.sendCallsOverType === 'days') {
        if (this.formValues.distributionOverDays > 1) {
          return 'days'
        } else return 'day'
      } else {
        if (this.formValues.distributionOverDays > 1) {
          return 'weeks'
        } else return 'week'
      }
    },
    getTitle() {
      return !this.isEdit
        ? 'New Vishing Campaign'
        : this.isDuplicate
        ? 'Duplicate Vishing Campaign'
        : 'Edit Vishing Campaign'
    },
    isScheduledTimeDisabled() {
      return this.formValues.scheduleType !== '3'
    },
    getTargetGroupErrorMessage() {
      return this.formValues.targetGroupResourceIds.length
        ? this.isShowTargetGroupUsersError
          ? 'Target groups must have at least 1 user with phone number'
          : 'Required'
        : 'Required'
    },
    getRecipientValueErrorMessage() {
      if (this.formValues.isLimitRecipients) {
        if (this.formValues.recipientType === 1) {
          if (this.formValues.recipientValue === '' || this.formValues.recipientValue <= 0) {
            return 'Enter a number higher than 0'
          }
          if (this.formValues.recipientValue > 100) {
            return 'This number cannot be higher than 100 percent'
          }
        } else {
          if (this.formValues.recipientValue === '' || this.formValues.recipientValue <= 0) {
            return 'Enter a number higher than 0'
          }
          if (this.formValues.recipientValue > this.totalTargetUserCount) {
            return 'This number cannot be higher than number of total target users'
          }
        }
      }

      return ''
    },
    getDistributionOverDaysValueErrorMessage() {
      if (
        this.formValues.distributionOverDays === '' ||
        this.formValues.distributionOverDays <= 0
      ) {
        return 'Enter a number higher than 0'
      }
      return ''
    },
    getCampaignInfoItems() {
      return {
        'Campaign Name': this.formValues.name,
        'Target Users': `${this.totalTargetUserCount} users`
      }
    },
    getCampaignDeliveryItems() {
      const deliveryItems = {
        'Caller Phone Number': this.formValues.callerPhoneNumber
      }
      if (this.formValues.scheduleType === '1') {
        deliveryItems['Starting'] = 'Now'
      } else if (this.formValues.scheduleType === '2') {
        deliveryItems['Starting'] = 'Later'
      } else {
        deliveryItems['Scheduled'] = `${this.formValues.scheduleDate}`
      }
      return deliveryItems
    }
  },
  watch: {
    timeZones: {
      deep: true,
      handler(val) {
        if (this.formValues.scheduledDateTimeZoneId)
          this.selectedTimeZoneText =
            val?.timeZoneList?.find((item) => item.id === this.formValues.scheduledDateTimeZoneId)
              ?.displayName || ''
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
    'formValues.targetGroupResourceIds'(val) {
      this.isTargetGroupsValid = !!val.length
    },
    selectedTargetGroups: {
      immediate: true,
      deep: true,
      handler(val) {
        this.totalTargetUserCount = val.reduce((acc, item) => {
          acc += item?.userCountWithPhoneNumber || 0
          return acc
        }, 0)
      }
    },
    'formValues.sendCallsOnDays': {
      deep: true,
      handler(val) {
        this.distributionDays = val.reduce((acc, val) => {
          return acc + val
        }, 0)
      }
    },
    distributionDays() {
      this.callForCalculateSendingInfo()
    },
    'formValues.sendCallsOverType'(val) {
      if (val === 'weeks') {
        this.distributionDayCount = parseInt(this.formValues.distributionOverDays * 7)
      } else {
        this.distributionDayCount = parseInt(this.formValues.distributionOverDays)
      }
      this.callForCalculateSendingInfo()
    },
    'formValues.distributionOverDays'(val) {
      if (this.formValues.sendCallsOverType === 'weeks') {
        this.distributionDayCount = parseInt(val * 7)
      } else {
        this.distributionDayCount = parseInt(val)
      }
      this.callForCalculateSendingInfo()
    },
    'formValues.scheduleType'(val) {
      if (val !== '3') {
        this.isDateValid = true
        this.isTimezoneValid = true
        this.formValues.scheduleDate = ''
        this.selectedTimeZoneText = ''
      }
    },
    'formValues.scheduleDate'() {
      this.checkDateIsValid()
    },
    'formValues.scheduledDateTimeZoneId'(val) {
      if (val) {
        this.selectedTimeZoneText =
          this.timeZones?.timeZoneList?.find((item) => item.id === val)?.displayName || ''
      }
      this.checkTimezoneValid()
    },
    selectedTimeZone(val) {
      this.formValues.scheduledDateTimeZoneId = val
    }
  },
  created() {
    if (this.isEdit || this.isDuplicate) {
      this.callForCampaign()
    }
    this.getSelectedTimeZone()
    this.callForPhoneNumbers()
    this.callForTargetGroups()
  },
  methods: {
    getSelectedTimeZone() {
      if (this.$store?.getters['common/getSelectedTimeZone']) {
        this.formValues.scheduledDateTimeZoneId = this.$store?.getters['common/getSelectedTimeZone']
      } else {
        this.$store.dispatch('common/callForSettings')
      }
    },
    handleCancel(forceUpdate = false) {
      this.$emit('cancel', forceUpdate)
    },
    changeVishingCampaignModalStatus() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit('cancel')
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit('cancel')
        }
      })
    },
    checkDateIsValid() {
      this.isDateValid = this.formValues
        ? this.formValues.scheduleType === '3'
          ? this.formValues.scheduleDate && this.formValues.scheduleDate.length > 0
          : true
        : false
      return this.isDateValid
    },
    checkTimezoneValid() {
      this.isTimezoneValid = this.formValues
        ? this.formValues.scheduleType === '3'
          ? !!this.formValues.scheduledDateTimeZoneId
          : true
        : false
      return this.isTimezoneValid
    },
    callForCampaign() {
      getVishingCampaign(this.selectedRow.resourceId).then((response) => {
        const {
          callerPhoneNumber,
          distributionEndTime = '',
          distributionStartTime = '',
          distributionDays,
          distributionOverDays,
          excludeFromReports,
          name,
          scheduleDate,
          scheduleType,
          scheduledDateTimeZoneId,
          targetGroupResourceIds = [],
          templateResourceId = '',
          targetGroups
        } = response?.data?.data || {}
        this.formValues.callerPhoneNumber = callerPhoneNumber
        this.formValues.distributionEndTime = distributionEndTime.split(':').slice(0, 2).join(':')
        this.formValues.distributionStartTime = distributionStartTime
          .split(':')
          .slice(0, 2)
          .join(':')
        this.formValues.sendCallsOnDays = getSendCallOnDays(distributionDays)
        this.formValues.distributionOverDays = distributionOverDays
        this.formValues.excludeFromReports = excludeFromReports
        this.formValues.name = this.isDuplicate ? `${name} - Copy` : name
        this.formValues.scheduleDate = scheduleDate
        this.formValues.scheduledDateTimeZoneId = scheduledDateTimeZoneId
        this.formValues.scheduleType = getScheduleType(scheduleType)
        this.formValues.targetGroupResourceIds = targetGroups.map((tGroup) => tGroup.value) || []
        this.formValues.templateResourceId = templateResourceId
        this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
        this.$nextTick(() => (this.isTargetGroupsValid = true))
        this.selectTableItems(targetGroups)
      })
    },
    callForTargetGroups() {
      searchTargetGroups(this.axiosPayloadOfTargetGroups).then((response) => {
        if (this.initial) {
          this.responseOfTargetGroupsItems = response
        }
        this.initial = false
      })
    },
    callForCalculateSendingInfo() {
      if (!this.formValues.distributionOverDays) return
      if (!this.formValues.distributionStartTime) return
      if (!this.formValues.distributionEndTime) return
      this.debounce(() => {
        const payload = {
          distributionOverDays: this.distributionDayCount,
          distributionStartTime: this.formValues.distributionStartTime,
          distributionEndTime: this.formValues.distributionEndTime,
          distributionDays: this.distributionDays,
          totalTargetUserCount: this.totalTargetUserCount
        }
        getVishingCampaignDistributionCalculation(payload).then((response) => {
          this.delayBetweenEachCallInMinutes =
            response?.data?.data?.delayBetweenEachCallInMinutes || 0
        })
      }, 500)
    },
    debounce(fn, delay) {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        fn()
      }, delay)
    },
    selectTableItems(items) {
      this.$nextTick(() => {
        const selectedTableItems = items
          .filter((item) => item)
          .map((item) => ({ ...item, resourceId: item.value }))
        this.$refs.refTargetAudience.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
          selectedTableItems
        )
      })
    },
    callForPhoneNumbers() {
      getPhoneNumbers().then((response) => {
        this.phoneNumbers = response?.data || []
      })
    },
    handleTableSelectionChange(items) {
      this.selectedTargetGroups = items
      this.formValues.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: item
        }))
    },
    handleRecipientValueChange(val) {
      if (!val || /\d+$/.test(val)) {
        this.formValues.recipientValue = val
      } else {
        this.$refs.refRecipientValue.initialValue = this.formValues.recipientValue
        this.$refs.refRecipientValue.lazyValue = this.formValues.recipientValue
      }
    },
    handleSendOverCallsValueChange(val) {
      if (!val || /\d+$/.test(val)) {
        this.formValues.distributionOverDays = val
      } else {
        this.$refs.refSendCallsOver.initialValue = this.formValues.distributionOverDays
        this.$refs.refSendCallsOver.lazyValue = this.formValues.distributionOverDays
      }
      this.callForCalculateSendingInfo()
    },
    handleInitialTemplate(id) {
      this.initialFormValues.templateResourceId = id
    },
    handleSelectedTemplateChange(item) {
      this.formValues.template = item
    },
    handleSelectedTemplateResourceIdChange(id) {
      this.formValues.templateResourceId = id
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    backStep() {
      this.step--
    },
    nextStep() {
      if (this.step === 1) {
        const { refFormStep1 } = this.$refs
        refFormStep1.validate()
        this.checkDateIsValid()
        this.checkTimezoneValid()
        this.$nextTick(() => {
          if (refFormStep1.$el.querySelector('.error--text')) {
            scrollToComponent(refFormStep1.$el.querySelector('.error--text'))
          } else {
            this.step++
          }
        })
      } else if (this.step === 3) {
        this.callForCalculateSendingInfo()
        if (this.formValues.targetGroupResourceIds.length) {
          if (!this.totalTargetUserCount) {
            this.isShowTargetGroupUsersError = true
            this.isTargetGroupsValid = false
            return
          }
          this.step++
        } else {
          this.isTargetGroupsValid = false
        }
      } else if (this.step === 4) {
        const { refFormStep4 } = this.$refs
        if (
          refFormStep4.validate() &&
          this.distributionDays > 0 &&
          this.formValues.distributionStartTime &&
          this.formValues.distributionEndTime &&
          this.formValues.distributionOverDays > 0
        )
          this.step++
      } else this.step++
    },
    submit() {
      const {
        name,
        scheduleType,
        scheduleDate,
        scheduledDateTimeZoneId,
        excludeFromReports,
        targetGroupResourceIds,
        callerPhoneNumber,
        distributionOverDays,
        distributionStartTime,
        distributionEndTime,
        templateResourceId
      } = this.formValues
      const payload = {
        name,
        scheduleType: parseInt(scheduleType),
        scheduleDate,
        scheduledDateTimeZoneId,
        excludeFromReports,
        targetGroupResourceIds: targetGroupResourceIds.map((tGroup) => tGroup.value),
        callerPhoneNumber,
        distributionOverDays,
        distributionStartTime,
        distributionEndTime,
        distributionDays: this.distributionDays,
        templateResourceId
      }
      this.isActionButtonDisabled = true
      if (this.isEdit) {
        updateVishingCampaign(payload, this.selectedRow.resourceId)
          .then(() => {
            this.handleCancel(true)
          })
          .finally(() => (this.isActionButtonDisabled = false))
      } else {
        createVishingCampaign(payload)
          .then(() => {
            this.handleCancel(true)
          })
          .finally(() => (this.isActionButtonDisabled = false))
      }
    }
  }
}
</script>
