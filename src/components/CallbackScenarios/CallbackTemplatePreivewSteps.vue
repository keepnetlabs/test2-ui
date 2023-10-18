<template>
  <div class="callback-template-preview-steps">
    <div class="callback-template-preview-steps__header">
      <span class="callback-template-preview-steps__header-text">Steps</span>
      <div class="callback-template-preview-steps__header-badges">
        <div class="callback-template-preview-steps__header-badge">
          <v-icon class="mr-1" color="#ffffff" :size="16">mdi-web</v-icon>{{ template.language }}
        </div>
        <div class="callback-template-preview-steps__header-badge">
          <v-icon class="mr-1" color="#ffffff" :size="16">mdi-microphone-outline</v-icon
          >{{ template.voice }}
        </div>
        <div v-if="hasAudioFile" class="callback-template-preview-steps__header-badge mr-0">
          <v-icon class="mr-1" color="#ffffff" :size="16">$playfile</v-icon>Audio Files
        </div>
      </div>
    </div>
    <div class="callback-template-preview-steps__steps-container">
      <div class="callback-template-preview-steps__steps">
        <div
          :class="[
            'callback-template-preview-steps__step',
            selectedStep === 'Call Greeting' && 'is-selected'
          ]"
          @click="handleSelectStep('Call Greeting')"
        >
          <span class="callback-template-preview-steps__step-text">{{
            getStepName(template.callGreeting, 'Call Greeting')
          }}</span>
          <div
            v-if="template && template.callGreeting && template.callGreeting.isPhishingCodeStep"
            class="callback-template-preview-steps__step-badge"
          >
            Phishing Code Step
          </div>
        </div>
        <div
          v-for="(step, index) in template.steps"
          :class="[
            'callback-template-preview-steps__step',
            selectedStep === `Step - ${index}` && 'is-selected'
          ]"
          :key="index"
          @click="handleSelectStep('Step', index)"
        >
          <span class="callback-template-preview-steps__step-text">{{
            getStepName(step, 'Step', index + 1)
          }}</span>
          <div v-if="step.isDigitEnteringStep" class="callback-template-preview-steps__step-badge">
            Digit Entering Step
          </div>
        </div>
        <div
          :class="[
            'callback-template-preview-steps__step',
            selectedStep === `Invalid Dialing Notice` && 'is-selected'
          ]"
          @click="handleSelectStep('Invalid Dialing Notice')"
        >
          <span class="callback-template-preview-steps__step-text">{{
            getStepName(template.invalidDialingNotice, 'Invalid Dialing Notice')
          }}</span>
        </div>
        <div class="callback-template-preview-steps__step"></div>
      </div>
      <div class="callback-template-preview-steps__step-details">
        <span class="callback-template-preview-steps__step-text">{{
          getStepName(getSelectedStepObject, getSelectedStepCategory, getSelectedStepIndex)
        }}</span>
        <span v-if="getSelectedStepObject && getSelectedInputType === 'TextToSpeech'">
          {{ getSelectedStepObject?.inputText || '' }}
        </span>
        <template v-if="getSelectedStepObject && getSelectedInputType === 'FileUpload'">
          <span>
            {{ getSelectedStepObject?.inputUrl || '' }}
          </span>
          <AudioPlayer
            v-if="getSelectedStepObject.inputUrl"
            :src="getSelectedStepObject.inputUrl"
          />
        </template>
        <div class="callback-template-preview-steps__step-details-badges">
          <div class="callback-template-preview-steps__step-details-badge">
            <v-icon class="mr-2" color="#757575" :size="16">mdi-web</v-icon>{{ template.language }}
          </div>
          <div class="callback-template-preview-steps__step-details-badge">
            <v-icon color="#757575" :size="16">mdi-microphone-outline</v-icon>{{ template.voice }}
          </div>
        </div>
        <div class="callback-template-preview-steps__step-details-badges">
          <div
            v-if="getSelectedStepObject && !!getSelectedStepObject.inputDigit"
            class="callback-template-preview-steps__step-details-badge callback-template-preview-steps__step-details-badge--digits"
          >
            Required {{ getSelectedStepObject.inputDigit }} digits input
          </div>
          <div
            v-if="isSelectedStepDigitEnteringStep"
            class="callback-template-preview-steps__step-badge"
          >
            Digit Entering Step
          </div>
          <div
            v-if="getSelectedStepObject && getSelectedInputType === 'Pause'"
            class="callback-template-preview-steps__step-details-badge callback-template-preview-steps__step-details-badge--digits"
          >
            Pause for {{ getSelectedStepObject?.duration || 0 }} seconds
          </div>
          <div
            v-if="isSelectedStepPhishingCodeStep"
            class="callback-template-preview-steps__step-badge"
          >
            Phishing Code Step
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer'
export default {
  name: 'CallbackTemplatePreivewSteps',
  components: {
    AudioPlayer
  },
  props: {
    template: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      selectedStep: 'Call Greeting',
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
  computed: {
    hasAudioFile() {
      return (
        this.template?.steps?.some((step) => step?.inputUrl) ||
        this.template?.callGreeting?.inputUrl ||
        this.template?.invalidDialingNotice?.inputUrl
      )
    },
    getSelectedInputType() {
      return this.getSelectedStepObject?.inputType || 'TextToSpeech'
    },
    isSelectedStepPhishingCodeStep() {
      return this.getSelectedStepObject?.isPhishingCodeStep || false
    },
    isSelectedStepDigitEnteringStep() {
      return this.getSelectedStepObject?.isDigitEnteringStep || false
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
