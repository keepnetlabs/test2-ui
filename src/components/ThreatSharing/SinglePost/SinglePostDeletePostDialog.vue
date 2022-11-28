<template>
  <AppDialog
    :status="status"
    type="delete"
    icon="mdi-delete"
    title="Delete Incident?"
    title-id="text--threat-sharing-incident-single-post-delete-popup-title"
    subtitle-id="text--threat-sharing-incident-single-post-delete-popup-subtitle"
    :subtitle="deleteIncidentName"
    :body="`This post will be deleted from ${deleteIncidentCommunityName}`"
    @changeStatus="handleClose"
  >
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        actionButtonText="DELETE"
        :confirm-button-disabled="isActionButtonDisabled"
        :confirm-button-id="`threat-sharing-single-post-delete-incident-confirm`"
        :cancel-button-id="`threat-sharing-single-post-delete-incident-confirm`"
        @handleClose="handleClose"
        @handleConfirm="handleDeletePost"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { deleteCommunityPost } from '@/api/threatSharing'
export default {
  name: 'SinglePostDeletePostDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    deleteIncidentName: {
      type: String,
      default: ''
    },
    deleteIncidentCommunityName: {
      type: String,
      default: ''
    },
    deleteIncidentId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isActionButtonDisabled: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('changeStatus', false)
    },
    handleDeletePost() {
      this.isActionButtonDisabled = true
      deleteCommunityPost(this.deleteIncidentId)
        .then(() => {
          this.handleClose()
          this.$emit('on-delete')
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
