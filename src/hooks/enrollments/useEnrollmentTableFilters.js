import { PROPERTY_STORE } from '@/model/constants/commonConstants'

export default {
  props: {
    levels: {
      type: Array,
      default: () => []
    },
    durations: {
      type: Array,
      default: () => []
    }
  },
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
      if (!val || !Array.isArray(val)) return
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
      const audienceColumn = this.tableOptions.columns.find(
        (col) => col.property === 'targetAudience'
      )
      const items =
        audienceColumn?.filterableCustomFieldName === PROPERTY_STORE.ROLES
          ? (val || []).map((item) => ({
              ...item,
              value: item.id || item.roleId || item.resourceId || item.value
            }))
          : val
      this.$set(audienceColumn, 'filterableItems', items)
      this?.$refs?.refTable?.reRenderFilters()
    },
    levels(val) {
      const levelColumn = this.tableOptions.columns.find(
        (col) => col.property === PROPERTY_STORE.LEVEL
      )
      if (levelColumn) {
        this.$set(levelColumn, 'filterableItems', val || [])
        this?.$refs?.refTable?.reRenderFilters()
      }
    },
    durations(val) {
      const durationColumn = this.tableOptions.columns.find(
        (col) => col.property === PROPERTY_STORE.DURATION
      )
      if (durationColumn) {
        this.$set(durationColumn, 'filterableItems', val || [])
        this?.$refs?.refTable?.reRenderFilters()
      }
    }
  }
}
