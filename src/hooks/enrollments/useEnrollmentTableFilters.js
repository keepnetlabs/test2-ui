export default {
  watch: {
    enrollmentStatusEnum(val) {
      const filterableItems = val.map((item) => ({
        text: item.displayName || item.name,
        value: item.id || item.name
      }))
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'status'),
        'filterableItems',
        filterableItems
      )
      this?.$refs?.refTable?.reRenderFilters()
    },
    languages(val) {
      this.$set(
        this.tableOptions.columns.find((col) => col.property === 'languages'),
        'filterableItems',
        val.map((l) => ({
          text: l.isoFriendlyName,
          value: l.code
        }))
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
    }
  }
}
