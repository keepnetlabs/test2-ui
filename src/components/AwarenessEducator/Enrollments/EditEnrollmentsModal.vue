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
      title-id="text--edit-enrollments-modal-title"
      :title="title"
      :saveDisable="loading"
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
            v-if="selectedRow.status === 'Scheduled'"
            style="max-width: 600px;"
            title="Schedule"
          >
            <div class="campaign-manager-advanced-settings__distribution-item mt-n2">
              <span>Schedule to:</span>
              <div :class="['ml-3', !isDateValid && 'date-picker-error mb-n3']">
                <InputDate
                  v-model="formData.enrollmentScheduler.scheduledDate"
                  class="date-picker-height-40 black-placeholder"
                  type="datetime"
                  ref="refPicker"
                  placeholder="Select Date and Time"
                  style="width: 100%; max-width: 220px;"
                  :format="parsedFormat"
                  :valueFormat="parsedFormat"
                  :picker-options="datePickerOptions"
                  :rules="[(v) => Validations.required(v)]"
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
                  v-model="formData.enrollmentScheduler.scheduledTimeZoneId"
                  class="black-placeholder"
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
          </FormGroup>
          <FormGroup
            v-if="selectedRow.status === 'Scheduled' && isLearningPath"
            class="mt-2"
            title="Distribution"
            sub-title="Distribute learning path materials with the specified interval days."
          >
            <div class="campaign-manager-advanced-settings__other-settings-last">
              <v-checkbox
                v-model="isDistributionEnabled"
                id="input--campaign-manager-advanced-settings-randomly-selected"
                color="#2196f3"
                hide-details
              >
              </v-checkbox>
              <span>Send training meterials every</span>
              <v-text-field
                v-model="formData.distributionDays"
                v-mask="'#######'"
                id="input--edit-enrollment-reminder-period-count"
                placeholder="Enter number"
                outlined
                class="edit-name-textfield edit-select standard-height mx-2 absolute-text-input-error"
                style="max-width: 64px;"
                :disabled="!isDistributionEnabled"
                :rules="rules.number"
              ></v-text-field>
              <span>days</span>
            </div>
            <AlertBox
              v-if="isDistributionEnabled"
              class="bg-aqua-light mt-2"
              icon-color="#2196F3"
              icon-name="mdi-information"
              text="If the delivery time falls on a weekend, it will be sent on the following Monday."
              :slots="{ primaryAction: false, secondaryAction: false }"
            />
          </FormGroup>
          <FormGroup
            v-if="sendReminderEvery && !isReminderStopped"
            :title="labels.Reminder"
            style="max-width: 875px;"
            class="mb-2 mt-6"
          >
            <div
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
          <FormGroup
            v-if="isAutoEnroll && !isAutoEnrollStopped"
            class="mt-4 mb-2"
            style="max-width: 950px;"
            :title="labels.AutoEnroll"
          >
            <div
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
import { getTimeZone, getTimeZoneForMoment } from '@/utils/functions'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import * as Validations from '@/utils/validations'
import { mapGetters } from 'vuex'
import { getTimeByTimeZone } from '@/api/company'
import AlertBox from '@/components/AlertBox'
import {
  periodTypeItems,
  endTypeItems,
  enrollmentAutoEnrollTypeItems,
  enrollmentAutoEnrollDayOfWeekItems
} from '@/components/AwarenessEducator/SendTraining/utils'

export default {
  name: 'EditEnrollmentsModal',
  components: {
    KSelect,
    InputDate,
    FormGroup,
    AppModalBodyHeader,
    AppModal,
    InputEntityName,
    InputTimezone,
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
    },
    title: {
      type: String,
      default: 'Edit Enrollment'
    }
  },
  data() {
    return {
      Validations,
      isAutoEnrollStopped: false,
      isReminderStopped: false,
      loading: false,
      isStopReminderDialogVisible: false,
      isStopAutoEnrollDialogVisible: false,
      labels,
      radioItems: [{ text: 'Send now', value: '1' }],
      isTimezoneValid: true,
      sendReminderEvery: false,
      isAutoEnroll: false,
      isDistributionEnabled: false,
      parsedFormat: getTimeZone(false),
      rules: {
        number: [
          (v) => /\d/.test(v) || 'Enter valid number',
          (v) => v > 0 || 'Enter number greater than 0',
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      },
      formData: {
        markedAsTest: false,
        distributionDays: 2,
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
        },
        enrollmentScheduler: {
          scheduledDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
          scheduledTimeZoneId: '',
          useOwnTimeZone: false
        }
      },
      periodTypeItems,
      endTypeItems,
      enrollmentAutoEnrollTypeItems,
      enrollmentAutoEnrollDayOfWeekItems,
      datePickerOptions: {
        disabledDate: this.disabledEndDates
      }
    }
  },
  computed: {
    ...mapGetters({
      selectedTimeZone: 'common/getSelectedTimeZone'
    }),
    isLearningPath() {
      return this.selectedRow?.type === 'Learning Path'
    },
    distributionSmtpDelayTimeTypes() {
      return this.getDistributionSmtpDelayTimeTypes()
    },
    trainingTimeItems() {
      return this.getDistributionEmailOverTimeTypes()
    },
    isDateValid() {
      return (
        !(this.selectedRow?.status === 'Scheduled') ||
        (this.selectedRow?.status === 'Scheduled' &&
          !!this.formData?.enrollmentScheduler?.scheduledDate)
      )
    }
  },
  watch: {
    selectedTimeZone: {
      handler(val) {
        if (val && !this.formData.enrollmentScheduler.scheduledTimeZoneId)
          this.formData.enrollmentScheduler.scheduledTimeZoneId = val
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
    'formData.enrollmentScheduler.scheduledTimeZoneId': {
      handler(newVal, oldVal) {
        if (!!oldVal && !!newVal) {
          this.formData.enrollmentScheduler.useOwnTimeZone = false
          getTimeByTimeZone(newVal).then((res) => {
            if (res?.data?.data) {
              this.formData.enrollmentScheduler.scheduledDate = res.data.data
            }
          })
        }
      }
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    callForData() {
      if (this?.selectedRow?.enrollmentId) {
        AwarenessEducatorService.getEnrollment(this.selectedRow.enrollmentId).then((response) => {
          const { enrollmentReminder, enrollmentAutoEnroll, enrollmentScheduler } =
            response?.data?.data || {}
          if (enrollmentReminder) this.sendReminderEvery = true
          if (this.selectedRow?.status === 'Scheduled') {
            this.formData.enrollmentScheduler = { ...enrollmentScheduler } || {
              scheduledDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
              scheduledTimeZoneId: '',
              useOwnTimeZone: false
            }
          }
          if (this.isLearningPath && !!response.data.data.distributionDays) {
            this.isDistributionEnabled = true
            this.formData.distributionDays = response?.data?.data?.distributionDays || 2
          }
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
      if (!this.isDateValid) return
      if (this.$refs.refForm.validate()) {
        this.loading = true
        const payload = JSON.parse(JSON.stringify(this.formData))
        if (this.selectedRow.status !== 'Scheduled') {
          delete payload['scheduleDate']
          delete payload['scheduledTimeZoneId']
          if (!!payload?.enrollmentScheduler) {
            payload.enrollmentScheduler = null
          }
        }
        if (!this.sendReminderEvery) payload.enrollmentReminder = null
        if (!this.isAutoEnroll) payload.enrollmentAutoEnroll = null
        if (!this.isLearningPath) delete payload.distributionDays
        if (this.isDistributionEnabled && !!payload?.distributionDays) {
          payload.distributionDays = parseInt(payload.distributionDays)
        } else {
          payload.distributionDays = null
        }
        AwarenessEducatorService.updateEnrollment(payload, this.selectedRow.enrollmentId)
          .then(() => {
            this.$emit(EMITS.ON_CLOSE, true)
          })
          .finally(() => {
            this.loading = false
          })
      }
    }
  }
}
</script>
