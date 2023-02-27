<template>
  <VForm ref="refForm" class="new-investigation-settings">
    <FormGroup id="label--investigation-name" :title="labels.InvestigationName" has-hint>
      <InputEntityName
        v-model.trim="formData.investigationName"
        id="input--investigation-name"
        initial-placeholder="Enter an investigation name"
      />
    </FormGroup>
    <FormGroup
      id="label--investigation-target-users"
      :title="labels.TargetUsers"
      :sub-title="labels.InvestigateSubLabel"
    >
      <div class="target-users-select__radio-group">
        <VRadioGroup
          v-model="formData.targetUserType"
          id="input--investigation-target-user-type"
          class="mt-0"
          row
          @change="handleTargetUserTypeChange"
        >
          <VRadio
            id="input--investigation-target-user-type-all-users"
            value="AllUsers"
            label="All Users"
            color="#2196f3"
          />
          <VRadio
            id="input--investigation-target-user-type-user-groups"
            value="Groups"
            label="User Groups"
            color="#2196f3"
          />
          <VRadio
            id="input--investigation-target-user-type-specific-users"
            value="SpecificUsers"
            label="Specific Users"
            color="#2196f3"
          />
        </VRadioGroup>
      </div>
      <div class="target-users-select__input-area">
        <VTextField
          v-if="isTargetUserTypeAllUsers"
          id="input--investigation-target-user-all-users"
          placeholder="All Users"
          outlined
          dense
          disabled
        />
        <InputTargetGroup
          v-if="isTargetUserTypeGroups"
          v-model.trim="formData.targetUsersValue"
          ref="refInputTargetGroups"
          multiple
          dense
          persistent-hint
          auto-select-first
          small-chips
          deletable-chips
          item-text="name"
          :default-items="defaultTargetGroups"
          :rules="targetGroupsValidation"
        />
        <InputTargetUsers
          v-if="isTargetUserTypeUsers"
          v-model.trim="formData.targetUsersValue"
          ref="refInputTargetUsers"
          multiple
          dense
          persistent-hint
          auto-select-first
          deletable-chips
          small-chips
          item-text="email"
          item-value="email"
          :default-items="defaultTargetUsers"
          :rules="targetGroupsValidation"
        />
      </div>
    </FormGroup>
    <FormGroup :title="labels.EmailDateRange" :sub-title="labels.EmailDateRangeSub">
      <div class="date-row mb-6" :class="[!isDateValid && 'date-picker-container']">
        <InputDate
          v-model="formData.emailDateRange"
          id="input--investigation-email-date-range"
          type="datetimerange"
          ref="refPicker"
          :format="parsedFormat"
          :valueFormat="parsedFormat"
          :picker-options="pickerOptions"
          :rules="[]"
          :defaultTime="['00:00:00', '23:59:00']"
          :prefix-icon="'el-icon-date'"
        />
        <div class="v-text-field__details checkbox-error" v-if="!isDateValid">
          <transition appear name="bounce">
            <div class="v-messages theme--light error--text" role="alert">
              <div class="v-messages__wrapper">
                <div class="v-messages__message" style="padding-left: 10px;">
                  Required
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </FormGroup>
    <FormGroup :title="labels.Duration" :sub-title="labels.InvestigationDurationSub">
      <KSelect
        v-model.trim="formData.duration"
        id="input--investigation-duration"
        custom-menu-class="menu--investigation-duration"
        outlined
        item-text="durationLabel"
        item-value="durationValue"
        placeholder="3 Days"
        :items="durations"
        :rules="requiredRule"
      />
    </FormGroup>
    <FormGroup has-hint :title="labels.SelectSources" :sub-title="labels.SelectSourcesSub">
      <MailConfigurationSelectSources v-model="formData.scanTypes" />
    </FormGroup>
    <FormGroup has-hint :title="labels.Action" :sub-title="labels.ActionSub">
      <KSelect
        v-model.trim="formData.action"
        id="input--investigation-action"
        custom-menu-class="menu--investigation-action"
        outlined
        hide-details
        item-text="actionLabel"
        item-value="actionValue"
        position="top"
        placeholder="Select an action"
        :items="actions"
        :rules="requiredRule"
        @change="actionChanged"
      />
    </FormGroup>
    <FormGroup v-if="isRenderWarningMessage" :title="labels.Message">
      <VTextField
        v-model.trim="formData.warningMessage"
        id="input--investigation-message"
        placeholder="Enter a message"
        outlined
        :rules="warningMessageRules"
      />
    </FormGroup>
  </VForm>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import labels from '@/model/constants/labels'
import {
  TARGET_USER_TYPES,
  ACTION_TYPES,
  DURATION_TYPES,
  durations,
  actions
} from '@/components/Investigation/utils'
import InputTargetGroup from '@/components/Common/Inputs/InputTargetGroup'
import * as Validations from '@/utils/validations'
import InputTargetUsers from '@/components/Common/Inputs/InputTargetUsers'
import InputDate from '@/components/Common/Inputs/InputDate.vue'
import { getTimeZone, getTimeZoneForMoment, scrollToComponent } from '@/utils/functions'
import { mapGetters } from 'vuex'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import MailConfigurationSelectSources from '@/components/Common/Others/MailConfigurationSelectSources'

export default {
  name: 'NewInvestigationSettings',
  components: {
    MailConfigurationSelectSources,
    KSelect,
    InputDate,
    InputTargetUsers,
    InputTargetGroup,
    InputEntityName,
    FormGroup
  },
  data() {
    return {
      labels,
      durations,
      actions,
      formData: {
        investigationName: `Manual Investigation - ${this.$moment(Date.now()).format(
          getTimeZoneForMoment()
        )}`,
        duration: DURATION_TYPES.OneDay,
        targetUserType: TARGET_USER_TYPES.AllUsers,
        targetUsersValue: '',
        warningMessage: '',
        action: ACTION_TYPES.NoAction,
        emailDateRange: [],
        scanTypes: []
      },
      targetGroupsValidation: [
        (v) => {
          return v.length ? Validations.required(v) : labels.Required
        }
      ],
      requiredRule: [(v) => Validations.required(v)],
      warningMessageRules: [
        (v) => Validations.required(v),
        (v) => Validations.startsWithSpace(v),
        (v) => Validations.maxLength(v, 64, labels.getMaxLengthMessage(labels.Message, 64))
      ],
      isDateValid: true,
      parsedFormat: getTimeZone(false),
      pickerOptions: {
        onPick: (date) => {
          const { minDate, maxDate } = date
          const refPicker = this.$refs.refPicker
          if (maxDate && minDate) {
            this.date = refPicker.formatToValue([minDate, maxDate])
          }
        },
        shortcuts: [
          {
            text: 'Today',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setHours(0, 0, 0, 0)
              end.setHours(23, 59, 59)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Yesterday',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setDate(start.getDate() - 1)
              start.setHours(0, 0, 0, 0)
              end.setDate(end.getDate() - 1)
              end.setHours(23, 59, 59)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last week',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last month',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Last 3 months',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      defaultTargetGroups: [],
      defaultTargetUsers: []
    }
  },
  computed: {
    ...mapGetters({
      timezoneFormat: 'auth/getTimezoneFormat'
    }),
    isTargetUserTypeAllUsers() {
      return this.formData.targetUserType === TARGET_USER_TYPES.AllUsers
    },
    isTargetUserTypeGroups() {
      return this.formData.targetUserType === TARGET_USER_TYPES.Groups
    },
    isTargetUserTypeUsers() {
      return this.formData.targetUserType === TARGET_USER_TYPES.Users
    },
    isRenderWarningMessage() {
      return this.formData.action === ACTION_TYPES.Warning
    }
  },
  watch: {
    'formData.targetUsersValue'(newVal) {
      //it is a vuetify bug, it adds an empty string to the array when the user deletes the last chip
      if (newVal[0] === '') {
        newVal.splice(0, 1)
      }
    },
    'formData.emailDateRange'(val) {
      this.isDateValid = val && val.length > 0
    },
    timezoneFormat: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.parsedFormat = getTimeZone(false, val)
          const parsedFormatForMoment = getTimeZoneForMoment(val)
          this.investigationName = `Manual Investigation - ${this.$moment(Date.now()).format(
            parsedFormatForMoment
          )}`
        }
      }
    }
  },
  methods: {
    handleTargetUserTypeChange() {
      this.formData.targetUsersValue =
        this.formData.targetUserType === TARGET_USER_TYPES.AllUsers ? '' : []
      this.$refs.refForm.resetValidation()
    },
    actionChanged() {
      this.formData.warningMessage = ''
      if (this.formData.action !== ACTION_TYPES.Warning) return
      this.$nextTick(() => {
        const el = this.$refs.refForm.$el.querySelector('.warning-message')
        if (el) scrollToComponent(el)
      })
    },
    setFormData(data = {}) {
      for (const [key, value] of Object.entries(data)) {
        if (!this.formData.hasOwnProperty(key)) continue
        this.formData[key] = value
      }
      if (this.isTargetUserTypeGroups) {
        this.defaultTargetGroups = this.formData.targetUsersValue
      } else if (this.isTargetUserTypeUsers) {
        this.defaultTargetUsers = this.formData.targetUsersValue.map((email) => ({
          email
        }))
      }
    },
    validateForm() {
      if (!this.formData.emailDateRange.length) this.isDateValid = false
      return this.$refs.refForm.validate() && this.isDateValid
    }
  }
}
</script>
