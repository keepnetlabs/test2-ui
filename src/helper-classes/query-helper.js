export default class QueryHelperForTable {
  constructor(router, route) {
    this.router = router
    this.route = route
    this.name = route.name
    this.query = { ...route.query }
  }
  isRouteQuery() {
    return this?.route?.query?.page && this?.route?.query?.size
  }

  setDefaultValues() {
    this.setRouterQuery('page', 1)
    this.setRouterQuery('size', 10)
  }

  controlRouteQuery() {
    if (!this.isRouteQuery()) {
      this.setRouterQuery('page', 1)
      this.setRouterQuery('size', 10)
    } else {
      const { size, page } = this.route.query
      if (!['5', '10', '25'].some((defaultNum) => defaultNum === size)) {
        this.setRouterQuery('size', 10)
      }
      const parsedPage = Number.parseInt(page)
      if (Number.isNaN(parsedPage) || parsedPage <= 0) {
        this.setRouterQuery('page', 1)
      }
    }
  }

  setRouterQuery(key, value) {
    if (this.name !== this.route.name) {
      this.router.replace({ query: {} })
      return
    }
    this.query = { ...this.query, [key]: value }
    this.router.replace({ query: this.query }).catch((e) => {})
  }

  returnQueryValues() {
    let { page, size } = this.query
    const parsedPage = Number.parseInt(page)
    page = Number.isNaN(parsedPage) ? 1 : parsedPage
    const parsedSize = Number.parseInt(size)
    size = Number.isNaN(parsedSize) ? 10 : parsedSize
    return { page, size }
  }
}
