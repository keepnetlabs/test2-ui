<template>
  <v-btn
    class="the-records-button"
    :color="getColor"
    rounded
    :style="getStyle"
    @click="handleClick"
  >
    <span>15 records</span>
    <v-icon right>mdi-open-in-new</v-icon>
  </v-btn>
</template>
<script>
export default {
  name: 'TheRecordsButton',
  props: {
    row: {
      type: Object
    }
  },
  emits: ['on-click'],
  computed: {
    getColor() {
      return '#e3f2fd'
    },
    getStyle() {
      return {
        boxShadow: 'none !important',
        width: '130px'
      }
    }
  },
  methods: {
    handleClick() {
      this.$emit('on-click', this.row)
    }
  }
}
</script>

<style lang="scss">
.the-records-button {
  .v-btn__content {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.71;
    color: #2196f3;
    letter-spacing: normal;
    text-transform: lowercase;
  }
}
</style>
