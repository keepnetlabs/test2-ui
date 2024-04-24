<template>
  <AppDialog
    type="delete"
    icon="mdi-delete"
    title="Delete Scenario?"
    subtitle="Scenario will be deleted permanently"
    title-id="text--scenario-delete-popup-title"
    subtitle-id="text--scenario-delete-popup-subtitle"
    :status="status"
    @changeStatus="handleClose"
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
        @handleClose="handleClose"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'CommonSimulatorDeleteScenario',
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
    apiFunc: {
      type: Function,
      required: true
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
    },
    multipleDeleteApiFunc: {
      type: Function
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
    handleClose() {
      this.$emit('on-close')
    },
    handleDelete() {
      if (this.isMultiple) {
        this.isActionButtonDisabled = true
        console.log(this.multipleDeletePayload)
        this.multipleDeleteApiFunc(this.multipleDeletePayload)
          .then(() => {
            this.$emit('on-success-multiple')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.isActionButtonDisabled = true
        this.apiFunc(this.selectedScenario.resourceId)
          .then(() => {
            this.$emit('on-success', this.selectedScenario)
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    }
  }
}
</script>
