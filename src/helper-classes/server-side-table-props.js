export default class ServerSideProps {
  constructor(
    orderBy = '',
    isClustered = false,
    pageSize = 10,
    pageNumber = 1,
    totalNumberOfPages = 0,
    totalNumberOfRecords = 0
  ) {
    this.orderBy = orderBy
    this.isClustered = isClustered
    this.pageSize = pageSize
    this.pageNumber = pageNumber
    this.totalNumberOfPages = totalNumberOfPages
    this.totalNumberOfRecords = totalNumberOfRecords
  }
  getTotalNumberOfRecords() {
    return this.totalNumberOfRecords
  }
  getTotalNumberOfPages() {
    return this.totalNumberOfPages
  }
  getPageSize() {
    return this.pageSize
  }
  getPageNumber() {
    return this.pageNumber
  }
}
