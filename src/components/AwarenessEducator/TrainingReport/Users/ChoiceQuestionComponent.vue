<template>
  <div class="options-list">
    <div
      v-for="option in answerOptions"
      :key="option.optionId || option.text"
      class="option-item"
      :class="{
        selected: option.isUserAnswer,
        correct: option.isCorrect && showCorrectAnswers
      }"
    >
      <span class="option-text">{{ option.text }}</span>
      <div class="option-badges">
        <span v-if="option.isUserAnswer" class="badge badge-selected">Selected</span>
        <span
          v-if="option.isCorrect && showCorrectAnswers"
          class="badge badge-correct"
        >Correct</span>
      </div>
    </div>
  </div>
</template>

<script>
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