const executiveReports = {
  namespaced: true,
  state: {
    valueTypes: [],
    categories: [],
    groupedBy: [],
    targetGroups: [],
    chartTypes: [
      { text: 'Bar Graph', value: 'bar' },
      { text: 'Gauge', value: 'gauge' },
      { text: 'Pie Chart', value: 'pie' },
      { text: 'Line Graph', value: 'line' },
      { text: 'Stacked Bar Graph', value: 'stackedBar' },
      { text: 'Doughnut', value: 'doughnut' },
      { text: 'Table', value: 'table' }
    ],
    dateIntervals: [
      { text: 'Daily', value: 'day' },
      { text: 'Weekly', value: 'week' },
      { text: 'Monthly', value: 'month' },
      { text: 'Quarterly', value: 'quarter' },
      { text: 'Yearly', value: 'year' }
    ]
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
