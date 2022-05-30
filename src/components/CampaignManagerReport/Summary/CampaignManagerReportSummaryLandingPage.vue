<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-application"
    :show-body-detail.sync="isShowLandingPageTemplate"
    :title="labels.LandingPageWhoUsers"
  >
    <template #body>
      <div v-if="isFormData" class="campaign-manager-last-step__landing-page-template-body pb-4">
        <div class="campaign-manager-last-step__landing-page-template-body-header">
          <div class="campaign-manager-last-step__landing-page-template-body-header-left">
            <div class="campaign-manager-last-step__email-template-body-header-left">
              {{ formData.name }}
            </div>
          </div>
          <div class="campaign-manager-last-step__landing-page-template-body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge
              size="mini"
              :color="getBadgeColor(formData.difficulty)"
              :text="getBadgeText(formData.difficulty)"
              :outline="false"
            />
            <Badge
              size="mini"
              color="#E0E0E0"
              class-name="badge-middle px-2 py-2"
              :text="getBadgeText(formData.method)"
              :outline="false"
            />
            <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
              <template #content>
                <v-icon>mdi-web</v-icon>{{ formData.languageShortCode }}
              </template>
            </Badge>
          </div>
        </div>
        <div class="campaign-manager-last-step__email-template-body-header-sub">
          <span class="campaign-manager-last-step__landing-page-template-body-header-left-url"
            >URL:</span
          >
          {{ formData.urlTemplate }}
        </div>
      </div>
      <div
        v-if="isShowLandingPageTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <DatatableLoading v-if="isLoading" :loading="isLoading" />
          <KEmailPreview v-else ref="refPreview" :html="emailTemplate" is-extra-height />
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import Badge from '@/components/Badge'
import labels from '@/model/constants/labels'
import KEmailPreview from '@/components/KEmailPreview'
import { useLoading } from '@/hooks/useLoading'
import { getCampaignManagerLandingPageTemplatePreviewContent } from '@/api/landingPage'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
export default {
  name: 'CampaignManagerReportSummaryLanginPage',
  components: { DatatableLoading, KEmailPreview, Badge, CampaignManagerSummaryCard },
  mixins: [useLoading],
  props: {
    formData: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      isShowLandingPageTemplate: false,
      emailTemplate: null
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    }
  },
  watch: {
    isShowLandingPageTemplate(val = false) {
      if (val && !this.emailTemplate) {
        this.callForTemplate()
      }
    }
  },
  methods: {
    callForTemplate() {
      this.setLoading(true)
      getCampaignManagerLandingPageTemplatePreviewContent(
        this.formData.resourceId,
        this.formData.jobResourceId
      )
        .then((response) => {
          const {
            data: { data }
          } = response
          this.emailTemplate = data.landingPages[0]?.content
        })
        .finally(this.setLoading)
    },
    getBadgeColor(text = '') {
      switch (text.toLowerCase()) {
        case 'easy':
          return '#217124'
        case 'medium':
          return '#2196f3'
        case 'hard':
          return '#f56c6c'
        default:
          return '#2196f3'
      }
    },
    getBadgeText(text = '') {
      return text
    }
  }
}
</script>
