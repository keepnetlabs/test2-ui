<template>
  <AppDialog
    title-id="text--siem-integration-delete-popup-title"
    subtitle-id="text--siem-integration-delete-popup-subtitle"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="getSubTitle"
    :status="status"
    @changeStatus="closeModal"
  >
    <template #app-dialog-body> {{ getContent }} </template>
    <template #app-dialog-footer>
      <AppDialogFooter
        type="delete"
        cancel-button-id="btn-cancel--siem-integrations-popup"
        confirm-button-id="btn-delete--siem-integrations-popup"
        :confirm-button-disabled="isActionButtonDisabled"
        @handleClose="closeModal"
        @handleConfirm="handleDelete"
      />
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import AppDialogFooter from '@/components/SmallComponents/AppDialogFooter'
import { deleteSIEMIntegration } from '@/api/siemIntegrations'
export default {
  name: 'SIEMIntegrationDeleteDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    },
    isMultiple: {
      type: Boolean,
      default: false
    },
    userCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isActionButtonDisabled: false,
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      CONSTANTS: {
        icon: 'mdi-delete',
        title: 'Delete Integration?'
      }
    }
  },
  computed: {
    getContent() {
      return this.isMultiple
        ? `${this.userCount} integration(s) will be deleted`
        : `${this.item && this.item.name} will be deleted.`
    },
    getSubTitle() {
      return `${
        this.isMultiple ? `${this.userCount} integration(s)` : 'Integration'
      } will deleted permanently`
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleDelete() {
      this.isActionButtonDisabled = true
      deleteSIEMIntegration(this.item.resourceId)
        .then(() => {
          this.$emit('on-delete', this.item)
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
