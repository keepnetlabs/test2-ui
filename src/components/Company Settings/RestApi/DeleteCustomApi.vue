<template>
  <app-dialog
    :status="status"
    icon="mdi-delete"
    :title="getTitle"
    @changeStatus="closeModal"
    :subtitle="getSubtitle"
    id="rest-api-delete-popup"
    title-id="text--rest-api-delete-popup-title"
    subtitle-id="text--test-api-delete-popup-subtitle"
  >
    <template v-slot:app-dialog-body>
      {{ labels.DeleteRestApiBody }}
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        :confirm-button-disabled="saveDisable"
        type="delete"
        cancel-button-id="btn-cancel--rest-api-popup"
        confirm-button-id="btn-delete--rest-api-popup"
        action-button-text="DELETE"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
export default {
  name: 'DeleteCustomApi',
  components: {
    AppDialog,
    AppDialogFooter
  },
  props: {
    selectedRow: {
      type: Object
    },
    saveDisable: {
      type: Boolean
    },
    status: {
      type: Boolean
    }
  },
  emits: ['closeDialog', 'handleDelete'],
  data() {
    return {
      labels
    }
  },
  computed: {
    getTitle() {
      return `Delete Rest API`
    },
    getSubtitle() {
      return `${this.selectedRow.clientName}`
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeDialog')
    },
    handleDelete() {
      this.$emit('handleDelete', this.selectedRow['resourceId'])
    }
  }
}
</script>
