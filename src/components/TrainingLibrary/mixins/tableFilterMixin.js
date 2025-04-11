import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      filters: 'trainingLibrary/getFilters',
      getTableFilterRenderKey: 'trainingLibrary/getTableFilterRenderKey'
    })
  },
  watch: {
    getTableFilterRenderKey() {
      this.addFilterToTable()
    }
  },
  mounted() {
    this.addFilterToTable()
  },
  methods: {
    ...mapActions({
      setFilterToPayload: 'trainingLibrary/setFilterToPayload',
      removeFilterFromPayload: 'trainingLibrary/removeFilterFromPayload',
      setSortBy: 'trainingLibrary/setSortBy'
    }),
    columnFilterChanged(filter) {
      const activeFilter = this.filters.find(
        (item) => item.key.toLowerCase() === filter.FieldName.toLowerCase()
      )
      this.$set(activeFilter, 'isFilterActive', true)
      let activeValue = filter.Value
      if (filter.Operator === 'Include') activeValue = filter.Value.split(',')
      this.$set(activeFilter, 'activeValue', activeValue)
      this.$set(activeFilter, 'activeOperator', filter.Operator)
      this.setFilterToPayload(activeFilter)
    },
    columnFilterCleared(fieldName) {
      const filter = this.filters.find((item) => item.key.toLowerCase() === fieldName.toLowerCase())
      this.$set(filter, 'isFilterActive', false)
      let filterValue, filterOperator
      if (filter.filterType === 'search' || filter.filterType === 'longTextSearch') {
        filterValue = []
        filterOperator = 'Include'
      } else if (filter.filterType === 'select') {
        filterValue = ''
        filterOperator = 'Contains'
      } else {
        filterValue = ''
        filterOperator = '='
      }
      this.$set(filter, 'value', filterValue)
      this.$set(filter, 'activeValue', filterValue)
      this.$set(filter, 'operator', filterOperator)
      this.$set(filter, 'activeOperator', filterOperator)
      this.removeFilterFromPayload(filter)
    },
    addFilterToTable() {
      const filterValues = {}
      this.filters.forEach((filter) => {
        const { activeOperator, activeValue, key } = filter
        const assignedFilterObj = {
          fieldName: '',
          selectValue: '',
          textValue: ''
        }
        if (activeOperator === 'Include') {
          if (activeValue.length) {
            assignedFilterObj.fieldName = key
            assignedFilterObj.selectValue = activeValue.join(',')
          }
        } else if (activeOperator === 'Contains') {
          assignedFilterObj.fieldName = key
          assignedFilterObj.selectValue = activeOperator
          assignedFilterObj.textValue = activeValue
        } else if (activeOperator === '=') {
          assignedFilterObj.fieldName = key
          assignedFilterObj.textValue = activeValue
        }
        filterValues[key] = assignedFilterObj
      })
      if (this.$refs.refTable) this.$refs.refTable.reRenderFilters(filterValues)
    },
    sortChanged(sortedColumn) {
      const sort = {
        ascending: sortedColumn.order === 'ascending',
        text: sortedColumn.order === 'ascending' ? 'A to Z' : 'Z to A'
      }
      const label = this.tableOptions.columns.find(
        (column) => column.property === sortedColumn.prop
      )?.label
      const item = {
        text: label.includes('Name') ? 'Material Name' : label,
        orderBy: sortedColumn.prop
      }
      this.setSortBy({ item, sort })
    }
  }
}
