export default class QueryHelperForTable {
  constructor(router, route) {
    this.router = router
    this.route = route
    this.name = route.name
    this.query = { ...route.query }
  }
  isRouteQuery() {
    return this.route.query && this.route.query.page && this.route.query.size
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
      const parsedPage = parseInt(page)
      if (isNaN(parsedPage) || parsedPage <= 0) {
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
}
