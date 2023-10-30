<template>
  <div>
    <CommonSimulatorEmailTemplatePreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedEmailTemplate"
      @on-close="togglePreviewDialog"
    />
    <CommonSimulatorEmailTemplateDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-email-template="selectedEmailTemplate"
      :api-func="selectedEmailTemplate"
      @on-success="toggleDeleteDialog(null, true)"
      @on-close="toggleDeleteDialog"
    />
    <QuishingEmailTemplatesTable
      ref="refTable"
      @on-edit-or-new="toggleNewEmailTemplatesModal"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>
<script>
import QuishingEmailTemplatesTable from '@/components/QuishingEmailTemplates/QuishingEmailTemplatesTable'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'

export default {
  name: 'QuishingEmailTemplates',
  components: {
    CommonSimulatorEmailTemplateDeleteDialog,
    CommonSimulatorEmailTemplatePreviewDialog,
    QuishingEmailTemplatesTable
  },
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
    togglePreviewDialog(selectedEmailTemplate = null) {
      this.selectedEmailTemplate = selectedEmailTemplate
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleDeleteDialog(row = null, forceUpdate) {
      if (forceUpdate) this.$refs.refTable.callForData()
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
