<template>
  <v-form ref="refForm">
    <CampaignManagerCampaignInfo
      ref="refCampaignManagerCampaignInfo"
      :show-duration="false"
      :show-phishing-scenarios="false"
      :show-schedule="false"
    />
    <div>
      <v-checkbox
        v-model="formData.excludeFromReports"
        id="input--campaign-manager-advanced-settings-exclude-from-reports"
        color="#2196f3"
      >
        <template #label> Exclude from reports</template>
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
          v-mask="'###'"
          id="input--campaign-manager-advanced-settings-other-settings-number"
          placeholder="Enter number"
          outlined
          class="edit-name-textfield edit-select standard-height ml-2"
          hide-details
          style="max-width: 48px;"
          :disabled="getDisabledStatusOfRandomlySelected"
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
          position="top"
          :items="getRandomlySelectedItems"
          :disabled="getDisabledStatusOfRandomlySelected"
        />
        <span class="ml-2">of target users</span>
      </div>
    </div>
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo'
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'PhishingScenariosFastLaunchStep1',
  components: { KSelect, CampaignManagerCampaignInfo },
  props: {
    formDetails: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      formData: {
        excludeFromReports: false,
        sendRandomlyUsers: false,
        sendRandomlyUsersCount: 20,
        sendRandomlyUsersCalculateTypeId: '1'
      }
    }
  },
  computed: {
    getDisabledStatusOfRandomlySelected() {
      return !this.formData.sendRandomlyUsers
    },
    getRandomlySelectedItems() {
      return this.formDetails['sendRandomlyUsersCalculateTypes']
    }
  }
}
</script>
