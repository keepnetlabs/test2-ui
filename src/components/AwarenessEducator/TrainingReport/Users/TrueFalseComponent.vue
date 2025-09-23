<template>
  <div class="true-false-question-container">
    <div class="true-false-question-options">
      <div
        v-for="option in answerOptions"
        :key="option.optionId || option.text"
        class="true-false-option-card"
        :class="{
          'true-false-option-card--selected': option.isUserAnswer,
          'true-false-option-card--correct': option.isCorrect && showCorrectAnswers
        }"
      >
        <div class="true-false-option-header">
          <span class="true-false-option-text">{{ option.text }}</span>
        </div>
        <div class="true-false-option-badges">
          <span v-if="option.isUserAnswer" class="true-false-badge true-false-badge--selected">Selected</span>
          <span v-if="option.isCorrect && showCorrectAnswers" class="true-false-badge true-false-badge--correct"
            >Correct</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/true-false-component.scss'

export default {
  name: 'TrueFalseComponent',
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
  methods: {
    isTrueOption(text) {
      return text && (text.toLowerCase().includes('true') || text.toLowerCase().includes('doğru'))
    },
    isFalseOption(text) {
      return text && (text.toLowerCase().includes('false') || text.toLowerCase().includes('yanlış'))
    }
  }
}
</script>

