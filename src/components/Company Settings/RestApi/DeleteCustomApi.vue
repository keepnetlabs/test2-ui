<template>
  <app-dialog
    :status="status"
    icon="mdi-delete"
    :title="getTitle"
    @changeStatus="closeModal"
    :subtitle="labels.RestApi"
    id="rest-api-delete-popup"
  >
    <template v-slot:app-dialog-body>
      {{ labels.DeleteRestApiBody }}
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        :confirm-button-disabled="saveDisable"
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
      return `${labels.Delete} ${this.selectedRow['clientName']}`
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
