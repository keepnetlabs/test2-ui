<template>
  <div class="vishing-campaign-modal__summary__template">
    <CampaignManagerSummaryCard icon="$domain" :title="labels.VishingTemplate">
      <template #body>
        <div class="vishing-campaign-modal__summary__template-body pb-4">
          <div class="vishing-campaign-modal__summary__template-body-header">
            <div class="vishing-campaign-modal__summary__template-body-header-left">
              {{ formValues.template.name }}
            </div>
            <div class="vishing-campaign-modal__summary__template-body-header-right">
              <v-btn style="display: none;"></v-btn>
              <Badge
                size="mini"
                :color="getBadgeColor(formValues.template.difficulty)"
                :text="getBadgeText(formValues.template.difficulty)"
                :outline="false"
              />
              <Badge size="mini" color="#757575" class-name="px-2 py-2" :outline="false">
                <template #content>
                  <v-icon :size="16" class="mr-1">mdi-web</v-icon>{{ formValues.template.language }}
                </template>
              </Badge>
            </div>
          </div>
          <div class="vishing-campaign-modal__summary__template-steps">
            <div>
              <div
                v-for="(step, index) in formValues.template.steps"
                :class="{
                  'vishing-campaign-modal__summary__template-step': true,
                  'vishing-campaign-modal__summary__template-step--selected':
                    selectedTemplateStepIndex === index
                }"
                :key="index"
                @click="handleSelectedTemplateStepChange(index)"
              >
                <span class="vishing-campaign-modal__summary__template-step-name">
                  {{ getStepName(step, index) }}
                </span>
                <Badge v-if="step.isVishingStep" color="#B83A3A" text="Vishing Step" />
                <div v-else />
              </div>
            </div>
            <div class="vishing-campaign-modal__summary__template-step-preview">
              <VishingTemplatePreviewStep
                :index="selectedTemplateStepIndex"
                :step="formValues.template.steps[selectedTemplateStepIndex]"
              />
            </div>
          </div>
        </div>
      </template>
    </CampaignManagerSummaryCard>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import VishingTemplatePreviewStep from '@/components/VishingTemplates/VishingTemplatePreviewStep'
import Badge from '@/components/Badge'

export default {
  name: 'VishingCampaignModalSummaryVishingTemplate',
  components: { CampaignManagerSummaryCard, VishingTemplatePreviewStep, Badge },
  props: {
    formValues: {
      type: Object
    }
  },
  data() {
    return {
      labels,
      selectedTemplateStepIndex: 0
    }
  },
  methods: {
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
    },
    handleSelectedTemplateStepChange(index) {
      this.selectedTemplateStepIndex = index
    },
    getStepName(step, index) {
      return `Step ${index + 1} - ${this.getStepText(step.type || step.inputType)}`
    },
    getStepText(step) {
      if (step === 'TextToSpeech') return 'Text to Speech'
      if (step === 'FileUpload') return 'Upload Audio'
      if (step === 'Pause') return 'Pause'
      return ''
    }
  }
}
</script>
