<template>
  <app-dialog
    v-if="!!selectedRow"
    :status="isShow"
    type="delete"
    title-id="text--company-group-details-delete-popup-title"
    subtitle-id="text--company-group-details-delete-popup-subtitle"
    icon="mdi-delete"
    title="Warning!"
  >
    <template v-slot:app-dialog-body>
      {{ selectedRow.companyName && selectedRow.companyName }} will be removed from company group.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        type="delete"
        cancel-button-id="btn-cancel--company-group-detail-popup"
        confirm-button-id="btn-delete--company-group-detail-popup"
        :confirm-button-disabled="saveDisable"
        @handleClose="closeModal"
        @handleConfirm="confirmRemove"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '../AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
export default {
  name: 'RemoveModal',
  props: {
    isShow: {
      type: Boolean
    },
    saveDisable: {
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
    confirmRemove() {
      this.$emit('confirmRemove', this.selectedRow)
      this.$emit('changeModalStatus', false)
    }
  }
}
</script>
