<template>
  <div>
    <CompanySettingsHeader
      title="Landing Page Templates"
      sub-title="The created landing page template will be used in simulators using the landing page and any edits made will be available."
    />
    <CommonSimulatorEmailTemplateDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-email-template="selectedLandingPageTemplate"
      :api-func="deleteLandingPageTemplate"
      :type="SCENARIO_DELETE_DIALOG_TYPES.LANDING_PAGE"
      @on-success="toggleDeleteDialog(null, true)"
      @on-close="toggleDeleteDialog"
    />
    <QuishingLandingPageTemplatesTable
      ref="refTable"
      @on-edit-or-new="toggleNewLandingPageTemplateModal"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
    />
  </div>
</template>
<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader.vue'
import QuishingLandingPageTemplatesTable from '@/components/QuishingLandingPageTemplates/QuishingLandingPageTemplatesTable.vue'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'
import { SCENARIO_DELETE_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
export default {
  name: 'QuishingLandingPageTemplates',
  computed: {
    SCENARIO_DELETE_DIALOG_TYPES() {
      return SCENARIO_DELETE_DIALOG_TYPES
    }
  },
  components: {
    CommonSimulatorEmailTemplateDeleteDialog,
    QuishingLandingPageTemplatesTable,
    CompanySettingsHeader
  },
  data() {
    return {
      deleteLandingPageTemplate: QuishingService.deleteLandingPageTemplate,
      isShowDeleteDialog: false,
      isShowNewLandingPageTemplateModal: false,
      isShowPreviewDialog: false,
      selectedLandingPageTemplate: null,
      isDuplicate: false,
      isEdit: false
    }
  },
  methods: {
    toggleNewLandingPageTemplateModal() {
      this.isShowNewLandingPageTemplateModal = !this.isShowNewLandingPageTemplateModal
    },
    togglePreviewDialog(selectedLandingPageTemplate = null) {
      this.selectedLandingPageTemplate = selectedLandingPageTemplate
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    toggleDeleteDialog(row = null, forceUpdate) {
      if (forceUpdate) this.$refs.refTable.callForData()
      this.selectedLandingPageTemplate = row
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
