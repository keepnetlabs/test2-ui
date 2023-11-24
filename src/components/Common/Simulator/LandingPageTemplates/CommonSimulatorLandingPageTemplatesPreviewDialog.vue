<template>
  <AppDialog
    v-if="status"
    custom-size="1600"
    max-height
    max-height-size="900"
    icon="mdi-eye"
    title="Landing Page Template Preview"
    size="ultraMaximum"
    :status="status"
    :subtitle="getSubtitle"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <DatatableLoading v-if="isLoading" :loading="isLoading" />
      <LandingPageTemplateModalPreview
        v-show="!isLoading"
        :type="type"
        :template-name="landingPageParams.name"
        :landing-page-templates="landingPageTemplates"
        :phishing-url="landingPageParams.urlTemplate"
      />
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import LandingPageTemplateModalPreview from '@/components/LandingPage/LandingPageTemplateModalPreview'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose'
import AppDialog from '@/components/AppDialog'
import { useLoading } from '@/hooks/useLoading'
import { PREVIEW_DIALOG_TYPES } from '@/components/Common/Simulator/utils'
import { getLandingPageTemplate } from '@/api/landingPage'
export default {
  name: 'CommonSimulatorLandingPageTemplatesPreviewDialog',
  components: {
    AppDialog,
    AppDialogFooterWithClose,
    LandingPageTemplateModalPreview,
    DatatableLoading
  },
  mixins: [useLoading],
  props: {
    status: {
      type: Boolean,
      default: false
    },
    selectedRow: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: PREVIEW_DIALOG_TYPES.PHISHING
    },
    apiFunc: {
      type: Function,
      default: getLandingPageTemplate
    }
  },
  data() {
    return {
      landingPageTemplates: null,
      landingPageParams: {}
    }
  },
  computed: {
    getSubtitle() {
      return this?.selectedRow?.name || ''
    }
  },
  created() {
    this.callForData()
  },
  methods: {
    handleClose() {
      this.$emit('on-close')
    },
    callForData() {
      this.setLoading(true)
      this.apiFunc(this.selectedRow.resourceId)
        .then((response) => {
          const data = response.data.data
          this.landingPageParams.urlTemplate = data.urlTemplate
          this.landingPageParams.name = data.name
          this.landingPageTemplates = data.landingPages
          this.selectedTemplateHeader = data.name
          this.templateHTML = data.landingPages?.length
            ? data.landingPages[0]?.content || null
            : null
        })
        .finally(() => {
          this.timeoutId = setTimeout(() => {
            this.setLoading()
          }, 500)
        })
    }
  }
}
</script>
