<template>
  <div
    style="
      font-size: 11px;
      font-weight: normal;
      text-align: center;
      color: rgba(56, 59, 65, 0.72);
      letter-spacing: normal;
    "
  >
    {{ getCountdown }}
  </div>
</template>

<script>
export default {
  data() {
    return {
      countDown: 59
    }
  },
  props: {
    changeButtonStatus: {
      required: false
    }
  },
  computed: {
    getCountdown() {
      const { countDown } = this
      return `Resend SMS in 00:${countDown < 10 ? 0 : ''}${countDown}`
    }
  },
  created() {
    this.countDownTimer()
  },
  methods: {
    countDownTimer() {
      if (this.countDown > 0) {
        setTimeout(() => {
          this.countDown -= 1
          this.countDownTimer()
        }, 1000)
      } else if (this.countDown === 0) {
        if (!this.countDown) {
          this.$emit('changeButtonStatus')
        }
      }
    }
  }
}
</script>
