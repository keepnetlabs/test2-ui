<template>
  <div class="likert-question-container">
    <div class="likert-response-container">
      <div class="likert-answer-field">
        <span class="likert-answer-label">User's Answer:</span>
        <div class="likert-answer-list">
          <div v-if="userResponses.length === 0" class="likert-item">
            <div class="likert-response-text">No likert responses found</div>
          </div>
          <div v-for="(response, index) in userResponses" :key="index" class="likert-item">
            <div class="likert-question-number">{{ index + 1 }}</div>
            <div class="likert-response-text">{{ response }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/likert-component.scss'

export default {
  name: 'LikertComponent',
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
    userResponses() {
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return []
      }

      // Kullanıcının verdiği likert cevaplarını al (isUserAnswer: true)
      const userAnswer = this.answerOptions.find((option) => option.isUserAnswer)

      if (userAnswer && userAnswer.option) {
        // "0_Strongly_Disagree, 1_Strongly_Disagree, ..." formatını parse et
        return userAnswer.option.split(', ').map((response, index) => {
          // "0_Strongly_Disagree" formatından "Strongly Disagree" çıkar
          const parts = response.split('_')
          if (parts.length > 1) {
            // İlk sayıyı çıkar, geriye kalanları birleştir ve _ yerine boşluk koy
            return parts.slice(1).join(' ').replaceAll(/_/g, ' ')
          }
          return response
        })
      }

      return []
    }
  }
}
</script>
