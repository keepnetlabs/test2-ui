<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-application"
    detailable-button-id="btn--preview-training-report-training-material"
    :isLoading="isFetchingSummary"
    :show-body-detail="false"
    :title="labels.TrainingMaterial"
    @previewClicked="handlePreviewClick"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-training-material__body pb-4">
        <TrainingPreviewDialog
          v-if="isShowPreviewDialog"
          :status="isShowPreviewDialog"
          :selected-row="selectedRow"
          :languages="languages"
          @on-close="toggleShowPreviewDialog"
        />
        <div class="training-report-training-material__body-header">
          <div class="training-report-training-material__template-name">
            {{ formData.name }}
          </div>
          <div class="training-report-training-material__body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge size="mini" color="#2196F3" text="Scorm" :outline="false" />
            <Badge
              class-name="training-report-training-material__body-header-right-badge-language"
              size="mini"
              color="#757575"
              :outline="false"
            >
              <template #content>
                <v-icon size="small">mdi-web</v-icon>
                <span v-for="(language, index) in formData.languages" :key="language"
                  >{{ language }} {{ formData.languages.length - 1 > index ? '|' : '' }}
                </span>
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
import TrainingPreviewDialog from '@/components/AwarenessEducator/TrainingPreviewDialog'

export default {
  name: 'TrainingReportTrainingMaterial',
  components: {
    TrainingPreviewDialog,
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
    },
    selectedRow: {
      type: Object
    },
    languages: {
      type: Array
    }
  },
  data() {
    return {
      labels,
      emailTemplate: null,
      isShowPreviewDialog: false
    }
  },
  computed: {
    isFormData() {
      return Object.keys(this.formData).length
    }
  },
  methods: {
    handlePreviewClick() {
      this.toggleShowPreviewDialog()
    },
    getBadgeColor(text = '') {
      if (text.toLowerCase() === 'easy') return '#217124'
      if (text.toLowerCase() === 'medium') return '#2196f3'
      if (text.toLowerCase() === 'hard') return '#f56c6c'
      return '#2196f3'
    },
    getBadgeText(text = '') {
      return text
    },
    toggleShowPreviewDialog() {
      this.isShowPreviewDialog = !this.isShowPreviewDialog
    }
  }
}
</script>
