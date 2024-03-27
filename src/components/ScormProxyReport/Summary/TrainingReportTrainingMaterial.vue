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
        <TrainingLibraryTrainingPreviewDialog
          v-if="getTrainingPreviewDialog.status"
          v-bind="getTrainingPreviewDialog"
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
import { useLoading } from '@/hooks/useLoading'
import TrainingLibraryTrainingPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryTrainingPreviewDialog.vue'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TrainingReportTrainingMaterial',
  components: {
    TrainingLibraryTrainingPreviewDialog,
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
      emailTemplate: null
    }
  },
  computed: {
    ...mapGetters({
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog'
    }),
    isFormData() {
      return Object.keys(this.formData).length
    }
  },
  methods: {
    ...mapActions({
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog'
    }),
    handlePreviewClick() {
      this.setTrainingPreviewDialog({
        status: true,
        selectedRow: this.selectedRow,
        showSendButton: false
      })
    },
    getBadgeColor(text = '') {
      if (text.toLowerCase() === 'easy') return '#217124'
      if (text.toLowerCase() === 'medium') return '#2196f3'
      if (text.toLowerCase() === 'hard') return '#f56c6c'
      return '#2196f3'
    },
    getBadgeText(text = '') {
      return text
    }
  }
}
</script>
