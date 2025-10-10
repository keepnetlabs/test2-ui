<template>
  <CampaignManagerSummaryCard
    is-training
    icon="mdi-book-education"
    :title="`Training: ${trainingParams.name}`"
  >
    <template #header-right>
      <VBtn
        class="campaign-manager-summary-card__button mr-6 pr-4"
        rounded
        outlined
        color="#2196f3"
        @click="handlePreviewClick"
      >
        <VIcon style="font-size: 20px; margin-right: 4px;">mdi-eye</VIcon>
        Preview
      </VBtn>
    </template>
    <template #body>
      <TrainingLibraryCommonComponents />
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard.vue'
import labels from '@/model/constants/labels'
import TrainingLibraryCommonComponents from '@/components/TrainingLibrary/TrainingLibraryCommonComponents.vue'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'
import { mapGetters } from 'vuex'
export default {
  name: 'CampaignManagerReportSummaryTraining',
  components: {
    TrainingLibraryCommonComponents,
    CampaignManagerSummaryCard
  },
  props: {
    trainingParams: {
      type: Object
    },
    selectedRow: {
      type: Object
    },
    selectedTrainingLanguages: {
      type: Array
    },
    callTrainingPreviewApi: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      labels,
      isShowTrainingDialog: false
    }
  },
  computed: {
    ...mapGetters({
      getTrainingPreviewDialog: 'trainingLibrary/getTrainingPreviewDialog'
    }),
    getCategoryName() {
      return this?.trainingParams?.category || this?.trainingParams?.categoryName
    }
  },
  watch: {
    'getTrainingPreviewDialog.status': {
      handler(newVal) {
        if (newVal === false) {
          this.isShowTrainingDialog = false
        }
      }
    }
  },
  methods: {
    handlePreviewClick() {
      this.toggleShowTrainingDialog()
    },
    toggleShowTrainingDialog() {
      if (this.isShowTrainingDialog) {
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: false
        })
      } else {
        // selectedTrainingLanguages varsa onu kullan, yoksa trainingParams.languageList'ten al
        let languages = this.selectedTrainingLanguages

        if (!languages || languages.length === 0) {
          // trainingParams.languageList'ten shortCode'ları al
          languages = (this.trainingParams.languageList || []).map((lang) => lang.languageShortCode)
        } else {
          // selectedTrainingLanguages varsa map et
          languages = languages.map((lang) => {
            if (typeof lang === 'object' && lang.code) {
              return lang.code
            }
            return lang
          })
        }

        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: true,
          selectedRow: {
            ...this.selectedRow,
            trainingId: this.selectedRow.trainingId || this.selectedRow.resourceId,
            name: this.trainingParams.name,
            languages
          },
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: true
        })
      }
      this.isShowTrainingDialog = !this.isShowTrainingDialog
    }
  }
}
</script>
