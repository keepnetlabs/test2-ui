<template>
  <KContainer tabless id="training-list">
    <DeleteTrainingDialog
      v-if="isShowDeleteTrainingDialog"
      :status="isShowDeleteTrainingDialog"
      @on-close="toggleShowDeleteTrainingDialog"
    />
    <TrainingPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      @on-close="toggleShowPreviewDialog"
    />
    <TrainingListTable
      ref="refTable"
      @on-action-delete="handleDeleteRowClick"
      @on-preview="toggleShowPreviewDialog"
    />
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import TrainingListTable from '@/components/AwarenessEducator/TrainingList/TrainingListTable'
import DeleteTrainingDialog from '@/components/AwarenessEducator/TrainingList/DeleteTrainingDialog'
import TrainingPreviewDialog from '@/components/AwarenessEducator/TrainingPreviewDialog'
export default {
  name: 'TrainingList',
  components: {
    DeleteTrainingDialog,
    TrainingListTable,
    KContainer,
    TrainingPreviewDialog
  },
  data() {
    return {
      isShowPreviewDialog: false,
      isShowDeleteTrainingDialog: false,
      selectedRow: null
    }
  },
  methods: {
    toggleShowDeleteTrainingDialog(forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      if (this.isShowDeleteTrainingDialog) this.selectedRow = null
      this.isShowDeleteTrainingDialog = !this.isShowDeleteTrainingDialog
    },
    toggleShowPreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    handleDeleteRowClick(row) {
      this.selectedRow = row
      this.toggleShowDeleteTrainingDialog()
    }
  }
}
</script>
