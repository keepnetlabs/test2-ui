<template>
  <AppModal
    :status="status"
    icon-name="$custom-new-instance"
    title="Create New Run"
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
        sub-title="Select target groups and schedule options for this callback campaign run"
      />
      <FormGroup
        class-name="campaign-manager__target-groups"
        title="Target Audience"
        sub-title="Select target groups to send this callback email"
      />
      <CampaignManagerTargetGroups
        ref="refCampaignManagerTargetGroup"
        class="mt-2"
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
      <InputSchedule v-model="inputScheduleFormData" ref="inputSchedule" />
      <InputDistribution
        v-model="inputDistributionFormData"
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
import { getTargetGroupCountDetail } from '@/api/targetUsers'
import CallbackService from '@/api/callback'
import { isDifferent, getDefaultAxiosPayload, getTimeZoneForMoment } from '@/utils/functions'
import useDebounce from '@/hooks/useDebounce'
import InputDistribution from '@/components/Common/Inputs/InputDistribution'
import InputSchedule from '@/components/Common/Inputs/InputSchedule'
import {
  DISTRIBUTION_START_TYPES,
  DISTRIBUTION_TYPES
} from '@/components/SmishingCampaignManager/utils'
import { SCHEDULE_TYPES } from '@/components/CampaignManager/utils'
import useDistributionComputed from '@/hooks/awareness-educator/useDistributionComputed'

const defaultFormValues = {
  targetGroupResourceIds: [],
  scheduleTypeId: '1',
  scheduledDate: '',
  scheduledDateTimeZoneId: '',
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
  mixins: [useDebounce, useDistributionComputed],
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
      totalSendSecond: 77720,
      batchEverySendSecond: 0,
      totalTargetUserCount: 0,
      labels,
      initialFormValues: structuredClone(defaultFormValues),
      formValues: structuredClone(defaultFormValues),
      isTargetGroupSearchLoading: false,
      isTargetGroupLoading: false,
      isTargetGroupFocused: false,
      isTargetGroupsValid: true,
      isDateValid: true,
      isActionButtonDisabled: false,
      initial: true,
      responseOfTargetGroupsItems: {},
      defaultTargetGroups: [],
      targetGroupItems: [],
      selectedTimeZoneText: '',
      inputDistributionFormData: {
        distributionTypeId: DISTRIBUTION_TYPES.PHISHING,
        distributionDelayEvery: 20,
        distributionEmailOverTimeTypeId: '1',
        distributionEmailOver: 8,
        distributionDelayTimeTypeId: '1',
        sendingLimit: 50,
        sendCallsOnDays: [1, 2, 4, 8, 16],
        distributionStartTime: '09:00',
        distributionEndTime: '17:00',
        distributionDays: 31,
        distributionStartTypeId: DISTRIBUTION_START_TYPES.NOW
      },
      inputScheduleFormData: {
        scheduleTypeId: SCHEDULE_TYPES.SCHEDULE_TO,
        scheduledDate: this.$moment(Date.now()).format(getTimeZoneForMoment()),
        scheduledDateTimeZoneId: ''
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
        return mfaIndex !== -1
      }
      return false
    },
    getSelectedSmtpDelayOverTimeType() {
      return this.formDetails['distributionSmtpDelayTimeTypes']
        ? this.formDetails['distributionSmtpDelayTimeTypes']?.find(
            (item) => item.value === this.inputDistributionFormData.distributionDelayTimeTypeId
          )?.text
        : ''
    },
    getDistributionDelayTimeItems() {
      return this.formDetails['distributionSmtpDelayTimeTypes'] || []
    },
    getTargetGroupErrorMessage() {
      return this.formValues.targetGroupResourceIds.length
        ? this.getTargetGroupErrorText
        : labels.TargetGroupSelectionRequiredError
    },
    getTargetGroupErrorText() {
      return this.isShowTargetGroupUsersError ? labels.TargetGroupUserRequiredError : 'Required'
    },
    scheduledTimeItems() {
      const { timeZoneList = [] } = this.$store.getters['common/getTimezones'] || {}
      return timeZoneList.map((item) => ({
        text: item.displayName,
        value: item.id
      }))
    }
  },
  watch: {
    'formValues.targetGroupResourceIds'(val) {
      this.isTargetGroupsValid = !!val.length
      this.debounce(() => {
        this.callForTargetGroupsUserCount()
      }, 500)
    },
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
    }
  },
  created() {
    this.callForTargetGroups()
    this.initialFormValues = structuredClone(this.formValues)
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
      CallbackService.getTargetGroupsForCurrentCompany(this.axiosPayloadOfTargetGroups)
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
        .filter(Boolean)
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
        .filter(Boolean)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: null
        }))
    },
    setTargetGroupLoading(val = false) {
      this.isTargetGroupLoading = val
    },
    handleSubmit() {
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
        this.setActionButtonDisability(true)
        const payload = {
          excludeFromReports: this.formValues.excludeFromReports,
          scheduledDate:
            this.inputScheduleFormData.scheduleTypeId === SCHEDULE_TYPES.SCHEDULE_TO
              ? this.inputScheduleFormData.scheduledDate
              : null,
          scheduledDateTimeZoneId: this.inputScheduleFormData.scheduledDateTimeZoneId,
          scheduleTypeId: this.inputScheduleFormData.scheduleTypeId,
          targetGroupResourceIds: this.formValues.targetGroupResourceIds.map(
            (target) => target.value
          ),
          distributionStartTypeId: this.inputDistributionFormData.distributionStartTypeId,
          distributionStartTime: this.inputDistributionFormData.distributionStartTime,
          distributionEndTime: this.inputDistributionFormData.distributionEndTime,
          distributionDays: this.inputDistributionFormData.distributionDays,
          campaignResourceId: this.resourceId
        }
        CallbackService.launchCallbackCampaignJob(payload)
          .then(() => {
            this.$emit(EMITS.ON_SUBMIT)
          })
          .finally(this.setActionButtonDisability)
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
          targetGroupResourceIds: this.formValues.targetGroupResourceIds,
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
          CallbackService.calculateSendingInfo(payload).then((response) => {
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
