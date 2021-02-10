class ClientTableExportHelper {
  constructor(filter = [], tableRef = null, sortOrder = '') {
    this.filter = filter
    this.tableRef = tableRef
    this.searchFilter = {
      Condition: 'OR',
      FilterItems: [],
      FilterGroups: []
    }
    this.sortFilter = {
      orderBy: sortOrder,
      ascending: false
    }
  }
  addSearchItems(columns = []) {
    this.searchFilter.FilterItems = this.tableRef
      .getSearchFilterItems()
      .filter((filterItem) =>
        columns.find(
          (col) =>
            col.filterableType && col.property.toLowerCase() === filterItem.FieldName.toLowerCase()
        )
      )
    this.filter.FilterGroups.push(this.searchFilter)
  }

  addSortItems() {
    const { sortProps } = this.tableRef
    this.sortFilter.ascending = sortProps.order === 'ascending'
    this.sortFilter.orderBy = sortProps.prop
  }
}

export default ClientTableExportHelper
