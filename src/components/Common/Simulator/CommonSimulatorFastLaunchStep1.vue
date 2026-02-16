<template>
  <v-form ref="refForm">
    <CampaignManagerCampaignInfo
      ref="refCampaignManagerCampaignInfo"
      :show-duration="false"
      :show-phishing-scenarios="false"
      :show-schedule="false"
      :show-mark-as-test="false"
      @initialFormValues="getInitialFormValues"
    />
    <CampaignManagerTargetAudience
      ref="refCampaignManagerTargetAudience"
      :show-checkboxes="false"
      :selected-target-groups.sync="selectedTargetGroups"
      :selected-target-groups-mapped.sync="selectedTargetGroupsMapped"
      :form-details="formDetails"
      :is-phishing="isPhishing"
      :isMFAScenarioSelected="isMFAScenarioSelected"
    />
    <div>
      <FormGroup :title="labels.MarkAsTest">
        <v-checkbox
          v-model="formData.excludeFromReports"
          id="input--campaign-manager-advanced-settings-exclude-from-reports"
          color="#2196f3"
        >
          <template #label>Exclude this campaign’s statistics from all generic reports</template>
        </v-checkbox>
      </FormGroup>
      <FormGroup style="max-width: 600px;" :title="labels.LimitRecipients">
        <div class="campaign-manager-advanced-settings__other-settings-last">
          <v-checkbox
            v-model="formData.sendRandomlyUsers"
            id="input--simulator-fast-launch-send-randomly"
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
      </FormGroup>
    </div>
  </v-form>
</template>

<script>
import labels from '@/model/constants/labels'
import CampaignManagerCampaignInfo from '@/components/CampaignManager/CampaignManagerInfo/CampaignManagerCampaignInfo'
import KSelect from '@/components/Common/Inputs/KSelect'
import CampaignManagerTargetAudience from '@/components/CampaignManager/TargetAudience/CampaignManagerTargetAudience.vue'
import FormGroup from '@/components/SmallComponents/FormGroup'

export default {
  name: 'CommonSimulatorFastLaunchStep1',
  components: {
    FormGroup,
    CampaignManagerTargetAudience,
    KSelect,
    CampaignManagerCampaignInfo
  },
  props: {
    formDetails: {
      type: Object
    },
    isMFAScenarioSelected: {
      type: Boolean,
      default: false
    },
    isPhishing: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      initialFormValues: {},
      selectedTargetGroups: [],
      selectedTargetGroupsMapped: [],
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
  },
  methods: {
    getInitialFormValues(values) {
      this.initialFormValues = JSON.parse(JSON.stringify({ ...this.formData, ...values }))
    },
    getCurrentFormValues() {
      return {
        ...this.formData,
        ...this.$refs.refCampaignManagerCampaignInfo.formData
      }
    }
  }
}
</script>
