<template>
  <div>
    <CompanySettingsHeader
      title="Landing Page Templates"
      sub-title="The created landing page template will be used in simulators using the landing page and any edits made will be available."
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
export default {
  name: 'QuishingLandingPageTemplates',
  components: { QuishingLandingPageTemplatesTable, CompanySettingsHeader },
  data() {
    return {
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
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    }
  }
}
</script>
