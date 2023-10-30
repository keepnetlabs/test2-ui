<template>
  <div>
    <CommonSimulatorEmailTemplatePreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedEmailTemplate"
      @on-close="togglePreviewDialog"
    />
    <QuishingEmailTemplatesTable
      @on-edit-or-new="toggleNewEmailTemplatesModal"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>
<script>
import QuishingEmailTemplatesTable from '@/components/QuishingEmailTemplates/QuishingEmailTemplatesTable'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog'

export default {
  name: 'QuishingEmailTemplates',
  components: { CommonSimulatorEmailTemplatePreviewDialog, QuishingEmailTemplatesTable },
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
    togglePreviewDialog(selectedEmailTemplate = {}) {
      this.selectedEmailTemplate = selectedEmailTemplate
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleDeleteDialog() {
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
