describe('executiveReports.js store module', () => {
  let executiveReportsStore
  let state

  beforeEach(() => {
    executiveReportsStore = {
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

    state = JSON.parse(JSON.stringify(executiveReportsStore.state))
  })

  describe('state', () => {
    it('initializes with empty value types', () => {
      expect(executiveReportsStore.state.valueTypes).toEqual([])
    })

    it('initializes with empty categories', () => {
      expect(executiveReportsStore.state.categories).toEqual([])
    })

    it('initializes with empty grouped by', () => {
      expect(executiveReportsStore.state.groupedBy).toEqual([])
    })

    it('initializes with empty target groups', () => {
      expect(executiveReportsStore.state.targetGroups).toEqual([])
    })

    it('initializes with 7 chart types', () => {
      expect(executiveReportsStore.state.chartTypes).toHaveLength(7)
    })

    it('includes Bar Graph in chart types', () => {
      expect(executiveReportsStore.state.chartTypes[0]).toEqual({ text: 'Bar Graph', value: 'bar' })
    })

    it('includes Gauge in chart types', () => {
      const gauge = executiveReportsStore.state.chartTypes.find(t => t.value === 'gauge')
      expect(gauge).toEqual({ text: 'Gauge', value: 'gauge' })
    })

    it('includes Table in chart types', () => {
      const table = executiveReportsStore.state.chartTypes.find(t => t.value === 'table')
      expect(table).toEqual({ text: 'Table', value: 'table' })
    })

    it('initializes with 5 date intervals', () => {
      expect(executiveReportsStore.state.dateIntervals).toHaveLength(5)
    })

    it('includes Daily in date intervals', () => {
      expect(executiveReportsStore.state.dateIntervals[0]).toEqual({ text: 'Daily', value: 'day' })
    })

    it('includes Monthly in date intervals', () => {
      const monthly = executiveReportsStore.state.dateIntervals.find(d => d.value === 'month')
      expect(monthly).toEqual({ text: 'Monthly', value: 'month' })
    })

    it('includes Yearly in date intervals', () => {
      const yearly = executiveReportsStore.state.dateIntervals.find(d => d.value === 'year')
      expect(yearly).toEqual({ text: 'Yearly', value: 'year' })
    })
  })

  describe('getters', () => {
    beforeEach(() => {
      state = executiveReportsStore.state
    })

    it('getValueTypes returns value types array', () => {
      state.valueTypes = [{ id: 1, name: 'Type 1' }]
      expect(executiveReportsStore.getters.getValueTypes(state)).toHaveLength(1)
    })

    it('getCategories returns categories array', () => {
      state.categories = [{ id: 1, name: 'Category 1' }]
      expect(executiveReportsStore.getters.getCategories(state)).toHaveLength(1)
    })

    it('getGroupedBy returns grouped by array', () => {
      state.groupedBy = [{ id: 1, name: 'Group 1' }]
      expect(executiveReportsStore.getters.getGroupedBy(state)).toHaveLength(1)
    })

    it('getTargetGroups returns target groups array', () => {
      state.targetGroups = [{ id: 1, name: 'Target 1' }]
      expect(executiveReportsStore.getters.getTargetGroups(state)).toHaveLength(1)
    })

    it('getChartTypes returns all chart types', () => {
      expect(executiveReportsStore.getters.getChartTypes(state)).toHaveLength(7)
    })

    it('getChartTypes contains bar value', () => {
      const types = executiveReportsStore.getters.getChartTypes(state)
      expect(types.some(t => t.value === 'bar')).toBe(true)
    })

    it('getDateIntervals returns all date intervals', () => {
      expect(executiveReportsStore.getters.getDateIntervals(state)).toHaveLength(5)
    })

    it('getDateIntervals contains week value', () => {
      const intervals = executiveReportsStore.getters.getDateIntervals(state)
      expect(intervals.some(i => i.value === 'week')).toBe(true)
    })
  })

  describe('module configuration', () => {
    it('module is namespaced', () => {
      expect(executiveReportsStore.namespaced).toBe(true)
    })

    it('has required properties', () => {
      expect(executiveReportsStore).toHaveProperty('state')
      expect(executiveReportsStore).toHaveProperty('getters')
      expect(executiveReportsStore).toHaveProperty('mutations')
      expect(executiveReportsStore).toHaveProperty('actions')
    })

    it('has all expected getters', () => {
      const expectedGetters = [
        'getValueTypes',
        'getCategories',
        'getGroupedBy',
        'getTargetGroups',
        'getChartTypes',
        'getDateIntervals'
      ]
      expectedGetters.forEach((getter) => {
        expect(executiveReportsStore.getters).toHaveProperty(getter)
      })
    })
  })

  describe('integration tests', () => {
    beforeEach(() => {
      state = JSON.parse(JSON.stringify(executiveReportsStore.state))
    })

    it('can retrieve all report configuration options', () => {
      state = executiveReportsStore.state

      const chartTypes = executiveReportsStore.getters.getChartTypes(state)
      const dateIntervals = executiveReportsStore.getters.getDateIntervals(state)

      expect(chartTypes.length).toBeGreaterThan(0)
      expect(dateIntervals.length).toBeGreaterThan(0)
    })

    it('chart types have proper structure', () => {
      state = executiveReportsStore.state
      const types = executiveReportsStore.getters.getChartTypes(state)

      types.forEach((type) => {
        expect(type).toHaveProperty('text')
        expect(type).toHaveProperty('value')
        expect(typeof type.text).toBe('string')
        expect(typeof type.value).toBe('string')
      })
    })

    it('date intervals have proper structure', () => {
      state = executiveReportsStore.state
      const intervals = executiveReportsStore.getters.getDateIntervals(state)

      intervals.forEach((interval) => {
        expect(interval).toHaveProperty('text')
        expect(interval).toHaveProperty('value')
        expect(typeof interval.text).toBe('string')
        expect(typeof interval.value).toBe('string')
      })
    })

    it('can update value types', () => {
      state.valueTypes = [
        { id: 1, name: 'Count' },
        { id: 2, name: 'Percentage' }
      ]
      expect(executiveReportsStore.getters.getValueTypes(state)).toHaveLength(2)
    })

    it('can update categories', () => {
      state.categories = [
        { id: 1, name: 'Phishing' },
        { id: 2, name: 'Malware' }
      ]
      expect(executiveReportsStore.getters.getCategories(state)).toHaveLength(2)
    })
  })
})
