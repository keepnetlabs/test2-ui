import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'
import { normalizeSearchFilterItems, resolveApiDurationFieldName } from '@/utils/searchFilterNormalize'

export default {
  methods: {
    columnFilterChanged(filter) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterChanged(
        filter,
        this.axiosPayload
      )
      this.callForData()
    },
    columnFilterCleared(fieldName) {
      this.axiosPayload.filter.FilterGroups[0].FilterItems = columnFilterCleared(
        fieldName,
        this.axiosPayload
      )
      this.callForData()
    },
    serverSidePageNumberChanged(pageNumber = 1) {
      this.axiosPayload.pageNumber = pageNumber
      this.callForData()
    },
    serverSideSizeChanged(pageSize = 5) {
      this.axiosPayload.pageSize = pageSize
      this.serverSideProps.pageSize = pageSize
      this.resetPageNumber()
      this.callForData()
    },
    sortChanged({ order, prop } = {}) {
      this.axiosPayload.ascending = order === 'ascending'
      this.axiosPayload.orderBy = resolveApiDurationFieldName(prop)
      this.callForData()
    },
    resetPageNumber() {
      this.axiosPayload.pageNumber = 1
      this.serverSideProps.pageNumber = 1
    },
    handleSearchChange(searchFilter = {}) {
      const incoming = searchFilter?.filter?.FilterGroups?.[0]?.FilterItems || []
      this.axiosPayload.filter.FilterGroups[1].FilterItems = normalizeSearchFilterItems(incoming)
      if (typeof searchFilter?.filter?.SearchInputTextValue === 'string') {
        this.axiosPayload.filter.SearchInputTextValue = searchFilter.filter.SearchInputTextValue
      }
      this.resetPageNumber()
      this.callForData()
    }
  }
}
