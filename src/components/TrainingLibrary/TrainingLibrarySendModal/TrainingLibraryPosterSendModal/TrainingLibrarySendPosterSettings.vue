<template>
  <v-form ref="refForm" class="send-training-settings">
    <FormGroup has-hint :title="labels.EnrollmentName">
      <InputEntityName
        v-model.trim="formData.name"
        id="input--enrollment-name"
        initial-placeholder="Enter a name"
        entity-name="enrollment"
      />
    </FormGroup>
    <InputContentLanguage
      v-model="formData.languageIds"
      ref="refInputContentLanguage"
      :training-id="selectedRow.trainingId"
    />
    <DeliveryMethod
      v-model="formData.deliveryMethod"
      sub-title="Select how the poster will be delivered to the target audience."
      type="Poster"
      :isLMS="showProxySection"
      @input="handleDeliveryMethodChange"
    />
    <AlertBox
      v-if="deliveryMethodText"
      class="bg-aqua-light mb-4 max-w-554"
      icon-color="#2196F3"
      icon-name="mdi-information"
      :text="deliveryMethodText"
      :slots="{ primaryAction: false, secondaryAction: false }"
    />
    <div v-if="isDeliveryMethodSMS" class="mb-6">
      <SendTrainingSMSSettings
        v-if="formData.isSendSMSNotification"
        ref="refSendTrainingSMSSettings"
        merge-tag-subtitle="SMS text to be sent to target users. Use the mandatory merge tag {TRAININGURL} for the link to be added to the SMS"
        :distributionDelayTimeTypes="distributionDelayTimeTypes"
        :totalPhoneNumberUserCount="totalPhoneNumberUserCount"
        :phoneNumberItems="phoneNumberItems"
        :phoneNumbers="phoneNumbers"
      />
    </div>
    <FormGroup v-if="!formData.isProxy" style="max-width: 650px;" :title="labels.Schedule">
      <v-radio-group
        v-model="formData.scheduleTypeId"
        class="mt-0 campaign-manager-target-groups-radio"
        hide-details
      >
        <v-radio
          v-for="item in radioItems"
          :key="item.text"
          :id="`input--campaign-manager-radio-${item.text}`"
          style="margin-bottom: 16px;"
          color="#2196f3"
          :value="item.value"
          :label="item.text"
        ></v-radio>
        <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
          <v-radio
            :id="`input--campaign-manager-radio-schedule-to`"
            style="margin-bottom: 0;"
            label="Schedule to"
            color="#2196f3"
            value="2"
          />
          <div :class="[!isDateValid && 'date-picker-error mb-n3']">
            <InputDate
              v-model="formData.enrollmentScheduler.scheduledDate"
              class="date-picker-height-40 ml-2 mx-1 black-placeholder"
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
          <InputTimezone
            v-model="formData.enrollmentScheduler.scheduledTimeZoneId"
            class="black-placeholder ml-1"
            :disabled="isScheduledTimeDisabled"
          />
        </div>
      </v-radio-group>
    </FormGroup>
    <FormGroup v-if="false" class="mt-6" :title="labels.Reminder" style="max-width: 875px;">
      <div class="campaign-manager-advanced-settings__other-settings-last">
        <v-checkbox
          v-model="sendReminderEvery"
          id="input--campaign-manager-advanced-settings-randomly-selected"
          color="#2196f3"
          hide-details
        >
        </v-checkbox>
        <span>Set reminder every</span>
        <v-text-field
          v-model="formData.enrollmentReminder.periodCount"
          v-mask="'#######'"
          id="input--edit-enrollment-reminder-period-count"
          placeholder="Enter number"
          outlined
          class="edit-name-textfield edit-select standard-height ml-2 absolute-text-input-error"
          style="max-width: 64px;"
          :disabled="!sendReminderEvery"
          :rules="rules.number"
        ></v-text-field>
        <KSelect
          v-model.trim="formData.enrollmentReminder.periodType"
          id="input--edit-enrollment-reminder-period-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 120px;"
          :items="getPeriodTypeItems"
          :disabled="!sendReminderEvery"
        />
        <span class="ml-2">ends</span>
        <KSelect
          v-model.trim="formData.enrollmentReminder.endType"
          id="input--edit-enrollment-reminder-end-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 282px; min-width: 282px;"
          :items="endTypeItems"
          :disabled="!sendReminderEvery"
        />
        <v-text-field
          v-if="formData.enrollmentReminder.endType === 'AfterOccurrences'"
          v-model="formData.enrollmentReminder.occurrenceCount"
          v-mask="'#######'"
          id="input--campaign-manager-advanced-settings-other-settings-occurence-count"
          placeholder="Enter number"
          outlined
          class="ml-2 absolute-text-input-error"
          style="max-width: 64px;"
          :disabled="!sendReminderEvery"
          :rules="rules.number"
        ></v-text-field>
        <span v-if="formData.enrollmentReminder.endType === 'AfterOccurrences'" class="ml-2"
          >times</span
        >
        <InputDate
          v-if="formData.enrollmentReminder.endType === 'OnDate'"
          v-model="formData.enrollmentReminder.stopTime"
          class="date-picker-height-40 ml-2"
          type="date"
          ref="refPicker"
          placeholder="Select Date"
          format="dd/MM/yyyy"
          style="width: 100%; max-width: 180px;"
          :picker-options="datePickerOptions"
          :disabled="!sendReminderEvery"
        />
      </div>
      <AlertBox
        v-if="
          sendReminderEvery &&
          ['QuizCompleted', 'QuizSuccessfullyCompleted'].includes(
            formData.enrollmentReminder.endType
          )
        "
        style="max-width: 690px;"
        class="mt-4 align-items-center"
        icon-name="mdi-information"
        text="If this option is selected and there is no exam in the training, the reminder will continue indefinitely."
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
    </FormGroup>
    <FormGroup
      v-if="!formData.isProxy && showCertificate"
      class="mt-6"
      :title="labels.Certificate"
      style="max-width: 875px;"
    >
      <div class="d-flex align-center">
        <v-checkbox
          v-model="formData.awardCertificate"
          id="input--campaign-manager-advanced-settings-randomly-selected"
          hide-details
          color="#2196f3"
          label="Award certificate when a user completes the training"
        >
        </v-checkbox>
        <KSelect
          v-model.trim="formData.certificateConfigSendType"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          position="top"
          style="max-width: 200px;"
          :items="certificateTypeItems"
          :disabled="!formData.awardCertificate"
        />
      </div>
    </FormGroup>
    <FormGroup
      v-if="!formData.isProxy"
      class="mt-6"
      style="max-width: 950px;"
      :title="labels.AutoEnroll"
    >
      <div class="campaign-manager-advanced-settings__other-settings-last">
        <v-checkbox
          v-model="isAutoEnroll"
          id="input--campaign-manager-advanced-settings-randomly-selected"
          color="#2196f3"
          hide-details
        >
        </v-checkbox>
        <span>Automatically enroll new users in target groups</span>
        <KSelect
          v-model.trim="formData.enrollmentAutoEnroll.type"
          id="input--enrollment-auto-enroll-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          position="top"
          style="max-width: 150px;"
          :items="enrollmentAutoEnrollTypeItems"
          :disabled="!isAutoEnroll"
          @change="handleEnrollmentTypeChange"
        />
        <KSelect
          v-if="formData.enrollmentAutoEnroll.type === 'Next'"
          v-model.trim="formData.enrollmentAutoEnroll.dayOfWeek"
          id="input--enrollment-auto-enroll-day-of-week"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 150px;"
          position="top"
          :items="enrollmentAutoEnrollDayOfWeekItems"
          :disabled="!isAutoEnroll"
        />
        <v-text-field
          v-if="formData.enrollmentAutoEnroll.type === 'In'"
          v-model="formData.enrollmentAutoEnroll.periodCount"
          v-mask="'#######'"
          id="input--enrollment-auto-enroll-period-count"
          placeholder="Enter number"
          outlined
          class="ml-2 absolute-text-input-error"
          style="max-width: 64px;"
          :disabled="!isAutoEnroll"
          :rules="rules.number"
        ></v-text-field>
        <KSelect
          v-if="formData.enrollmentAutoEnroll.type === 'In'"
          v-model.trim="formData.enrollmentAutoEnroll.emailPeriodTypeEnum"
          id="input--enrollment-auto-enroll-period-type"
          class="ml-2"
          outlined
          dense
          hide-details
          placeholder="Select a item"
          style="max-width: 118px;"
          position="top"
          :items="periodTypeItems"
          :disabled="!isAutoEnroll"
        />
      </div>
    </FormGroup>
    <FormGroup :class="!formData.isProxy ? 'mt-6' : ''" title="Mark as Test">
      <v-checkbox
        v-model="formData.markedAsTest"
        id="input--campaign-manager-advanced-settings-randomly-selected"
        hide-details
        color="#2196f3"
        label="Exclude this campaign’s statistics from all generic reports"
      >
      </v-checkbox>
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import InputTimezone from '@/components/Common/Inputs/InputTimezone.vue'
import { mapGetters } from 'vuex'
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import SendTrainingSMSSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSMSSettings.vue'
import InputContentLanguage from '@/components/Common/Inputs/InputContentLanguage.vue'
import { getTimeByTimeZone } from '@/api/company'
import AlertBox from '@/components/AlertBox.vue'
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import {
  endTypeItems,
  enrollmentAutoEnrollDayOfWeekItems,
  enrollmentAutoEnrollTypeItems,
  certificateTypeItems,
  periodTypeItems
} from '@/components/AwarenessEducator/SendTraining/utils'
import { posterMergeTags } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'
import { DELIVERY_METHODS } from '@/components/Common/DeliveryMethod/utils'
import DeliveryMethod from '@/components/Common/DeliveryMethod/DeliveryMethod.vue'
export default {
  name: 'TrainingLibrarySendPosterSettings',
  components: {
    InputEntityName,
    AlertBox,
    InputContentLanguage,
    InputTimezone,
    InputDate,
    KSelect,
    FormGroup,
    SendTrainingSMSSettings,
    DeliveryMethod
  },
  props: {
    selectedRow: {
      type: Object
    },
    enumTypes: {
      type: Object
    },
    distributionDelayTimeTypes: {
      type: Array
    },
    totalPhoneNumberUserCount: {
      type: Number
    },
    phoneNumberItems: {
      type: Array,
      default: () => []
    },
    phoneNumbers: {
      type: Array,
      default: () => []
    },
    showProxySection: {
      type: Boolean,
      default: true
    },
    smsNotificationSub: {
      type: String,
      default: labels.SMSNotificationSub
    },
    showCertificate: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      posterMergeTags,
      parsedFormat: getTimeZone(false),
      labels,
      deliveryMethod: 'email',
      Validations,
      isDateValid: true,
      sendReminderEvery: false,
      isAutoEnroll: false,
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      },
      formData: {
        name: '',
        isSendSMSNotification: false,
        senderPhoneNumber: '',
        smsText: '',
        languageIds: [],
        markedAsTest: false,
        awardCertificate: false,
        certificateConfigSendType: 'SendOnFirstAttempt',
        scheduleTypeId: '1',
        isProxy: false,
        enrollmentScheduler: {
          scheduledDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          scheduledTimeZoneId: '',
          useOwnTimeZone: true
        },
        enrollmentAutoEnroll: {
          type: 'SameDay',
          dayOfWeek: 0,
          emailPeriodTypeEnum: 'Day',
          periodCount: 1
        },
        enrollmentReminder: {
          periodCount: 1,
          periodType: 'Day',
          endType: 'TrainingCompleted',
          occurrenceCount: 1,
          stopTime: ''
        }
      },
      radioItems: [{ text: 'Send now', value: '1' }],
      rules: {
        number: [
          (v) => /\d/.test(v) || 'Enter valid number',
          (v) => v > 0 || 'Enter number greater than 0',
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      },
      periodTypeItems,
      endTypeItems,
      certificateTypeItems,
      enrollmentAutoEnrollTypeItems,
      enrollmentAutoEnrollDayOfWeekItems
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone',
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    deliveryMethodText() {
      if (this.formData.deliveryMethod === DELIVERY_METHODS.SMS) {
        return 'Poster is delivered in SMS and also sent by email.'
      } else if (this.formData.deliveryMethod === DELIVERY_METHODS.MICROSOFT_TEAMS) {
        return 'Poster is delivered in Microsoft Teams and also sent by email.'
      }
      return ''
    },
    getPeriodTypeItems() {
      return (
        this?.enumTypes?.EmailPeriodTypeEnum.map((type, index) => ({
          text: this.periodTypeItems[index].text,
          value: type.name
        })) || this.periodTypeItems
      )
    },
    getEndTypeItems() {
      return (
        this?.enumTypes?.ReminderEndTypeEnum.map((type, index) => ({
          text: this.endTypeItems[index].text,
          value: type.name
        })) || this.endTypeItems
      )
    },
    isScheduledTimeDisabled() {
      return this.formData.scheduleTypeId !== '2'
    },
    isDeliveryMethodSMS() {
      return this.formData.deliveryMethod === DELIVERY_METHODS.SMS
    }
  },
  created() {
    this.getSelectedTimeZone()
  },
  watch: {
    timezoneFormat: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.parsedFormat = getTimeZone(false, val)
        }
      }
    },
    'formData.enrollmentScheduler.scheduledTimeZoneId'(val) {
      if (val) {
        getTimeByTimeZone(val).then((res) => {
          if (res?.data?.data) {
            this.formData.enrollmentScheduler.scheduledDate = res.data.data
          }
        })
      }
    },
    selectedTimeZone(val) {
      this.formData.enrollmentScheduler.scheduledTimeZoneId = val
    },
    'formData.enrollmentScheduler.scheduledDate'() {
      this.checkDateIsValid()
    },
    'formData.scheduleTypeId'(val) {
      if (val !== '2') {
        this.isDateValid = true
        if (!this.formData.enrollmentScheduler.scheduledDate) {
          this.formData.enrollmentScheduler.scheduledDate = this.$moment(Date.now()).format(
            getTimeZoneForMoment()
          )
        }
        if (!this.formData.enrollmentScheduler.scheduledTimeZoneId) {
          this.formData.enrollmentScheduler.scheduledTimeZoneId = this.selectedTimeZone
        }
      }
    }
  },
  methods: {
    checkDateIsValid() {
      let isDateValid
      if (this.formData) {
        isDateValid =
          this.formData.scheduleTypeId === '2'
            ? this.formData.enrollmentScheduler.scheduledDate &&
              this.formData.enrollmentScheduler.scheduledDate.length > 0
            : true
      } else isDateValid = false
      this.isDateValid = isDateValid
      return this.isDateValid
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    getSelectedTimeZone() {
      if (this.$store?.getters['common/getSelectedTimeZone']) {
        this.formData.enrollmentScheduler.scheduledTimeZoneId = this.$store?.getters[
          'common/getSelectedTimeZone'
        ]
      } else {
        this.$store.dispatch('common/callForSettings')
      }
    },
    handleEnrollmentTypeChange(val) {
      this.$set(this.enrollmentAutoEnrollTypeItems[2], 'text', 'next')
      this.$set(this.enrollmentAutoEnrollTypeItems[3], 'text', 'in')
    },
    validateForm() {
      return this.$refs.refForm.validate()
    },
    handleDeliveryMethodChange(val) {
      this.formData.deliveryMethod = val
      this.formData.isProxy = val === DELIVERY_METHODS.LMS
      this.formData.isSendSMSNotification = val === DELIVERY_METHODS.SMS
    }
  }
}
</script>
