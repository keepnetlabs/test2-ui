<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    detailable-button-id="btn--preview-training-report-training-material"
    :icon="getCardIcon"
    :is-loading="isFetchingSummary"
    :show-body-detail="false"
    :title="getCardTitle"
    @previewClicked="handlePreviewClick"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-training-material__body pb-4">
        <TrainingLibraryTrainingPreviewDialog
          v-if="getTrainingPreviewDialog.status"
          v-bind="getTrainingPreviewDialog"
        />
        <TrainingLibraryPosterPreviewDialog
          v-if="getPosterPreviewDialog.status"
          v-bind="getPosterPreviewDialog"
        />
        <TrainingLibraryInfographicPreviewDialog
          v-if="getInfographicPreviewDialog.status"
          v-bind="getInfographicPreviewDialog"
        />
        <div class="training-report-training-material__body-header">
          <div class="training-report-training-material__template-name">
            {{ formData.name }}
          </div>
          <div class="training-report-training-material__body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge
              v-if="isTrainingTypeTraining"
              size="mini"
              color="#2196F3"
              text="Scorm"
              :outline="false"
            />
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
import TrainingLibraryPosterPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryPosterPreviewDialog.vue'
import TrainingLibraryInfographicPreviewDialog from '@/components/TrainingLibrary/TrainingLibraryPreviewDialog/TrainingLibraryInfographicPreviewDialog.vue'
import { mapActions, mapGetters } from 'vuex'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '../../../TrainingLibrary/TrainingLibraryFirstCard/utils'

export default {
  name: 'TrainingReportTrainingMaterial',
  components: {
    TrainingLibraryTrainingPreviewDialog,
    TrainingLibraryPosterPreviewDialog,
    TrainingLibraryInfographicPreviewDialog,
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
    },
    trainingType: {
      type: String
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
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog',
      getPosterPreviewDialog: 'trainingLibrary/getPosterPreviewDialog',
      getInfographicPreviewDialog: 'trainingLibrary/getInfographicPreviewDialog'
    }),
    getCardTitle() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return labels.PosterMaterial
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return labels.InfographicMaterial
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
        return labels.LearningPathThatUsersWillBeRedirectTo
      return labels.TrainingMaterial
    },
    getCardIcon() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) return 'mdi-post'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) return 'mdi-post'
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH)
        return 'mdi-school'
      return 'mdi-application'
    },
    isFormData() {
      return Object.keys(this.formData).length
    },
    isTrainingTypeTraining() {
      return this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.TRAINING
    }
  },
  methods: {
    ...mapActions({
      setTrainingPreviewDialog: 'trainingLibrary/setTrainingPreviewDialog',
      setPosterPreviewDialog: 'trainingLibrary/setPosterPreviewDialog',
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog'
    }),
    handlePreviewClick() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        this.setPosterPreviewDialog({
          status: true,
          selectedRow: this.selectedRow,
          type: 'poster',
          title: labels.PosterPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showPosterName: true,
          showFavoriteButton: true,
          sendButton: false,
          showSendButton: false,
          icon: 'mdi-eye'
        })
      } else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        this.setInfographicPreviewDialog({
          status: true,
          selectedRow: this.selectedRow,
          type: 'infographic',
          title: labels.InfographicPreview,
          subtitle: '',
          showDetails: true,
          showTabs: true,
          showPosterName: true,
          showFavoriteButton: true,
          showSendButton: false,
          icon: 'mdi-eye'
        })
      } else {
        this.setTrainingPreviewDialog({
          status: true,
          selectedRow: this.selectedRow,
          showSendButton: false
        })
      }
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
