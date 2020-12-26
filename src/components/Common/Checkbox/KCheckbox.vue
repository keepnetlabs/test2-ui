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
  props: ['value', 'defaultValue'],
  data() {
    return {
      checkboxValue: this.value || this.defaultValue,
      isDeterminate: this.value === 'indeterminate' || this.defaultValue === 'indeterminate'
    }
  },
  created() {
    if (this.defaultValue) {
      this.$emit('input', this.defaultValue)
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
      this.$nextTick(() => {
        this.$refs.refCheckbox.validate(true, newVal)
      })
    }
  }
}
</script>
