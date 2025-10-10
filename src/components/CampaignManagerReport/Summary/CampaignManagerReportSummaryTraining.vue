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
        // Kapatma
        this.$store.commit('trainingLibrary/SET_TRAINING_PREVIEW_DIALOG', {
          status: false,
          selectedRow: null,
          showSendButton: true,
          type: TRAINING_LIBRARY_TYPES.TRAINING,
          onlyPreview: false
        })
      } else {
        // Açma
        // languageList varsa ondan language ID'leri al
        let languages = []

        if (this.trainingParams.languageList && Array.isArray(this.trainingParams.languageList)) {
          languages = this.trainingParams.languageList.map((lang) => lang.languageId)
        } else if (this.selectedTrainingLanguages && this.selectedTrainingLanguages.length > 0) {
          // selectedTrainingLanguages varsa map et
          languages = this.selectedTrainingLanguages.map((lang) => {
            if (typeof lang === 'object' && lang.languageId) {
              return lang.languageId
            }
            if (typeof lang === 'object' && lang.code) {
              return lang.code
            }
            return lang
          })
        } else if (typeof this.trainingParams.languages === 'string') {
          // trainingParams.languages string ise split et
          languages = this.trainingParams.languages.split('|').map((l) => l.trim())
        } else if (Array.isArray(this.trainingParams.languages)) {
          languages = this.trainingParams.languages
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
