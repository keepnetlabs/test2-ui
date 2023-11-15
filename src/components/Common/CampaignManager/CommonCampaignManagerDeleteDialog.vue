<template>
  <AppDialog
    type="delete"
    title-id="text--campaign-manager-delete-popup-title"
    subtitle-id="text--campaign-manager-delete-popup-subtitle"
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
        cancel-button-id="btn-cancel--campaign-manager-popup"
        confirm-button-id="btn-delete--campaign-manager-popup"
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
export default {
  name: 'CommonCampaignManagerDeleteDialog',
  components: { AppDialogFooter, AppDialog },
  props: {
    status: {
      type: Boolean
    },
    item: {
      type: Object
    },
    isActionButtonDisabled: {
      type: Boolean
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
      isMultipleDelete: false,
      multipleDeletedUserCount: 0,
      CONSTANTS: {
        icon: 'mdi-delete',
        title: 'Delete Campaign(s)?'
      }
    }
  },
  computed: {
    getContent() {
      return this.isMultiple
        ? `${this.userCount} campaign(s) will be deleted`
        : `${this.item && this.item.name} will be deleted.`
    },
    getSubTitle() {
      return `${
        this.isMultiple ? `${this.userCount} campaign(s)` : 'Campaign'
      } will deleted permanently`
    }
  },
  methods: {
    closeModal() {
      this.$emit('on-close')
    },
    handleDelete() {
      if (this.isMultiple) {
        this.$emit('on-multiple-delete')
      } else {
        this.$emit('on-delete', this.item)
      }
    }
  }
}
</script>
