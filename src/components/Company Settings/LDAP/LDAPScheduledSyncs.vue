<template>
  <div>
    <TargetUserLDAPImportModal
      v-if="isShowImportLDAPModal"
      is-edit
      :status="isShowImportLDAPModal"
      :resource-id="resourceId"
      :selected-row="selectedRow"
      :custom-fields="customFields"
      :field-mappings="fieldMappings"
      @on-close="toggleImportLDAPModal"
      @on-close-with-update="callForUpdatedData"
    />
    <LDAPScheduleDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-row="selectedRow"
      @on-close="toggleDeleteDialog({})"
      @on-close-with-update="handleUpdateTable"
    />
    <ConfigureCompanyStepHeader
      class="mb-6"
      :title="labels.ScheduledSyncs"
      :subtitle="labels.ScheduledSyncsSub"
    />
    <LDAPScheduledSyncsTable
      ref="refTable"
      @on-edit="toggleImportLDAPModal"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>

<script>
import labels from '@/model/constants/labels'
import LDAPScheduledSyncsTable from '@/components/Company Settings/LDAP/LDAPScheduledSyncsTable'
import ConfigureCompanyStepHeader from '@/components/Companies/ConfigureCompanyStepHeader'
import TargetUserLDAPImportModal from '@/components/TargetUsers/LDAP/TargetUserLDAPImportModal'
import LDAPScheduleDeleteDialog from '@/components/Company Settings/LDAP/LDAPScheduleDeleteDialog'
export default {
  name: 'LDAPScheduledSyncs',
  components: {
    LDAPScheduleDeleteDialog,
    TargetUserLDAPImportModal,
    ConfigureCompanyStepHeader,
    LDAPScheduledSyncsTable
  },
  props: {
    resourceId: {
      type: String
    },
    customFields: {
      type: Array
    },
    fieldMappings: {
      type: Array
    }
  },
  data() {
    return {
      labels,
      isShowEditModal: false,
      isShowImportLDAPModal: false,
      isShowDeleteDialog: false,
      selectedRow: {}
    }
  },
  methods: {
    toggleImportLDAPModal(row) {
      this.selectedRow = row
      this.isShowImportLDAPModal = !this.isShowImportLDAPModal
    },
    toggleDeleteDialog(row) {
      this.selectedRow = row
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleUpdateTable() {
      this.$refs.refTable.unSelectRow(this.selectedRow)
      this.$refs.refTable.callForData()
      this.toggleDeleteDialog({})
    },
    callForUpdatedData() {
      this.toggleImportLDAPModal({})
      this.$refs.refTable.callForData()
    }
  }
}
</script>
