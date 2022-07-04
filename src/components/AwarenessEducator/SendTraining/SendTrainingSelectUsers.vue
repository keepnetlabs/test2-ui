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
      />
      <CustomError
        class="mb-6 ml-2"
        style="margin-top: 2px;"
        :is-valid="isTargetGroupsValid"
        :error-message="getTargetGroupErrorMessage"
      />
    </div>
    <div v-show="selectedRadioGroupIndex === 1">
      <FormGroup :title="labels.PhishingCampaigns" :sub-title="labels.PhishingCampaignsSub">
      </FormGroup>
      <SendTrainingSelectUsersByCampaign />
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
      isShowTargetGroupUsersError: false,
      isTargetGroupsValid: true,
      responseOfTargetGroupsItems: null,
      formData: {
        targetGroupResourceIds: []
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
    callForTargetGroups() {
      searchTargetGroups(this.axiosPayloadOfTargetGroups).then((response) => {
        if (this.initial) {
          this.responseOfTargetGroupsItems = response
        }
        this.initial = false
      })
    }
  }
}
</script>
