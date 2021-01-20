export default class QueryHelperForTable {
  constructor(router, route) {
    this.router = router
    this.route = route
    this.query = { ...route.query }
  }
  isRouteQuery(callback = () => {}) {
    if (!this.route.query && !this.route.query.page && !this.route.query.size) {
      callback(false)
    }

    const { size, page } = this.route.query

    if (!['5', '10', '25'].some((defaultNum) => defaultNum === size)) {
      this.setRouterQuery('size', 10)
    }
    const parsedPage = parseInt(page)
    if (isNaN(parsedPage) || parsedPage <= 0) {
      this.setRouterQuery('page', 1)
    }
    callback(true)
  }

  setRouterQuery(key, value) {
    debugger
    this.query = { ...this.query, [key]: value }
    this.router.replace({ query: this.query }).catch((e) => {})
  }
}
