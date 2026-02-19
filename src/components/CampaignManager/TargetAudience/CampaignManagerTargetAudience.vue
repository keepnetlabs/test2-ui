<template>
  <div>
    <AlertBox
      v-if="isMultiplePhishingScenarios"
      class="mb-6 bg-aqua-light"
      style="margin-right: 120px;"
      text="Ensure that the target user count is equal to or greater than the scenario count. Adjust accordingly if the target user count is lower."
      icon-color="#2196F3"
      icon-name="mdi-information"
      :slots="{ primaryAction: false, secondaryAction: false }"
    />
    <CampaignManagerTargetGroups
      ref="refCampaignManagerTargetGroup"
      :is-call-api-when-created="isCallApiWhenCreated"
      :is-valid="isTargetGroupsValid"
      :is-vishing="isVishing"
      :is-all-groups="isAllGroups"
      :isMFAScenarioSelected="isMFAScenarioSelected"
      :isSmishing="isSmishing"
      :isCallback="isCallback"
      :last-column-name="lastColumnName"
      :default-selected-target-group-resource-ids="defaultSelectedTargetGroupResourceIds"
      :scenario-resource-ids="scenarioResourceIds"
      :is-phishing="isPhishing"
      :target-group-resource-ids="targetGroupResourceIds"
      :send-user-preferred-language="sendUserPreferredLanguage"
      :scenario-distribution="scenarioDistribution"
      :category-filter="categoryFilter"
      @handle-selection-change="handleTargetGroupSelectionChange"
    />
    <CustomError
      class="mb-6 ml-2"
      style="margin-top: 2px;"
      :is-valid="isTargetGroupsValid"
      :error-message="getTargetGroupErrorMessage"
    />
    <VForm ref="refForm">
      <FormGroup v-if="showCheckboxes" style="max-width: 640px;" :title="labels.LimitRecipients">
        <div>
          <VCheckbox
            v-if="!isVishing && !isQuishingPrintOut && getPhishingReporterSummaryPermissions"
            v-model="formData.sendOnlyActiveUsers"
            id="input--campaign-manager-advanced-settings-only-active-users"
            color="#2196f3"
            :disabled="!onlineUsersCount"
          >
            <template #label>
              Send only to active users on phishing reporter add-in ({{
                onlineUsersCount
              }}
              currently)</template
            >
          </VCheckbox>
          <div class="campaign-manager-advanced-settings__other-settings-last">
            <VCheckbox
              v-model="formData.sendRandomlyUsers"
              id="input--target-audience-send-randomly"
              color="#2196f3"
              hide-details
            >
            </VCheckbox>
            <span>Send this campaign to randomly selected</span>
            <VTextField
              v-model="formData.sendRandomlyUsersCount"
              v-mask="'#######'"
              id="input--campaign-manager-advanced-settings-other-settings-number"
              outlined
              class="ml-2 absolute-text-input-error absolute-text-input-error--max-width"
              style="max-width: 64px;"
              :disabled="getDisabledStatusOfRandomlySelected"
              :rules="formData.sendRandomlyUsers ? [...rules.number, userCountValidation] : []"
            ></VTextField>
            <KSelect
              v-model.trim="formData.sendRandomlyUsersCalculateTypeId"
              id="input--campaign-manager-advanced-settings-other-settings-percent"
              class="ml-2"
              outlined
              dense
              hide-details
              placeholder="Select a item"
              style="max-width: 118px;"
              :items="formDetails['sendRandomlyUsersCalculateTypes']"
              :disabled="getDisabledStatusOfRandomlySelected"
            />
            <span class="ml-2">of target users</span>
          </div>
        </div>
      </FormGroup>
    </VForm>
  </div>
</template>

<script>
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
import labels from '@/model/constants/labels'
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import * as Validations from '@/utils/validations'
import { getPhishingReportSummary } from '@/api/phishingReporter'
import { SEND_RANDOMLY_USERS_CALCULATE_TYPES } from '@/components/CampaignManager/utils'
import AlertBox from '@/components/AlertBox'
import { mapGetters } from 'vuex'
export default {
  name: 'CampaignManagerTargetAudience',
  components: {
    AlertBox,
    KSelect,
    FormGroup,
    CustomError,
    CampaignManagerTargetGroups
  },
  props: {
    defaultValues: {
      type: Object,
      default: () => ({})
    },
    showCheckboxes: {
      type: Boolean,
      default: true
    },
    selectedTargetGroupsMapped: {
      type: Array,
      default: () => []
    },
    selectedTargetGroups: {
      type: Array,
      default: () => []
    },
    formDetails: {
      type: Object,
      default: () => ({})
    },
    isVishing: {
      type: Boolean,
      default: false
    },
    isAllGroups: {
      type: Boolean,
      default: false
    },
    lastColumnName: {
      type: String,
      default: 'email'
    },
    totalTargetUserCount: {
      type: Number,
      default: 0
    },
    isMultiplePhishingScenarios: {
      type: Boolean,
      default: false
    },
    defaultSelectedTargetGroupResourceIds: {
      type: Array,
      default: () => []
    },
    isCallApiWhenCreated: {
      type: Boolean,
      default: true
    },
    isSmishing: {
      type: Boolean,
      default: false
    },
    isCallback: {
      type: Boolean,
      default: false
    },
    isMFAScenarioSelected: {
      type: Boolean,
      default: false
    },
    isQuishingPrintOut: {
      type: Boolean,
      default: false
    },
    isPhishing: {
      type: Boolean,
      default: false
    },
    targetGroupResourceIds: {
      type: Array,
      default: () => []
    },
    scenarioResourceIds: {
      type: Array,
      default: () => []
    },
    sendUserPreferredLanguage: {
      type: String,
      default: '0'
    },
    scenarioDistribution: {
      type: Number,
      default: 0
    },
    categoryFilter: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isTargetGroupsValid: true,
      isShowTargetGroupUsersError: false,
      isShowActiveAndPhoneNumberError: false,
      onlineUsersCount: 0,
      formData: {
        sendOnlyActiveUsers: false,
        sendRandomlyUsers: false,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: SEND_RANDOMLY_USERS_CALCULATE_TYPES.PERCENTAGE
      },
      rules: {
        number: [
          (v) => Validations.required(v, 'Enter a number higher than 0'),
          (v) => Validations.startsWith(v, 'Cannot start with 0', 0),
          (v) => v < 1000000 || `${v} cannot exceed ${1000000}`
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      getPhishingReporterSummaryPermissions: 'permissions/getPhishingReporterSummaryPermissions'
    }),
    getTargetGroupErrorMessage() {
      return this.selectedTargetGroupsMapped.length
        ? this.getTargetGroupErrorText
        : labels.TargetGroupSelectionRequiredError
    },
    getTargetGroupErrorText() {
      if (this.isShowActiveAndPhoneNumberError) {
        return `Target groups must have at least 1 active user who has phone number assigned to them`
      }

      if (this.isShowTargetGroupUsersError) {
        return labels.TargetGroupUserRequiredError
      }

      return 'Required'
    },
    getDisabledStatusOfRandomlySelected() {
      return !this.formData.sendRandomlyUsers
    }
  },
  watch: {
    defaultValues: {
      deep: true,
      handler(val) {
        this.formData = { ...this.formData, ...val }
      }
    },
    selectedTargetGroupsMapped(val) {
      this.isTargetGroupsValid = !!val.length
    }
  },
  created() {
    this.callForActiveOutlookUsers()
  },
  methods: {
    callForActiveOutlookUsers() {
      const today = new Date()
      const day = today.getUTCDate()
      const month = today.getUTCMonth() + 1
      const year = today.getUTCFullYear()
      const hours = today.getUTCHours()
      const minutes = today.getUTCMinutes()
      const seconds = today.getUTCSeconds()
      const fourMinutesBefore = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes() - 4,
        today.getSeconds()
      )
      const fourMinutesBeforeMonth = fourMinutesBefore.getUTCMonth() + 1
      const fourMinutesBeforeDay = fourMinutesBefore.getUTCDate()
      const fourMinutesBeforeHours = fourMinutesBefore.getUTCHours()
      const fourMinutesBeforeMinutes = fourMinutesBefore.getUTCMinutes()
      const fourMinutesBeforeSeconds = fourMinutesBefore.getUTCSeconds()
      const dateObj = {
        endDate: `${year}-${this.getDateValue(month)}-${this.getDateValue(day)}-${this.getDateValue(
          hours
        )}-${this.getDateValue(minutes)}-${this.getDateValue(seconds)}`,
        startDate: `${fourMinutesBefore.getUTCFullYear()}-${this.getDateValue(
          fourMinutesBeforeMonth
        )}-${this.getDateValue(fourMinutesBeforeDay)}-${this.getDateValue(
          fourMinutesBeforeHours
        )}-${this.getDateValue(fourMinutesBeforeMinutes)}-${this.getDateValue(
          fourMinutesBeforeSeconds
        )}`
      }
      if (
        !this.isVishing &&
        !this.isQuishingPrintOut &&
        this.getPhishingReporterSummaryPermissions
      ) {
        getPhishingReportSummary({
          startDate: dateObj.startDate,
          endDate: dateObj.endDate
        }).then((response) => {
          const { data } = response.data
          this.onlineUsersCount = data['onlineUsersCount']
        })
      }
    },
    getDateValue(value) {
      value = typeof value == 'string' ? value : value.toString()
      return value.length === 1 ? `0${value}` : `${value}`
    },
    handleTargetGroupSelectionChange(items) {
      this.$emit('update:selectedTargetGroups', items)
      this.$emit(
        'update:selectedTargetGroupsMapped',
        items
          .filter(Boolean)
          .map((item) => ({
            text: item.text || item.name,
            value: item.value || item.resourceId,
            extraDatas: item
          }))
      )
    },
    userCountValidation(v) {
      const { sendRandomlyUsersCalculateTypeId } = this.formData
      const val = Number.parseInt(v)
      if (sendRandomlyUsersCalculateTypeId === SEND_RANDOMLY_USERS_CALCULATE_TYPES.PERCENTAGE) {
        return (val <= 100 && val >= 0) || 'This number cannot be higher than 100 percent'
      } else {
        return (
          this.totalTargetUserCount >= val ||
          'This number cannot be higher than number of total target users.'
        )
      }
    }
  }
}
</script>
