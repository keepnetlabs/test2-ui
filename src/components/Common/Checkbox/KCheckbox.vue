<template>
  <v-checkbox
    ref="refCheckbox"
    v-bind="$attrs"
    v-on="$listeners"
    @click="handleInput"
    v-model="checkboxValue"
    :indeterminate="isDeterminate"
  >
  </v-checkbox>
</template>
<script>
export default {
  name: 'KCheckbox',
  props: ['value'],
  data() {
    return {
      isDeterminate: this.value === 'indeterminate',
      checkboxValue: this.value
    }
  },
  methods: {
    handleInput() {
      const oldVal = !this.checkboxValue
      let newVal = this.checkboxValue
      if (this.isDeterminate) {
        this.isDeterminate = false
        newVal = true
        this.checkboxValue = true
        this.$refs.refCheckbox.lazyValue = true
        this.$forceUpdate()
      } else if (oldVal && !this.isDeterminate) {
        newVal = false
      } else if (!oldVal && newVal && !this.isDeterminate) {
        this.isDeterminate = true
        newVal = 'indeterminate'
      }

      this.$emit('input', newVal)
    }
  }
}
</script>
