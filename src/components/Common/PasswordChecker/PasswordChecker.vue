<template>
  <div class="password-complexity">
    <div class="password-complexity__content">
      <div class="password-complexity__content-label">Password strength:</div>
      <div class="password-complexity__content-checker">
        <div
          id="text--password-checker-0"
          class="password-complexity__content-checker--group"
          :style="{ background: getPasswordColor }"
        >
          <span v-if="complexity === 1">Very Weak</span>
        </div>
        <div
          id="text--password-checker-1"
          class="password-complexity__content-checker--group"
          :class="getPasswordColor"
          :style="{ background: (complexity > 1 && getPasswordColor) || '#e0e0e0' }"
        >
          <span v-if="complexity === 2">Weak</span>
        </div>
        <div
          id="text--password-checker-2"
          class="password-complexity__content-checker--group"
          :class="getPasswordColor"
          :style="{ background: (complexity > 2 && getPasswordColor) || '#e0e0e0' }"
        >
          <span v-if="complexity === 3">Medium</span>
        </div>
        <div
          id="text--password-checker-3"
          class="password-complexity__content-checker--group"
          :class="getPasswordColor"
          :style="{ background: (complexity > 3 && getPasswordColor) || '#e0e0e0' }"
        >
          <span v-if="complexity === 4">Strong</span>
        </div>
        <div
          class="password-complexity__content-checker--group"
          :class="getPasswordColor"
          :style="{ background: (complexity > 4 && getPasswordColor) || '#e0e0e0' }"
        >
          <span v-if="complexity === 5">Very Strong</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { passwordComplexity } from '@/utils/functions'

export default {
  name: 'PasswordChecker',
  props: {
    password: { required: true }
  },
  data() {
    return {
      complexity: 1
    }
  },
  computed: {
    passwordComplexity() {
      return passwordComplexity(this.password)
    },
    getPasswordColor() {
      let score = this.passwordComplexity || 0
      let color
      if (score <= 20) {
        color = '#f56c6c'
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.complexity = 1
      } else if (score >= 21 && score <= 40) {
        color = '#e6a23c'
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.complexity = 2
      } else if (score >= 41 && score <= 60) {
        color = '#00bcd4'
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.complexity = 3
      } else if (score >= 61 && score <= 80) {
        color = '#2196f3'
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.complexity = 4
      } else if (score >= 81) {
        color = '#43a047'
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.complexity = 5
      }
      return color
    }
  },
  methods: {}
}
</script>
