<template>
  <AppModal
    :status="status"
    icon-name="mdi-send"
    title="Edit Enrollment"
    title-id="text--edit-enrollments-modal-title"
    @closeOverlay="handleClose"
    @submit="handleSubmit"
  >
    <template #overlay-body>
      <AppModalBodyHeader title="Enrollment Settings" />
      <v-form ref="refForm">
        <FormGroup class="mt-6" :title="labels.Reminder" style="max-width: 875px;">
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
            ></v-text-field>
            <KSelect
              v-model.trim="formData.enrollmentReminder.periodType"
              id="input--edit-enrollment-reminder-period-type"
              class="ml-2"
              outlined
              dense
              hide-details
              placeholder="Select a item"
              style="max-width: 100px;"
              :items="periodTypeItems"
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
              v-if="formData.enrollmentReminder.endType === 'AfterOccurences'"
              v-model="formData.enrollmentReminder.occurrenceCount"
              v-mask="'#######'"
              id="input--campaign-manager-advanced-settings-other-settings-occurence-count"
              placeholder="Enter number"
              outlined
              class="ml-2 absolute-text-input-error"
              style="max-width: 64px;"
              :disabled="!sendReminderEvery"
            ></v-text-field>
            <span v-if="formData.endType === 3" class="ml-2">times</span>
            <InputDate
              v-if="formData.enrollmentReminder.endType === 'OnDate'"
              v-model="formData.enrollmentReminder.stopTime"
              class="date-picker-height-40 ml-2"
              type="date"
              ref="refPicker"
              placeholder="Select Date"
              format="dd/MM/yyyy"
              style="width: 100%; max-width: 180px;"
              :disabled="!sendReminderEvery"
            />
          </div>
        </FormGroup>
        <FormGroup class="mt-6" style="max-width: 950px;" :title="labels.AutoEnroll">
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
            ></v-text-field>
            <KSelect
              v-model.trim="formData.enrollmentAutoEnroll.emailPeriodTypeEnum"
              id="input--enrollment-auto-enroll-period-type"
              class="ml-2"
              outlined
              dense
              hide-details
              placeholder="Select a item"
              style="max-width: 118px;"
              :items="periodTypeItems"
              :disabled="!isAutoEnroll"
            />
          </div>
        </FormGroup>
        <FormGroup class="mt-6" title="Mark as Test">
          <v-checkbox
            v-model="formData.markedAsTest"
            id="input--campaign-manager-advanced-settings-randomly-selected"
            hide-details
            color="#2196f3"
            label="Exclude this enrollment's statistics from all generic reports"
          >
          </v-checkbox>
        </FormGroup>
      </v-form>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputDate from '@/components/Common/Inputs/InputDate'
import labels from '@/model/constants/labels'
import KSelect from '@/components/Common/Inputs/KSelect'
import { EMITS } from '@/components/AwarenessEducator/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'EditEnrollmentsModal',
  components: {
    KSelect,
    InputDate,
    FormGroup,
    AppModalBodyHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      labels,
      radioItems: [{ text: 'Send now', value: '1' }],
      isDateValid: true,
      sendReminderEvery: false,
      isAutoEnroll: false,
      formData: {
        markedAsTest: false,
        enrollmentAutoEnroll: {
          type: 'SameDay',
          dayOfWeek: 0,
          emailPeriodTypeEnum: 1,
          periodCount: 0
        },
        enrollmentReminder: {
          periodCount: 0,
          periodType: 1,
          endType: 1,
          occurrenceCount: 0,
          stopTime: ''
        }
      },
      periodTypeItems: [
        { text: 'days', value: 'Day' },
        { text: 'weeks', value: 'Week' },
        { text: 'months', value: 'Month' }
      ],
      endTypeItems: [
        {
          text: 'when user completes the training',
          value: 'TrainingCompleted'
        },
        {
          text: 'when user completes the quiz',
          value: 'QuizCompleted'
        },
        {
          text: 'after occurences',
          value: 'AfterOccurences'
        },
        {
          text: 'on date',
          value: 'OnDate'
        }
      ],
      enrollmentAutoEnrollTypeItems: [
        { text: 'the same day', value: 'SameDay' },
        { text: 'the next day', value: 'NextDay' },
        { text: 'next...', value: 'Next' },
        { text: 'in...', value: 'In' }
      ],
      enrollmentAutoEnrollDayOfWeekItems: [
        { text: 'Monday', value: 0 },
        { text: 'Tuesday', value: 1 },
        { text: 'Wednesday', value: 2 },
        { text: 'Thursday', value: 3 },
        { text: 'Friday', value: 4 }
      ]
    }
  },
  computed: {
    distributionSmtpDelayTimeTypes() {
      return this.getDistributionSmtpDelayTimeTypes()
    },
    trainingTimeItems() {
      return this.getDistributionEmailOverTimeTypes()
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (this?.selectedRow?.enrollmentId) {
        AwarenessEducatorService.getEnrollment(this.selectedRow.enrollmentId).then((response) => {
          const { enrollmentReminder, enrollmentAutoEnroll } = response?.data?.data
          if (enrollmentReminder) this.sendReminderEvery = true
          if (enrollmentAutoEnroll) this.isAutoEnroll = true
          this.formData.enrollmentReminder = enrollmentReminder
            ? enrollmentReminder
            : this.formData.enrollmentReminder
          delete response?.data?.data?.enrollmentReminder
          this.formData.enrollmentAutoEnroll = enrollmentAutoEnroll
            ? enrollmentAutoEnroll
            : this.formData.enrollmentAutoEnroll
          delete response?.data?.data?.enrollmentAutoEnroll
          this.formData = { ...this.formData, ...response?.data?.data }
        })
      }
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE)
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
    handleSubmit() {
      const payload = JSON.parse(JSON.stringify(this.formData))
      if (!this.sendReminderEvery) payload.enrollmentReminder = null
      if (!this.isAutoEnroll) payload.enrollmentAutoEnroll = null
      AwarenessEducatorService.updateEnrollment(payload, this.selectedRow.enrollmentId).then(() => {
        this.$emit(EMITS.ON_CLOSE, true)
      })
    }
  }
}
</script>
