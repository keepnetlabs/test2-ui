<template>
  <div>
    <DefaultButtonRowAction
      :id="rowActions[0].id"
      :icon="rowActions[0].icon"
      :text="rowActions[0].name"
      :scope="scope"
      :disabled="rowActions[0].disabled"
      :checkIsOwnerProperty="false"
      @on-click="handlePreview(scope.row)"
    />
    <RowActionsMenu>
      <DefaultMenuRowAction
        :id="rowActions[1].id"
        :scope="scope"
        :disabled="rowActions[1].disabled || !scope.row.isEditable"
        :icon="rowActions[1].icon"
        :text="rowActions[1].name"
        @on-click="handleSend(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[2].id"
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="rowActions[2].disabled"
        :icon="rowActions[2].icon"
        :text="rowActions[2].name"
        :checkIsOwnerProperty="false"
        @on-click="handleAddFavorite(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[3].id"
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="rowActions[3].disabled || !scope.row.isEditable"
        :icon="rowActions[3].icon"
        :text="rowActions[3].name"
        @on-click="handleEdit(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[4].id"
        :scope="scope"
        :icon="rowActions[4].icon"
        :text="rowActions[4].name"
        @on-click="handleDuplicate(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[5].id"
        :scope="scope"
        :disabled="rowActions[5].disabled || !scope.row.isEditable"
        :icon="rowActions[5].icon"
        :text="rowActions[5].name"
        @on-click="handleActionDelete(scope.row)"
      />
    </RowActionsMenu>
  </div>
</template>

<script>
import DefaultMenuRowAction from '@/components/SmallComponents/RowActions/DefaultMenuRowAction.vue'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction.vue'
import RowActionsMenu from '@/components/SmallComponents/RowActions/RowActionsMenu.vue'
import labels from '@/model/constants/labels'
import { mapActions } from 'vuex'
import AwarenessEducatorService from '@/api/awarenessEducator'

export default {
  name: 'TrainingLibraryLearningPathRowActions',
  components: { RowActionsMenu, DefaultButtonRowAction, DefaultMenuRowAction },
  props: {
    scope: {
      type: Object
    }
  },
  data() {
    return {
      rowActions: [
        {
          id: 'btn-preview--row-actions-learning-path',
          name: labels.Preview,
          icon: 'mdi-eye'
        },
        {
          id: 'btn-send--row-actions-learning-path',
          name: labels.SendLearningPath,
          icon: 'mdi-send'
        },
        {
          id: 'btn-favorite--row-actions-learning-path',
          name: this?.scope?.row?.isFavourite ? labels.RemoveFromFavorites : labels.AddToFavorites,
          icon: this?.scope?.row?.isFavourite ? 'mdi-bookmark' : 'mdi-bookmark-outline'
        },
        {
          id: 'btn-edit--row-actions-learning-path',
          name: labels.Edit,
          icon: 'mdi-pencil'
        },
        {
          id: 'btn-duplicate--row-actions-learning-path',
          name: labels.Duplicate,
          icon: 'mdi-content-copy',
          action: 'on-duplicate'
        },
        {
          id: 'btn-delete--row-actions-learning-path',
          name: labels.Delete,
          icon: 'mdi-delete'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      setDeleteDialog: 'trainingLibrary/setDeleteDialog',
      setLearningPathPreviewDialog: 'trainingLibrary/setLearningPathPreviewDialog',
      setNewLearningPathModal: 'trainingLibrary/setNewLearningPathModal',
      setLearningPathSendModal: 'trainingLibrary/setLearningPathSendModal',
      callForData: 'trainingLibrary/callForTrainingLibrary'
    }),
    handlePreview(row) {
      this.setLearningPathPreviewDialog({
        status: true,
        selectedRow: row,
        showSendButton: true
      })
    },
    handleSend(row) {
      this.setLearningPathSendModal({
        status: true,
        selectedRow: row
      })
    },
    handleAddFavorite(row) {
      if (row.isFavourite) {
        AwarenessEducatorService.removeFromFavorite(row.trainingId).then(() => {
          this.callForData()
        })
      } else {
        AwarenessEducatorService.addToFavorite(row.trainingId).then(() => {
          this.callForData()
        })
      }
    },
    handleEdit(row) {
      this.setNewLearningPathModal({
        status: true,
        selectedRow: row,
        isEdit: true,
        isDuplicate: false
      })
    },
    handleDuplicate(row) {
      AwarenessEducatorService.duplicateTraining(row.trainingId).then(() => {
        this.callForData()
      })
    },
    handleActionDelete(row) {
      this.setDeleteDialog({
        status: true,
        title: 'Delete Learning Path Material?',
        body: 'Are you sure you want to delete this learning path material?',
        selectedRow: row,
        type: 'learning-path',
        apiFunc: AwarenessEducatorService.deleteTraining,
        onClose: (forceUpdate) => {
          if (forceUpdate) this.$emit('on-force-update', forceUpdate)
        }
      })
    }
  }
}
</script>
