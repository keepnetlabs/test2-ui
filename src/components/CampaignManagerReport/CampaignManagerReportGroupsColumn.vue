<template>
  <span :style="labelStyle" @click="handleClick">{{ label }}</span>
</template>

<script>
export default {
  name: 'CampaignManagerReportGroupsColumn',
  props: {
    value: {
      type: [String, Array],
      default: ''
    }
  },
  computed: {
    groups() {
      if (Array.isArray(this.value)) return this.value.filter(Boolean)
      return String(this.value || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)
    },
    count() {
      return this.groups.length
    },
    label() {
      if (!this.count) return '-'
      return this.count === 1 ? '1 group' : `${this.count} groups`
    },
    labelStyle() {
      const baseStyle = {
        color: '#2196F3',
        fontFamily: 'Open Sans',
        fontSize: '12px',
        fontStyle: 'normal',
        fontWeight: 600,
        lineHeight: '18px'
      }
      return this.count ? { ...baseStyle, cursor: 'pointer' } : baseStyle
    }
  },
  methods: {
    handleClick() {
      if (!this.count) return
      this.$emit('click', this.groups)
    }
  }
}
</script>
