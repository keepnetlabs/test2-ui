<template>
  <AppDialog
    v-if="isShowDialog"
    title-id="text--campaign-manager-delete-popup-title"
    subtitle-id="text--campaign-manager-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="CONSTANTS.subtitle"
    :status="isShowDialog"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body> {{ content }} </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--leaving-popup"
        confirm-button-id="btn-delete--leaving-popup"
        action-button-text="Quit"
        action-button-color="#F56C6C"
        cancel-button-text="Keep Editing"
        cancel-button-color="#383B41"
        @handleClose="handleClose"
        @handleConfirm="handleCallback"
      />
    </template>
  </AppDialog>
</template>

<script>
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LeavingDialog',
  components: { AppDialogFooter, AppDialog },
  data() {
    return {
      CONSTANTS: {
        icon: 'mdi-delete',
        title: labels.YouAreLeaving,
        subtitle: labels.OperationWillBeAbondened
      },
      content: labels.YouWillLoseAllProgressAndData
    }
  },
  computed: {
    ...mapGetters({
      isShowDialog: 'common/getIsShowLeavingDialog',
      callback: 'common/getLeavingDialogCallback'
    })
  },
  methods: {
    ...mapActions({
      setDialog: 'common/setIsShowLeavingDialog'
    }),
    handleClose() {
      this.setDialog(false)
    },
    handleCallback() {
      this.handleClose()
      this.callback()
    }
  }
}
</script>
