<template>
  <v-btn
    :class="['the-records-button', { 'the-records-button--disabled': this.row.total === 1 }]"
    rounded
    :color="getColor"
    :style="getStyle"
    :disabled="isDisabled"
    @click="handleClick"
  >
    <span>{{ getText }}</span>
    <v-icon right :style="isIconVisible">mdi-open-in-new</v-icon>
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
  watch: {
    row(row) {
      this.isDisabled = row.total === 1
    }
  },
  emits: ['on-click'],
  data() {
    return {
      isDisabled: this.row.total === 1
    }
  },
  computed: {
    getColor() {
      return '#e3f2fd'
    },
    getStyle() {
      return {
        boxShadow: 'none !important',
        width: '130px'
      }
    },
    getText() {
      const text = this.row.total === 1 ? 'record' : 'records'
      return `${this.row.total} ${text}`
    },
    isIconVisible() {
      return { visibility: this.row.total === 1 ? 'hidden' : 'visible' }
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
  &--disabled {
    .v-btn__content {
      color: #757575 !important;
    }
  }
}
</style>
