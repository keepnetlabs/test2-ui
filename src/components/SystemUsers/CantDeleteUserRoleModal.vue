<template>
  <app-dialog
    v-if="status"
    :status="status"
    @changeStatus="closeOverlay"
    icon="mdi-alert"
    size="small"
    title="Delete Emails?"
    body=" This user role is assigned to 5 system users. In order to delete this role you must change the
      roles of these user and make sure this role is not assigned to any user."
    class-name="cant-delete-user-role-modal"
  >
    <template v-slot:app-dialog-footer>
      <div class="d-flex justify-end">
        <v-btn class="users__button" text color="#2196f3" @click="closeOverlay">OKAY</v-btn>
      </div>
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'

export default {
  name: 'CantDeleteUserRoleModal',
  components: {
    AppDialog
  },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    }
  }
}
</script>

<style lang="scss">
.cant-delete-user-role-modal {
  .k-dialog__header {
    padding-top: 24px;
    padding-bottom: 23px;
  }
}
</style>
