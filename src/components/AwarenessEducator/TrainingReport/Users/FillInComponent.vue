<template>
  <div class="fill-in-question-container">
    <div class="fill-in-response-container">
      <div class="fill-in-answer-field">
        <label class="fill-in-answer-label">User's Answer:</label>
        <div class="fill-in-answer-input">
          {{ getUserAnswer }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/fill-in-component.scss'

export default {
  name: 'FillInComponent',
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

      // Fill-in tipi için genelde tek bir cevap vardır, ilk elemanı al
      const firstAnswer = this.answerOptions[0]
      return firstAnswer
        ? firstAnswer.text || firstAnswer.option || 'No answer provided'
        : 'No answer provided'
    }
  }
}
</script>
