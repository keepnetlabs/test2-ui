<template>
  <app-dialog
    :status="status"
    icon="mdi-alert"
    title="Delete SAML Setting"
    :subtitle="getSubtitle"
    id="saml-settings-delete-popup"
    title-id="text--saml-settings-delete-popup-title"
    subtitle-id="text--saml-settings-delete-popup-subtitle"
    @changeStatus="handleCloseDialog"
  >
    <template v-slot:app-dialog-body>
      {{ labels.SAMLDeletePopupBody }}
    </template>
    <template v-slot:app-dialog-footer>
      <app-dialog-footer
        cancel-button-id="btn-cancel--saml-settings-popup"
        confirm-button-id="btn-delete--saml-settings-popup"
        type="delete"
        :confirmButtonDisabled="saveDisable"
        @handleClose="handleCloseDialog"
        @handleConfirm="handleDelete"
      />
    </template>
  </app-dialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import labels from '@/model/constants/labels'
import { deleteSamlSettings } from '@/api/samlSettings'
export default {
  name: 'DeleteSamlSettings',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    selectedRow: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['on-close', 'on-delete'],
  data() {
    return {
      labels,
      saveDisable: false
    }
  },
  computed: {
    getSubtitle() {
      return this.selectedRow.name
    }
  },
  methods: {
    handleCloseDialog() {
      this.$emit('on-close')
    },
    handleDelete() {
      this.saveDisable = true
      deleteSamlSettings(this.selectedRow.resourceId)
        .then(() => {
          this.$emit('on-delete', this.selectedRow)
          this.handleCloseDialog()
        })
        .finally(() => {
          this.saveDisable = false
        })
    }
  }
}
</script>
