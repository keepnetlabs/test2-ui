<template>
  <AppDialog
    type="delete"
    icon="mdi-delete"
    title="Delete Scenario?"
    subtitle="Scenario will be deleted permanently"
    title-id="text--scenario-delete-popup-title"
    subtitle-id="text--scenario-delete-popup-subtitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body>
      {{ getBodyText }}
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--scenario-popup"
        confirm-button-id="btn-delete--scenario-popup"
        type="delete"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import CallbackService from '@/api/callback'
export default {
  name: 'DeleteCallbackScenario',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    status: {
      type: Boolean
    },
    selectedScenario: {
      type: Object
    },
    scenarioCount: {
      type: Number,
      default: 0
    },
    isMultiple: {
      type: Boolean
    },
    multipleDeletePayload: {
      type: Object
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  computed: {
    getBodyText() {
      if (this.isMultiple) {
        return `${this.scenarioCount} scenarios will be deleted.`
      }
      return `${this.selectedScenario && this.selectedScenario.name} will be deleted.`
    }
  },
  methods: {
    closeModal() {
      this.$emit('handleCloseModal')
    },
    handleDelete() {
      if (this.isMultiple) {
        this.isActionButtonDisabled = true
        CallbackService.bulkDeleteCallbackScenarios(this.multipleDeletePayload)
          .then(() => {
            this.$emit('on-success-multiple')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.isActionButtonDisabled = true
        CallbackService.deleteCallbackScenario(this.selectedScenario.resourceId)
          .then(() => {
            this.$emit('handleSuccessDeleteAction', this.selectedScenario)
            this.closeModal()
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    }
  }
}
</script>
