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
    <FormGroup
      v-if="showProxySection"
      class="send-training-settings__lms"
      title="Training Delivery for Your LMS"
      sub-title="Easily use the training in your own LMS by downloading the training proxy package"
    >
      <div class="send-training-settings__lms-switch">
        <VSwitch
          v-model="formData.isProxy"
          id="input--send-training-settings-lms"
          hide-details
          label="Training Delivery for Your LMS"
          color="#2196f3"
        />
      </div>
      <div class="send-training-settings__lms-helper">
        <VIcon size="default">mdi-information</VIcon>
        <span class="text-primary-color fs-3 ml-2"
          >When the Training Delivery for Your LMS is activated, only the Content Language and Mark
          as Test options are used</span
        >
      </div>
    </FormGroup>
    <div v-if="!formData.isProxy" class="mb-6">
      <FormGroup
        class="send-training-settings__lms"
        title="SMS Notification"
        :sub-title="smsNotificationSub"
      >
        <AlertBox
          class="bg-aqua-light mb-4"
          icon-color="#2196F3"
          icon-name="mdi-information"
          text="Once the SMS notification is enabled, target audience will receive SMS in addition to email, only if their phone number exists in the system. "
          :slots="{ primaryAction: false, secondaryAction: false }"
        />
        <div class="send-training-settings__lms-switch">
          <VSwitch
            v-model="formData.isSendSMSNotification"
            id="input--send-training-settings-lms"
            hide-details
            label="SMS notification for your learning path"
            color="#2196f3"
          />
        </div>
      </FormGroup>
      <SendTrainingSMSSettings
        v-if="formData.isSendSMSNotification"
        ref="refSendTrainingSMSSettings"
        merge-tag-subtitle="SMS text to be sent to target users. Use the mandatory merge tag {LEARNINGPATHNAME} for the link to be added to the SMS"
        default-sms-text-template="Dear {FULLNAME}
{LEARNINGPATHNAME} assigned to you. Please enroll it on {LEARNINGPATHURL}"
        :distributionDelayTimeTypes="distributionDelayTimeTypes"
        :default-merge-tags="learningPathMergeTags"
        :totalPhoneNumberUserCount="totalPhoneNumberUserCount"
        :phoneNumberItems="phoneNumberItems"
        :phoneNumbers="phoneNumbers"
      />
    </div>
    <InputSchedule v-model="formData.enrollmentScheduler" ref="inputSchedule" class="mb-6" />
    <FormGroup
      v-if="!formData.isProxy"
      class="mt-2"
      :title="labels.Reminder"
      style="max-width: 875px;"
    >
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
          :items="getEndTypeItems"
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
    </FormGroup>
    <FormGroup v-if="!formData.isProxy && showCertificate" class="mt-6" :title="labels.Certificate">
      <v-checkbox
        v-model="formData.awardCertificate"
        id="input--campaign-manager-advanced-settings-randomly-selected"
        hide-details
        color="#2196f3"
        label="Award certificate when a user completes the learning path"
      >
      </v-checkbox>
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
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import SendTrainingSMSSettings from '@/components/AwarenessEducator/SendTraining/SendTrainingSMSSettings.vue'
import AlertBox from '@/components/AlertBox.vue'
import InputEntityName from '@/components/Common/Inputs/InputEntityName.vue'
import {
  endTypeItems,
  enrollmentAutoEnrollDayOfWeekItems,
  enrollmentAutoEnrollTypeItems,
  periodTypeItems
} from '@/components/AwarenessEducator/SendTraining/utils'
import { learningPathMergeTags } from '@/components/TrainingLibrary/TrainingLibraryFilters/utils'
import InputSchedule from '@/components/Common/Inputs/InputSchedule.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
export default {
  name: 'TrainingLibrarySendLearningPathSettings',
  components: {
    InputSchedule,
    InputEntityName,
    AlertBox,
    InputDate,
    KSelect,
    FormGroup,
    SendTrainingSMSSettings
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
      learningPathMergeTags,
      parsedFormat: getTimeZone(false),
      labels,
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
        isProxy: false,
        enrollmentScheduler: {
          scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
          scheduledDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          scheduledDateTimeZoneId: ''
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
      enrollmentAutoEnrollTypeItems,
      enrollmentAutoEnrollDayOfWeekItems
    }
  },
  computed: {
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
    }
  },
  methods: {
    checkDateIsValid() {
      let isDateValid
      if (this.formData) {
        isDateValid =
          this.formData.enrollmentScheduler.dueDate &&
          this.formData.enrollmentScheduler.dueDate.length > 0
      } else isDateValid = false
      this.isDateValid = isDateValid
      return this.isDateValid
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    handleEnrollmentTypeChange(val) {
      if (val === 3) {
        this.enrollmentAutoEnrollTypeItems[2].text = 'next'
        this.enrollmentAutoEnrollTypeItems[3].text = 'in...'
      } else if (val === 4) {
        this.enrollmentAutoEnrollTypeItems[2].text = 'next...'
        this.enrollmentAutoEnrollTypeItems[3].text = 'in'
      } else {
        this.enrollmentAutoEnrollTypeItems[2].text = 'next...'
        this.enrollmentAutoEnrollTypeItems[3].text = 'in...'
      }
    },
    validateForm() {
      return this.$refs.refForm.validate()
    }
  }
}
</script>
