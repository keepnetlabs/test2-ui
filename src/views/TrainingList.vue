<template>
  <KContainer tabless id="training-list">
    <NewTrainingModal
      v-if="isShowNewTrainingModal"
      :status="isShowNewTrainingModal"
      :is-edit="isEdit"
      :selected-row="selectedRow"
      @on-close="toggleShowNewTrainingModal"
    />
    <SendTrainingModal
      v-if="isShowSendTrainingModal"
      :status="isShowSendTrainingModal"
      :selected-row="selectedRow"
      @on-close="toggleShowSendTrainingModal"
    />
    <DeleteTrainingDialog
      v-if="isShowDeleteTrainingDialog"
      :status="isShowDeleteTrainingDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowDeleteTrainingDialog"
    />
    <TrainingPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedRow"
      @on-close="toggleShowPreviewDialog"
    />
    <TrainingListTable
      ref="refTable"
      @on-action-delete="handleDeleteRowClick"
      @on-preview="toggleShowPreviewDialog"
      @on-add="toggleShowNewTrainingModal"
      @on-edit="handleEditRowClick"
      @on-training="handleSendTrainingRowClick"
    />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import TrainingListTable from '@/components/AwarenessEducator/TrainingList/TrainingListTable'
import DeleteTrainingDialog from '@/components/AwarenessEducator/TrainingList/DeleteTrainingDialog'
import TrainingPreviewDialog from '@/components/AwarenessEducator/TrainingPreviewDialog'
import NewTrainingModal from '@/components/AwarenessEducator/NewTraining/NewTrainingModal'
import SendTrainingModal from '@/components/AwarenessEducator/SendTraining/SendTrainingModal'
export default {
  name: 'TrainingList',
  components: {
    SendTrainingModal,
    NewTrainingModal,
    DeleteTrainingDialog,
    TrainingListTable,
    KContainer,
    TrainingPreviewDialog
  },
  data() {
    return {
      isShowPreviewDialog: false,
      isShowDeleteTrainingDialog: false,
      isShowNewTrainingModal: false,
      isShowSendTrainingModal: false,
      selectedRow: null,
      isEdit: false
    }
  },
  methods: {
    toggleShowDeleteTrainingDialog(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (this.isShowDeleteTrainingDialog) this.selectedRow = null
      this.isShowDeleteTrainingDialog = !this.isShowDeleteTrainingDialog
    },
    toggleShowPreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleShowNewTrainingModal(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (this.isShowNewTrainingModal) {
        this.selectedRow = null
        this.isEdit = false
      }
      this.isShowNewTrainingModal = !this.isShowNewTrainingModal
    },
    toggleShowSendTrainingModal(forceUpdate = false) {
      this.getDataAndReRenderTable(forceUpdate)
      if (this.isShowSendTrainingModal) {
        this.selectedRow = null
      }
      this.isShowSendTrainingModal = !this.isShowSendTrainingModal
    },
    getDataAndReRenderTable(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteTrainingDialog()
    },
    handleEditRowClick(row) {
      this.selectedRow = row
      this.isEdit = true
      this.toggleShowNewTrainingModal()
    },
    handleSendTrainingRowClick(row) {
      this.selectedRow = row
      this.toggleShowSendTrainingModal()
    }
  }
}
</script>
