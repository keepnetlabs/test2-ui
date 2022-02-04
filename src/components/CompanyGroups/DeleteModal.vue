<template>
  <app-dialog
    v-if="!!selectedRow"
    :status="isShow"
    icon="mdi-delete"
    title="Warning!"
    title-id="text--company-group-delete-popup-title"
    subtitle-id="text--company-group-delete-popup-subtitle"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ selectedRow.name && selectedRow.name }} will be deleted and all data will be lost.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--company-group-popup"
        confirm-button-id="btn-delete--company-group-popup"
        type="delete"
        @handleClose="closeModal"
        @handleConfirm="confirmDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'DeleteModal',
  props: {
    isShow: {
      type: Boolean
    },
    selectedRow: {
      type: Object
    }
  },
  components: {
    AppDialogFooter,
    AppDialog
  },
  computed: {},
  methods: {
    closeModal() {
      this.$emit('changeModalStatus', false)
    },
    confirmDelete() {
      this.$emit('confirmDelete', this.selectedRow)
      this.$emit('changeModalStatus', false)
    }
  }
}
</script>
