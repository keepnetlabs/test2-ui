<template>
  <AppModal
    :status="status"
    icon-name="$custom-new-instance"
    title="Create New Instance"
    class-name="add-in-configuration"
    title-id="text--create-new-instance__title"
    confirm-button-id="btn-save--campaign-manager-new-instance-modal"
    cancel-button-id="btn-cancel--campaign-manager-new-instance-modal"
    :confirm-button-text="labels.Launch"
    :confirm-button-style="{ width: '90px' }"
    :save-disable="isActionButtonDisabled"
    @closeOverlay="closeOverlay"
    @submit="handleSubmit"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        :title="labels.CampaignInstance"
        sub-title="Select target groups and schedule options for this smishing campaign instance"
      />
      <FormGroup
        class-name="campaign-manager__target-groups"
        title="Target Audience"
        sub-title="Select target groups to send this text message"
      />
      <CampaignManagerTargetGroups
        ref="refCampaignManagerTargetGroup"
        class="mt-2"
        is-vishing
        is-smishing
        last-column-name="phoneNumber"
        :selected-target-groups="formValues.targetGroupResourceIds"
        :response-of-target-groups-items="responseOfTargetGroupsItems"
        :is-valid="isTargetGroupsValid"
        :isMFAScenarioSelected="isMFAScenarioSelected"
        @handle-selection-change="handleTableSelectionChange"
      />
      <CustomError
        class="mb-6 ml-2"
        style="margin-top: 2px;"
        :is-valid="isTargetGroupsValid"
        :error-message="getTargetGroupErrorMessage"
      />
      <InputSchedule v-model="inputScheduleFormData" ref="inputSchedule" class="mb-6" isSmishing />
      <InputDistribution
        v-model="inputDistributionFormData"
        :type="DISTRIBUTION_TYPES.SMISHING"
        :distribution-delay-time-items="getDistributionDelayTimeItems"
        :selected-time-zone-text="selectedTimeZoneText"
        @call-for-calculate-sending-info="callForCalculateSendingInfo"
      />
      <div
        v-if="getDistributionTextRenderStatus"
        class="campaign-manager-advanced-settings__distribution-text mt-6"
      >
        {{ getDistributionText }}
      </div>
      <FormGroup class="mt-6" :title="labels.MarkAsTest" style="max-width: 640px;">
        <div>
          <v-checkbox
            v-model="formValues.excludeFromReports"
            id="input--campaign-manager-advanced-settings-exclude-from-reports"
            color="#2196f3"
          >
            <template #label> Exclude this campaign’s statistics from all generic reports</template>
          </v-checkbox>
        </div>
      </FormGroup>
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
import { searchTargetGroups, getTargetGroupCountDetail } from '@/api/targetUsers'
import SmishingService from '@/api/smishing'
import { isDifferent, getDefaultAxiosPayload, getTimeZoneForMoment } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import InputDistribution from '@/components/Common/Inputs/InputDistribution.vue'
import InputSchedule from '@/components/Common/Inputs/InputSchedule.vue'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import {
  DISTRIBUTION_START_TYPES,
  DISTRIBUTION_TYPES
} from '@/components/SmishingCampaignManager/utils'

const defaultFormValues = {
  targetGroupResourceIds: [],
  scheduleTypeId: '1',
  scheduledDate: '',
  scheduledDateTimeZoneId: '',
  useTargetUserTimeZone: false,
  excludeFromReports: false
}
const EMITS = {
  ON_CLOSE: 'on-close',
  ON_SUBMIT: 'on-submit'
}
export default {
  name: 'CampaignManagerNewInstanceModal',
  components: {
    InputSchedule,
    InputDistribution,
    AppModal,
    AppModalBodyHeader,
    FormGroup,
    CampaignManagerTargetGroups,
    CustomError
  },
  mixins: [useDebounce],
  emits: EMITS,
  props: {
    status: {
      type: Boolean
    },
    resourceId: {
      type: String
    },
    formDetails: {
      type: Object,
      default: () => ({})
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      DISTRIBUTION_TYPES,
      labels,
      initialFormValues: JSON.parse(JSON.stringify(defaultFormValues)),
      formValues: JSON.parse(JSON.stringify(defaultFormValues)),
      totalSendSecond: 77720,
      batchEverySendSecond: 0,
      isTargetGroupSearchLoading: false,
      isTargetGroupLoading: false,
      isTargetGroupFocused: false,
      isTargetGroupsValid: true,
      isShowTargetGroupUsersError: false,
      isShowActiveAndPhoneNumberError: false,
      isDateValid: true,
      isActionButtonDisabled: false,
      initial: true,
      responseOfTargetGroupsItems: {},
      defaultTargetGroups: [],
      targetGroupItems: [],
      totalTargetUserCount: 0,
      selectedTimeZoneText: '',
      inputScheduleFormData: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
        scheduledDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
        scheduledDateTimeZoneId: '',
        useTargetUserTimeZone: false
      },
      inputDistributionFormData: {
        distributionTypeId: DISTRIBUTION_TYPES.SMISHING,
        distributionDelayEvery: 20,
        distributionDelayTimeTypeId: '1',
        sendingLimit: 50,
        sendCallsOnDays: [1, 2, 4, 8, 16],
        distributionStartTime: '09:00',
        distributionEndTime: '17:00',
        distributionDays: 31,
        distributionStartTypeId: DISTRIBUTION_START_TYPES.NOW
      },
      axiosPayloadOfTargetGroups: getDefaultAxiosPayload()
    }
  },
  computed: {
    isMFAScenarioSelected() {
      if (this.selectedRow?.method === 'MFA') return true
      if (this.selectedRow?.method === 'Multiple Method') {
        const methodsArray = JSON.parse(this.selectedRow.methodDetail)
        const mfaIndex = methodsArray.findIndex((methodObj) => methodObj.method === 'MFA')
        if (mfaIndex !== -1) {
          return true
        }
        return false
      }
      return false
    },
    getDistributionDelayTimeItems() {
      return this.formDetails['distributionDelayTimeTypes'] || []
    },
    getTargetGroupErrorMessage() {
      return this.formValues.targetGroupResourceIds.length
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
    getDistributionText() {
      if (this.totalTargetUserCount === 1)
        return `Sending an SMS will start immediately for a single user.`
      return `Sending ${this.inputDistributionFormData.sendingLimit} SMS every ${this.inputDistributionFormData.distributionDelayEvery} ${this.getSelectedSmtpDelayOverTimeType} to ${this.totalTargetUserCount} target users will take approximately ${this.getApproximatedTime}.`
    },
    getEmailOverMinutes() {
      let seconds = this.batchEverySendSecond
      seconds = seconds.toFixed()
      if (seconds < 1) seconds = 1
      let minutes = 0
      if (seconds > 60) {
        minutes = seconds % 60
        seconds = seconds / 60
      }
      minutes = minutes.toString()
      seconds = seconds.toString()
      const singleDigitMinutes = `0${minutes}`
      const singleDigitSeconds = `0${seconds}`
      return `${minutes.length === 1 ? singleDigitMinutes : minutes}:${
        seconds.length === 1 ? singleDigitSeconds : seconds
      }`
    },
    getSelectedSmtpDelayOverTimeType() {
      return this.formDetails['distributionDelayTimeTypes']
        ? this.formDetails['distributionDelayTimeTypes']?.find(
            (item) => item.value === this.inputDistributionFormData.distributionDelayTimeTypeId
          )?.text
        : ''
    },
    getDistributionTextRenderStatus() {
      if (!this.totalTargetUserCount) return false
      return this.inputDistributionFormData.distributionTypeId === DISTRIBUTION_TYPES.SMISHING
        ? this.inputDistributionFormData.sendingLimit &&
            this.inputDistributionFormData.distributionDelayEvery
        : this.inputDistributionFormData.sendingLimit &&
            this.inputDistributionFormData.distributionEmailOver
    },
    getApproximatedTime() {
      let seconds = this.totalSendSecond
      let minutes = 0
      let hours = 0
      if (seconds > 60) {
        minutes = Math.floor(seconds / 60)
        seconds = seconds % 60
      }
      if (minutes > 60) {
        hours = Math.floor(minutes / 60)
        minutes = minutes % 60
      }
      seconds = Math.floor(seconds)
      if (minutes === 0 && hours === 0 && seconds === 0) {
        seconds = 1
      }
      const hoursText = hours > 1 ? 'hours' : 'hour'
      const minutesText = minutes > 1 ? 'minutes' : 'minute'
      const secondsText = seconds > 1 ? 'seconds' : 'second'
      const leftSideHours = `${hours} ${hoursText} `
      let leftSideText = '',
        rightSideText = ''
      if (hours !== 0) {
        leftSideText = leftSideHours
      }
      if (minutes !== 0) {
        leftSideText += `${minutes} ${minutesText} `
      }
      if (seconds !== 0) {
        if (hours !== 0 || minutes !== 0) rightSideText = `and ${seconds} ${secondsText}`
        else rightSideText = `${seconds} ${secondsText}`
      }

      return `${leftSideText}${rightSideText}`
    }
  },
  watch: {
    'inputScheduleFormData.scheduledDateTimeZoneId': {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectedTimeZoneText =
            this.timeZones?.timeZoneList?.find((item) => item.id === val)?.displayName || ''
        }
      }
    },
    'inputDistributionFormData.sendCallsOnDays': {
      deep: true,
      handler(val) {
        this.inputDistributionFormData.distributionDays = val.reduce((acc, val) => {
          return acc + val
        }, 0)
      }
    },
    totalTargetUserCount(val) {
      if (!val) return
      this.callForCalculateSendingInfo()
    },
    'formValues.targetGroupResourceIds'(val) {
      this.isTargetGroupsValid = !!val.length
      this.debounce(() => {
        this.callForTargetGroupsUserCount()
      }, 500)
    }
  },
  created() {
    this.callForTargetGroups()
    this.initialFormValues = JSON.parse(JSON.stringify(this.formValues))
  },
  methods: {
    closeOverlay() {
      const isChanged = isDifferent(this.formValues, this.initialFormValues)
      if (!isChanged) {
        return this.$emit(EMITS.ON_CLOSE)
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.$emit(EMITS.ON_CLOSE)
        }
      })
    },
    callForTargetGroups() {
      this.isTargetGroupSearchLoading = true
      this.setTargetGroupLoading(true)
      searchTargetGroups(this.axiosPayloadOfTargetGroups)
        .then((response) => {
          const { data: { data: { results = [] } = {} } = {} } = response
          if (this.initial) {
            this.responseOfTargetGroupsItems = response
          }

          this.initial = false
          this.targetGroupItems = results.map((item) => ({
            text: item.name,
            value: item.resourceId,
            extraDatas: null
          }))
        })
        .finally(() => {
          this.isTargetGroupSearchLoading = false
          this.setTargetGroupLoading()
          this.addDefaultTargetGroupItems(this.defaultTargetGroups)
          this.targetGroupItems.push(...this.defaultTargetGroups)
        })
    },
    addDefaultTargetGroupItems(targetGroups = []) {
      if (this.formValues.targetGroupResourceIds.length || !targetGroups.length) return
      this.$nextTick(() => {
        this.handleTargetGroupsResourceIdsChange(targetGroups)
      })
    },
    handleTargetGroupsResourceIdsChange(items) {
      const selectedTableItems = items
        .filter((item) => item)
        .map((item) => ({ ...item, resourceId: item.value }))
      if (
        this.$refs?.refCampaignManagerTargetGroup?.$refs?.refGroupTable?.$refs?.refTable?.$refs
          ?.elTableRef
      ) {
        this.$refs.refCampaignManagerTargetGroup.$refs.refGroupTable.$refs.refTable.getSelectedObjectAndSelectRowsByRowKey(
          selectedTableItems
        )
      }
    },
    handleTableSelectionChange(items) {
      this.formValues.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: null
        }))
    },
    setTargetGroupLoading(val = false) {
      this.isTargetGroupLoading = val
    },
    async handleSubmit() {
      this.setActionButtonDisability(true)
      if (
        this.inputScheduleFormData.scheduleTypeId === SCHEDULE_TYPES.SCHEDULE_TO &&
        !this.inputScheduleFormData.scheduledDate
      ) {
        this.isDateValid = false
      }
      if (!this.formValues.targetGroupResourceIds.length) {
        this.isTargetGroupsValid = false
      }
      if (this.isDateValid && this.isTargetGroupsValid) {
        const payload = {
          ...this.formValues,
          useTargetUserTimeZone: this.inputScheduleFormData?.useTargetUserTimeZone || false,
          scheduledDateTimeZoneId: this.inputScheduleFormData.scheduledDateTimeZoneId,
          scheduleTypeId: this.inputScheduleFormData.scheduleTypeId,
          distributionStartTypeId: this.inputDistributionFormData.distributionStartTypeId,
          distributionStartTime: this.inputDistributionFormData.distributionStartTime,
          distributionEndTime: this.inputDistributionFormData.distributionEndTime,
          distributionDays: this.inputDistributionFormData.distributionDays,
          scheduledDate:
            this.inputScheduleFormData.scheduleTypeId !== SCHEDULE_TYPES.SCHEDULE_TO
              ? null
              : this.inputScheduleFormData.scheduledDate,
          targetGroupResourceIds: this.formValues.targetGroupResourceIds.map(
            (target) => target.value
          )
        }
        SmishingService.launchSmishingCampaign(this.resourceId, payload)
          .then(() => {
            this.$emit(EMITS.ON_SUBMIT)
          })
          .finally(this.setActionButtonDisability)
      } else {
        this.setActionButtonDisability(false)
      }
    },
    setActionButtonDisability(flag = false) {
      this.isActionButtonDisabled = flag
    },
    callForCalculateSendingInfo() {
      if (
        !this.formValues.targetGroupResourceIds.length ||
        !this.totalTargetUserCount ||
        this.totalTargetUserCount === 1
      )
        return
      if (!this.inputDistributionFormData.distributionDelayEvery) return
      this.debounce(() => {
        const payload = {
          targetGroupResourceIds: this.formValues.targetGroupResourceIds.map((item) => item.value),
          distributionTypeId: this.inputDistributionFormData.distributionTypeId,
          distributionDelayEvery: this.inputDistributionFormData.distributionDelayEvery,
          distributionDelayTimeTypeId: this.inputDistributionFormData.distributionDelayTimeTypeId,
          distributionEmailOver: this.inputDistributionFormData.distributionEmailOver,
          distributionEmailOverTimeTypeId: this.inputDistributionFormData
            .distributionEmailOverTimeTypeId,
          sendingLimit: this.inputDistributionFormData.sendingLimit,
          totalTargetUserCount: this.totalTargetUserCount,
          distributionDays: this.inputDistributionFormData.distributionDays,
          distributionStartTime: this.inputDistributionFormData.distributionStartTime,
          distributionEndTime: this.inputDistributionFormData.distributionEndTime,
          sendRandomlyUsers: false,
          sendRandomlyUsersCalculateTypeId: '1',
          sendRandomlyUsersCount: '20'
        }
        if (payload.distributionDelayEvery) {
          SmishingService.calculateSendingInfo(payload).then((response) => {
            const {
              data: { data }
            } = response
            const { totalSendSecond, batchEverySendSecond } = data
            this.totalSendSecond = totalSendSecond
            this.batchEverySendSecond = batchEverySendSecond
          })
        }
      }, 500)
    },
    async callForTargetGroupsUserCount() {
      if (!this.formValues.targetGroupResourceIds.length) {
        this.totalTargetUserCount = 0
        return
      }
      const userCountDetailResponse = await getTargetGroupCountDetail(
        this.formValues.targetGroupResourceIds.map((item) => item.value)
      )
      if (userCountDetailResponse?.data?.data && userCountDetailResponse?.data?.data?.length) {
        this.totalTargetUserCount = userCountDetailResponse?.data?.data?.reduce((acc, row) => {
          if (row.status !== 'Active') return acc
          const verifiedUserCount =
            row?.domainAllowList?.find((r) => r.status === 'Verified')?.count || 0
          return acc + verifiedUserCount
        }, 0)
      }
    }
  }
}
</script>
