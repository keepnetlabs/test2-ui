<template>
  <app-dialog v-if="!!selectedRow" :status="isShow" icon="mdi-delete" title="Warning!">
    <template v-slot:app-dialog-body>
      {{ selectedRow.companyName && selectedRow.companyName }} will be removed from company group.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--company-group-detail-popup"
        confirm-button-id="btn-delete--company-group-detail-popup"
        :confirm-button-disabled="saveDisable"
        type="delete"
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

<style lang="scss">
.delete-user {
  &__footer {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    &-button {
      font-size: 14px;
      font-weight: 600;
      line-height: 1.71;
      letter-spacing: normal;
    }
  }
}
</style>
