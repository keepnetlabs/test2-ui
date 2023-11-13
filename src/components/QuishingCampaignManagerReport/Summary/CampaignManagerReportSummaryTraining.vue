<template>
  <CampaignManagerSummaryCard icon="mdi-application" :title="labels.TrainingForUsersQuishing">
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
      <TrainingLibraryPreviewDialog
        v-if="isShowTrainingDialog"
        :status="isShowTrainingDialog"
        :call-api="callTrainingPreviewApi"
        :selected-row="selectedRow"
        :training-params="trainingParams"
        :default-selected-languages="selectedTrainingLanguages"
        @on-close="toggleShowTrainingDialog"
      />
      <div class="campaign-manager-last-step__training-template-body pb-4">
        <div class="campaign-manager-last-step__training-template-body-header">
          <div class="campaign-manager-last-step__training-template-body-header-left">
            {{ trainingParams.name }}
          </div>
          <div class="campaign-manager-last-step__training-template-body-header-right">
            <VBtn style="display: none;"></VBtn>
            <Badge
              size="mini"
              color="#2196F3"
              text="Scorm"
              class-name="px-2 py-2"
              :outline="false"
            />
            <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
              <template #content> <v-icon>mdi-web</v-icon>{{ trainingParams.languages }} </template>
            </Badge>
          </div>
        </div>
        <div class="campaign-manager-last-step__training-template-body-header-right__sub">
          <span>{{ getCategoryName }} (category) </span>
          <span>&#8226;</span> <span class="fw-400">by </span>
          <span>{{ trainingParams.companyName }} </span>
        </div>
        <div
          style="
            font-weight: 400;
            font-size: 12px;
            line-height: 19px;
            color: #383b41;
            margin-top: 8px;
          "
        >
          {{ trainingParams.description }}
        </div>
      </div>
    </template>
  </CampaignManagerSummaryCard>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard.vue'
import labels from '@/model/constants/labels'
import Badge from '@/components/Badge.vue'
import TrainingLibraryPreviewDialog from '@/components/AwarenessEducator/TrainingLibraryPreviewDialog.vue'
export default {
  name: 'CampaignManagerReportSummaryTraining',
  components: { TrainingLibraryPreviewDialog, Badge, CampaignManagerSummaryCard },
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
    getCategoryName() {
      return this?.trainingParams?.category || this?.trainingParams?.categoryName
    }
  },
  methods: {
    handlePreviewClick() {
      this.toggleShowTrainingDialog()
    },
    toggleShowTrainingDialog() {
      this.isShowTrainingDialog = !this.isShowTrainingDialog
    }
  }
}
</script>
