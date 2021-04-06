<template>
  <!--eslint-disable-next-line vue/no-parsing-error-->
  <div class="countdown-text">Resend SMS in 00:{{ countDown < 10 ? 0 : '' }}{{ countDown }}</div>
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

<style>
.countdown-text {
  font-size: 11px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: rgba(56, 59, 65, 0.72);
}
</style>
