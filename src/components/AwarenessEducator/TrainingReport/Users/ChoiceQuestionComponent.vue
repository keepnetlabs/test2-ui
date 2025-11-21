<template>
  <div class="choice-question-container">
    <div class="choice-question-options">
      <div
        v-for="option in answerOptions"
        :key="option.optionId || option.text"
        class="choice-option-item"
        :class="{
          'choice-option-item--selected': option.isUserAnswer,
          'choice-option-item--correct': option.isCorrect && showCorrectAnswers
        }"
      >
        <div class="choice-option-content">
          <span class="choice-option-text">{{ option.text }}</span>
        </div>
        <div class="choice-option-badges">
          <span v-if="option.isUserAnswer" class="choice-badge choice-badge--selected"
            >Selected</span
          >
          <span
            v-if="option.isCorrect && showCorrectAnswers"
            class="choice-badge choice-badge--correct"
            >Correct</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/choice-question-component.scss'

export default {
  name: 'ChoiceQuestionComponent',
  props: {
    answerOptions: {
      type: Array,
      required: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    }
  }
}
</script>
