<template>
  <AppDialog
    icon="mdi-eye"
    custom-size="1600"
    max-height
    max-height-size="900"
    :subtitle="labels.TemplatePreview"
    :status="status"
    :title="getTitle"
    style="overflow: hidden;"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <KEmailPreview
        v-if="!!getTemplatePreviewContent"
        :html="getTemplatePreviewContent"
        :is-red-flagged-template="isRedFlaggedTemplate"
      />
    </template>
    <template #app-dialog-footer>
      <AppDialogFooterWithClose @on-close="handleClose" />
    </template>
  </AppDialog>
</template>

<script>
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog.vue'
import KEmailPreview from '@/components/KEmailPreview.vue'
import AppDialogFooterWithClose from '@/components/SmallComponents/AppDialogFooterWithClose.vue'
export default {
  name: 'CampaignManagerPhishingScenariosPreviewDialog',
  components: { AppDialogFooterWithClose, KEmailPreview, AppDialog },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    landingPageParams: {
      type: Object,
      default: () => ({})
    },
    emailTemplate: {
      type: String,
      default: ''
    },
    landingPageTemplates: {
      type: Array,
      default: () => []
    },
    emailTemplateParams: {
      type: Object,
      default: () => ({})
    },
    tab: {
      type: String,
      default: 'email'
    }
  },
  data() {
    return {
      labels,
      selectedLandingPageTab: '1'
    }
  },
  computed: {
    getTitle() {
      if (this.tab === 'email' || this.tab === 'individual-printout')
        return this.emailTemplateParams?.name || ''
      return this.landingPageParams?.name || ''
    },
    getTemplatePreviewContent() {
      if (this.tab === 'email' || this.tab === 'individual-printout') {
        return this.emailTemplate
      } else {
        return this.getCurrentLandingPageTemplate
      }
    },
    getCurrentLandingPageTemplate() {
      return this.landingPageTemplates?.length > 1
        ? this.landingPageTemplates?.[Number.parseInt(this.selectedLandingPageTab) - 1]?.content || ''
        : this.landingPageTemplates?.[0]?.content || ''
    },
    isRedFlaggedTemplate() {
      const html = this.getTemplatePreviewContent || ''
      return typeof html === 'string' && html.includes('data-redflag')
    }
  },
  methods: {
    handleClose() {
      this.$emit('on-close', false)
    }
  }
}
</script>
