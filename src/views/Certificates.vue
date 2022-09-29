<template>
  <KContainer tabless id="certificates-list">
    <NewCertificatesModal
      v-if="isShowNewCertificateModal"
      :status="isShowNewCertificateModal"
      :selected-item="selectedRow"
      :is-duplicate="isDuplicate"
      @on-close="toggleShowNewCertificateModal"
    />
    <DeleteCertificateDialog
      v-if="isShowDeleteCertificateDialog"
      :status="isShowDeleteCertificateDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteCertificatesDialog"
    />
    <CertificatePreviewDialog
      v-if="isShowPreviewCertificateDialog"
      :status="isShowPreviewCertificateDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowPreviewModal"
    />
    <CertificateListTable
      ref="refTable"
      @on-add="toggleShowNewCertificateModal"
      @on-preview="handlePreviewRowClick"
      @on-edit="handleEditRowClick"
      @on-action-delete="handleDeleteRowClick"
      @on-duplicate="handleDuplicateRowClick"
    />
  </KContainer>
</template>

<script>
import CertificateListTable from '@/components/AwarenessEducator/Certificates/CertificateListTable'
import KContainer from '@/components/KContainer/KContainer'
import DeleteCertificateDialog from '@/components/AwarenessEducator/Certificates/DeleteCertificateDialog'
import CertificatePreviewDialog from '@/components/AwarenessEducator/Certificates/CertificatePreviewDialog'
import NewCertificatesModal from '@/components/AwarenessEducator/Certificates/NewCertificatesModal'
export default {
  name: 'Certificates',
  components: {
    NewCertificatesModal,
    CertificatePreviewDialog,
    DeleteCertificateDialog,
    KContainer,
    CertificateListTable
  },
  data() {
    return {
      isShowNewCertificateModal: false,
      isShowDeleteCertificateDialog: false,
      isShowPreviewCertificateDialog: false,
      selectedRow: null,
      isEdit: false,
      isDuplicate: false
    }
  },
  methods: {
    toggleShowNewCertificateModal(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowNewCertificateModal) {
        this.selectedRow = null
        this.isDuplicate = false
      }
      this.isShowNewCertificateModal = !this.isShowNewCertificateModal
    },
    toggleShowPreviewModal() {
      if (this.isShowPreviewCertificateDialog) this.selectedRow = null
      this.isShowPreviewCertificateDialog = !this.isShowPreviewCertificateDialog
    },
    toggleShowDeleteCertificatesDialog(forceUpdate = false) {
      if (forceUpdate) {
        this.$refs.refTable.$refs.refTable.unSelectRow(this.selectedRow)
        this.$refs.refTable.callForData()
      }
      if (this.isShowDeleteCertificateDialog) this.selectedRow = null
      this.isShowDeleteCertificateDialog = !this.isShowDeleteCertificateDialog
    },
    handleEditRowClick(row) {
      this.selectedRow = row
      this.isEdit = true
      this.toggleShowNewCertificateModal()
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteCertificatesDialog()
    },
    handlePreviewRowClick(row) {
      this.selectedRow = row
      this.toggleShowPreviewModal()
    },
    handleDuplicateRowClick(row) {
      this.selectedRow = row
      this.isDuplicate = true
      this.toggleShowNewCertificateModal()
    }
  }
}
</script>
