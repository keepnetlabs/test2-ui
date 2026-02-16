<template>
  <div class="word-bank-question-container">
    <div class="word-bank-response-container">
      <div class="word-bank-answer-field">
        <span class="word-bank-answer-label">User's Answer:</span>
        <div class="word-bank-answer-list">
          <div v-for="(word, index) in userWords" :key="index" class="word-bank-item">
            <div class="word-bank-word">{{ word }}</div>
            <div class="word-bank-position">{{ getOrdinalNumber(index + 1) }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/word-bank-component.scss'

export default {
  name: 'WordBankComponent',
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
    userWords() {
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return []
      }

      // Kullanıcının yerleştirdiği kelimeleri al (isUserAnswer: true)
      const userAnswers = this.answerOptions.filter((option) => option.isUserAnswer)

      return userAnswers.map((option) => {
        return option.text || option.option || option.answer || ''
      })
    }
  },
  methods: {
    getOrdinalNumber(num) {
      const ordinals = {
        1: '1st',
        2: '2nd',
        3: '3rd'
      }

      if (ordinals[num]) {
        return ordinals[num]
      }

      return `${num}th`
    }
  }
}
</script>
