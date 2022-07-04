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
      <SendTrainingSelectUsersByCampaign
        :value="formData.campaignResourceId"
        @on-item-change="handleCampaignChange"
      />
      <FormGroup
        style="max-width: 640px;"
        :title="labels.TargetUsers"
        :sub-title="labels.SendTrainingTargetUsersSub"
      >
        <div>
          <v-checkbox
            v-model="formData.excludeFromReports"
            id="input--campaign-manager-advanced-settings-exclude-from-reports"
            color="#2196f3"
          >
            <template #label> Exclude from reports</template>
          </v-checkbox>
          <v-checkbox
            v-model="formData.sendOnlyActiveUsers"
            id="input--campaign-manager-advanced-settings-only-active-users"
            color="#2196f3"
            :disabled="!isUsersOnline"
          >
            <template #label> Send only to active users on phishing reporter add-in</template>
          </v-checkbox>
          <div class="campaign-manager-advanced-settings__other-settings-last">
            <v-checkbox
              v-model="formData.sendRandomlyUsers"
              id="input--campaign-manager-advanced-settings-randomly-selected"
              color="#2196f3"
              hide-details
            >
            </v-checkbox>
            <span>Send this campaign to randomly selected</span>
            <v-text-field
              v-model="formData.sendRandomlyUsersCount"
              v-mask="'#######'"
              id="input--campaign-manager-advanced-settings-other-settings-number"
              placeholder="Enter number"
              outlined
              class="edit-name-textfield edit-select standard-height ml-2 absolute-text-input-error"
              style="max-width: 64px;"
              :disabled="getDisabledStatusOfRandomlySelected"
              :rules="[...rules.number, userCountValidation]"
            ></v-text-field>
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
              @change="validateForm"
            />
            <span class="ml-2">of target users</span>
          </div>
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
      isShowTargetGroupUsersError: false,
      isTargetGroupsValid: true,
      responseOfTargetGroupsItems: null,
      formData: {
        targetGroupResourceIds: [],
        campaignResourceId: ''
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
    },
    handleCampaignChange(item) {
      this.formData.campaignResourceId = item.resourceId
    }
  }
}
</script>
