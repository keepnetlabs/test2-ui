<template>
  <div class="dropdown-question-container">
    <div class="dropdown-response-container">
      <div class="dropdown-answer-field">
        <span class="dropdown-answer-label">User's Answer:</span>
        <div class="dropdown-answer-input">
          <span class="dropdown-selected-text">{{ getUserSelection }}</span>
          <i class="mdi mdi-chevron-down dropdown-icon"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/dropdown-component.scss'

export default {
  name: 'DropdownComponent',
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
    getUserSelection() {
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return 'No selection made'
      }

      // Kullanıcının seçtiği cevabı bul (isUserAnswer: true)
      const userAnswer = this.answerOptions.find((option) => option.isUserAnswer)

      if (userAnswer) {
        return userAnswer.text || userAnswer.option || userAnswer.answer
      }

      return 'No selection made'
    }
  }
}
</script>
