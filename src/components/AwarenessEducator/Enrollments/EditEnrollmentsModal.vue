<template>
  <div>
    <StopReminderDialog
      :status="isStopReminderDialogVisible"
      :isActionButtonDisabled="loading"
      @confirm="handleConfirmStopReminder"
      @close="handleCloseStopReminderDialog"
    />
    <StopAutoEnrollDialog
      :status="isStopAutoEnrollDialogVisible"
      :isActionButtonDisabled="loading"
      @confirm="handleConfirmStopAutoEnroll"
      @close="handleCloseStopAutoEnrollDialog"
    />
    <AppModal
      :status="status"
      icon-name="mdi-pencil"
      title="Edit Enrollment"
      title-id="text--edit-enrollments-modal-title"
      @closeOverlay="handleClose"
      @submit="handleSubmit"
    >
      <template #overlay-body>
        <AppModalBodyHeader title="Enrollment Settings" />
        <v-form ref="refForm">
          <FormGroup has-hint :title="labels.EnrollmentName">
            <InputEntityName
              v-model.trim="formData.name"
              id="input--enrollment-name"
              entity-name="enrollment"
            />
          </FormGroup>
          <FormGroup
            v-if="sendReminderEvery"
            :title="labels.Reminder"
            style="max-width: 875px;"
            class="mb-2"
          >
            <div
              v-if="!isReminderStopped"
              class="campaign-manager-advanced-settings__other-settings-last campaign-manager-advanced-settings__other-settings-last--disabled"
            >
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
                disabled
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
                style="max-width: 100px;"
                :items="periodTypeItems"
                disabled
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
                disabled
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
                disabled
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
                disabled
                :picker-options="datePickerOptions"
              />
            </div>
          </FormGroup>
          <v-btn
            v-if="sendReminderEvery && !isReminderStopped"
            style="font-weight: 600; text-transform: none;"
            rounded
            outlined
            color="#2196F3"
            @click="handleStopReminder"
          >
            <v-icon class="mr-2" style="font-size: 22px;">mdi-stop</v-icon>
            Stop Reminder
          </v-btn>
          <FormGroup>
            <AlertBox
              v-if="isReminderStopped"
              class="bg-aqua-light"
              icon-color="#2196F3"
              icon-name="mdi-information"
              text="Reminder is already stopped and can not run again for this enrollment."
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
          </FormGroup>
          <FormGroup
            v-if="isAutoEnroll"
            class="mt-4 mb-2"
            style="max-width: 950px;"
            :title="labels.AutoEnroll"
          >
            <div
              v-if="!isAutoEnrollStopped"
              class="campaign-manager-advanced-settings__other-settings-last campaign-manager-advanced-settings__other-settings-last--disabled"
            >
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
                disabled
                :items="enrollmentAutoEnrollTypeItems"
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
                disabled
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
                disabled
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
                :items="periodTypeItems"
                disabled
              />
            </div>
          </FormGroup>
          <v-btn
            v-if="isAutoEnroll && !isAutoEnrollStopped"
            style="font-weight: 600; text-transform: none;"
            rounded
            outlined
            color="#2196F3"
            @click="handleStopAutoEnroll"
          >
            <v-icon class="mr-2" style="font-size: 22px;">mdi-stop</v-icon>
            Stop Auto-enroll
          </v-btn>
          <FormGroup>
            <AlertBox
              v-if="isAutoEnrollStopped"
              class="bg-aqua-light"
              icon-color="#2196F3"
              icon-name="mdi-information"
              text="Auto-enroll is already stopped and can not run again for this enrollment."
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
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
  </div>
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
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import StopReminderDialog from '@/components/AwarenessEducator/Enrollments/StopReminderDialog'
import StopAutoEnrollDialog from '@/components/AwarenessEducator/Enrollments/StopAutoEnrollDialog'
import AlertBox from '@/components/AlertBox'
export default {
  name: 'EditEnrollmentsModal',
  components: {
    KSelect,
    InputDate,
    FormGroup,
    AppModalBodyHeader,
    AppModal,
    InputEntityName,
    StopReminderDialog,
    StopAutoEnrollDialog,
    AlertBox
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
      isAutoEnrollStopped: false,
      isReminderStopped: false,
      loading: false,
      isStopReminderDialogVisible: false,
      isStopAutoEnrollDialogVisible: false,
      labels,
      radioItems: [{ text: 'Send now', value: '1' }],
      isDateValid: true,
      sendReminderEvery: false,
      isAutoEnroll: false,
      rules: {
        number: [
          (v) => /\d/.test(v) || 'Enter valid number',
          (v) => v > 0 || 'Enter number greater than 0',
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      },
      formData: {
        markedAsTest: false,
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
          text: 'after occurrences',
          value: 'AfterOccurrences'
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
        { text: 'Sunday', value: 0 },
        { text: 'Monday', value: 1 },
        { text: 'Tuesday', value: 2 },
        { text: 'Wednesday', value: 3 },
        { text: 'Thursday', value: 4 },
        { text: 'Friday', value: 5 },
        { text: 'Saturday', value: 6 }
      ],
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      }
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
          const { enrollmentReminder, enrollmentAutoEnroll } = response?.data?.data || {}
          if (enrollmentReminder) this.sendReminderEvery = true
          if (this.selectedRow?.status === 'Auto-Enroll') this.isAutoEnroll = true
          this.formData.enrollmentReminder = enrollmentReminder
            ? enrollmentReminder
            : this.formData.enrollmentReminder
          delete response?.data?.data?.enrollmentReminder
          this.formData.enrollmentAutoEnroll = enrollmentAutoEnroll
            ? enrollmentAutoEnroll
            : this.formData.enrollmentAutoEnroll
          delete response?.data?.data?.enrollmentAutoEnroll
          this.formData = { ...this.formData, ...response?.data?.data }
          this.isReminderStopped = !!enrollmentReminder?.stopTime
          this.isAutoEnrollStopped = !!enrollmentAutoEnroll?.stopTime
        })
      }
    },
    handleStopReminder() {
      this.isStopReminderDialogVisible = true
    },
    handleConfirmStopReminder() {
      this.loading = true
      AwarenessEducatorService.stopReminder(this.selectedRow.enrollmentId)
        .then((res) => {
          this.isReminderStopped = true
          this.isStopReminderDialogVisible = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCloseStopReminderDialog() {
      this.isStopReminderDialogVisible = false
    },
    handleStopAutoEnroll() {
      this.isStopAutoEnrollDialogVisible = true
    },
    handleConfirmStopAutoEnroll() {
      this.loading = true
      AwarenessEducatorService.stopAutoEnroll(this.selectedRow.enrollmentId)
        .then((res) => {
          this.isAutoEnrollStopped = true
          this.isStopAutoEnrollDialogVisible = false
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleCloseStopAutoEnrollDialog() {
      this.isStopAutoEnrollDialogVisible = false
    },
    disabledEndDates(val) {
      return new Date().setHours(0, 0, 0, 0) > val.getTime()
    },
    handleClose() {
      this.$emit(EMITS.ON_CLOSE, this.isAutoEnrollStopped || this.isReminderStopped)
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
      if (this.$refs.refForm.validate()) {
        const payload = JSON.parse(JSON.stringify(this.formData))
        if (!this.sendReminderEvery) payload.enrollmentReminder = null
        if (!this.isAutoEnroll) payload.enrollmentAutoEnroll = null
        AwarenessEducatorService.updateEnrollment(payload, this.selectedRow.enrollmentId).then(
          () => {
            this.$emit(EMITS.ON_CLOSE, true)
          }
        )
      }
    }
  }
}
</script>
