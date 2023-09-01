<template>
  <v-btn
    v-if="isRenderButton"
    rounded
    :id="`btn-records--incident-responder-clustered-table-${index}`"
    :class="['the-records-button', { 'the-records-button--disabled': isDisabled }]"
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
    },
    index: {
      type: Number
    },
    disabledCount: {
      type: Number,
      default: 1
    },
    label: {
      type: String,
      default: 'record'
    },
    isShowButtonWithZeroTotal: {
      type: Boolean,
      default: true
    },
    width: {
      type: String,
      default: '130px'
    }
  },
  watch: {
    row(row) {
      this.isDisabled = row.total === this.disabledCount
    }
  },
  emits: ['on-click'],
  data() {
    return {
      isDisabled: this.row.total === this.disabledCount
    }
  },
  computed: {
    isRenderButton() {
      if (this.isShowButtonWithZeroTotal) return true
      return this?.row?.total > 0
    },
    getColor() {
      return '#e3f2fd'
    },
    getStyle() {
      return {
        boxShadow: 'none !important',
        width: this.width
      }
    },
    getText() {
      const text = this.row.total === 1 || this.row.total === 0 ? `${this.label}` : `${this.label}s`
      return `${this.row.total} ${text}`
    },
    isIconVisible() {
      return { visibility: this.row.total === this.disabledCount ? 'hidden' : 'visible' }
    }
  },
  methods: {
    handleClick() {
      this.$emit('on-click', this.row)
    }
  }
}
</script>
