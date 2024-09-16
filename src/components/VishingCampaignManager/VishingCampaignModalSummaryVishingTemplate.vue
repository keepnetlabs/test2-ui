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
              <Badge
                size="mini"
                color="#757575"
                class-name="px-2 py-2 ml-2"
                :outline="false"
                :col="{
                  props: {
                    style: {
                      maxWidth: 'unset'
                    }
                  }
                }"
              >
                <template #content>
                  <v-icon :size="16" class="mr-1">mdi-web</v-icon>{{ formValues.template.language }}
                </template>
              </Badge>
              <Badge
                size="mini"
                color="#757575"
                class-name="px-2 py-2 ml-4"
                :outline="false"
                :col="{
                  props: {
                    style: {
                      maxWidth: 'unset'
                    }
                  }
                }"
              >
                <template #content>
                  <v-icon :size="16" class="mr-1">mdi-microphone-outline</v-icon
                  >{{ formValues.template.voice }}
                </template>
              </Badge>
              <div v-if="hasAudioFile" class="vishing-campaign-modal__summary__audio-file-badge">
                <v-icon class="mr-2" color="#ffffff" :size="16">$playfile</v-icon>Audio Files
              </div>
            </div>
          </div>
          <VishingTemplatePreviewSteps
            :showHeader="false"
            :template="formValues.template"
            :isTextToSpeechCompatible="isTextToSpeechCompatible"
            :voiceResourceId="formValues.template.vishingLanguageResourceId"
          />
        </div>
      </template>
    </CampaignManagerSummaryCard>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import labels from '@/model/constants/labels'
import VishingTemplatePreviewSteps from '@/components/VishingTemplates/VishingTemplatePreviewSteps'
import Badge from '@/components/Badge'

export default {
  name: 'VishingCampaignModalSummaryVishingTemplate',
  components: { CampaignManagerSummaryCard, VishingTemplatePreviewSteps, Badge },
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
  computed: {
    hasAudioFile() {
      return (
        this.formValues?.template?.steps?.some((step) => step.inputType === 'FileUpload') ||
        this.formValues?.template?.invalidDialingNotice?.inputType === 'FileUpload'
      )
    },
    isTextToSpeechCompatible() {
      return [2, 3].includes(this.formValues?.template?.voiceProviderTypeId)
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
