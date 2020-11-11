<template>
  <app-dialog v-if="!!selectedRow" :status="isShow" icon="mdi-delete" title="Warning!">
    <template v-slot:app-dialog-body>
      {{ selectedRow.name && selectedRow.name }} will be permanently deleted.
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer @handleClose="closeModal" @handleConfirm="confirmDelete" />
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
