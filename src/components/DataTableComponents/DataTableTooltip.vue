<template>
  <div ref="tooltip" class="datatable-tooltip" :style="tooltipStyle">
    {{ content }}
  </div>
</template>

<script>
export default {
  name: 'DataTableTooltip',
  props: {
    tooltipStyle: {
      type: Object
    },
    content: {
      type: String
    },
    appendToBody: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.appendToBody) {
      document.body.appendChild(this.$refs.tooltip)
    }
  },
  beforeDestroy() {
    if (
      this.appendToBody &&
      this.$refs.tooltip &&
      this.$refs.tooltip.parentNode === document.body
    ) {
      document.body.removeChild(this.$refs.tooltip)
    }
  }
}
</script>
