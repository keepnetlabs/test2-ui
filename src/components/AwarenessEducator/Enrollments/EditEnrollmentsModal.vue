<template>
  <AppModal
    :status="status"
    icon-name="mdi-send"
    title="Edit Enrollment"
    title-id="text--edit-enrollments-modal-title"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        title="Enrollment Settings"
        sub-title="Select target groups and schedule options for this phishing campaign instance"
      />
      <v-form ref="refForm">
        <FormGroup style="max-width: 600px;" :title="labels.Schedule">
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
                value="3"
              />
              <div :class="[!isDateValid && 'date-picker-error mb-n3']">
                <InputDate
                  v-model="formData.enrollmentScheduler.scheduledDate"
                  class="date-picker-height-40 ml-2"
                  type="datetime"
                  ref="refPicker"
                  placeholder="Select Date Select Time"
                  style="width: 100%; max-width: 222px;"
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
              <InputTimezone
                v-model="formData.enrollmentScheduler.scheduledTimeZoneId"
                :disabled="isScheduledTimeDisabled"
              />
            </div>
          </v-radio-group>
        </FormGroup>
        <FormGroup class="mt-6" :title="labels.Reminder" style="max-width: 875px;">
          <div class="campaign-manager-advanced-settings__other-settings-last">
            <v-checkbox
              v-model="formData.sendReminderEvery"
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
              :disabled="!formData.sendReminderEvery"
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
              :disabled="!formData.sendReminderEvery"
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
              :disabled="!formData.sendReminderEvery"
            />
            <v-text-field
              v-if="formData.enrollmentReminder.endType === 3"
              v-model="formData.enrollmentReminder.occurrenceCount"
              v-mask="'#######'"
              id="input--campaign-manager-advanced-settings-other-settings-occurence-count"
              placeholder="Enter number"
              outlined
              class="ml-2 absolute-text-input-error"
              style="max-width: 64px;"
              :disabled="!formData.sendReminderEvery"
            ></v-text-field>
            <span v-if="formData.endType === 3" class="ml-2">times</span>
            <InputDate
              v-if="formData.enrollmentReminder.endType === 4"
              v-model="formData.enrollmentReminder.stopTime"
              class="date-picker-height-40 ml-2"
              type="date"
              ref="refPicker"
              placeholder="Select Date"
              format="dd/MM/yyyy"
              style="width: 100%; max-width: 180px;"
              :disabled="!formData.sendReminderEvery"
            />
          </div>
        </FormGroup>
        <FormGroup class="mt-6" style="max-width: 950px;" :title="labels.AutoEnroll">
          <div class="campaign-manager-advanced-settings__other-settings-last">
            <v-checkbox
              v-model="formData.isAutoEnroll"
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
              :disabled="!formData.isAutoEnroll"
              @change="handleEnrollmentTypeChange"
            />
            <KSelect
              v-if="formData.enrollmentAutoEnroll.type === 3"
              v-model.trim="formData.enrollmentAutoEnroll.dayOfWeek"
              id="input--enrollment-auto-enroll-day-of-week"
              class="ml-2"
              outlined
              dense
              hide-details
              placeholder="Select a item"
              style="max-width: 150px;"
              :items="enrollmentAutoEnrollDayOfWeekItems"
              :disabled="!formData.isAutoEnroll"
            />
            <v-text-field
              v-if="formData.enrollmentAutoEnroll.type === 4"
              v-model="formData.enrollmentAutoEnroll.periodCount"
              v-mask="'#######'"
              id="input--enrollment-auto-enroll-period-count"
              placeholder="Enter number"
              outlined
              class="ml-2 absolute-text-input-error"
              style="max-width: 64px;"
              :disabled="!formData.isAutoEnroll"
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
              :disabled="!formData.isAutoEnroll"
            />
          </div>
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
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import KSelect from '@/components/Common/Inputs/KSelect'
import { EMITS } from '@/components/AwarenessEducator/utils'
import AwarenessEducatorService from '@/api/awarenessEducator'
export default {
  name: 'EditEnrollmentsModal',
  components: { KSelect, InputTimezone, InputDate, FormGroup, AppModalBodyHeader, AppModal },
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
      formData: {
        sendReminderEvery: false,
        scheduleTypeId: '1',
        enrollmentScheduler: {
          scheduledDate: '',
          scheduledTimeZoneId: '',
          useOwnTimeZone: true
        },
        enrollmentAutoEnroll: {
          type: 1,
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
        { text: 'days', value: 1 },
        { text: 'weeks', value: 2 },
        { text: 'months', value: 3 }
      ],
      endTypeItems: [
        {
          text: 'when user completes the training',
          value: 1
        },
        {
          text: 'when user completes the quiz',
          value: 2
        },
        {
          text: 'after occurences',
          value: 3
        },
        {
          text: 'on date',
          value: 4
        }
      ],
      enrollmentAutoEnrollTypeItems: [
        { text: 'the same day', value: 1 },
        { text: 'the next day', value: 2 },
        { text: 'next...', value: 3 },
        { text: 'in...', value: 4 }
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
    isScheduledTimeDisabled() {
      return this.formData.scheduleTypeId !== '3'
    },
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
          const {
            enrollmentReminder,
            enrollmentAutoEnroll,
            enrollmentScheduler
          } = response?.data?.data
          this.formData.enrollmentReminder = enrollmentReminder
          this.formData.enrollmentAutoEnroll = enrollmentAutoEnroll
          this.formData.enrollmentScheduler = enrollmentScheduler
          console.log('response.data.data', response.data.data)
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
    }
  }
}
</script>
