import AgenticAIActivitiesDrawer from '@/components/Common/Widget/WidgetComponents/AgenticAIActivitiesDrawer.vue'

describe('AgenticAIActivitiesDrawer.vue (extra branch coverage)', () => {
  describe('applySort', () => {
    it('returns data when sortProps is null', () => {
      const ctx = {}
      const data = [{ a: 1 }]
      expect(
        AgenticAIActivitiesDrawer.methods.applySort.call(ctx, data, null)
      ).toEqual(data)
    })

    it('returns data when sortProps has no prop', () => {
      const ctx = {}
      const data = [{ a: 1 }]
      expect(
        AgenticAIActivitiesDrawer.methods.applySort.call(ctx, data, { order: 'ascending' })
      ).toEqual(data)
    })

    it('returns data when sortProps has no order', () => {
      const ctx = {}
      const data = [{ a: 1 }]
      expect(
        AgenticAIActivitiesDrawer.methods.applySort.call(ctx, data, { prop: 'a' })
      ).toEqual(data)
    })

    it('sorts string values with localeCompare', () => {
      const ctx = {}
      const data = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }]
      const result = AgenticAIActivitiesDrawer.methods.applySort.call(ctx, data, {
        prop: 'name',
        order: 'ascending'
      })
      expect(result.map((r) => r.name)).toEqual(['Alice', 'Bob', 'Charlie'])
    })
  })

  describe('normalizeStatus', () => {
    it('returns capitalized status when not in map and not empty', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'pending')).toBe(
        'Pending'
      )
    })

    it('returns status when empty string', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, '')).toBe('')
    })

    it('handles waitingforapproval without spaces', () => {
      const ctx = {}
      expect(AgenticAIActivitiesDrawer.methods.normalizeStatus.call(ctx, 'waitingforapproval')).toBe(
        'Waiting for Approval'
      )
    })
  })

  describe('handleDrawerClickOutside', () => {
    it('returns early when target is inside v-menu', () => {
      const emit = jest.fn()
      const ctx = { $emit: emit, shouldControlBodyScroll: false }
      const mockTarget = {
        closest: jest.fn(() => true)
      }
      AgenticAIActivitiesDrawer.methods.handleDrawerClickOutside.call(ctx, {
        target: mockTarget
      })
      expect(emit).not.toHaveBeenCalled()
    })

    it('calls handleClose when target is not inside v-menu', () => {
      const emit = jest.fn()
      const ctx = {
        $emit: emit,
        shouldControlBodyScroll: false,
        enableBodyScroll: jest.fn(),
        handleClose: AgenticAIActivitiesDrawer.methods.handleClose
      }
      const mockTarget = {
        closest: jest.fn(() => null)
      }
      AgenticAIActivitiesDrawer.methods.handleDrawerClickOutside.call(ctx, {
        target: mockTarget
      })
      expect(emit).toHaveBeenCalledWith('on-close')
    })
  })

  describe('handleClose', () => {
    it('calls enableBodyScroll when shouldControlBodyScroll is true', () => {
      const enableBodyScroll = jest.fn()
      const emit = jest.fn()
      const ctx = {
        shouldControlBodyScroll: true,
        enableBodyScroll,
        $emit: emit
      }
      AgenticAIActivitiesDrawer.methods.handleClose.call(ctx)
      expect(enableBodyScroll).toHaveBeenCalled()
      expect(emit).toHaveBeenCalledWith('on-close')
    })
  })

  describe('applySearch', () => {
    it('excludes rows when value is undefined', () => {
      const ctx = {
        columns: [{ property: 'name' }]
      }
      const data = [{ name: undefined }, { name: 'Alice' }]
      const result = AgenticAIActivitiesDrawer.methods.applySearch.call(ctx, data, 'alice')
      expect(result).toEqual([{ name: 'Alice' }])
    })

    it('excludes rows when value is null', () => {
      const ctx = {
        columns: [{ property: 'name' }]
      }
      const data = [{ name: null }, { name: 'Bob' }]
      const result = AgenticAIActivitiesDrawer.methods.applySearch.call(ctx, data, 'bob')
      expect(result).toEqual([{ name: 'Bob' }])
    })
  })
})
