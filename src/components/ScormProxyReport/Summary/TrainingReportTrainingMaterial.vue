<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-application"
    detailable-button-id="btn--preview-training-report-training-material"
    :isLoading="isFetchingSummary"
    :show-body-detail="false"
    is-training
    :title="getCardTitle"
    @previewClicked="handlePreviewClick"
  >
    <template #body>
      <TrainingLibraryCommonComponents v-if="isFormData" :should-control-body-scroll="true" />
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import { useLoading } from '@/hooks/useLoading'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import { mapGetters } from 'vuex'
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
      getSurveyPreviewDialog: 'trainingLibrary/getSurveyPreviewDialog'
    }),
    isFormData() {
      return Object.keys(this.formData).length
    },
    getCardTitle() {
      if (this.isSurvey) return `Survey: ${this.formData.name}`
      return `Training: ${this.formData.name}`
    }
  },
  methods: {
    handlePreviewClick() {
      if (this.isSurvey) {
        this.$store.commit('trainingLibrary/SET_SURVEY_PREVIEW_DIALOG', {
          status: true,
          selectedRow: this.selectedRow
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
  }
}
</script>
