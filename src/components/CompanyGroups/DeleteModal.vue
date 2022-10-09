<template>
  <app-dialog
    v-if="!!isShow"
    :status="isShow"
    type="delete"
    icon="mdi-delete"
    title="Warning!"
    title-id="text--company-group-delete-popup-title"
    subtitle-id="text--company-group-delete-popup-subtitle"
    @changeStatus="closeModal"
  >
    <template v-slot:app-dialog-body>
      {{ getContent }}
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        :confirm-button-disabled="isActionButtonDisabled"
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
    },
    isActionButtonDisabled: {
      type: Boolean
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    groupCount: {
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
        ? `${this.groupCount} ${
            this.groupCount > 1 ? 'company groups' : 'company group'
          } will be deleted and all data will be lost.`
        : `${this.selectedRow && this.selectedRow.name} will be deleted and all data will be lost.`
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
        this.$emit('confirmDelete', this.selectedRow)
      }
      this.$emit('changeModalStatus', false)
    }
  }
}
</script>
