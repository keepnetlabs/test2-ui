<template>
  <div>
    <CompanySettingsHeader
      title="Landing Page Templates"
      sub-title="The created landing page template will be used in simulators using the landing page and any edits made will be available."
    />
    <QuishingNewLandingPageModal
      v-if="isShowNewLandingPageTemplateModal"
      ref="newLandingPage"
      :status="isShowNewLandingPageTemplateModal"
      :email-template-id="getLandingPageTemplateId"
      :is-edit="isEdit"
      :is-duplicate="isDuplicate"
      :landing-page-data="landingPageData"
      @changeNewEmailTemplateModalStatus="changeNewEmailTemplateModalStatus"
    />
    <CommonSimulatorLandingPageTemplatesPreviewDialog
      v-if="isShowPreviewDialog"
      :status="isShowPreviewDialog"
      :selected-row="selectedLandingPageTemplate"
      :type="PREVIEW_DIALOG_TYPES.QUISHING"
      :api-func="getLandingPageTemplate"
      @on-close="togglePreviewDialog"
      @on-edit="handleEditFromPreview"
    />
    <CommonSimulatorEmailTemplateDeleteDialog
      v-if="isShowDeleteDialog"
      :status="isShowDeleteDialog"
      :selected-email-template="selectedLandingPageTemplate"
      :api-func="deleteLandingPageTemplate"
      :type="SCENARIO_DELETE_DIALOG_TYPES.LANDING_PAGE"
      :templateCount="multipleDeletedTemplatesCount"
      :multipleDeleteApiFunc="bulkDeleteLandingPageTemplates"
      :multipleDeletePayload="multipleTemplatesPayload"
      :isMultiple="isMultipleDelete"
      @on-success="toggleDeleteDialog(null, true)"
      @on-success-multiple="handleSuccessMultipleDeleteAction"
      @on-close="toggleDeleteDialog"
    />
    <QuishingLandingPageTemplatesTable
      ref="refTable"
      :landing-page-data="landingPageData"
      @on-edit-or-new="toggleNewLandingPageTemplateModal"
      @on-preview="togglePreviewDialog"
      @on-delete="toggleDeleteDialog"
      @on-multiple-delete="handleMultipleDelete"
    />
  </div>
</template>
<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader.vue'
import QuishingLandingPageTemplatesTable from '@/components/QuishingLandingPageTemplates/QuishingLandingPageTemplatesTable.vue'
import CommonSimulatorEmailTemplateDeleteDialog from '@/components/Common/Simulator/EmailTemplates/CommonSimulatorEmailTemplateDeleteDialog.vue'
import {
  PREVIEW_DIALOG_TYPES,
  SCENARIO_DELETE_DIALOG_TYPES
} from '@/components/Common/Simulator/utils'
import QuishingService from '@/api/quishing'
import QuishingNewLandingPageModal from '@/components/QuishingLandingPageTemplates/QuishingNewLandingPageModal.vue'
import CommonSimulatorLandingPageTemplatesPreviewDialog from '@/components/Common/Simulator/LandingPageTemplates/CommonSimulatorLandingPageTemplatesPreviewDialog.vue'
export default {
  name: 'QuishingLandingPageTemplates',
  components: {
    CommonSimulatorLandingPageTemplatesPreviewDialog,
    QuishingNewLandingPageModal,
    CommonSimulatorEmailTemplateDeleteDialog,
    QuishingLandingPageTemplatesTable,
    CompanySettingsHeader
  },
  data() {
    return {
      PREVIEW_DIALOG_TYPES,
      SCENARIO_DELETE_DIALOG_TYPES,
      landingPageData: null,
      isShowDeleteDialog: false,
      isShowNewLandingPageTemplateModal: false,
      isShowPreviewDialog: false,
      selectedLandingPageTemplate: null,
      isDuplicate: false,
      isMultipleDelete: false,
      multipleDeletedScenariosCount: 0,
      multipleScenariosPayload: {},
      isEdit: false
    }
  },
  created() {
    this.callForLookups()
  },
  computed: {
    getLandingPageTemplateId() {
      return this.selectedLandingPageTemplate?.resourceId || ''
    }
  },
  methods: {
    getLandingPageTemplate: QuishingService.getLandingPageTemplate,
    deleteLandingPageTemplate: QuishingService.deleteLandingPageTemplate,
    bulkDeleteLandingPageTemplates: QuishingService.bulkDeleteLandingPageTemplates,
    toggleNewLandingPageTemplateModal(row = null, isDuplicate = false) {
      this.selectedLandingPageTemplate = row
      this.isEdit = !!row
      this.isDuplicate = isDuplicate
      this.isShowNewLandingPageTemplateModal = !this.isShowNewLandingPageTemplateModal
    },
    togglePreviewDialog(selectedLandingPageTemplate = null) {
      this.selectedLandingPageTemplate = selectedLandingPageTemplate
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    },
    handleEditFromPreview(row) {
      this.isShowPreviewDialog = false
      this.$nextTick(() => {
        this.toggleNewLandingPageTemplateModal(row, false)
      })
    },
    toggleDeleteDialog(row = null, forceUpdate = false) {
      this.isMultipleDelete = false
      if (forceUpdate) this.$refs.refTable.callForData()
      this.selectedLandingPageTemplate = row
      this.isShowDeleteDialog = !this.isShowDeleteDialog
    },
    handleMultipleDelete({ selections, excludedItems, selectAll, axiosPayload, serverSideProps }) {
      this.isMultipleDelete = true
      this.multipleDeletedTemplatesCount = selectAll
        ? serverSideProps.totalNumberOfRecords
        : selections.length
      this.multipleTemplatesPayload = {
        items: selectAll ? [] : selections.map((item) => item.resourceId),
        excludedItems,
        selectAll,
        filter: axiosPayload.filter
      }
      this.isShowDeleteDialog = true
    },
    handleSuccessMultipleDeleteAction() {
      this?.$refs?.refTable?.$refs?.refLandingPageList?.resetSelectableParams()
      this.isShowDeleteDialog = false
      this.$refs?.refTable?.callForData()
    },
    callForLookups() {
      QuishingService.getLandingPageFormDetails().then((response) => {
        const domainRecords = response?.data?.data?.domainRecords?.map((item) => {
          return {
            text: item.domain,
            value: item.id.toString(),
            extraDatas: [
              {
                text: item.urlSchemaType,
                value: item.urlSchemaTypeId.toString()
              },
              { text: item.isStopBotActivity, value: item.isStopBotActivity }
            ]
          }
        })
        this.landingPageData = { ...response.data.data, domainRecords }
      })
    },
    checkIfCanCloseGrapesJSModal() {
      if (this.$refs.newLandingPage) {
        if (this.$refs.newLandingPage.$refs.refEmailTemplate)
          this.$refs.newLandingPage.$refs.refEmailTemplate.toggleShowGrapesModal()
      }
    },
    checkIfCanCloseNewLandingPage() {
      if (this.$refs.newLandingPage) {
        this.$refs.newLandingPage.changeNewEmailTemplateModalStatus()
      }
    },
    changeNewEmailTemplateModalStatus(status = false, forceUpdate = false) {
      if (forceUpdate) this.$refs.refTable.callForData()
      this.toggleNewLandingPageTemplateModal(null, false)
    }
  }
}
</script>
