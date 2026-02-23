<template>
  <AppModal
    :status="status"
    title-id="text--add-or-edit-ldap-modal-title"
    icon-name="mdi-email"
    :title="labels.LDAPModalTitle"
    @closeOverlay="handleClose"
  >
    <template #overlay-body>
      <v-stepper v-model="step" class="k-stepper">
        <v-stepper-header class="k-stepper__header">
          <v-stepper-step
            id="step--target-user-add-or-edit-modal-campaign-info"
            class="k-stepper__step"
            :complete="step > 1"
            :step="1"
            >{{ labels.SyncOptions }}
          </v-stepper-step>
          <v-divider class="k-stepper__divider" />
          <v-stepper-step
            id="step--target-user-ldap-add-or-edit-modal-advanced-settings"
            class="k-stepper__step"
            :complete="step > 2"
            :step="2"
            >{{ labels.SelectUsers }}
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items class="k-stepper__items">
          <v-stepper-content class="k-stepper__content" :step="1">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.SyncOptions"
              :subtitle="labels.SyncOptionsSub"
            />
            <TargetUserLDAPImportModalStep1
              ref="refStep1"
              :selected-l-d-a-p-items.sync="selectedLDAPItems"
              :is-l-d-a-p-groups-valid.sync="isLDAPGroupsValid"
              :step1-target-group-resource-id.sync="step1TargetGroupResourceId"
              :step1-step.sync="step1Step"
            />
          </v-stepper-content>
          <v-stepper-content class="k-stepper__content" :step="2">
            <ConfigureCompanyStepHeader
              class="mb-8"
              :title="labels.SelectUsers"
              :subtitle="labels.LDAPImportModalStep2Subtitle"
            />
            <TargetUserLDAPImportModalStep2
              v-if="step === 2"
              ref="refStep2"
              :selected-l-d-a-p-items="selectedLDAPItems"
              :step1-step="step1Step"
              :step2-step.sync="step2Step"
              :is-loading.sync="isStep2Loading"
              @on-error="step -= 1"
            />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </template>
    <template #overlay-footer>
      <TargetUserLDAPModalStepperFooter
        :step.sync="step"
        :selected-items-count="getSelectedUsersLength"
        :total-number-of-records="totalNumberOfRecords"
        :selected-radio-step="step2Step"
        :is-submit-disabled="isSubmitDisabled"
        :is-next-button-disabled="isNextButtonDisabled"
        :is-step2-loading="isStep2Loading"
        max-step="2"
        @on-cancel="handleClose"
        @validate-step1="handleValidateStep1"
        @on-import-all="submit(0)"
        @on-import-selected="submit(1)"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import labels from '@/model/constants/labels'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import TargetUserLDAPModalStepperFooter from '@/components/TargetUsers/LDAP/TargetUserLDAPModalStepperFooter'
import TargetUserLDAPImportModalStep1 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep1'
import TargetUserLDAPImportModalStep2 from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModalStep2'
import LDAPService from '@/api/ldap'
import { getDefaultAxiosPayload, getDefaultFilter } from '@/utils/functions'
export default {
  name: 'TargetUserLDAPImportModal',
  components: {
    TargetUserLDAPImportModalStep2,
    TargetUserLDAPImportModalStep1,
    TargetUserLDAPModalStepperFooter,
    ConfigureCompanyStepHeader,
    AppModal
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    resourceId: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: null
    },
    fieldMappings: {
      type: Array,
      default: () => []
    },
    customFields: {
      type: Array,
      default: () => []
    }
  },
  emits: ['on-close'],
  provide() {
    return {
      resourceId: this.resourceId,
      fieldMappings: this.fieldMappings,
      customFields: this.customFields,
      isEdit: this.isEdit,
      setTotalNumberOfRecords: (val) => {
        if (!this.totalNumberOfRecords) this.totalNumberOfRecords = val
      },
      setSelectedUsers: (val) => (this.selectedUsers = val),
      getEditedScheduledFilter: () => this.editedScheduledFilter,
      handleServerSideSelectionParams: (serverSideSelectionParams) =>
        (this.serverSideSelectionParams = serverSideSelectionParams),
      getServerSideSelectionParams: () => this.serverSideSelectionParams
    }
  },
  data() {
    return {
      labels,
      step: 1,
      isSubmitDisabled: false,
      selectedLDAPItems: [],
      totalNumberOfRecords: 0,
      selectedUsers: [],
      editedScheduledFilter: null,
      isLDAPGroupsValid: true,
      step1TargetGroupResourceId: '',
      step1Step: 0,
      step2Step: 0,
      isStep2Loading: false,
      serverSideSelectionParams: {
        isSelectedAllEver: false,
        excludedResourceIdList: []
      },
      usersQueryFilter: getDefaultFilter()
    }
  },
  computed: {
    getSelectedUsersLength() {
      return this.selectedUsers.length
    },
    isNextButtonDisabled() {
      let comparator
      if (this.step1Step === 0) {
        comparator = this.isLDAPGroupsValid
      } else {
        comparator = this.serverSideSelectionParams?.isSelectedAllEver
          ? this.serverSideSelectionParams?.isSelectedAllEver
          : !!this.selectedLDAPItems?.length
      }
      return !comparator
    }
  },
  created() {
    if (this.isEdit && this?.selectedRow?.resourceId) {
      this.callForData()
    }
  },
  methods: {
    callForData() {
      LDAPService.getLDAPConfigDetail(this?.selectedRow?.resourceId).then((response) => {
        const {
          data: { data }
        } = response
        const {
          targetGroupResourceId,
          ldapSettingResourceId,
          filter,
          groupFilterValues,
          status
        } = data
        if (
          filter?.filterGroups?.[0]?.filterItems?.length ||
          filter?.filterGroups?.[1]?.filterItems?.length
        ) {
          this.step2Step = 0
        } else {
          this.step2Step = 1
        }
        this.editedScheduledFilter = filter?.filterGroups?.length
          ? filter
          : getDefaultAxiosPayload().filter

        this.$refs.refStep1.targetGroupResourceId = targetGroupResourceId
        this.$refs.refStep1.isActive = Boolean(status)
        this.selectedRow.ldapSettingResourceId = ldapSettingResourceId
        const index = groupFilterValues?.length ? 1 : 0
        this.$refs.refStep1.selectedRadioGroupIndex = index
        if (index)
          this.$nextTick(() => {
            this.$refs.refStep1.$refs.refImportTable.initialGroupFilterValues = groupFilterValues
          })
      })
    },
    handleClose() {
      this.$emit('on-close')
    },
    handleValidateStep1(callback) {
      const step1 = this?.$refs?.refStep1
      this.selectedUsers = []
      if (!((this.isEdit && [0, 1].includes(this.step2Step)) || [1, 2].includes(this.step2Step))) {
        this.totalNumberOfRecords = 0
      }
      if (!step1.validateForm()) {
        const comparator = this.serverSideSelectionParams?.isSelectedAllEver
          ? this.serverSideSelectionParams?.isSelectedAllEver
          : this.selectedLDAPItems?.length
        if (!comparator) {
          this.isLDAPGroupsValid = false
        }
      } else callback()
    },
    getPayloadFilter() {
      if (this.isEdit) {
        return this.step2Step === 0
          ? this?.$refs?.refStep2?.$refs?.refQuery?.getPayloadFilter()
          : getDefaultAxiosPayload().filter
      } else if (this.step2Step === 1) {
        return this?.$refs?.refStep2?.$refs?.refQuery?.getPayloadFilter()
      } else
        return this.step2Step === 2
          ? getDefaultAxiosPayload().filter
          : this?.$refs?.refStep2?.$refs?.refManually?.$refs?.refTable?.axiosPayload?.filter
    },
    submit(importType) {
      this.isSubmitDisabled = true
      const isSchedule = [1, 2].includes(this?.$refs?.refStep2?.step2Step) || this.isEdit
      const filter = this.getPayloadFilter()
      const payload = {
        ldapSettingResourceId: this.resourceId,
        targetGroupResourceId: this?.$refs?.refStep1?.targetGroupResourceId || '',
        transactionId: this?.$refs?.refStep2?.transactionId,
        importType,
        groupFilterValues: this?.$refs?.refStep2?.groupFilterValues,
        filter,
        isSchedule,
        selectAll: this.serverSideSelectionParams?.isSelectedAllEver || false,
        excludedItems: this.serverSideSelectionParams?.excludedResourceIdList || []
      }
      //that mean partial import
      if (importType === 1) {
        payload.selectedUserResourceIds = this.selectedUsers.map((user) => user.resourceId)
      }
      if (
        (this.isEdit ? this.step2Step === 0 : this.step2Step === 1) &&
        !this?.$refs?.refStep2?.$refs?.refQuery?.$refs?.refForm?.validate()
      ) {
        this.isSubmitDisabled = false
        return
      }
      if (this.isEdit) {
        payload.status = Number(this?.$refs?.refStep1?.isActive)
      }

      if (!this.isEdit) {
        LDAPService.createLDAPConfig(payload)
          .then(() => {
            this.handleClose()
            this.$emit('on-close-with-update')
          })
          .finally(() => {
            this.isSubmitDisabled = false
          })
      } else {
        LDAPService.updateLDAPSchedule(payload, this.selectedRow?.resourceId).then(() => {
          this.$emit('on-close-with-update')
        })
      }
    }
  }
}
</script>
