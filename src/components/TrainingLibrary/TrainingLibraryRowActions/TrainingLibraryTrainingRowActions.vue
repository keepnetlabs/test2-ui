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
        :disabled="rowActions[3].disabled"
        :icon="rowActions[3].icon"
        :text="rowActions[3].name"
        @on-click="handleEdit(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[4].id"
        :scope="scope"
        :disabled="rowActions[4].disabled || !scope.row.isEditable"
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
  name: 'TrainingLibraryTrainingRowActions',
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
          id: 'btn-preview--row-actions-training',
          name: labels.Preview,
          icon: 'mdi-eye'
        },
        {
          id: 'btn-send--row-actions-training',
          name: labels.SendTraining,
          icon: 'mdi-send'
        },
        {
          id: 'btn-favorite--row-actions-training',
          name: this.scope.row.isFavorite ? labels.RemoveFromFavorites : labels.AddToFavorites,
          icon: this.scope.row.isFavorite ? 'mdi-bookmark' : 'mdi-bookmark-outline'
        },
        {
          id: 'btn-edit--row-actions-training',
          name: labels.Edit,
          icon: 'mdi-pencil'
        },
        {
          id: 'btn-duplicate--row-actions-training',
          name: labels.Duplicate,
          icon: 'mdi-content-copy',
          action: 'on-duplicate'
        },
        {
          id: 'btn-delete--row-actions-training',
          name: labels.Delete,
          icon: 'mdi-delete'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      setDeleteDialog: 'trainingLibrary/setDeleteDialog',
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog',
      setNewTrainingModal: 'trainingLibrary/setNewTrainingModal',
      setTrainingSendModal: 'trainingLibrary/setTrainingSendModal'
    }),
    handlePreview(row) {
      this.setTrainingPreviewDialog({
        status: true,
        selectedRow: row
      })
    },
    handleSend(row) {
      this.setTrainingSendModal({
        status: true,
        selectedRow: row
      })
    },
    handleAddFavorite(row) {
      this.$emit('on-training-add-favorite', row)
    },
    handleEdit(row) {
      this.setNewTrainingModal({
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
        title: 'Delete Training Material?',
        body: 'Are you sure you want to delete this training material?',
        selectedRow: row,
        type: 'training',
        apiFunc: AwarenessEducatorService.deleteTraining,
        onClose: (forceUpdate) => {
          if (forceUpdate) this.$emit('on-force-update', forceUpdate)
        }
      })
    }
  }
}
</script>
