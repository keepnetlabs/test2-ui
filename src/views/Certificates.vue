<template>
  <KContainer tabless id="certificates-list">
    <NewCertificatesModal
      v-if="isShowNewCertificateModal"
      :status="isShowNewCertificateModal"
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
      @on-close="toggleShowPreviewModal"
    />
    <CertificateListTable
      ref="refTable"
      @on-add="toggleShowNewCertificateModal"
      @on-preview="toggleShowPreviewDialog"
      @on-edit="handleEditRowClick"
      @on-action-delete="handleDeleteRowClick"
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
      isEdit: false
    }
  },
  methods: {
    toggleShowNewCertificateModal(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      this.isShowNewCertificateModal = !this.isShowNewCertificateModal
    },
    toggleShowPreviewModal() {
      this.isShowPreviewCertificateDialog = !this.isShowPreviewCertificateDialog
    },
    toggleShowDeleteCertificatesDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowPreviewCertificateDialog) this.selectedRow = null
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
    toggleShowPreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    }
  }
}
</script>
