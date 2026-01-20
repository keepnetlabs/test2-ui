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
    getFilterKey(fieldName) {
      if (fieldName === 'vendorName') return 'vendor'
      if (fieldName === 'roles') return 'targetAudience'
      return fieldName
    },
    getTableFieldName(filterKey) {
      if (filterKey === 'vendor') return 'vendorName'
      if (filterKey === 'targetAudience') return 'roles'
      return filterKey
    },
    columnFilterChanged(filter) {
      const isFilterArray = Array.isArray(filter)
      const activeFilter = this.filters.find((item) => {
        const fieldName = isFilterArray ? filter[0].FieldName : filter.FieldName
        const key = this.getFilterKey(fieldName)
        return item.key.toLowerCase() === key.toLowerCase()
      })
      if (!activeFilter) return
      this.$set(activeFilter, 'isFilterActive', true)
      let activeValue = isFilterArray
        ? filter.map((item) => item.Value || item.value)
        : filter.Value
      if (filter.Operator === 'Include') activeValue = filter.Value.split(',')
      this.$set(activeFilter, 'activeValue', activeValue)
      this.$set(activeFilter, 'activeOperator', isFilterArray ? 'between' : filter.Operator)
      this.setFilterToPayload(activeFilter)
    },
    columnFilterCleared(fieldName) {
      const filter = this.filters.find((item) => {
        const key = this.getFilterKey(fieldName)
        return item.key.toLowerCase() === key.toLowerCase()
      })
      if (!filter) return
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
        let { activeOperator, activeValue, key } = filter
        key = this.getTableFieldName(key)
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
        } else if (
          activeOperator === 'Contains' ||
          activeOperator === '=' ||
          activeOperator === '!=' ||
          activeOperator === '>=' ||
          activeOperator === '<=' ||
          activeOperator === 'between'
        ) {
          assignedFilterObj.fieldName = key
          assignedFilterObj.selectValue = activeOperator
          assignedFilterObj.textValue = activeValue
        } else {
          assignedFilterObj.fieldName = key
          assignedFilterObj.textValue = activeValue
        }

        filterValues[key] = assignedFilterObj
      })
      if (this.$refs.refTable) this.$refs.refTable.reRenderFilters(filterValues)
    },
    sortChanged(sortedColumn) {
      const isDate = sortedColumn.prop === 'createTime'
      let sortText
      if (isDate) {
        sortText = sortedColumn.order === 'ascending' ? 'New to old' : 'Old to new'
      } else {
        sortText = sortedColumn.order === 'ascending' ? 'A to Z' : 'Z to A'
      }
      const sort = {
        ascending: sortedColumn.order === 'ascending',
        text: sortText
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
