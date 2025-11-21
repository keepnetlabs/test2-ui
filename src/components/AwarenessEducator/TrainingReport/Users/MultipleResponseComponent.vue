<template>
  <div class="multiple-response-question-container">
    <div class="multiple-response-question-options">
      <div
        v-for="option in answerOptions"
        :key="option.optionId || option.text"
        class="multiple-response-option-item"
        :class="{
          'multiple-response-option-item--selected': option.isUserAnswer,
          'multiple-response-option-item--correct': option.isCorrect && showCorrectAnswers
        }"
      >
        <div class="multiple-response-option-content">
          <i
            :class="
              option.isUserAnswer ? 'mdi mdi-checkbox-marked' : 'mdi mdi-checkbox-blank-outline'
            "
            class="multiple-response-checkbox-icon"
          ></i>
          <span class="multiple-response-option-text">{{ option.text }}</span>
        </div>
        <div class="multiple-response-option-badges">
          <span
            v-if="option.isUserAnswer"
            class="multiple-response-badge multiple-response-badge--selected"
            >Selected</span
          >
          <span
            v-if="option.isCorrect && showCorrectAnswers"
            class="multiple-response-badge multiple-response-badge--correct"
            >Correct</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/multiple-response-component.scss'

export default {
  name: 'MultipleResponseComponent',
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
