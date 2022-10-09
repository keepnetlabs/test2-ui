<template>
  <AppDialog
    :status="status"
    icon="mdi-alert"
    id="system-users-delete-role-popup"
    title-id="text--system-users-delete-role-popup-title"
    subtitle-id="text--system-users-delete-role-popup-subtitle"
    :title="labels.CannotDeleteUserRole"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body
      >This user role is assigned to {{ systemUserCount }} system users. In order to delete this
      role you must change the roles of these user and make sure this role is not assigned to any
      user.</template
    >
    <template #app-dialog-footer>
      <div class="d-flex download-buttons flex-row flex-wrap justify-end">
        <v-btn
          id="btn-delete--notification-template-close-default-template-warning-popup"
          class="users__button"
          text
          color="#2196F3"
          @click="handleClose"
          >{{ labels.Okay }}</v-btn
        >
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
export default {
  name: 'CannotDeleteRoleDialog',
  components: { AppDialog },
  props: {
    status: {
      type: Boolean
    },
    templateName: {
      type: String
    },
    systemUserCount: {
      type: Number
    }
  },
  data() {
    return {
      labels
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    }
  }
}
</script>
