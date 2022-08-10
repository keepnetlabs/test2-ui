<template>
  <v-form ref="refForm" class="send-training-settings">
    <FormGroup has-hint :title="labels.ContentLanguage">
      <KSelect
        v-model.trim="formData.languageIds"
        persistent-hint
        dense
        outlined
        chips
        deletable-chips
        multiple
        small-chips
        autocomplete="off"
        hint="*Required"
        placeholder="Select content language"
        :slots="{ item: true, selection: true }"
        :rules="[(v) => v.length > 0 || 'Required']"
        :items="contentLanguageItems"
        :item-disabled="checkIsItemDisabled"
      >
        <template #item="{ item, index }">
          <ContentLanguageSelecItem
            :item="item"
            :index="index"
            :isDisabled="checkIsItemDisabled(item)"
            :isFirst="item.value === 'All'"
            :isSelected="getCheckboxCheckedValue(item)"
          />
        </template>
        <template #selection="data">
          <v-chip
            v-if="data.item.value !== 'All'"
            v-show="!isAllSelected"
            v-bind="data.attrs"
            close
            small
            :key="JSON.stringify(data.item)"
            :input-value="data.selected"
            :disabled="data.disabled"
            @click:close="data.parent.selectItem(data.item)"
          >
            {{ data.item.text }}
          </v-chip>
          <div v-else>
            {{ data.item.text }}
          </div>
        </template>
      </KSelect>
    </FormGroup>
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
            value="2"
          />
          <div :class="[!isDateValid && 'date-picker-error mb-n3']">
            <InputDate
              v-model="formData.enrollmentScheduler.scheduledDate"
              class="date-picker-height-40 ml-2 black-placeholder"
              type="datetime"
              ref="refPicker"
              placeholder="Select Date and Time"
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
          <span class="v-label theme--light ml-2" style="font-size: 14px;">in</span>
          <InputTimezone
            v-model="formData.enrollmentScheduler.scheduledTimeZoneId"
            class="black-placeholder"
            :disabled="isScheduledTimeDisabled"
          />
        </div>
      </v-radio-group>
    </FormGroup>
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
          v-if="formData.enrollmentReminder.endType === 'AfterOccurences'"
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
    <FormGroup class="mt-6" :title="labels.Certificate">
      <v-checkbox
        v-model="formData.awardCertificate"
        id="input--campaign-manager-advanced-settings-randomly-selected"
        hide-details
        color="#2196f3"
        label="Award certificate when a user completes the training"
      >
      </v-checkbox>
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
          :disabled="!isAutoEnroll"
        />
      </div>
    </FormGroup>
  </v-form>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import labels from '@/model/constants/labels'
import * as Validations from '@/utils/validations'
import InputDate from '@/components/Common/Inputs/InputDate'
import InputTimezone from '@/components/Common/Inputs/InputTimezone'
import AwarenessEducatorService from '@/api/awarenessEducator'
import ContentLanguageSelecItem from '@/components/AwarenessEducator/SendTraining/ContentLanguageSelecItem'

export default {
  name: 'SendTrainingSettings',
  components: { ContentLanguageSelecItem, InputTimezone, InputDate, KSelect, FormGroup },
  props: {
    selectedRow: {
      type: Object
    },
    enumTypes: {
      type: Object
    }
  },
  inject: {
    getDistributionEmailOverTimeTypes: {
      type: Array,
      default: () => []
    },
    getDistributionSmtpDelayTimeTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      labels,
      Validations,
      contentLanguageItems: [],
      isDateValid: true,
      sendReminderEvery: false,
      isAutoEnroll: false,
      formData: {
        languageIds: [],
        markedAsTest: false,
        awardCertificate: false,
        scheduleTypeId: '1',
        enrollmentScheduler: {
          scheduledDate: '',
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
        { text: 'Sunday', value: 0 },
        { text: 'Monday', value: 1 },
        { text: 'Tuesday', value: 2 },
        { text: 'Wednesday', value: 3 },
        { text: 'Thursday', value: 4 },
        { text: 'Friday', value: 5 },
        { text: 'Saturday', value: 6 }
      ]
    }
  },
  computed: {
    isAllSelected() {
      return this.formData.languageIds.some((item) => item === 'All')
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
    distributionSmtpDelayTimeTypes() {
      return this.getDistributionSmtpDelayTimeTypes()
    },
    trainingTimeItems() {
      return this.getDistributionEmailOverTimeTypes()
    },
    isDistributionSmtpDelayDisabled() {
      return this.formData.distributionTypeId !== '1'
    }
  },
  created() {
    this.callForContentLanguageItems()
  },
  watch: {
    isAllSelected(newVal) {
      if (newVal === true) {
        const validOptionValues = this.contentLanguageItems.map((item) => item.value)
        this.formData.languageIds = [...validOptionValues]
      } else {
        this.formData.languageIds = []
      }
    }
  },
  methods: {
    checkIsItemDisabled(item) {
      if (item.value === 'All') return false
      if (this.isAllSelected) return true
      return false
    },
    getCheckboxCheckedValue(item) {
      if (
        this.formData.languageIds.some((languageId) => languageId === item.value) ||
        this.isAllSelected
      )
        return true
      return false
    },
    callForContentLanguageItems() {
      AwarenessEducatorService.getContentLanguageItems(this?.selectedRow?.trainingId).then(
        (response) => {
          this.contentLanguageItems = response?.data?.data?.map((lang) => ({
            text: lang.name,
            value: lang.id
          }))
          this.contentLanguageItems.unshift({
            text: 'All Languages',
            value: 'All'
          })
        }
      )
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
