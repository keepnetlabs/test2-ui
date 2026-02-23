<template>
  <Fragment>
    <UnlinkIntegrationModal
      :status="isUnlinkModalVisible"
      :isActionButtonDisabled="isButtonsDisabled"
      @on-close="handleCloseUnlinkModal"
      @on-confirm="handleConfirmUnlink"
    />
    <StopSyncronizationModal
      :status="isStopSyncModalVisible"
      :isActionButtonDisabled="isButtonsDisabled"
      @on-close="handleCloseStopSyncModal"
      @on-confirm="handleConfirmStopSync"
    />
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div v-else class="google-user-provisioning">
      <CompanySettingsHeader
        title="Google User Provisioning"
        sub-title="Manage google user provisioning configurations"
      />
      <AlertBox
        v-if="isSomethingWentWrong"
        class="alert-box--error mb-6"
        icon-color="#B83A3A"
        icon-name="mdi-information"
        text="Something went wrong. Please try again and if problem still persists reach support."
        :slots="{ primaryAction: false, secondaryAction: false }"
      />
      <v-form lazy-validation ref="refForm">
        <FormGroup
          title="1. Integrate your Google Workspace"
          sub-title="Authorize your Google Workspace account with Keepnet"
          :class="[isLinked && 'mb-6']"
        >
          <VBtn
            v-if="!isLinked"
            color="#2196f3"
            class="clustered-table-back-btn"
            outlined
            rounded
            @click="handleConnectToGoogle"
          >
            <span>CONNECT TO GOOGLE</span>
          </VBtn>
          <VBtn
            v-else
            color="#F56C6C"
            class="clustered-table-back-btn"
            outlined
            rounded
            @click="handleUnlinkIntegration"
          >
            <span v-if="isLinked" style="text-transform: none;">Unlink integration</span>
          </VBtn>
        </FormGroup>
        <template v-if="isLinked">
          <FormGroup
            title="2. Select Sync Source"
            sub-title="Specify where to search for users to sync"
            class="mb-4"
            :style="syncControlStyle"
          >
            <VRadioGroup
              v-model="formValues.provisioningConfig.source"
              row
              class="mt-2 mb-3 pt-0"
              hide-details
            >
              <VRadio
                color="#2196f3"
                label="Sync Organizational Units (OU)"
                :value="SYNC_SOURCE_TYPES.ORGANIZATION"
              />
              <VRadio color="#2196f3" label="Sync Groups" :value="SYNC_SOURCE_TYPES.GROUP" />
            </VRadioGroup>
          </FormGroup>
          <FormGroup
            :title="getSelectGroupsTitle"
            :sub-title="getSelectGroupsSubTitle"
            class="mb-2"
            :style="syncControlStyle"
          >
            <KSelect
              v-if="formValues.provisioningConfig.source === SYNC_SOURCE_TYPES.GROUP"
              v-model="formValues.provisioningConfig.selected"
              type="select"
              placeholder="Select groups"
              multiple
              dense
              deletable-chips
              autocomplete="off"
              chips
              outlined
              class="pop-up-card__invite-member"
              persistent-hint
              position="bottom"
              item-value="id"
              item-text="name"
              :item-disabled="handleGroupItemDisabled"
              :slots="{ item: true, selection: true }"
              :menu-props="{
                contentClass: 'scheduled-reports-send-to-target-group-menu',
                auto: true
              }"
              :items="groupOptions"
              :rules="[(v) => !!v.length || labels.Required]"
              @input="handleSelectedGroupsChange"
            >
              <template #selection="data">
                <span v-if="isAllGroupsSelected" v-show="data.index === 0">All Groups</span>
                <v-chip
                  v-else
                  v-show="!isAllGroupsSelected"
                  v-bind="data.attrs"
                  close
                  small
                  :key="JSON.stringify(data.item)"
                  :input-value="data.selected"
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template #item="data">
                <div v-if="data.item.name !== 'All Groups'">
                  <div
                    :class="[
                      'mail-configuration-select-sources__item-container',
                      {
                        'mail-configuration-select-sources__item-container--disabled': isAllGroupsSelected
                      }
                    ]"
                  >
                    <v-checkbox
                      hide-details
                      class="mt-n1"
                      :disabled="isAllGroupsSelected"
                      :input-value="isGroupSelected(data.item.id)"
                    />
                    <div class="mail-configuration-select-sources__item">
                      <div class="mail-configuration-select-sources__item-left">
                        {{ data.item.name }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div
                    :class="[
                      'mail-configuration-select-sources__item-container',
                      {
                        'mail-configuration-select-sources__item-container--disabled': isAllGroupsSelected
                      }
                    ]"
                  >
                    <v-checkbox hide-details class="mt-n1" :input-value="isAllGroupsSelected" />
                    <div class="mail-configuration-select-sources__item">
                      <div class="mail-configuration-select-sources__item-left">
                        {{ data.item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </KSelect>
            <KSelect
              v-else
              v-model="formValues.provisioningConfig.selected"
              type="select"
              placeholder="Select organizational units"
              multiple
              dense
              deletable-chips
              autocomplete="off"
              small-chips
              outlined
              class="pop-up-card__invite-member"
              persistent-hint
              position="bottom"
              item-value="id"
              item-text="name"
              :item-disabled="handleOrganizationItemDisabled"
              :slots="{ item: true, selection: true }"
              :menu-props="{
                contentClass: 'scheduled-reports-send-to-target-group-menu',
                auto: true
              }"
              :items="organizationOptions"
              :rules="[(v) => !!v.length || labels.Required]"
              @input="handleSelectedOrganizationsChange"
            >
              <template #selection="data">
                <span v-if="isAllOrganizationsSelected" v-show="data.index === 0"
                  >All Organizational Units</span
                >
                <v-chip
                  v-else
                  v-show="!isAllOrganizationsSelected"
                  v-bind="data.attrs"
                  close
                  small
                  :key="JSON.stringify(data.item)"
                  :input-value="data.selected"
                  @click:close="data.parent.selectItem(data.item)"
                >
                  {{ data.item.name }}
                </v-chip>
              </template>
              <template #item="data">
                <div v-if="data.item.name !== 'All Organizational Units'">
                  <div
                    :class="[
                      'mail-configuration-select-sources__item-container',
                      {
                        'mail-configuration-select-sources__item-container--disabled': isAllOrganizationsSelected
                      }
                    ]"
                  >
                    <v-checkbox
                      hide-details
                      class="mt-n1"
                      :disabled="isAllOrganizationsSelected"
                      :input-value="isOrganizationSelected(data.item.id)"
                    />
                    <div class="mail-configuration-select-sources__item">
                      <div class="mail-configuration-select-sources__item-left">
                        {{ data.item.name }}
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else>
                  <div
                    :class="[
                      'mail-configuration-select-sources__item-container',
                      {
                        'mail-configuration-select-sources__item-container--disabled': isAllOrganizationsSelected
                      }
                    ]"
                  >
                    <v-checkbox
                      hide-details
                      class="mt-n1"
                      :input-value="isAllOrganizationsSelected"
                    />
                    <div class="mail-configuration-select-sources__item">
                      <div class="mail-configuration-select-sources__item-left">
                        {{ data.item.name }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </KSelect>
          </FormGroup>
          <div :style="syncControlStyle">
            <FormGroup
              style="max-width: unset;"
              title="4. Select Sync Method"
              sub-title="Select how you’d like to synchronize users"
              :class="
                formValues.provisioningConfig.sync.method === SYNC_METHOD_TYPES.SOURCE_GROUP
                  ? 'mb-2'
                  : 'mb-6'
              "
            >
              <VRadioGroup
                v-model="formValues.provisioningConfig.sync.method"
                row
                class="mt-2 mb-3 pt-0"
                hide-details
              >
                <VRadio
                  color="#2196f3"
                  label="Sync all users to target users"
                  :value="SYNC_METHOD_TYPES.TARGET_USER"
                />
                <VRadio
                  color="#2196f3"
                  label="Sync all users to a target group"
                  :value="SYNC_METHOD_TYPES.TARGET_GROUP"
                />
                <VRadio
                  color="#2196f3"
                  label="Sync users and create matching group"
                  :value="SYNC_METHOD_TYPES.SOURCE_GROUP"
                />
              </VRadioGroup>
            </FormGroup>
            <FormGroup
              v-if="formValues.provisioningConfig.sync.method === SYNC_METHOD_TYPES.TARGET_GROUP"
              title="Select Target Group"
              sub-title="All users from your Google Workspace will be added to this group"
              class="mb-6"
            >
              <InputTargetGroup
                v-model.trim="formValues.provisioningConfig.sync.details"
                ref="inputTargetGroup"
                clearable
                placeholder="Select a target group"
                :manipulate-items="handleManipulateItems"
                :payload="targetGroupPayload"
              />
            </FormGroup>
            <template
              v-if="formValues.provisioningConfig.sync.method === SYNC_METHOD_TYPES.SOURCE_GROUP"
            >
              <AlertBox
                class="mb-2"
                icon-color="#B6791D"
                icon-name="mdi-information"
                text="Users and groups under the selected organizational units will be created."
                :slots="{ primaryAction: false, secondaryAction: false }"
              />
              <div v-if="false" class="google-user-provisioning__matching-groups mb-6">
                <div
                  v-for="(group, index) in getMatchingGroupOptions"
                  :key="index"
                  class="google-user-provisioning__matching-groups__group"
                >
                  {{ group.name }}
                </div>
              </div>
            </template>
          </div>
          <div class="d-flex align-center">
            <VBtn
              v-if="!formValues.enableProvisioning"
              outlined
              rounded
              color="#2196f3"
              @click="handleStartSync"
            >
              <span style="font-weight: 600;">Start sync</span>
            </VBtn>
            <template v-else>
              <VBtn outlined rounded color="#F56C6C" class="mr-4" @click="handleStopSync">
                <span style="font-weight: 600;">Stop sync</span>
              </VBtn>
              <VTooltip :disabled="!formValues.isSyncing" bottom>
                <template #activator="{ on }">
                  <VBtn
                    v-on="on"
                    id="google-user-provisioning__sync-now-button"
                    outlined
                    rounded
                    color="#00BCD4"
                    :disabled="formValues.isSyncing"
                    @click="handleSyncAgain"
                  >
                    <span style="font-weight: 600;">Sync Now</span>
                  </VBtn>
                </template>
                <span
                  >Users are currently syncing. “Sync Now” will be available once the process is
                  complete.</span
                >
              </VTooltip>
            </template>
            <div class="ml-6">
              <v-icon color="#757575" class="mr-2">mdi-alert-circle</v-icon>
              <span style="font-size: 14px; font-weight: 600; color: #757575;"
                >Synchronization occurs every 24 hours.</span
              >
            </div>
          </div>
        </template>
      </v-form>
    </div>
  </Fragment>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import AlertBox from '@/components/AlertBox'
import {
  getGoogleAuthorizeLink,
  submitGoogleUserProvisioningInformation,
  unlinkGoogleUserProvisioning,
  getGoogleUserProvisioning,
  getGoogleUserProvisioningGroups,
  getGoogleUserProvisioningOrganizationUnits,
  syncGoogleUserProvisioning,
  manuallySyncGoogleUserProvisioning,
  stopSyncGoogleUserProvisioning
} from '@/api/googleUserProvisioning'
import { SYNC_METHOD_TYPES, SYNC_SOURCE_TYPES } from './utils'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { Fragment } from 'vue-frag'
import UnlinkIntegrationModal from './UnlinkIntegrationModal.vue'
import StopSyncronizationModal from './StopSyncronizationModal.vue'
import labels from '@/model/constants/labels'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getDefaultAxiosPayload } from '@/utils/functions'
import InputTargetGroup from '@/components/Common/Inputs/InputTargetGroup'
const defaultFormValues = {
  googleOAuthResourceId: '',
  provisioningConfig: {
    source: SYNC_SOURCE_TYPES.ORGANIZATION,
    selected: ['All_wiOrAv9C'],
    sync: {
      method: SYNC_METHOD_TYPES.TARGET_USER,
      details: []
    }
  },
  enableProvisioning: false,
  provisioningResourceId: '',
  isSyncing: false,
  groupsOfOrgUnit: []
}
export default {
  name: 'GoogleUserProvisioning',
  components: {
    InputTargetGroup,
    CompanySettingsHeader,
    FormGroup,
    AlertBox,
    Fragment,
    DatatableLoading,
    UnlinkIntegrationModal,
    StopSyncronizationModal,
    KSelect
  },
  data() {
    return {
      labels,
      isUnlinkModalVisible: false,
      isStopSyncModalVisible: false,
      SYNC_METHOD_TYPES,
      SYNC_SOURCE_TYPES,
      isButtonsDisabled: false,
      isLoading: true,
      isSomethingWentWrong: false,
      isLinked: false,
      groupOptions: [],
      organizationOptions: [],
      targetGroupOptions: [],
      formValues: { ...defaultFormValues },
      interval: null,
      targetGroupPayload: getDefaultAxiosPayload({
        filter: {
          Condition: 'AND',
          FilterGroups: [
            {
              Condition: 'OR',
              FilterItems: [
                {
                  Value: 'false',
                  FieldName: 'isscimgroup',
                  Operator: 'Include'
                },
                {
                  Value: 'false',
                  FieldName: 'isgooglegroup',
                  Operator: 'Include'
                }
              ],
              FilterGroups: []
            },
            {
              Condition: 'OR',
              FilterItems: [],
              FilterGroups: []
            }
          ]
        },
        selectTargetUserResourceIds: ''
      })
    }
  },
  computed: {
    isSynced() {
      return !!this.formValues.enableProvisioning && !!this.formValues.provisioningResourceId
    },
    syncControlStyle() {
      return {
        opacity: this.isSynced ? '56%' : '100%',
        pointerEvents: this.isSynced ? 'none' : 'all'
      }
    },
    getMatchingGroupOptions() {
      if (this.formValues.provisioningConfig.source === SYNC_SOURCE_TYPES.GROUP) {
        if (this.isAllGroupsSelected) {
          return this.groupOptions.slice(1)
        } else {
          return this.groupOptions.filter((item) =>
            this.formValues.provisioningConfig.selected.includes(item.id)
          )
        }
      } else if (this.isAllOrganizationsSelected) {
        return this.organizationOptions.slice(1)
      } else {
        return this.organizationOptions.filter((item) =>
          this.formValues.provisioningConfig.selected.includes(item.id)
        )
      }
    },
    isAllGroupsSelected() {
      return (
        this.formValues?.provisioningConfig?.source === SYNC_SOURCE_TYPES.GROUP &&
        this.formValues?.provisioningConfig?.selected?.includes?.('All_EeMkZ7dF')
      )
    },
    isAllOrganizationsSelected() {
      return (
        this.formValues?.provisioningConfig?.source === SYNC_SOURCE_TYPES.ORGANIZATION &&
        this.formValues?.provisioningConfig?.selected?.includes?.('All_wiOrAv9C')
      )
    },
    getAllGroupsIcon() {
      if (this.isAllGroupsSelected) return 'mdi-checkbox-marked'
      return 'mdi-checkbox-blank-outline'
    },
    getAllOrganizationsIcon() {
      if (this.isAllOrganizationsSelected) return 'mdi-checkbox-marked'
      return 'mdi-checkbox-blank-outline'
    },
    getSelectGroupsTitle() {
      if (this.formValues.provisioningConfig.source === SYNC_SOURCE_TYPES.GROUP) {
        return `3. Select Groups`
      }
      return `3. Select Organizational Units`
    },
    getSelectGroupsSubTitle() {
      if (this.formValues.provisioningConfig.source === SYNC_SOURCE_TYPES.GROUP) {
        return `Pick the groups you’d like to sync from the dropdown menu`
      }
      return `Pick the organizational units you’d like to sync from the dropdown menu`
    }
  },
  created() {
    if (!this.$route?.query?.code) {
      this.callForData()
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  watch: {
    '$route.query': {
      deep: true,
      immediate: true,
      handler(val) {
        if (!!val?.code && !!val?.state) {
          const { code, state } = val
          const payload = { code, state }
          submitGoogleUserProvisioningInformation(payload)
            .then((res) => {
              if (res?.data?.data?.resourceId) {
                this.$router.replace('/company/company-settings')
                this.isSomethingWentWrong = false
                this.callForData()
              }
            })
            .catch((err) => {
              this.isSomethingWentWrong = true
              this.isLoading = false
            })
        }
      }
    },
    'formValues.isSyncing': {
      handler(val) {
        if (val) {
          this.interval = setInterval(this.callForDataWithoutLoading, 10000)
        }
        if (!val) {
          clearInterval(this.interval)
        }
      }
    }
  },
  methods: {
    handleManipulateItems(items = []) {
      return items.map(({ name, resourceId }) => ({
        text: name,
        value: resourceId
      }))
    },
    resetForm() {
      this.formValues = { ...defaultFormValues }
    },
    callForData() {
      this.isLoading = true
      getGoogleUserProvisioning()
        .then((res) => {
          this.isLinked = true
          this.formValues = { ...this.formValues, ...res.data.data }
          if (this.formValues.provisioningConfig.sync.method === SYNC_METHOD_TYPES.TARGET_GROUP) {
            this.formValues.provisioningConfig.sync.details = this.formValues.provisioningConfig.sync.details[0]
            this.targetGroupPayload.selectTargetUserResourceIds = this.formValues.provisioningConfig.sync.details
            this.$nextTick(() => {
              if (this.$refs.inputTargetGroup) this.$refs.inputTargetGroup.callForTargetGroups()
            })
          }
        })
        .then(this.callForGroups)
        .then(this.callForOrganizationalUnits)
        .finally(() => {
          this.isLoading = false
        })
    },
    callForDataWithoutLoading() {
      getGoogleUserProvisioning()
        .then((res) => {
          this.isLinked = true
          this.formValues = { ...this.formValues, ...res.data.data }
          if (this.formValues.provisioningConfig.sync.method === SYNC_METHOD_TYPES.TARGET_GROUP) {
            this.formValues.provisioningConfig.sync.details = this.formValues.provisioningConfig.sync.details[0]
          }
        })
        .then(this.callForGroups)
        .then(this.callForOrganizationalUnits)
    },
    callForGroups() {
      getGoogleUserProvisioningGroups().then((res) => {
        this.groupOptions = res?.data?.data || []
      })
    },
    callForOrganizationalUnits() {
      getGoogleUserProvisioningOrganizationUnits().then((res) => {
        this.organizationOptions = res?.data?.data || []
      })
    },
    handleConnectToGoogle() {
      this.isButtonsDisabled = true
      getGoogleAuthorizeLink()
        .then((res) => {
          if (res?.data?.data) globalThis.location = res.data.data
        })
        .finally(() => {
          this.isButtonsDisabled = false
        })
    },
    handleStartSync() {
      if (this.$refs.refForm.validate()) {
        this.isButtonsDisabled = true
        if (this.formValues.provisioningConfig.sync.method === SYNC_METHOD_TYPES.TARGET_GROUP) {
          this.formValues.provisioningConfig.sync.details = [
            this.formValues.provisioningConfig.sync.details
          ]
        } else {
          this.formValues.provisioningConfig.sync.details = []
        }
        syncGoogleUserProvisioning(this.formValues)
          .then(() => {
            this.callForData()
          })
          .finally(() => {
            this.isButtonsDisabled = false
          })
      }
    },
    handleSyncAgain() {
      this.isButtonsDisabled = true
      manuallySyncGoogleUserProvisioning({
        provisioningResourceId: this.formValues.provisioningResourceId
      })
        .then(this.callForData)
        .finally(() => {
          this.isButtonsDisabled = false
        })
    },
    handleUnlinkIntegration() {
      this.isUnlinkModalVisible = true
    },
    handleCloseUnlinkModal() {
      this.isUnlinkModalVisible = false
    },
    handleConfirmUnlink() {
      this.isButtonsDisabled = true
      unlinkGoogleUserProvisioning()
        .then((res) => {
          this.isLinked = false
          this.handleCloseUnlinkModal()
        })
        .then(this.resetForm)
        .finally(() => {
          this.isButtonsDisabled = false
        })
    },
    handleStopSync() {
      this.isStopSyncModalVisible = true
    },
    handleCloseStopSyncModal() {
      this.isStopSyncModalVisible = false
    },
    handleConfirmStopSync() {
      this.isButtonsDisabled = true
      stopSyncGoogleUserProvisioning({
        provisioningResourceId: this.formValues.provisioningResourceId
      })
        .then(() => {
          this.handleCloseStopSyncModal()
          this.callForData()
        })
        .then(this.resetForm)
        .finally(() => {
          this.isButtonsDisabled = false
        })
    },
    handleSelectedGroupsChange(selectedGroups) {
      if (selectedGroups.includes('All_EeMkZ7dF')) {
        this.formValues.provisioningConfig.selected = ['All_EeMkZ7dF']
      } else {
        this.formValues.provisioningConfig.selected = selectedGroups
      }
    },
    handleSelectedOrganizationsChange(selectedOrganizations) {
      if (selectedOrganizations.includes('All_wiOrAv9C')) {
        this.formValues.provisioningConfig.selected = ['All_wiOrAv9C']
      } else {
        this.formValues.provisioningConfig.selected = selectedOrganizations
      }
    },
    handleGroupItemDisabled(item) {
      if (this.isAllGroupsSelected) {
        return item.name !== 'All Groups'
      } else {
        return false
      }
    },
    handleOrganizationItemDisabled(item) {
      if (this.isAllOrganizationsSelected) {
        return item.name !== 'All Organizational Units'
      } else return false
    },
    isGroupSelected(id) {
      return this.isAllGroupsSelected || this.formValues.provisioningConfig.selected.includes(id)
    },
    isOrganizationSelected(id) {
      return (
        this.isAllOrganizationsSelected || this.formValues.provisioningConfig.selected.includes(id)
      )
    }
  }
}
</script>
