import executiveReports from '@/store/modules/executiveReports'

describe('executiveReports store (extra coverage)', () => {
  const chartTypes = [
    { text: 'Bar Graph', value: 'bar' },
    { text: 'Pie Chart', value: 'pie' }
  ]
  const dateIntervals = [
    { text: 'Daily', value: 'day' },
    { text: 'Monthly', value: 'month' }
  ]
  let state

  beforeEach(() => {
    state = {
      valueTypes: [],
      categories: [],
      groupedBy: [],
      targetGroups: [],
      chartTypes,
      dateIntervals
    }
  })

  describe('getters', () => {
    it('getValueTypes returns state.valueTypes', () => {
      state.valueTypes = [{ id: 1 }]
      expect(executiveReports.getters.getValueTypes(state)).toEqual([{ id: 1 }])
    })

    it('getCategories returns state.categories', () => {
      state.categories = [{ id: 1 }]
      expect(executiveReports.getters.getCategories(state)).toEqual([{ id: 1 }])
    })

    it('getGroupedBy returns state.groupedBy', () => {
      state.groupedBy = ['day']
      expect(executiveReports.getters.getGroupedBy(state)).toEqual(['day'])
    })

    it('getTargetGroups returns state.targetGroups', () => {
      state.targetGroups = [{ id: 1 }]
      expect(executiveReports.getters.getTargetGroups(state)).toEqual([{ id: 1 }])
    })

    it('getChartTypes returns chartTypes array', () => {
      const result = executiveReports.getters.getChartTypes(state)
      expect(result).toEqual(chartTypes)
      expect(result.some((c) => c.value === 'bar')).toBe(true)
    })

    it('getDateIntervals returns dateIntervals array', () => {
      const result = executiveReports.getters.getDateIntervals(state)
      expect(result).toEqual(dateIntervals)
      expect(result.some((i) => i.value === 'day')).toBe(true)
    })
  })

  describe('actions', () => {
    it('callForData exists and does not throw', () => {
      expect(() => executiveReports.actions.callForData()).not.toThrow()
    })
  })
})
