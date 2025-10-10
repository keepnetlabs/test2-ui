<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    is-training
    detailable-button-id="btn--preview-training-report-training-material"
    :icon="getCardIcon"
    :is-loading="isFetchingSummary"
    :show-body-detail="false"
    :title="getCardTitle"
    @previewClicked="handlePreviewClick"
  >
    <template #body>
      <div v-if="isFormData">
        <TrainingLibraryCommonComponents :should-control-body-scroll="true" />
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import { mapActions, mapGetters } from 'vuex'
import { TRAINING_LIBRARY_PAYLOAD_TYPES } from '../../../TrainingLibrary/TrainingLibraryFirstCard/utils'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingReportTrainingMaterial',
  components: {
    TrainingLibraryCommonComponents,
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
    },
    isSurvey: {
      type: Boolean
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
      getInfographicPreviewDialog: 'trainingLibrary/getInfographicPreviewDialog',
      getLearningPathPreviewDialog: 'trainingLibrary/getLearningPathPreviewDialog',
      getSurveyPreviewDialog: 'trainingLibrary/getSurveyPreviewDialog'
    }),
    getCardTitle() {
      if (this.isSurvey) return `Survey: ${this.formData.name}`
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER)
        return `Poster: ${this.formData.name}`
      else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC)
        return `Infographic: ${this.formData.name}`
      else if (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      )
        return `Learning Path: ${this.formData.name}`
      return `Training: ${this.formData.name}`
    },
    getCardIcon() {
      return 'mdi-book-education'
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
      setInfographicPreviewDialog: 'trainingLibrary/setInfographicPreviewDialog',
      setLearningPathPreviewDialog: 'trainingLibrary/setLearningPathPreviewDialog',
      setSurveyPreviewDialog: 'trainingLibrary/setSurveyPreviewDialog',
      resetAllModals: 'trainingLibrary/resetAllModals'
    }),
    handlePreviewClick() {
      if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.POSTER) {
        this.$store.commit('trainingLibrary/SET_POSTER_PREVIEW_DIALOG', {
          status: true,
          selectedRow: this.selectedRow,
          onlyPreview: true
        })
      } else if (this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.INFOGRAPHIC) {
        this.$store.commit('trainingLibrary/SET_INFO_GRAPHIC_PREVIEW_DIALOG', {
          status: true,
          selectedRow: this.selectedRow,
          onlyPreview: true
        })
      } else if (
        this.trainingType === TRAINING_LIBRARY_PAYLOAD_TYPES.LEARNING_PATH ||
        this.trainingType === TRAINING_LIBRARY_TYPES.LEARNING_PATH
      ) {
        this.$store.commit('trainingLibrary/SET_LEARNING_PATH_PREVIEW_DIALOG', {
          status: true,
          selectedRow: this.selectedRow,
          onlyPreview: true
        })
      } else if (this.isSurvey) {
        this.$store.commit('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
          status: true,
          selectedRow: this.selectedRow,
          onlyPreview: true
        })
      } else {
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: true,
          selectedRow: this.selectedRow,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: true
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
  },
  beforeDestroy() {
    this.resetAllModals()
  }
}
</script>
