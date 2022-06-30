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
    <div v-if="step.fileUrl" class="vishing-template-preview-step__audio">
      <AudioPlayer :src="step.fileUrl" type="client" />
    </div>
    <div v-if="hasTags" class="vishing-template-preview-step__tags">
      <Badge
        v-if="hasRequiredDigitCount"
        color="#E0E0E0"
        isBlackText
        size="auto"
        :outline="false"
        :text="getRequiredDigitCountTagText"
      />
      <Badge v-if="step.isFailStep" color="#B6791D" text="Fail Step" :outline="false" />
    </div>
  </div>
</template>

<script>
import AudioPlayer from '@/components/AudioPlayer'
import Badge from '@/components/Badge'
export default {
  name: 'VishingTemplatePreviewStep',
  components: {
    AudioPlayer,
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
// }
</script>

<style lang="scss">
.vishing-template-preview-step {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &__title {
    font-weight: 600;
    font-size: 14px;
    color: #383b41;
  }

  &__text {
    font-weight: 400;
    font-size: 14px;
    color: #383b41;
  }

  &__file-name {
    font-weight: 400;
    font-size: 12px;
    color: #383b41;
  }

  &__tags {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__required-digit-tag {
    border: none !important;
  }
}

#vishing-template-preview-step__required-digit-tag {
  border: none !important;
}
</style>
