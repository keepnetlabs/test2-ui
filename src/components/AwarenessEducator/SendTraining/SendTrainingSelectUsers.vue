<template>
  <v-form ref="refForm">
    <KButtonRadioGroup v-model="selectedRadioGroupIndex" class="mb-8" :items="radioGroupItems" />
    <div v-show="selectedRadioGroupIndex === 0">
      <FormGroup :title="labels.TargetUserGroups" :sub-title="labels.TargetUserGroupsSub">
      </FormGroup>
      <TargetGroups
        ref="refTargetGroups"
        class="mt-2"
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
          >
            <template #label>{{ labels.UserWhoOpenedEmail }}</template>
          </v-checkbox>
          <v-checkbox
            v-if="methodTypeId !== 3"
            v-model="formData.userWhoClickedEmail"
            id="input--send-training-user-who-clicked-email"
            color="#2196f3"
          >
            <template #label>{{ labels.UserWhoClickedEmail }}</template>
          </v-checkbox>
          <v-checkbox
            v-if="methodTypeId === 2"
            v-model="formData.userWhoSubmittedData"
            id="input--send-training-user-who-submitted-data"
            color="#2196f3"
          >
            <template #label>{{ labels.UserWhoSubmittedData }}</template>
          </v-checkbox>
          <v-checkbox
            v-if="methodTypeId === 3"
            v-model="formData.userWhoDownloadedAttachment"
            id="input--send-training-user-who-downloaded-attachment"
            color="#2196f3"
          >
            <template #label>{{ labels.UserWhoDownloadedAttachment }}</template>
          </v-checkbox>
          <v-checkbox
            v-model="formData.userWhoReportedAsSuspicious"
            id="input--send-training-user-who-reported-as-suspicious"
            color="#2196f3"
          >
            <template #label>{{ labels.UserWhoReportedAsSuspicious }}</template>
          </v-checkbox>
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
import { searchTargetGroups } from '@/api/targetUsers'
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
      labels,
      initial: true,
      selectedRadioGroupIndex: 0,
      totalTargetUserCount: 0,
      isShowTargetGroupUsersError: false,
      isTargetGroupsValid: true,
      responseOfTargetGroupsItems: null,
      methodTypeId: '',
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
        },
        {
          label: labels.ByCampaign
        }
      ],
      axiosPayloadOfTargetGroups: getDefaultAxiosPayload()
    }
  },
  computed: {
    getTargetGroupErrorMessage() {
      return this.formData.targetGroupResourceIds.length
        ? this.isShowTargetGroupUsersError
          ? 'Target groups must have at least 1 user'
          : 'Required'
        : 'Required'
    }
  },
  created() {
    this.callForTargetGroups()
  },
  methods: {
    handleTableSelectionChange(items) {
      this.formData.targetGroupResourceIds = items
        .filter((item) => item)
        .map((item) => ({
          text: item.text || item.name,
          value: item.value || item.resourceId,
          extraDatas: null
        }))
    },
    callForTargetGroups() {
      searchTargetGroups(this.axiosPayloadOfTargetGroups).then((response) => {
        if (this.initial) {
          this.responseOfTargetGroupsItems = response
        }
        this.initial = false
      })
    },
    handleCampaignChange(item) {
      debugger
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
    }
  }
}
</script>
