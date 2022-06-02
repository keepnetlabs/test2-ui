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
            >{{ labels.SelectGroups }}
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
              :title="labels.Groups"
              :subtitle="labels.LDAPImportModalStep1Subtitle"
            />
            <TargetUserLDAPImportModalStep1
              ref="refStep1"
              :selected-l-d-a-p-items.sync="selectedLDAPItems"
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
              :selected-radio-step.sync="selectedRadioGroupIndex"
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
        :selected-radio-step="selectedRadioGroupIndex"
        :is-submit-disabled="isSubmitDisabled"
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
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getDefaultFilter } from '@/utils/functions'
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
      setTotalNumberOfRecords: (val) => (this.totalNumberOfRecords = val),
      setSelectedUsers: (val) => (this.selectedUsers = val),
      setViewUsersQuery: (val) => (this.usersQueryFilter = val)
    }
  },
  data() {
    return {
      labels,
      step: 1,
      isSubmitDisabled: false,
      selectedLDAPItems: [],
      totalNumberOfRecords: 0,
      selectedRadioGroupIndex: 0,
      selectedUsers: [],
      usersQueryFilter: getDefaultFilter()
    }
  },
  computed: {
    getSelectedUsersLength() {
      return this.selectedUsers.length
    }
  },
  created() {
    if (this.isEdit && this?.selectedRow?.resourceId) {
      this.callForData()
    }
  },
  methods: {
    callForData() {
      LDAPService.getLDAPConfigDetail(this?.selectedRow?.resourceId).then((response) => {})
    },
    handleClose() {
      this.$emit('on-close')
    },
    handleValidateStep1(callback) {
      const step1 = this?.$refs?.refStep1
      this.selectedRadioGroupIndex = 0
      this.selectedUsers = []
      this.totalNumberOfRecords = 0
      if (!step1.validateForm()) {
        if (!this.selectedLDAPItems?.length) {
          step1.isLDAPGroupsValid = false
        }
      } else callback()
    },
    submit(importType) {
      this.isSubmitDisabled = true
      const payload = {
        ldapSettingResourceId: this.resourceId,
        targetGroupResourceId: this?.$refs?.refStep1?.targetGroupResourceId || '',
        transactionId: this?.$refs?.refStep2?.transactionId,
        importType,
        groupFilterValues: this?.$refs?.refStep2?.groupFilterValues,
        filter:
          this?.$refs?.refStep2?.selectedRadioGroupIndex === 1
            ? this.usersQueryFilter
            : this?.$refs?.refStep2?.$refs?.refManually?.$refs?.refTable?.axiosPayload?.filter,
        isSchedule: this?.$refs?.refStep2?.selectedRadioGroupIndex === 1
      }
      //that mean partial import
      if (importType === 1) {
        payload.selectedUserResourceIds = this.selectedUsers.map((user) => user.resourceId)
      }
      LDAPService.createLDAPConfig(payload)
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            message: `Import process has been started`,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-information'
          })
          this.handleClose()
        })
        .finally(() => {
          this.isSubmitDisabled = false
        })
    }
  }
}
</script>
