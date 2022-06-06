<template>
  <app-dialog
    :status="isShow"
    icon="mdi-delete"
    title="Warning!"
    title-id="text--company-delete-popup-title"
    subtitle-id="text--company-delete-popup-subtitle"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ getContent }}
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        :confirm-button-disabled="isActionButtonDisabled"
        cancel-button-id="btn-cancel--company-popup"
        confirm-button-id="btn-delete--company-popup"
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
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    companyCount: {
      type: Number,
      default: 0
    }
  },
  components: {
    AppDialogFooter,
    AppDialog
  },
  computed: {
    getContent() {
      return this.isMultiple
        ? `${this.companyCount} ${
            this.companyCount > 1 ? 'companies' : 'company'
          } will be deleted and all data will be lost.`
        : `${
            this.selectedRow && this.selectedRow.companyName
          } will be deleted and all data will be lost.`
    }
  },
  methods: {
    closeModal() {
      this.$emit('changeModalStatus', false)
    },
    confirmDelete() {
      if (this.isMultiple) {
        this.$emit('confirmMultipleDelete')
      } else {
        this.$emit('confirmDelete', this.item)
      }
      this.$emit('changeModalStatus', false)
    }
  }
}
</script>
