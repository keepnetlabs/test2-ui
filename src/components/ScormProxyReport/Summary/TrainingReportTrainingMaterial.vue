<template>
  <CampaignManagerSummaryCard
    class="mt-4"
    detailable
    icon="mdi-application"
    detailable-button-id="btn--preview-training-report-training-material"
    :isLoading="isFetchingSummary"
    :show-body-detail="false"
    :title="isSurvey ? labels.SurveyMaterial : labels.TrainingMaterial"
    @previewClicked="handlePreviewClick"
  >
    <template #body>
      <div v-if="isFormData" class="training-report-training-material__body pb-4">
        <TrainingLibraryCommonComponents :should-control-body-scroll="true" />
        <div class="training-report-training-material__body-header">
          <div class="training-report-training-material__template-name">
            {{ formData.name }}
          </div>
          <div class="training-report-training-material__body-header-right">
            <v-btn style="display: none;"></v-btn>
            <Badge v-if="!isSurvey" size="mini" color="#2196F3" text="Scorm" :outline="false" />
            <Badge
              class-name="training-report-training-material__body-header-right-badge-language"
              size="mini"
              color="#757575"
              :outline="false"
            >
              <template #content>
                <v-icon size="small">mdi-web</v-icon>
                <span v-for="(language, index) in formData.languages" :key="language"
                  >{{ language }}
                  {{ formData.languages.length - 1 > index ? '|' : '' }}
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
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import { mapGetters } from 'vuex'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

export default {
  name: 'TrainingReportTrainingMaterial',
  components: {
    TrainingLibraryCommonComponents,
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
