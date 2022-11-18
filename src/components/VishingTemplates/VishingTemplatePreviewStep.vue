<template>
  <div class="vishing-template-preview-step">
    <v-btn style="display: none;" />
    <span class="vishing-template-preview-step__title">{{ getStepTitle }}</span>
    <span v-if="isTextToSpeechStep" class="vishing-template-preview-step__text">
      {{ step.textToSpeech }}
    </span>
    <span v-if="step.fileName" class="vishing-template-preview-step__file-name">
      {{ step.fileName }}
    </span>
    <div v-if="hasTags" class="vishing-template-preview-step__tags">
      <Badge
        v-if="hasRequiredDigitCount"
        color="#E0E0E0"
        textBlack
        size="auto"
        :outline="false"
        :text="getRequiredDigitCountTagText"
      />
      <Badge v-if="step.isFailStep" color="#B83A3A" text="Vishing Step" :outline="false" />
    </div>
    <span v-if="step.pauseSeconds" class="vishing-template-preview-step__text">
      {{ `Pause for ${step.pauseSeconds} seconds` }}
    </span>
  </div>
</template>

<script>
import Badge from '@/components/Badge'
export default {
  name: 'VishingTemplatePreviewStep',
  components: {
    Badge
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
      return `Step ${this.index + 1} - ${this.step.type}`
    },
    isTextToSpeechStep() {
      return this.step.type === 'Text to Speech'
    },
    hasTags() {
      return this.hasRequiredDigitCount || this.step.isFailStep
    },
    hasRequiredDigitCount() {
      return this.step.requiredDigitCount !== undefined
    },
    getRequiredDigitCountTagText() {
      return this.hasRequiredDigitCount
        ? `Required ${this.step.requiredDigitCount} digits input`
        : ''
    }
  }
}

// interface Step {
//     type: 'Text to Speech' | 'Upload Audio' | 'Pause';
//     textToSpeech?: string;
//     fileName?: string;
//     fileUrl?: string;
//     requiredDigitCount?: number;
//     isFailStep: boolean;
//     pauseSeconds?: number
// }
</script>
