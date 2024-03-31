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
        v-if="false"
        :id="rowActions[1].id"
        :scope="scope"
        :disabled="rowActions[1].disabled"
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
        @on-click="handleDownloadScreensaver(scope.row)"
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
        :disabled="rowActions[3].disabled || !scope.row.isEditable"
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
import AwarenessEducatorService from '@/api/awarenessEducator'
import { mapActions } from 'vuex'

export default {
  name: 'TrainingLibraryScreensaverRowActions',
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
          id: 'btn-preview--row-actions-screensaver',
          name: labels.Preview,
          icon: 'mdi-eye'
        },
        {
          id: 'btn-send--row-actions-screensaver',
          name: labels.SendScreensaver,
          icon: 'mdi-send'
        },
        {
          id: 'btn-download--row-actions-screensaver',
          name: labels.DownloadScreensaver,
          icon: 'mdi-download'
        },
        {
          id: 'btn-favorite--row-actions-screensaver',
          name: this.scope.row.isFavourite ? labels.RemoveFromFavorites : labels.AddToFavorites,
          icon: this.scope.row.isFavourite ? 'mdi-bookmark' : 'mdi-bookmark-outline'
        },
        {
          id: 'btn-edit--row-actions-screensaver',
          name: labels.Edit,
          icon: 'mdi-pencil'
        },
        {
          id: 'btn-duplicate--row-actions-screensaver',
          name: labels.Duplicate,
          icon: 'mdi-content-copy',
          action: 'on-duplicate'
        },
        {
          id: 'btn-delete--row-actions-screensaver',
          name: labels.Delete,
          icon: 'mdi-delete'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      setDeleteDialog: 'trainingLibrary/setDeleteDialog',
      setScreenSaverPreviewDialog: 'trainingLibrary/setScreenSaverPreviewDialog',
      setNewScreensaverModal: 'trainingLibrary/setNewScreensaverModal',
      setScreensaverSendModal: 'trainingLibrary/setScreensaverSendModal',
      callForData: 'trainingLibrary/callForTrainingLibrary'
    }),
    handlePreview(row) {
      this.setScreenSaverPreviewDialog({
        status: true,
        selectedRow: row,
        type: 'screensaver',
        title: labels.ScreensaverPreview,
        subtitle: '',
        showDetails: true,
        showTabs: true,
        showSendButton: false,
        showScreensaverName: true,
        showFavoriteButton: true,
        icon: 'mdi-eye'
      })
    },
    handleSend(row) {
      this.setScreensaverSendModal({
        status: true,
        selectedRow: row
      })
    },
    handleDownloadScreensaver(row) {
      this.setScreenSaverPreviewDialog({
        status: true,
        selectedRow: row,
        type: 'downloadScreensaver',
        title: labels.DownloadScreensaver,
        showSendButton: false,
        subtitle: '',
        showDetails: false,
        showTabs: false,
        showFavoriteButton: false,
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
      this.setNewScreensaverModal({
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
        title: 'Delete Screensaver Material?',
        body: 'Are you sure you want to delete this screensaver material?',
        selectedRow: row,
        type: 'screensaver',
        apiFunc: AwarenessEducatorService.deleteTraining,
        onClose: (forceUpdate) => {
          if (forceUpdate) this.$emit('on-force-update', forceUpdate)
        }
      })
    }
  }
}
</script>
