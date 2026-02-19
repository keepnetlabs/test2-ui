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
                      class="mb-0 mr-2"
                      color="#2196f3"
                      label="Schedule to:"
                      value="3"
                    />
                    <div :class="[!isDateValid && 'date-picker-error mb-n3']">
                      <InputDate
                        v-model="formValues.scheduleDate"
                        class="date-picker-height-40 black-placeholder"
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
                    <span class="v-label theme--light mx-2" style="font-size: 14px;">on</span>
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
              :is-vishing="true"
              :default-selected-target-group-resource-ids="defaultSelectedTargetGroupResourceIds"
              @handle-selection-change="handleTableSelectionChange"
            />
            <CustomError v-if="!isTargetGroupsValid" :error-message="getTargetGroupErrorMessage" />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content vishing-campaign" :step="4">
            <ConfigureCompanyStepHeader
              class="mb-8"
              title="Call Settings"
              subtitle="Set call options"
            />
            <v-form ref="refFormStep4">
              <InputCallerPhoneNumber v-model="formValues.callerPhoneNumber" />
              <FormGroup
                title="Distribution"
                sub-title="Call target users with over a specified time period. Set days and hours of calls."
              >
                <div class="vishing-campaign-modal__send-calls">
                  <span>Send calls over</span>
                  <div class="position-relative">
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
                </div>
                <div class="vishing-campaign-modal__send-calls-on mb-1">
                  <div>
                    <div>Send calls on</div>
                  </div>
                  <div class="vishing-campaign-modal__send-calls-on__days d-flex gap-2">
                    <v-checkbox
                      v-for="day in sendCallsOnDaysOptionsShort"
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
                  <span v-if="!!selectedTimeZoneText" class="mx-2">in</span>
                  <span v-if="!!selectedTimeZoneText" class="form-group-horizontal-content__label">
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
            <div class="campaign-manager-last-step__target-users mt-4">
              <CampaignManagerSummaryCard
                detailable
                icon="mdi-account-multiple"
                :show-body-detail.sync="isShowTargetUserDetail"
                :title="labels.TargetUsers"
              >
                <template #body>
                  <div class="campaign-manager-last-step__target-users-body pb-4">
                    <span> {{ getTotalTargetGroupsAndUsersCount }}</span>
                  </div>
                  <div v-if="isShowTargetUserDetail">
                    <CampaignManagerTargetGroupsAndUserSummaryInfo
                      :items="getTargetGroupItems"
                      isPhoneNumber
                    />
                  </div>
                </template>
              </CampaignManagerSummaryCard>
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
        :saveButtonText="getSaveText"
        :disabled-statuses="{
          submitButton: isActionButtonDisabled,
          nextButton: isActionButtonDisabled
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
  isDifferent,
  getTimeZoneForMoment
} from '@/utils/functions'
import VishingTemplateSelectList from '@/components/VishingCampaignManager/VishingTemplateSelectList'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
import { searchTargetGroups, getTargetGroupCountDetail } from '@/api/targetUsers'
import labels from '@/model/constants/labels'
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import VishingCampaignModalSummaryVishingTemplate from '@/components/VishingCampaignManager/VishingCampaignModalSummaryVishingTemplate'
import * as Validations from '@/utils/validations'
import {
  getScheduleType,
  getSendCallOnDays,
  recipientTypes,
  sendCallsOnDaysOptionsShort,
  sendCallsOverTypes
} from '@/components/VishingCampaignManager/utils'
import {
  createVishingCampaign,
  getVishingCampaign,
  updateVishingCampaign,
  getVishingCampaignDistributionCalculation
} from '@/api/vishing'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber.vue'
import useDebounce from '@/hooks/useDebounce'
import CampaignManagerTargetGroupsAndUserSummaryInfo from '@/components/CampaignManager/Summary/CampaignManagerTargetGroupsAndUserSummaryInfo'
import { getTimeByTimeZone } from '@/api/company'

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
    InputCallerPhoneNumber,
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
    CampaignManagerSummaryCard,
    VishingCampaignModalSummaryVishingTemplate,
    CampaignManagerTargetGroupsAndUserSummaryInfo
  },
  mixins: [useDebounce],
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
      initialFormValues: JSON.parse(
        JSON.stringify({
          ...initialFormValues,
          scheduleDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        })
      ),
      formValues: JSON.parse(
        JSON.stringify({
          ...initialFormValues,
          scheduleDate: this.$moment(Date.now()).format(getTimeZoneForMoment())
        })
      ),
      selectedTargetGroups: [],
      totalTargetUserCount: 0,
      isTargetGroupsValid: true,
      responseOfTargetGroupsItems: {},
      isShowTargetGroupUsersError: false,
      isShowTargetUserDetail: false,
      userCountDetailResponse: {},
      axiosPayloadOfTargetGroups: getDefaultAxiosPayload(),
      recipientTypes,
      distributionDays: 31,
      sendCallsOverTypes,
      sendCallsOnDaysOptionsShort,
      isActionButtonDisabled: false,
      distributionDayCount: 7,
      defaultSelectedTargetGroupResourceIds: []
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timeZones: 'common/getTimezones',
      timezoneFormat: 'auth/getTimezoneFormat',
      getCurrentCompany: 'login/getCurrentCompany'
    }),
    getSaveText() {
      if (this.formValues.scheduleType === '1') {
        return labels.Launch
      }
      if (this.formValues.scheduleType === '2') {
        return labels.Save
      }
      return labels.Schedule
    },
    getTargetGroupItems() {
      const activeItems =
        this?.userCountDetailResponse?.data?.data?.filter?.((row) => row.status === 'Active') || []
      return activeItems
    },
    getTotalTargetGroupsAndUsersCount() {
      let text = ''
      if (Object.keys(this.formValues)?.length && this.formValues.targetGroupResourceIds) {
        const { targetGroupResourceIds } = this.formValues
        text = `${this.getTotalActiveUsersWithPhoneNumber} active user${
          this.getTotalActiveUsersWithPhoneNumber > 1 ? 's' : ''
        } with phone numbers from ${targetGroupResourceIds.length} group(s)`
      }
      return text
    },
    getTotalActiveUsersWithPhoneNumber() {
      return this.userCountDetailResponse?.data?.data?.reduce((acc, row) => {
        if (row.status !== 'Active') return acc
        const phoneNumberCount = row?.hasPhoneNumber?.find((r) => r.status === 'Yes')?.count || 0
        return acc + phoneNumberCount
      }, 0)
    },
    getSendCallsText() {
      return `${this.getTotalActiveUsersWithPhoneNumber} user${
        this.getTotalActiveUsersWithPhoneNumber > 1 ? 's' : ''
      } will receive calls over ${this.formValues.distributionOverDays} ${
        this.getDistributionTimeText
      } between ${
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
      } else if (this.formValues.distributionOverDays > 1) {
        return 'weeks'
      } else return 'week'
    },
    getTitle() {
      if (!this.isEdit) return 'New Vishing Campaign'
      return this.isDuplicate ? 'Duplicate Vishing Campaign' : 'Edit Vishing Campaign'
    },
    isScheduledTimeDisabled() {
      return this.formValues.scheduleType !== '3'
    },
    getTargetGroupErrorMessage() {
      if (this.formValues.targetGroupResourceIds.length) {
        return this.isShowTargetGroupUsersError
          ? labels.VishingTargetGroupUserRequiredError
          : labels.Required
      }
      return labels.TargetGroupSelectionRequiredError
    },
    getDistributionOverDaysValueErrorMessage() {
      if (
        this.formValues.distributionOverDays === '' ||
        this.formValues.distributionOverDays < 1 ||
        this.formValues.distributionOverDays > 6
      ) {
        return 'Enter a number between 1 and 6'
      }
      return ''
    },
    getCampaignInfoItems() {
      return {
        'Campaign Name': this.formValues.name,
        'Language / Voice': `${this.formValues?.template?.language} / ${this.formValues?.template?.voice}`,
        'Target Users': `${this.getTotalActiveUsersWithPhoneNumber} users`
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
    selectedTimeZone: {
      immediate: true,
      handler(val) {
        if (val) this.formValues.scheduledDateTimeZoneId = val
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
        this.distributionDayCount = Number.parseInt(this.formValues.distributionOverDays * 7)
      } else {
        this.distributionDayCount = Number.parseInt(this.formValues.distributionOverDays)
      }
      this.callForCalculateSendingInfo()
    },
    'formValues.distributionOverDays'(val) {
      if (this.formValues.sendCallsOverType === 'weeks') {
        this.distributionDayCount = Number.parseInt(val * 7)
      } else {
        this.distributionDayCount = Number.parseInt(val)
      }
      this.callForCalculateSendingInfo()
    },
    'formValues.scheduleType'(val) {
      if (val !== '3') {
        this.isDateValid = true
        this.isTimezoneValid = true
      } else {
        if (!this.formValues.scheduleDate) {
          this.formValues.scheduleDate = this.$moment(Date.now()).format(getTimeZoneForMoment())
        }
        if (!this.formValues.scheduledDateTimeZoneId) {
          this.formValues.scheduledDateTimeZoneId = this.selectedTimeZone
        }
      }
    },
    'formValues.scheduleDate'() {
      this.checkDateIsValid()
    },
    'formValues.scheduledDateTimeZoneId': {
      immediate: true,
      handler(val) {
        if (val) {
          //this.selectedTimeZoneText = this.timeZones?.timeZoneList?.find((item) => item.id === val)?.displayName || ''
          getTimeByTimeZone(val).then((res) => {
            if (res?.data?.data) {
              this.formValues.scheduleDate = res.data.data
            }
          })
        }
        this.checkTimezoneValid()
      }
    },
    timeZones: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectedTimeZoneText = val.timeZoneList?.find(
            (item) => item.id === this.getCurrentCompany?.timeZoneId
          )?.displayName
        }
      }
    }
  },
  created() {
    if (this.isEdit || this.isDuplicate) {
      this.callForCampaign()
    } else {
      this.callForTargetGroups()
    }
    this.getSelectedTimeZone()
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
      let isDateValid = false
      if (this.formValues) {
        if (this.formValues.scheduleType === '3') {
          isDateValid = this.formValues.scheduleDate && this.formValues.scheduleDate.length > 0
        } else isDateValid = true
      }
      this.isDateValid = isDateValid
      return this.isDateValid
    },
    checkTimezoneValid() {
      let isTimezoneValid = false
      if (this.formValues) {
        if (this.formValues.scheduleType === '3')
          isTimezoneValid = !!this.formValues.scheduledDateTimeZoneId
        else isTimezoneValid = true
      }
      this.isTimezoneValid = isTimezoneValid
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
          templateResourceId = '',
          targetGroups
        } = response?.data?.data || {}
        this.defaultSelectedTargetGroupResourceIds = targetGroups.map((tGroup) => tGroup.value)
        this.formValues.callerPhoneNumber = callerPhoneNumber
        this.formValues.distributionEndTime = distributionEndTime
          ?.split(':')
          ?.slice(0, 2)
          ?.join(':')
        this.formValues.distributionStartTime = distributionStartTime
          ?.split(':')
          ?.slice(0, 2)
          ?.join(':')
        this.formValues.sendCallsOnDays = getSendCallOnDays(distributionDays)
        this.formValues.distributionOverDays = distributionOverDays / 7
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
        this.callForTargetGroups()
      })
    },
    callForTargetGroups() {
      if (this.defaultSelectedTargetGroupResourceIds.length)
        this.axiosPayloadOfTargetGroups.selectTargetUserResourceIds = this.defaultSelectedTargetGroupResourceIds.join(
          ','
        )
      searchTargetGroups(this.axiosPayloadOfTargetGroups, true).then((response) => {
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
    selectTableItems(items) {
      this.$nextTick(() => {
        const selectedTableItems = items
          .filter(Boolean)
          .map((item) => ({ ...item, resourceId: item.value }))
        if (this.$refs?.refTargetAudience?.$refs?.refGroupTable?.$refs?.refTable)
          this.$refs.refTargetAudience.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
            selectedTableItems
          )
      })
    },
    handleTableSelectionChange(items) {
      this.selectedTargetGroups = items
      this.formValues.targetGroupResourceIds = items
        .filter(Boolean)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: item
        }))
    },
    handleSendOverCallsValueChange(val) {
      if (!val || /\d$/.test(val)) {
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
    showErrorMessage(form) {
      this.$nextTick(() => {
        if (form.querySelector('.error--text')) {
          scrollToComponent(form.querySelector('.error--text'))
        } else {
          this.step++
        }
      })
    },
    async nextStep() {
      if (this.step === 1) {
        const { refFormStep1 } = this.$refs
        refFormStep1.validate()
        this.checkDateIsValid()
        this.checkTimezoneValid()
        this.showErrorMessage(refFormStep1.$el)
      } else if (this.step === 3) {
        this.callForCalculateSendingInfo()
        if (this.formValues.targetGroupResourceIds.length) {
          if (!this.totalTargetUserCount) {
            this.isShowTargetGroupUsersError = true
            this.isTargetGroupsValid = false
            return
          }
          const targetGroupResourceIds = this.formValues.targetGroupResourceIds.map(
            (item) => item.value
          )
          this.isActionButtonDisabled = true
          this.userCountDetailResponse = await getTargetGroupCountDetail(targetGroupResourceIds)
          this.isActionButtonDisabled = false
          this.step++
        } else {
          this.isTargetGroupsValid = false
        }
      } else if (this.step === 4) {
        const { refFormStep4 } = this.$refs
        if (
          refFormStep4.validate() &&
          !this.getDistributionOverDaysValueErrorMessage &&
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
        distributionStartTime,
        distributionEndTime,
        templateResourceId
      } = this.formValues
      const payload = {
        name,
        scheduleType: Number.parseInt(scheduleType),
        scheduleDate,
        scheduledDateTimeZoneId,
        excludeFromReports,
        targetGroupResourceIds: targetGroupResourceIds.map((tGroup) => tGroup.value),
        callerPhoneNumber,
        distributionOverDays: this.distributionDayCount,
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
