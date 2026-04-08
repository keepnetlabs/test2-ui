<template>
  <div class="callback-campaign-modal__summary__template">
    <CampaignManagerSummaryCard
      icon="$callback"
      title="Callback Template"
      :isLoading="isFetchingSummary"
    >
      <template #body>
        <div v-if="template" class="callback-campaign-modal__summary__template-body pb-4">
          <div class="callback-campaign-modal__summary__template-body-header">
            <div class="callback-campaign-modal__summary__template-body-header-left">
              {{ template.name }}
            </div>
            <div class="callback-campaign-modal__summary__template-body-header-right">
              <v-btn style="display: none;"></v-btn>
              <Badge
                size="mini"
                :color="getBadgeColor(template.difficulty)"
                :text="getBadgeText(template.difficulty)"
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
                  <v-icon :size="16" class="mr-1">mdi-web</v-icon>{{ template.language }}
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
                  >{{ template.voice }}
                </template>
              </Badge>
              <div v-if="hasAudioFile" class="callback-campaign-modal__summary__audio-file-badge">
                <v-icon class="mr-2" color="#ffffff" :size="16">$playfile</v-icon>Audio Files
              </div>
            </div>
          </div>
          <CallbackTemplatePreviewSteps
            :showHeader="false"
            :template="template"
            :isTextToSpeechCompatible="isTextToSpeechCompatible"
            :voiceResourceId="template.vishingLanguageResourceId"
          />
        </div>
      </template>
    </CampaignManagerSummaryCard>
  </div>
</template>

<script>
import CampaignManagerSummaryCard from '@/components/CampaignManager/Summary/CampaignManagerSummaryCard'
import CallbackTemplatePreviewSteps from '@/components/CallbackScenarios/CallbackTemplatePreviewSteps'
import Badge from '@/components/Badge'

export default {
  name: 'CallbackCampaignModalSummaryCallbackTemplate',
  components: { CampaignManagerSummaryCard, CallbackTemplatePreviewSteps, Badge },
  props: {
    formValues: {
      type: Object
    },
    isFetchingSummary: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    template() {
      return this.formValues?.template || null
    },
    hasAudioFile() {
      return (
        this.template?.steps?.some((step) => step.inputType === 'FileUpload') ||
        this.template?.invalidDialingNotice?.inputType === 'FileUpload' ||
        this.template?.callGreeting?.inputType === 'FileUpload'
      )
    },
    isTextToSpeechCompatible() {
      return [2, 3].includes(this.template?.voiceProviderTypeId)
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
    }
  }
}
</script>
