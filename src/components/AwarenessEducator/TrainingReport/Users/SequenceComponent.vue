<template>
  <div class="sequence-question-container">
    <div class="sequence-response-container">
      <div class="sequence-answer-field">
        <span class="sequence-answer-label">User's Sequence:</span>
        <div class="sequence-answer-list">
          <div v-for="(item, index) in userSequence" :key="index" class="sequence-item">
            <div class="sequence-number">{{ index + 1 }}.</div>
            <div class="sequence-text">{{ item }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/sequence-component.scss'

export default {
  name: 'SequenceComponent',
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
    userSequence() {
      // answerOptions array'i zaten kullanıcının sıraladığı şekilde geliyor
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return []
      }

      return this.answerOptions.map((option) => option.text || option.option || option.answer)
    }
  }
}
</script>
