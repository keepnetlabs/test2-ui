export default {
  methods: {
    getTimeUnitLabel() {
      return this.timeUnit.toLowerCase() === 'year'
        ? 'Year'
        : `${this.timeUnit.substring(0, 1).toUpperCase() + this.timeUnit.substring(1)} / Year`
    }
  }
}
