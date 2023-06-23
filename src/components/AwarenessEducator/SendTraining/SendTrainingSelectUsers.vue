<template>
  <v-form ref="refForm">
    <KButtonRadioGroup v-model="selectedRadioGroupIndex" class="mb-8" :items="radioGroupItems" />
    <div v-show="selectedRadioGroupIndex === 0">
      <FormGroup :title="labels.TargetUserGroups" :sub-title="labels.TargetUserGroupsSub">
      </FormGroup>
      <TargetGroups
        ref="refTargetGroups"
        class="mt-2"
        is-all-groups
        :response-of-target-groups-items="responseOfTargetGroupsItems"
        :selected-target-groups="formData.targetGroupResourceIds"
        :is-valid="isTargetGroupsValid"
        @handle-selection-change="handleTableSelectionChange"
      />
      <CustomError
        class="mb-6 ml-2"
        style="margin-top: 2px;"
        :is-valid="isTargetGroupsValid"
        :error-message="getTargetGroupErrorMessage"
      />
    </div>
    <div v-if="selectedRadioGroupIndex === 1">
      <FormGroup :title="labels.PhishingCampaigns" :sub-title="labels.PhishingCampaignsSub">
      </FormGroup>
      <SendTrainingSelectUsersByCampaign
        ref="refSendTrainingSelectUsersByCampaign"
        :value="formData.campaignResourceId"
        :is-target-groups-valid="!!getTotalTargetUserCount"
        @on-item-change="handleCampaignChange"
      />
      <FormGroup
        class="mt-6"
        style="max-width: 640px;"
        :title="labels.TargetUsers"
        :sub-title="labels.SendTrainingTargetUsersSub"
      >
        <div>
          <v-checkbox
            v-model="formData.userWhoOpenedEmail"
            id="input--send-training-user-who-opened-email"
            color="#2196f3"
            @click="checkboxSelectionChange"
          >
            <template #label>{{ labels.UserWhoOpenedEmail }}</template>
          </v-checkbox>
          <v-checkbox
            v-if="methodTypeId !== 3"
            v-model="formData.userWhoClickedEmail"
            id="input--send-training-user-who-clicked-email"
            color="#2196f3"
            @click="checkboxSelectionChange"
          >
            <template #label>{{ labels.UserWhoClickedEmail }}</template>
          </v-checkbox>
          <v-checkbox
            v-if="methodTypeId === 2"
            v-model="formData.userWhoSubmittedData"
            id="input--send-training-user-who-submitted-data"
            color="#2196f3"
            @click="checkboxSelectionChange"
          >
            <template #label>{{ labels.UserWhoSubmittedData }}</template>
          </v-checkbox>
          <v-checkbox
            v-if="methodTypeId === 3"
            v-model="formData.userWhoDownloadedAttachment"
            id="input--send-training-user-who-downloaded-attachment"
            color="#2196f3"
            @click="checkboxSelectionChange"
          >
            <template #label>{{ labels.UserWhoOpenedAttachment }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="formData.userWhoReportedAsSuspicious"
            id="input--send-training-user-who-reported-as-suspicious"
            color="#2196f3"
            @click="checkboxSelectionChange"
          >
            <template #label>{{ labels.UserWhoReportedAsSuspicious }}</template>
          </v-checkbox>
          <CustomError
            class="mb-6"
            style="margin-top: 2px;"
            :is-valid="!getErrorText"
            :error-message="getErrorText"
          />
        </div>
      </FormGroup>
    </div>
  </v-form>
</template>

<script>
import KButtonRadioGroup from '@/components/ButtonRadioGroup/KButtonRadioGroup'
import FormGroup from '@/components/SmallComponents/FormGroup'
import labels from '@/model/constants/labels'
import CampaignManagerTargetGroups from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerTargetGroups'
import CustomError from '@/components/CustomError'
import { searchAllTargetGroups } from '@/api/targetUsers'
import { getDefaultAxiosPayload } from '@/utils/functions'
import SendTrainingSelectUsersByCampaign from '@/components/AwarenessEducator/SendTraining/SendTrainingSelectUsersByCampaign'
export default {
  name: 'SendTrainingSelectUsers',
  components: {
    SendTrainingSelectUsersByCampaign,
    CustomError,
    TargetGroups: CampaignManagerTargetGroups,
    FormGroup,
    KButtonRadioGroup
  },
  data() {
    return {
      targetUserCheckboxSelectionError: false,
      labels,
      initial: true,
      selectedRadioGroupIndex: 0,
      totalTargetUserCount: 0,
      isShowTargetGroupUsersError: false,
      isTargetGroupsValid: true,
      responseOfTargetGroupsItems: null,
      methodTypeId: '',
      selectedCampaign: null,
      formData: {
        targetGroupResourceIds: [],
        campaignResourceId: '',
        userWhoOpenedEmail: false,
        userWhoClickedEmail: false,
        userWhoSubmittedData: false,
        userWhoDownloadedAttachment: false,
        userWhoReportedAsSuspicious: false
      },
      radioGroupItems: [
        {
          label: labels.ByUserGroups
        }
        /*
        {
          label: labels.ByCampaign
        }

         */
      ],
      axiosPayloadOfTargetGroups: getDefaultAxiosPayload()
    }
  },
  computed: {
    getTargetGroupErrorMessage() {
      return this.formData.targetGroupResourceIds.length
        ? this.getTargetGroupErrorText
        : labels.TargetGroupSelectionRequiredError
    },
    getTargetGroupErrorText() {
      return this.isShowTargetGroupUsersError ? labels.TargetGroupUserRequiredError : 'Required'
    },
    getErrorText() {
      if (this.targetUserCheckboxSelectionError) {
        return 'At least one of the options must be selected'
      }

      if (!this.getTotalTargetUserCount) {
        return 'At least one target user must be selected'
      }

      return ''
    },
    getTotalTargetUserCount() {
      let total = 0

      if (this.selectedCampaign) {
        if (this.formData.userWhoOpenedEmail) {
          total += this.selectedCampaign.scenarioStats.openedEmail
        }

        if (this.formData.userWhoClickedEmail) {
          total += this.selectedCampaign.scenarioStats.clickedEmail
        }

        if (this.formData.userWhoSubmittedData) {
          total += this.selectedCampaign.scenarioStats.submittedEmail
        }

        if (this.formData.userWhoDownloadedAttachment) {
          total += this.selectedCampaign.scenarioStats.attachmentOpenedEmail
        }
        if (this.formData.userWhoReportedAsSuspicious) {
          total += this.selectedCampaign.scenarioStats.reportedEmail
        }
      }

      return total
    }
  },
  created() {
    this.callForTargetGroups()
  },
  watch: {
    selectedRadioGroupIndex(val) {
      if (val === 0) {
        this.totalTargetUserCount = 0
        this.formData.userWhoOpenedEmail = false
        this.formData.userWhoClickedEmail = false
        this.formData.userWhoSubmittedData = false
        this.formData.userWhoDownloadedAttachment = false
        this.formData.userWhoReportedAsSuspicious = false
        this.formData.campaignResourceId = ''
        this.methodTypeId = ''
        this.selectedCampaign = null
      } else {
        this.formData.targetGroupResourceIds = []
        this.$refs?.refTargetGroups?.$refs?.refGroupTable?.$refs?.refTable?.resetSelectableParams?.()
      }
    },
    getTotalTargetUserCount(val) {
      this.totalTargetUserCount = val
    }
  },
  methods: {
    handleTableSelectionChange(items) {
      this.selectedTargetGroups = items
      this.formData.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: null
        }))
    },
    callForTargetGroups() {
      searchAllTargetGroups(this.axiosPayloadOfTargetGroups).then((response) => {
        if (this.initial) {
          this.responseOfTargetGroupsItems = response
        }
        this.initial = false
      })
    },
    handleCampaignChange(item) {
      this.selectedCampaign = item
      this.methodTypeId = item.methodTypeId
      if (this.methodTypeId === 3) {
        this.formData.userWhoClickedEmail = false
      }
      if (this.methodTypeId !== 2) {
        this.formData.userWhoSubmittedData = false
      }
      if (this.methodTypeId !== 3) {
        this.formData.userWhoDownloadedAttachment = false
      }
      this.formData.campaignResourceId = item.resourceId
    },
    checkboxSelectionChange() {
      this.targetUserCheckboxSelectionError = false
    }
  }
}
</script>
