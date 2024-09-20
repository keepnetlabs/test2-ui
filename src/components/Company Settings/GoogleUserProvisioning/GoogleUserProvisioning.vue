<template>
  <div class="google-user-provisioning">
    <CompanySettingsHeader
      title="Google User Provisioning"
      sub-title="Manage google user provisioning configurations"
    />
    <AlertBox
      class="alert-box--error mb-6"
      icon-color="#B83A3A"
      icon-name="mdi-information"
      text="Something went wrong. Please try again and if problem still persists reach support."
      :slots="{ primaryAction: false, secondaryAction: false }"
    />
    <FormGroup
      title="1. Integrate your Google Workspace"
      sub-title="Authorize your Google Workspace account with Keepnet"
      has-hint
      class="mb-6"
    >
      <VBtn
        :color="isLinked ? '#F56C6C' : '#2196f3'"
        class="clustered-table-back-btn"
        outlined
        rounded
        @click="handleToggleConnection"
      >
        <span v-if="isLinked" style="text-transform: none;">Unlink integration</span>
        <span v-else>CONNECT TO GOOGLE</span>
      </VBtn>
    </FormGroup>
    <FormGroup
      title="2. Select Sync Source"
      sub-title="Specify where to search for users to sync"
      has-hint
    >
      <VRadioGroup v-model="syncType" row class="mt-2 mb-3 pt-0" hide-details>
        <VRadio color="#2196f3" label="Sync Groups" value="groups" />
        <VRadio
          color="#2196f3"
          label="Sync Organizational Units (OU)"
          value="organizationalUnits"
        />
      </VRadioGroup>
    </FormGroup>
    <FormGroup :title="getSelectGroupsTitle" :sub-title="getSelectGroupsSubTitle" has-hint>
      <VRadioGroup v-model="syncType" row class="mt-2 mb-3 pt-0" hide-details>
        <VRadio color="#2196f3" label="Sync Groups" value="groups" />
        <VRadio
          color="#2196f3"
          label="Sync Organizational Units (OU)"
          value="organizationalUnits"
        />
      </VRadioGroup>
    </FormGroup>
    <FormGroup
      style="max-width: unset;"
      title="4. Select Sync Method"
      sub-title="Select how you’d like to synchronize users"
      has-hint
    >
      <VRadioGroup v-model="syncUsersTo" row class="mt-2 mb-3 pt-0" hide-details>
        <VRadio color="#2196f3" label="Sync all users to target users" value="targetUsers" />
        <VRadio color="#2196f3" label="Sync all users to a target group" value="targetGroup" />
        <VRadio
          color="#2196f3"
          label="Sync users and create matching group"
          value="matchingGroups"
        />
      </VRadioGroup>
    </FormGroup>
    <div class="d-flex align-center">
      <VBtn v-if="!isStartedSync" outlined rounded color="#2196f3" @click="handleStartSync">
        <span style="font-weight: 600;">Start sync</span>
      </VBtn>
      <template v-else>
        <VBtn outlined rounded color="#F56C6C" class="mr-4" @click="handleStopSync">
          <span style="font-weight: 600;">Start sync</span>
        </VBtn>
        <VBtn outlined rounded color="#00BCD4" @click="handleSyncAgain">
          <span style="font-weight: 600;">Sync Now</span>
        </VBtn>
      </template>
      <div class="ml-6">
        <v-icon color="#757575" class="mr-2">mdi-alert-circle</v-icon>
        <span style="font-size: 14px; font-weight: 600;"
          >Synchronization occurs every 24 hours.</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import AlertBox from '@/components/AlertBox'
export default {
  name: 'GoogleUserProvisioning',
  components: { CompanySettingsHeader, FormGroup, AlertBox },
  data() {
    return {
      isLinked: false,
      isStartedSync: false,
      syncType: 'groups',
      syncUsersTo: 'targetUsers'
    }
  },
  computed: {
    getSelectGroupsTitle() {
      if (this.syncType === 'groups') {
        return `3. Select Groups`
      }
      return `3. Select Organizational Units`
    },
    getSelectGroupsSubTitle() {
      if (this.syncType === 'groups') {
        return `Pick the groups you’d like to sync from the dropdown menu`
      }
      return `Pick the organizational units you’d like to sync from the dropdown menu`
    }
  },
  methods: {
    handleToggleConnection() {
      this.isLinked = !this.isLinked
    },
    handleStartSync() {
      this.isStartedSync = !this.isStartedSync
    },
    handleSyncAgain() {
      console.log('handleSyncAgain')
    },
    handleStopSync() {
      console.log('handleStopSync')
    }
  }
}
</script>
