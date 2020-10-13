<template>
  <div>
    <div v-if="state === 'loading'">...</div>
    <div v-if="state === 'error'"><v-icon color="#f56c6c">mdi-close</v-icon></div>
    <div v-if="state === 'success'"><v-icon color="#43a047">mdi-check</v-icon></div>
  </div></template
>

<script>
export default {
  name: 'TestConnectivityStatus',
  props: {
    state: { required: true }
  }
}
</script>

<style scoped></style>
