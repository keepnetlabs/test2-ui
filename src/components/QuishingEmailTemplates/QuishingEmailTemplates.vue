<template>
  <div>
    <QuishingEmailTemplatesTable
      @on-edit-or-new="toggleNewEmailTemplatesModal"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>
<script>
import QuishingEmailTemplatesTable from '@/components/QuishingEmailTemplates/QuishingEmailTemplatesTable'

export default {
  name: 'QuishingEmailTemplates',
  components: { QuishingEmailTemplatesTable },
  data() {
    return {
      isShowDeleteDialog: false,
      isShowNewEmailTemplatesModal: false,
      isShowPreviewDialog: false,
      selectedEmailTemplate: null,
      isDuplicate: false,
      isEdit: false
    }
  },
  methods: {
    toggleNewEmailTemplatesModal() {
      this.isShowNewEmailTemplatesModal = !this.isShowNewEmailTemplatesModal
    },
    togglePreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleDeleteDialog() {
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
