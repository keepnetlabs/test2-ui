<template>
  <div class="vishing-template-preview-steps">
    <div v-if="showHeader" class="vishing-template-preview-steps__header">
      <span class="vishing-template-preview-steps__header-text">Steps</span>
      <div class="vishing-template-preview-steps__header-badges">
        <div class="vishing-template-preview-steps__header-badge">
          <v-icon class="mr-1" color="#ffffff" :size="16">mdi-web</v-icon>{{ template.language }}
        </div>
        <div class="vishing-template-preview-steps__header-badge">
          <v-icon class="mr-1" color="#ffffff" :size="16">mdi-microphone-outline</v-icon
          >{{ template.voice }}
        </div>
        <div v-if="hasAudioFile" class="vishing-template-preview-steps__header-badge mr-0">
          <v-icon class="mr-1" color="#ffffff" :size="16">$playfile</v-icon>Audio Files
        </div>
      </div>
    </div>
    <div style="width: 100%; height: calc(100% - 75px);">
      <div class="vishing-template-preview-steps__steps-container">
        <div class="vishing-template-preview-steps__steps">
          <div
            v-for="(step, index) in template.steps"
            :class="[
              'vishing-template-preview-steps__step',
              selectedStep === `Step - ${index}` && 'is-selected'
            ]"
            :key="index"
            @click="handleSelectStep('Step', index)"
          >
            <span class="vishing-template-preview-steps__step-text">{{
              getStepName(step, 'Step', index + 1)
            }}</span>
            <div v-if="step.isVishingStep" class="vishing-template-preview-steps__step-badge">
              Vishing Step
            </div>
          </div>
          <div
            :class="[
              'vishing-template-preview-steps__step',
              selectedStep === `Invalid Dialing Notice` && 'is-selected'
            ]"
            @click="handleSelectStep('Invalid Dialing Notice')"
          >
            <span class="vishing-template-preview-steps__step-text">{{
              getStepName(template.invalidDialingNotice, 'Invalid Dialing Notice')
            }}</span>
          </div>
        </div>
        <div class="vishing-template-preview-steps__step-details">
          <span class="vishing-template-preview-steps__step-text">{{
            getStepName(getSelectedStepObject, getSelectedStepCategory, getSelectedStepIndex)
          }}</span>
          <template v-if="getSelectedStepObject && getSelectedInputType === 'TextToSpeech'">
            <span>
              {{ getInputText }}
            </span>
            <div
              v-if="getSelectedStepObject && getSelectedInputType !== 'Pause'"
              class="vishing-template-preview-steps__step-details-badges"
            >
              <div class="vishing-template-preview-steps__step-details-badge">
                <v-icon class="mr-2" color="#757575" :size="16">mdi-web</v-icon
                >{{ template.language }}
              </div>
              <div class="vishing-template-preview-steps__step-details-badge">
                <v-icon color="#757575" :size="16">mdi-microphone-outline</v-icon
                >{{ template.voice }}
              </div>
            </div>
            <AudioPlayer
              ref="refTTSAudioPlayer"
              @srcError="playInputText"
              :key="componentKey"
              :src="ttsUrl"
              :isFetchingTTSUrl="isFetchingTTSUrl"
              :isTextToSpeechCompatible="isTextToSpeechCompatible"
            />
          </template>
          <template v-if="getSelectedStepObject && getSelectedInputType === 'FileUpload'">
            <div class="d-flex align-center">
              <div
                v-if="hasAudioFile"
                class="vishing-template-preview-steps__step-details-badge mr-2"
                style="min-width: 110px;"
              >
                <v-icon class="mr-2" color="#757575" :size="16">$playfile-gray</v-icon>File Audio
              </div>
              <span style="overflow-wrap: anywhere;">
                {{ getInputUrl }}
              </span>
            </div>
            <AudioPlayer
              v-if="getSelectedStepObject.inputUrl"
              :src="getSelectedStepObject.inputUrl"
            />
          </template>
          <div class="vishing-template-preview-steps__step-details-badges">
            <div
              v-if="getSelectedStepObject && !!getSelectedStepObject.inputDigit"
              class="vishing-template-preview-steps__step-details-badge vishing-template-preview-steps__step-details-badge--digits"
            >
              Required {{ getSelectedStepObject.inputDigit }} digit{{
                getSelectedStepObject.inputDigit > 1 ? 's' : ''
              }}
              input
            </div>
            <div
              v-if="getSelectedStepObject && getSelectedInputType === 'Pause'"
              class="vishing-template-preview-steps__step-details-badge vishing-template-preview-steps__step-details-badge--digits"
            >
              Pause for {{ getPauseDuration }} seconds
            </div>
            <div
              v-if="isSelectedStepVishingStep"
              class="vishing-template-preview-steps__step-badge"
            >
              Vishing Step
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer'
import { playTextToSpeech } from '@/api/vishing'
export default {
  name: 'VishingTemplatePreivewSteps',
  components: {
    AudioPlayer
  },
  props: {
    template: {
      type: Object,
      required: true
    },
    isTextToSpeechCompatible: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    voiceResourceId: {
      type: String
    }
  },
  data() {
    return {
      retryCount: 5,
      componentKey: '',
      ttsUrl: '',
      isFetchingTTSUrl: false,
      selectedStep: 'Step - 0',
      inputTypeItems: [
        {
          value: 'TextToSpeech',
          text: 'Text to Speech'
        },
        {
          value: 'FileUpload',
          text: 'Upload Audio'
        },
        {
          value: 'Pause',
          text: 'Pause'
        }
      ]
    }
  },
  watch: {
    selectedStep() {
      this.componentKey = Math.random()
      this.retryCount = 5
    },
    getSelectedInputType: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!this.getSelectedStepObject) return
        if (val === 'TextToSpeech' && this.isTextToSpeechCompatible) {
          this.playInputText()
        }
      }
    }
  },
  computed: {
    getInputText() {
      return this.getSelectedStepObject?.inputText || ''
    },
    getPauseDuration() {
      return this.getSelectedStepObject?.duration || 0
    },
    getInputUrl() {
      return this.getSelectedStepObject?.inputUrl || ''
    },
    hasAudioFile() {
      return (
        this.template?.steps?.some((step) => step?.inputType === 'FileUpload') ||
        this.template?.callGreeting?.inputType === 'FileUpload' ||
        this.template?.invalidDialingNotice?.inputType === 'FileUpload'
      )
    },
    getSelectedInputType() {
      return this.getSelectedStepObject?.inputType || 'TextToSpeech'
    },
    isSelectedStepVishingStep() {
      return this.getSelectedStepObject?.isVishingStep || false
    },
    getSelectedStepObject() {
      if (!this.template || !this.selectedStep) return null
      if (this.selectedStep.includes('Step')) {
        const stepIndex = this.selectedStep.split('Step - ')[1]
        return this.template?.steps?.[stepIndex]
      }
      if (this.selectedStep.includes('Invalid')) {
        return this.template?.invalidDialingNotice
      }
      return this.template?.callGreeting
    },
    getSelectedStepCategory() {
      if (this.selectedStep.includes('Step')) {
        return 'Step'
      }

      if (this.selectedStep.includes('Invalid')) {
        return 'Invalid Dialing Notice'
      }

      return 'Call Greeting'
    },
    getSelectedStepIndex() {
      if (this.selectedStep.includes('Step')) {
        const stepIndex = parseInt(this.selectedStep.split('Step - ')[1])
        return stepIndex + 1
      }
      return 0
    }
  },
  methods: {
    playInputText() {
      if (!this.getSelectedStepObject?.inputText) return
      if (!this.retryCount) return
      this.retryCount--
      this.componentKey = Math.random()
      this.isFetchingTTSUrl = true
      const payload = {
        inputText: this.getSelectedStepObject?.inputText || '',
        voiceResourceId: this.voiceResourceId
      }
      playTextToSpeech(payload)
        .then((res) => {
          if (res?.data?.data) {
            this.ttsUrl = res?.data?.data
          }
        })
        .finally(() => {
          this.isFetchingTTSUrl = false
        })
    },
    getStepName(step, category = 'Step', order = 1) {
      if (!step) return
      if (category === 'Step') {
        return `Step ${order} - ${this.getInputTypeName(step.inputType)}`
      } else {
        return `${category} - ${this.getInputTypeName(step.inputType)}`
      }
    },
    getInputTypeName(inputType) {
      return this.inputTypeItems.find((it) => it.value === inputType)?.text || 'Text to Speech'
    },
    handleSelectStep(category = 'Step', index = 0) {
      if (category === 'Step') {
        this.selectedStep = `Step - ${index}`
      } else {
        this.selectedStep = category
      }
    }
  }
}
</script>
