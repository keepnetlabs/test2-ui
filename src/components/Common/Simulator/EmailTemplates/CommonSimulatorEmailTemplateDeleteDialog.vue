<template>
  <AppDialog
    type="delete"
    icon="mdi-delete"
    :title="getTitle"
    :subtitle="getSubtitle"
    title-id="text--email-template-delete-popup-title"
    subtitle-id="text--email-template-delete-popup-subtitle"
    :status="status"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      {{ getBodyText }}
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--email-template-popup"
        confirm-button-id="btn-delete--email-template-popup"
        type="delete"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import AppDialog from '@/components/AppDialog'
import { SCENARIO_DELETE_DIALOG_TYPES } from '@/components/Common/Simulator/utils'

export default {
  name: 'CommonSimulatorEmailTemplateDeleteDialog',
  components: { AppDialog, AppDialogFooter },
  props: {
    status: {
      type: Boolean
    },
    selectedEmailTemplate: {
      type: Object
    },
    apiFunc: {
      type: Function
    },
    type: {
      type: String,
      default: SCENARIO_DELETE_DIALOG_TYPES.EMAIL
    },
    templateCount: {
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
    getTitle() {
      return this.type === SCENARIO_DELETE_DIALOG_TYPES.EMAIL
        ? 'Delete Email Template?'
        : 'Delete Landing Page Template?'
    },
    getSubtitle() {
      return this.type === SCENARIO_DELETE_DIALOG_TYPES.EMAIL
        ? 'Email Template will deleted permanently'
        : 'Landing Page will deleted permanently'
    },
    getBodyText() {
      if (this.isMultiple) {
        return `${this.templateCount} templates will be deleted.`
      }
      return `${this.selectedEmailTemplate && this.selectedEmailTemplate.name} will be deleted.`
    }
  },
  methods: {
    handleDelete() {
      if (this.isMultiple) {
        this.isActionButtonDisabled = true
        this.multipleDeleteApiFunc(this.multipleDeletePayload)
          .then(() => {
            this.$emit('on-success-multiple')
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      } else {
        this.isActionButtonDisabled = true
        this.apiFunc(this.selectedEmailTemplate.resourceId)
          .then(() => {
            this.$emit('on-success', this.selectedEmailTemplate)
          })
          .finally(() => {
            this.isActionButtonDisabled = false
          })
      }
    },
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
