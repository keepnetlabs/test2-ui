const executiveReports = {
  namespaced: true,
  state: {
    valueTypes: [],
    categories: [],
    groupedBy: [],
    targetGroups: [],
    chartTypes: [],
    dateIntervals: []
  },
  getters: {
    getValueTypes: (state) => state.valueTypes,
    getCategories: (state) => state.categories,
    getGroupedBy: (state) => state.groupedBy,
    getTargetGroups: (state) => state.targetGroups,
    getChartTypes: (state) => state.chartTypes,
    getDateIntervals: (state) => state.dateIntervals
  },
  mutations: {},
  actions: {
    callForData() {}
  }
}

export default executiveReports
