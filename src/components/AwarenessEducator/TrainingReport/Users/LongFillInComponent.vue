<template>
  <div class="long-fill-in-question-container">
    <div class="long-fill-in-response-container">
      <div class="long-fill-in-answer-field">
        <label class="long-fill-in-answer-label">User's Answer:</label>
        <div class="long-fill-in-answer-box">
          <div class="long-fill-in-text">{{ getUserResponse }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/long-fill-in-component.scss'

export default {
  name: 'LongFillInComponent',
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
    getUserResponse() {
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return 'No response provided'
      }

      // Kullanıcının yazdığı essay cevabını al (isUserAnswer: true)
      const userAnswer = this.answerOptions.find(option => option.isUserAnswer)

      if (userAnswer) {
        return userAnswer.text || userAnswer.option || userAnswer.answer || 'No response provided'
      }

      return 'No response provided'
    }
  }
}
</script>