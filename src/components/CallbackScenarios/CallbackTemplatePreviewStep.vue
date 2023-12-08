<template>
  <div class="callback-template-preview-step">
    <v-btn style="display: none;" />
    <span class="callback-template-preview-step__title">{{ getStepTitle }}</span>
    <span
      v-if="isTextToSpeechStep && step.inputText"
      class="callback-template-preview-step__text callback-template-preview-step__text-to-speech-text"
    >
      {{ step.inputText }}
    </span>
    <template v-if="isFileUploadStep">
      <span
        v-if="isFileUploadStep && step.inputUrl"
        class="callback-template-preview-step__file-name"
      >
        {{ getFileName(step.inputUrl) }}
      </span>
      <AudioPlayer
        v-if="step && step.inputUrl"
        ref="refAudioPlayer"
        :src="step.inputUrl"
        @play="handleAudioPlay"
        @pause="handleAudioPause"
      />
    </template>
    <div v-if="hasTags" class="callback-template-preview-step__tags">
      <Badge
        v-if="hasRequiredDigitCount"
        color="#E0E0E0"
        textBlack
        size="auto"
        className="callback-template-preview-step__tags__required-digit-tag"
        :outline="false"
        :text="getRequiredDigitCountTagText"
      />
      <Badge
        v-if="step && step.isVishingStep"
        className="callback-template-preview-step__tags__callback-step-tag"
        color="#B83A3A"
        text="Vishing Step"
        outline
      />
    </div>
    <span
      v-if="step && step.duration"
      class="callback-template-preview-step__text callback-template-preview-step__pause-duration-text"
    >
      {{ `Pause for ${step.duration} seconds` }}
    </span>
  </div>
</template>

<script>
import Badge from '@/components/Badge'
import AudioPlayer from '@/components/AudioPlayer'
import * as validations from '@/utils/validations'
export default {
  name: 'CallbackTemplatePreviewStep',
  components: {
    Badge,
    AudioPlayer
  },
  props: {
    step: {
      type: Object
    },
    index: {
      type: Number
    }
  },
  computed: {
    getStepTitle() {
      return `Step ${this.index + 1} - ${this.getBeautifiedStepType}`
    },
    getBeautifiedStepType() {
      if (!this.step?.inputType) return 'Text to Speech'
      if (this.step.inputType === 'TextToSpeech') return 'Text to Speech'
      if (this.step.inputType === 'FileUpload') return 'Upload Audio'
      if (this.step.inputType === 'Pause') return 'Pause'
      return ''
    },
    isTextToSpeechStep() {
      return this.step?.inputType === 'TextToSpeech'
    },
    isFileUploadStep() {
      return this.step?.inputType === 'FileUpload'
    },
    hasTags() {
      return this.hasRequiredDigitCount || this.step?.isVishingStep
    },
    hasRequiredDigitCount() {
      return !!this.step?.inputDigit
    },
    getRequiredDigitCountTagText() {
      return this.hasRequiredDigitCount ? `Required ${this.step.inputDigit} digits input` : ''
    }
  },
  methods: {
    getFileName(url = '') {
      if (validations.url(url)) {
        const lastSlashIndex = this.step.inputUrl.lastIndexOf('/') + 1
        const fileName = this.step.inputUrl.substring(lastSlashIndex)
        return fileName
      }
      return url
    },
    handleAudioPlay() {
      this.$emit('play')
    },
    handleAudioPause() {
      this.$emit('pause')
    }
  }
}
</script>
