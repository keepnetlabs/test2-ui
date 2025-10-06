<template>
  <AppDialog
    type="delete"
    title-id="text--training-library-delete-popup-title"
    subtitle-id="text--training-library-delete-popup-subtitle"
    icon="mdi-delete"
    :title="title"
    :status="status"
    class="training-library-delete-dialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      {{ body }}
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--training-dialog-popup"
        confirm-button-id="btn-delete-training-dialog-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog.vue'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
import { mapActions } from 'vuex'
import { emptyTrainingDeleteDialogObj } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingLibraryDeleteDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    },
    title: {
      type: String
    },
    body: {
      type: String
    },
    apiFunc: {
      type: Function,
      default: () => () => {}
    },
    type: {
      type: String,
      default: ''
    },
    onClose: {
      type: Function,
      default: () => () => {}
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    ...mapActions({ setDeleteDialog: 'trainingLibrary/setDeleteDialog' }),
    handleClose(forceUpdate = false) {
      this.setDeleteDialog(emptyTrainingDeleteDialogObj)
      if (typeof this.onClose === 'function') this.onClose(forceUpdate)
      this.$emit('changeStatus', forceUpdate)
    },
    handleConfirm() {
      if (typeof this.apiFunc !== 'function') return
      this.isActionButtonDisabled = true
      this.apiFunc(this.selectedRow.trainingId)
        .then(() => {
          this.handleClose(true)
        })
        .finally(() => (this.isActionButtonDisabled = false))
    }
  }
}
</script>

<style lang="scss">
.training-library-delete-dialog {
  z-index: 252 !important;

  .v-overlay {
    z-index: 252 !important;
  }
}
</style>
