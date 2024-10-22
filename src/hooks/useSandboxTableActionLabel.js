import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

export default {
  data() {
    return {
      isShowSandbox: true,
      tableActionLabel: 'HIDE BOT ACTIVITY'
    }
  },
  watch: {
    tableActionLabel(val) {
      this.$set(this.tableOptions.addButton, 'label', val)
      this.$set(this.tableOptions.addButton, 'tooltip', val)
      const index = this.tableOptions.columns.findIndex(
        (c) => c?.property === PROPERTY_STORE.ACTIVITYTYPE
      )
      if (index !== -1) {
        this.$set(
          this.tableOptions.columns[index],
          'filterableItems',
          this.isShowSandbox
            ? [
                { text: 'Human Activity', value: '0' },
                { text: 'Bot Activity', value: '1' }
              ]
            : [{ text: 'Human Activity', value: '0' }]
        )
      }
      this.axiosPayload.activityType = this.isShowSandbox ? 2 : 0
      if (
        this.axiosPayload.activityType === 0 &&
        this?.$refs?.refTable?.filterValues?.activityType?.selectValue
      ) {
        if (this.$refs.refTable.filterValues.activityType.selectValue === '0,1') {
          this.$set(this.$refs.refTable.filterValues.activityType, 'selectValue', '0')
        } else if (this.$refs.refTable.filterValues.activityType.selectValue === '1') {
          delete this.$refs.refTable.filterValues.activityType
        }
      } else if (
        this.axiosPayload.activityType === 2 &&
        this?.$refs?.refTable?.filterValues?.activityType?.selectValue
      ) {
        this.$set(this.$refs.refTable.filterValues.activityType, 'selectValue', '0,1')
      }
      this.$refs.refTable.reRenderFilters(this.$refs.refTable.filterValues)
      this.callForData()
    }
  },
  methods: {
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      const index = this.axiosPayload.filter.FilterGroups[0].FilterItems.findIndex(
        (item) => item.FieldName === 'activityType'
      )
      if (index !== -1) {
        const value = this.axiosPayload.filter.FilterGroups[0].FilterItems[index].Value
        if (value === '0,1' || value === '1,0') {
          this.axiosPayload.activityType = 2
        } else if (value === '1') {
          this.axiosPayload.activityType = 1
        } else {
          this.axiosPayload.activityType = 0
        }
      }
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      if (fieldName === PROPERTY_STORE.ACTIVITYTYPE)
        this.axiosPayload.activityType = this.isShowSandbox ? 2 : 0
      this.callForData()
    },
    handleActivity() {
      this.isShowSandbox = !this.isShowSandbox
      this.setTableActionLabel()
    },
    setTableActionLabel() {
      this.tableActionLabel = this.isShowSandbox ? `HIDE BOT ACTIVITY` : `SHOW BOT ACTIVITY`
    }
  }
}
