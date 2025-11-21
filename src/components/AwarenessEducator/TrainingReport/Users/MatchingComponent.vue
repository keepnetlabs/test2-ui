<template>
  <div class="matching-question-container">
    <div class="matching-response-container">
      <div class="matching-answer-field">
        <label class="matching-answer-label">User's Matches:</label>
        <div class="matching-answer-list">
          <div v-for="(match, index) in userMatches" :key="index" class="matching-item">
            <div class="matching-left">{{ match.left }}</div>
            <div class="matching-arrow">
              <i class="mdi mdi-arrow-right"></i>
            </div>
            <div class="matching-right">{{ match.right }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/matching-component.scss'

export default {
  name: 'MatchingComponent',
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
    userMatches() {
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return []
      }

      // Sadece kullanıcının eşleştirdiği cevapları al (isUserAnswer: true)
      const userAnswers = this.answerOptions.filter((option) => option.isUserAnswer)

      return userAnswers.map((option) => {
        const text = option.text || option.option || option.answer || ''

        // "Item 1 → Match 1" formatını parse et
        const arrowMatch = text.match(/^(.+?)\s*→\s*(.+)$/)
        if (arrowMatch) {
          return {
            left: arrowMatch[1].trim(),
            right: arrowMatch[2].trim()
          }
        }

        // Eğer arrow formatı yoksa, text'i böl
        const parts = text.split('→').map((part) => part.trim())
        if (parts.length >= 2) {
          return {
            left: parts[0],
            right: parts[1]
          }
        }

        // Fallback: tüm text'i sol tarafa koy
        return {
          left: text,
          right: ''
        }
      })
    }
  }
}
</script>
