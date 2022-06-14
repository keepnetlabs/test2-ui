<template>
  <div v-bind="$attrs" :class="['k-container', { 'k-container__no-tab': tabless }]">
    <v-card class="k-card">
      <slot></slot>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'KContainer',
  props: {
    tabless: {
      type: Boolean,
      default: false
    }
  }
}
</script>
