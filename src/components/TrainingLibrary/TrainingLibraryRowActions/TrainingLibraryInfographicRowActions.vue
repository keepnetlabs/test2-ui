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
        :disabled="rowActions[1].disabled"
        :icon="rowActions[2].icon"
        :text="rowActions[2].name"
        @on-click="handleDownloadInfographic(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[3].id"
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="rowActions[3].disabled"
        :icon="rowActions[3].icon"
        :text="rowActions[3].name"
        :checkIsOwnerProperty="false"
        @on-click="handleAddFavorite(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[4].id"
        :scope="scope"
        :check-is-owner-property="false"
        :disabled="rowActions[3].disabled"
        :icon="rowActions[4].icon"
        :text="rowActions[4].name"
        @on-click="handleEdit(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[5].id"
        :scope="scope"
        :icon="rowActions[5].icon"
        :text="rowActions[5].name"
        @on-click="handleDuplicate(scope.row)"
      />
      <DefaultMenuRowAction
        :id="rowActions[6].id"
        :scope="scope"
        :disabled="rowActions[6].disabled || !scope.row.isEditable"
        :icon="rowActions[6].icon"
        :text="rowActions[6].name"
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
  name: 'TrainingLibraryInfographicRowActions',
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
          id: 'btn-preview--row-actions-infographic',
          name: labels.Preview,
          icon: 'mdi-eye'
        },
        {
          id: 'btn-send--row-actions-infographic',
          name: labels.SendInfoGraphic,
          icon: 'mdi-send'
        },
        {
          id: 'btn-download--row-actions-infographic',
          name: labels.DownloadInfographic,
          icon: 'mdi-download'
        },
        {
          id: 'btn-favorite--row-actions-infographic',
          name: this.scope.row.isFavourite ? labels.RemoveFromFavorites : labels.AddToFavorites,
          icon: this.scope.row.isFavourite ? 'mdi-bookmark' : 'mdi-bookmark-outline'
        },
        {
          id: 'btn-edit--row-actions-infographic',
          name: labels.Edit,
          icon: 'mdi-pencil'
        },
        {
          id: 'btn-duplicate--row-actions-infographic',
          name: labels.Duplicate,
          icon: 'mdi-content-copy',
          action: 'on-duplicate'
        },
        {
          id: 'btn-delete--row-actions-infographic',
          name: labels.Delete,
          icon: 'mdi-delete'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      setDeleteDialog: 'trainingLibrary/setDeleteDialog',
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog',
      setNewInfographicModal: 'trainingLibrary/setNewInfographicModal',
      setInfographicSendModal: 'trainingLibrary/setInfographicSendModal',
      callForData: 'trainingLibrary/callForTrainingLibrary'
    }),

    handlePreview(row) {
      this.setInfographicPreviewDialog({
        status: true,
        selectedRow: row,
        type: 'infographic',
        title: labels.InfographicPreview,
        subtitle: '',
        showDetails: true,
        showTabs: true,
        showPosterName: true,
        showFavoriteButton: true,
        showSendButton: true,
        icon: 'mdi-eye'
      })
    },
    handleSend(row) {
      this.setInfographicSendModal({
        status: true,
        selectedRow: row
      })
    },
    handleDownloadInfographic(row) {
      this.setInfographicPreviewDialog({
        status: true,
        selectedRow: row,
        type: 'downloadInfographic',
        title: labels.DownloadInfographic,
        subtitle: '',
        showDetails: false,
        showTabs: false,
        showFavoriteButton: false,
        showSendButton: false,
        icon: 'mdi-download'
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
      this.setNewInfographicModal({
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
        title: 'Delete Infographic Material?',
        body: 'Are you sure you want to delete this infographic material?',
        selectedRow: row,
        type: 'infographic',
        apiFunc: AwarenessEducatorService.deleteTraining,
        onClose: (forceUpdate) => {
          if (forceUpdate) this.$emit('on-force-update', forceUpdate)
        }
      })
    }
  }
}
</script>
