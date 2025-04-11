<template>
  <AppDialog
    :status="status"
    size="big"
    title="Confirmation Required for Edit"
    icon="mdi-alert"
    ref="appDialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <div>
        <span v-if="isNotified">
          The edit action will be applied to the selected {{ emailCount }} emails, and
          {{ userCount }} users will be notified about the update. Do you want to proceed?
        </span>
        <span v-else>
          The edit action will be applied to the selected {{ emailCount }} emails. Do you want to
          proceed?
        </span>
      </div>
    </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        cancel-button-id="btn-cancel--incident-responder-confirmation-popup"
        confirm-button-id="btn-delete--incident-responder-confirmation-popup"
        action-button-text="CONFIRM"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="handleClose"
        @handleConfirm="handleConfirm"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter.vue'
export default {
  name: 'ConfirmationRequiredPopup',
  components: {
    AppDialogFooter,
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    emailCount: {
      type: Number,
      default: 0
    },
    userCount: {
      type: Number,
      default: 0
    },
    isActionButtonDisabled: {
      type: Boolean,
      default: false
    },
    payload: {
      type: Object,
      default: () => ({})
    },
    isNotified: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    handleConfirm() {
      this.$emit('on-confirm', this.payload)
    }
  }
}
</script>
