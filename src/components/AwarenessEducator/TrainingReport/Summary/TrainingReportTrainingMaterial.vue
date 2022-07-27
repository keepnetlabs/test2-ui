<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-email"
    :isLoading="isFetchingSummary"
    :show-body-detail="false"
    :title="labels.TrainingMaterial"
    @previewClicked="handlePreviewClick"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-training-material__body pb-4">
        <div class="training-report-training-material__body-header">
          <div class="training-report-training-material__template-name">
            {{ formData.name }}
          </div>
          <div class="training-report-training-material__body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge size="mini" color="#2196F3" text="Scorm" :outline="false" />
            <Badge size="mini" color="#757575" :outline="false">
              <template #content>
                <v-icon size="small">mdi-web</v-icon>{{ formData.languageShortCode }}
              </template>
            </Badge>
          </div>
        </div>
        <div class="training-report-training-material__created-by">
          {{ formData.category }} • <span style="font-weight: 400;">by</span>
          {{ formData.createdBy }}
        </div>
        <div class="training-report-training-material__description">
          {{ formData.description }}
        </div>
      </div>
      <!-- <div
        v-if="isShowEmailTemplate"
        class="campaign-manager-last-step__email-template-body-preview-container"
      >
        <div class="campaign-manager-last-step__email-template-body-preview">
          <DatatableLoading v-if="isLoading" :loading="isLoading" />
          <KEmailPreview v-else :html="emailTemplate" is-extra-height />
        </div>
      </div> -->
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge'
// import KEmailPreview from '@/components/KEmailPreview'
// import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { useLoading } from '@/hooks/useLoading'

export default {
  name: 'TrainingReportTrainingMaterial',
  components: {
    // DatatableLoading,
    // KEmailPreview,
    Badge,
    CampaignManagerSummaryCard
  },
  mixins: [useLoading],
  props: {
    formData: {
      type: Object
    },
    isFetchingSummary: {
      type: Boolean
    }
  },
  data() {
    return {
      isShowEmailTemplate: false,
      labels,
      emailTemplate: null
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    }
  },
  watch: {
    isShowEmailTemplate(val = false) {
      if (val && !this.emailTemplate) {
        this.callForTemplate()
      }
    }
  },
  methods: {
    callForTemplate() {},
    handlePreviewClick() {
      window.open(this.formData.trainingMaterialUrl, '_blank')
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
