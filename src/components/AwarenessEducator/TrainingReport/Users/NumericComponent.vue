<template>
  <div class="numeric-question-container">
    <div class="numeric-response-container">
      <div class="numeric-answer-field">
        <label class="numeric-answer-label">User's Answer:</label>
        <div class="numeric-answer-input">
          {{ getUserAnswer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/numeric-component.scss'

export default {
  name: 'NumericComponent',
  props: {
    answerOptions: {
      type: Array,
      required: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getUserAnswer() {
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return 'No answer provided'
      }

      // Numeric tipi için genelde tek bir cevap vardır, ilk elemanı al
      const firstAnswer = this.answerOptions[0]
      return firstAnswer ? (firstAnswer.text || firstAnswer.option || 'No answer provided') : 'No answer provided'
    }
  }
}
</script>