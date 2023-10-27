<template>
  <div>
    <NewQuishingEmailTemplatesModal
      v-if="isShowNewEmailTemplateModal"
      ref="newEmailTemplate"
      :status="isShowNewEmailTemplateModal"
      :is-duplicate="isDuplicate"
      :is-edit="isEdit"
      :email-template-id="getSelectedEmailTemplateId"
      @changeNewEmailTemplateModalStatus="changeNewEmailTemplateModalStatus"
      @showRenameAttachmentModal="onShowRenameAttachmentModal"
    />
    <CommonSimulatorEmailTemplatePreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedEmailTemplate"
      :api-func="getEmailTemplatePreviewContent"
      @on-close="togglePreviewDialog"
    />
    <CommonSimulatorAttachmentRenameDialog
      v-if="isShowRenameAttachmentDialog"
      :status="isShowRenameAttachmentDialog"
      @on-close="onCloseRenameAttachmentModal"
      @on-confirm="onConfirmRenameAttachment"
    />
    <CommonSimulatorEmailTemplateDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-email-template="selectedEmailTemplate"
      :api-func="deleteEmailTemplate"
      @on-success="toggleDeleteDialog(null, true)"
      @on-close="toggleDeleteDialog"
    />
    <QuishingEmailTemplatesTable
      ref="refTable"
      @on-edit-or-new="toggleNewEmailTemplateModal"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>
<script>
import QuishingEmailTemplatesTable from '@/components/QuishingEmailTemplates/QuishingEmailTemplatesTable'
import CommonSimulatorEmailTemplatePreviewDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplatePreviewDialog'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'
import CommonSimulatorAttachmentRenameDialog from '@/components/Common/Simulator/CommonSimulatorAttachmentRenameDialog.vue'
import NewQuishingEmailTemplatesModal from '@/components/QuishingEmailTemplates/NewQuishingEmailTemplatesModal.vue'
import QuishingService from '@/api/quishing'

export default {
  name: 'QuishingEmailTemplates',
  components: {
    NewQuishingEmailTemplatesModal,
    CommonSimulatorAttachmentRenameDialog,
    CommonSimulatorEmailTemplateDeleteDialog,
    CommonSimulatorEmailTemplatePreviewDialog,
    QuishingEmailTemplatesTable
  },
  data() {
    return {
      isShowDeleteDialog: false,
      isShowNewEmailTemplateModal: false,
      isShowPreviewDialog: false,
      selectedEmailTemplate: null,
      isDuplicate: false,
      isShowRenameAttachmentDialog: false,
      isEdit: false
    }
  },
  computed: {
    getSelectedEmailTemplateId() {
      return this.selectedEmailTemplate?.resourceId || ''
    }
  },
  methods: {
    getEmailTemplatePreviewContent: QuishingService.getEmailTemplatePreviewContent,
    deleteEmailTemplate: QuishingService.deleteEmailTemplate,
    toggleNewEmailTemplateModal(row = null, isDuplicate = false) {
      this.selectedEmailTemplate = row
      this.isDuplicate = isDuplicate
      this.isEdit = !!row
      this.isShowNewEmailTemplateModal = !this.isShowNewEmailTemplateModal
    },
    togglePreviewDialog(selectedEmailTemplate = null) {
      this.selectedEmailTemplate = selectedEmailTemplate
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleDeleteDialog(row = null, forceUpdate) {
      if (forceUpdate) this.$refs.refTable.callForData()
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    onShowRenameAttachmentModal() {
      this.isShowRenameAttachmentDialog = true
    },
    onCloseRenameAttachmentModal() {
      this.isShowRenameAttachmentDialog = false
    },
    onConfirmRenameAttachment(attachmentName = '') {
      if (this.$refs.newEmailTemplate) {
        let fileExtension = ''
        const type = this.$refs.newEmailTemplate.formValues.attachmentFiles[0].type
        if (this.$refs.newEmailTemplate.formValues.attachmentFiles[0].name) {
          fileExtension = this.$refs?.newEmailTemplate?.formValues?.attachmentFiles?.[0]?.name.split(
            '.'
          )[1]
          const file = this.$refs.newEmailTemplate.formValues.attachmentFiles[0]
          this.$refs.newEmailTemplate.formValues.attachmentFiles = [
            new File([file], `${attachmentName}.${fileExtension}`, {
              type
            })
          ]
        } else {
          fileExtension = this.$refs?.newEmailTemplate?.formValues?.attachmentFiles?.[0]?.fileName?.split(
            '.'
          )?.[1]
          this.$refs.newEmailTemplate.formValues.attachmentFiles = [
            {
              ...this.$refs.newEmailTemplate.formValues.attachmentFiles[0],
              fileName: `${attachmentName}.${fileExtension}`
            }
          ]
        }
        this.$refs.newEmailTemplate.isPhishingFileModified = true
      }
      this.onCloseRenameAttachmentModal()
    },
    checkIfCanCloseGrapesJSModal() {
      if (this.$refs.newEmailTemplate) {
        if (this.$refs.newEmailTemplate.$refs.refEmailTemplate)
          this.$refs.newEmailTemplate.$refs.refEmailTemplate.toggleShowGrapesModal()
      }
    },
    checkIfCanCloseNewEmailTemplate() {
      if (this.$refs.newEmailTemplate) {
        this.$refs.newEmailTemplate.changeNewEmailTemplateModalStatus()
      }
    },
    changeNewEmailTemplateModalStatus(status, restart) {
      if (restart) this.$refs.refTable.callForData()
      this.toggleNewEmailTemplateModal(null, false)
    }
  }
}
</script>
