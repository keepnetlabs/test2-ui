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
        @on-click="handleDownloadPoster(scope.row)"
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
        :disabled="rowActions[4].disabled || !scope.row.isEditable"
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
  name: 'TrainingLibraryPosterRowActions',
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
          id: 'btn-preview--row-actions-poster',
          name: labels.Preview,
          icon: 'mdi-eye'
        },
        {
          id: 'btn-send--row-actions-poster',
          name: labels.SendPoster,
          icon: 'mdi-send'
        },
        {
          id: 'btn-download--row-actions-poster',
          name: labels.DownloadPoster,
          icon: 'mdi-download'
        },
        {
          id: 'btn-favorite--row-actions-poster',
          name: labels.AddToFavorites,
          icon: 'mdi-bookmark-outline'
        },
        {
          id: 'btn-edit--row-actions-poster',
          name: labels.Edit,
          icon: 'mdi-pencil'
        },
        {
          id: 'btn-duplicate--row-actions-poster',
          name: labels.Duplicate,
          icon: 'mdi-content-copy',
          action: 'on-duplicate'
        },
        {
          id: 'btn-delete--row-actions-poster',
          name: labels.Delete,
          icon: 'mdi-delete'
        }
      ]
    }
  },
  methods: {
    ...mapActions({
      setDeleteDialog: 'trainingLibrary/setDeleteDialog',
      setPosterPreviewDialog: 'trainingLibrary/setPosterPreviewDialog'
    }),
    handlePreview(row) {
      this.setPosterPreviewDialog({
        status: true,
        selectedRow: row,
        type: 'poster',
        title: labels.PosterPreview,
        subtitle: '',
        showDetails: true,
        showTabs: true,
        showPosterName: true,
        icon: 'mdi-eye'
      })
    },
    handleSend(row) {
      this.$emit('on-poster-send', row)
    },
    handleDownloadPoster(row) {
      this.$emit('on-poster-download', row)
    },
    handleAddFavorite(row) {
      this.$emit('on-poster-add-favorite', row)
    },
    handleEdit(row) {
      this.$emit('on-poster-edit', row)
    },
    handleDuplicate(row) {
      this.$emit('on-poster-duplicate', row)
    },
    handleActionDelete(row) {
      this.setDeleteDialog({
        status: true,
        title: 'Delete Poster Material?',
        body: 'Are you sure you want to delete this poster material? ',
        selectedRow: row,
        type: 'poster',
        apiFunc: AwarenessEducatorService.deleteTraining,
        onClose: (forceUpdate) => {
          if (forceUpdate) this.$emit('on-force-update', forceUpdate)
        }
      })
    }
  }
}
</script>
