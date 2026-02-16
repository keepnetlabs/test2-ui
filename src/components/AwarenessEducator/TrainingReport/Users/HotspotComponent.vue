<template>
  <div class="hotspot-question-container">
    <div class="hotspot-response-container">
      <div class="hotspot-answer-field">
        <span class="hotspot-answer-label">User's Answer:</span>
        <div class="hotspot-answer-list">
          <div v-for="(spot, index) in userHotspots" :key="index" class="hotspot-item">
            <div class="hotspot-text">{{ spot }}</div>
            <div class="hotspot-badge">{{ index + 1 }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/components/training-report/hotspot-component.scss'

export default {
  name: 'HotspotComponent',
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
    userHotspots() {
      if (!this.answerOptions || this.answerOptions.length === 0) {
        return []
      }

      // Kullanıcının seçtiği hotspot'ları al (isUserAnswer: true)
      const userAnswers = this.answerOptions.filter((option) => option.isUserAnswer)

      return userAnswers.map((option) => {
        return option.text || option.option || option.answer || 'Hotspot Area'
      })
    }
  }
}
</script>
