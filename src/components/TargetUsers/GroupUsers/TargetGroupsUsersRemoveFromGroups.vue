<template>
  <AppDialog
    v-if="status"
    :status="status"
    title="Remove from group ?"
    icon="mdi-delete"
    subtitle="User(s) will be removed from target group"
    :body="getContent"
    @changeStatus="handleClose"
  >
    <template #app-dialog-footer>
      <AppDialogFooter @handleClose="handleClose" @handleConfirm="handleConfirm" />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { deleteTargetGroupUsers } from '@/api/targetUsers'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
export default {
  name: 'TargetGroupsUsersRemoveFromGroups',
  components: { AppDialogFooter, AppDialog },
  props: {
    groupName: {
      type: String
    },
    status: {
      type: Boolean
    },
    resourceId: {
      type: String
    },
    selectedRows: {
      type: Array
    }
  },
  emits: ['closeDialog', 'handleRemoveUsers'],
  computed: {
    getContent() {
      let text = 'user'
      text += this.selectedRows.length > 1 ? 's' : ''
      return `${this.selectedRows.length} ${text} will be removed from “${this.groupName}”`
    }
  },
  methods: {
    handleConfirm() {
      deleteTargetGroupUsers(this.resourceId, {
        targetUserResourceIds: this.selectedRows.map((item) => item.resourceId)
      }).then(() => {
        this.$store.dispatch('common/createSnackBar', {
          message: `${this.selectedRows.length} target user(s) removed from “${this.groupName}”`,
          color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
          icon: 'mdi-check-circle'
        })
        this.$emit('handleRemoveUsers')
      })
    },
    handleClose() {
      this.$emit('closeDialog')
    }
  }
}
</script>
