<template>
  <div class="vishing-template-preview-step">
    <v-btn style="display: none;" />
    <span class="vishing-template-preview-step__title">{{ getStepTitle }}</span>
    <span
      v-if="(isTextToSpeechStep && step.inputText)"
      class="vishing-template-preview-step__text vishing-template-preview-step__text-to-speech-text"
    >
      {{ step.inputText }}
    </span>
    <template v-if="isFileUploadStep">
      <span
        v-if="(isFileUploadStep && step.inputUrl)"
        class="vishing-template-preview-step__file-name"
      >
        {{ getFileName(step.inputUrl) }}
      </span>
      <AudioPlayer v-if="step.inputUrl" ref="refAudioPlayer" :src="step.inputUrl" />
    </template>
    <div v-if="hasTags" class="vishing-template-preview-step__tags">
      <Badge
        v-if="hasRequiredDigitCount"
        color="#E0E0E0"
        textBlack
        size="auto"
        className="vishing-template-preview-step__tags__required-digit-tag"
        :outline="false"
        :text="getRequiredDigitCountTagText"
      />
      <Badge
        v-if="step.isVishingStep"
        className="vishing-template-preview-step__tags__vishing-step-tag"
        color="#B83A3A"
        text="Vishing Step"
        outline
      />
    </div>
    <span
      v-if="step.duration"
      class="vishing-template-preview-step__text vishing-template-preview-step__pause-duration-text"
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
  name: 'VishingTemplatePreviewStep',
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
      return `Step ${this.index + 1} - ${this.getBeautifedStepType}`
    },
    getBeautifedStepType() {
      if (!this.step?.inputType) return 'Text to Speech'
      if (this.step.inputType === 'TextToSpeech') return 'Text to Speech'
      if (this.step.inputType === 'FileUpload') return 'Upload Audio'
      if (this.step.inputType === 'Pause') return 'Pause'
      return ''
    },
    isTextToSpeechStep() {
      return this.step.inputType === 'TextToSpeech'
    },
    isFileUploadStep() {
      return this.step.inputType === 'FileUpload'
    },
    hasTags() {
      return this.hasRequiredDigitCount || this.step.isVishingStep
    },
    hasRequiredDigitCount() {
      return !!this.step.inputDigit
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
    }
  }
}
</script>
