export default {
  props: {
    languages: {
      type: Array,
      default: () => []
    },
    categories: {
      type: Array,
      default: () => []
    },
    targetAudiences: {
      type: Array,
      default: () => []
    },
    scormTypes: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    languages(val) {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'languages'),
        'filterableItems',
        val
      )
      this?.$refs?.refTable?.reRenderFilters()
    },
    categories(val) {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'category'),
        'filterableItems',
        val
      )
      this?.$refs?.refTable?.reRenderFilters()
    },
    targetAudiences(val) {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'targetAudience'),
        'filterableItems',
        val
      )
      this?.$refs?.refTable?.reRenderFilters()
    },
    scormTypes(val) {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'type'),
        'filterableItems',
        val
      )
      this?.$refs?.refTable?.reRenderFilters()
    }
  }
}
