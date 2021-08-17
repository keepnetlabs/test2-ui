<template>
  <v-radio v-model="value" ref="refRadio" v-bind="$attrs" v-on="$listeners" @click="handleInput">
  </v-radio>
</template>

<script>
export default {
  name: 'KRadio',
  props: ['value'],
  methods: {
    handleInput(val) {
      this.$emit('input', val)
    }
  }
}
</script>
