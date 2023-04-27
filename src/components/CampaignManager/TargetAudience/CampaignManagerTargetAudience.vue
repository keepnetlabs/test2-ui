<template>
  <div>
    <CampaignManagerTargetGroups
      ref="refCampaignManagerTargetGroup"
      is-call-api-when-created
      :selected-target-groups="targetGroupResourceIds"
      :is-valid="isTargetGroupsValid"
      @handle-selection-change="handleTargetGroupSelectionChange"
    />
    <CustomError
      class="mb-6 ml-2"
      style="margin-top: 2px;"
      :is-valid="isTargetGroupsValid"
      :error-message="getTargetGroupErrorMessage"
    />
    <FormGroup style="max-width: 640px;" :title="labels.LimitRecipients">
      <div>
        <VCheckbox
          v-model="formData.sendOnlyActiveUsers"
          id="input--campaign-manager-advanced-settings-only-active-users"
          color="#2196f3"
          :disabled="!onlineUsersCount"
        >
          <template #label> Send only to active users on phishing reporter add-in</template>
        </VCheckbox>
        <div class="campaign-manager-advanced-settings__other-settings-last">
          <VCheckbox
            v-model="formData.sendRandomlyUsers"
            id="input--campaign-manager-advanced-settings-randomly-selected"
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

export default {
  name: 'CampaignManagerTargetAudience',
  components: { KSelect, FormGroup, CustomError, CampaignManagerTargetGroups },
  props: {
    targetGroupResourceIds: {
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
    }
  },
  data() {
    return {
      labels,
      isTargetGroupsValid: true,
      isShowTargetGroupUsersError: false,
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
    getTargetGroupErrorMessage() {
      return this.targetGroupResourceIds.length
        ? this.getTargetGroupErrorText
        : labels.TargetGroupSelectionRequiredError
    },
    getTargetGroupErrorText() {
      return this.isShowTargetGroupUsersError ? labels.TargetGroupUserRequiredError : 'Required'
    },
    getDisabledStatusOfRandomlySelected() {
      return !this.formData.sendRandomlyUsers
    }
  },
  watch: {
    targetGroupResourceIds(val) {
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
      getPhishingReportSummary({
        startDate: dateObj.startDate,
        endDate: dateObj.endDate
      }).then((response) => {
        const { data } = response.data
        this.onlineUsersCount = !!data['onlineUsersCount']
      })
    },
    getDateValue(value) {
      value = typeof value == 'string' ? value : value.toString()
      return value.length === 1 ? `0${value}` : `${value}`
    },
    handleTargetGroupSelectionChange(items) {
      this.$emit('update:selectedTargetGroups', items)
      this.$emit(
        'update:targetGroupResourceIds',
        items
          .filter((item) => item)
          .map((item) => ({
            text: item.text || item.name,
            value: item.value || item.resourceId,
            extraDatas: item
          }))
      )
    },
    userCountValidation(v) {
      const { sendRandomlyUsersCalculateTypeId } = this.formData
      //that means percent
      const val = parseInt(v)
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
