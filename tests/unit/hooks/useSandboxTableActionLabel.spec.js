import useSandboxTableActionLabel from '@/hooks/useSandboxTableActionLabel'
import { PROPERTY_STORE } from '@/model/constants/commonConstants'
import { columnFilterChanged, columnFilterCleared } from '@/utils/helperFunctions'

jest.mock('@/utils/helperFunctions', () => ({
  columnFilterChanged: jest.fn(),
  columnFilterCleared: jest.fn()
}))

describe('useSandboxTableActionLabel hook', () => {
  const buildCtx = () => ({
    isShowSandbox: false,
    tableActionLabel: 'SHOW BOT ACTIVITY',
    tableOptions: {
      addButton: { label: '', tooltip: '' },
      columns: [{ property: PROPERTY_STORE.ACTIVITYTYPE, filterableItems: [] }]
    },
    axiosPayload: {
      activityType: 0,
      filter: { FilterGroups: [{ FilterItems: [] }] }
    },
    $refs: {
      refTable: {
        filterValues: {},
        reRenderFilters: jest.fn()
      }
    },
    callForData: jest.fn(),
    $set: (obj, key, val) => {
      obj[key] = val
    }
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('setTableActionLabel sets SHOW/HIDE labels based on sandbox state', () => {
    const ctx = buildCtx()

    useSandboxTableActionLabel.methods.setTableActionLabel.call(ctx)
    expect(ctx.tableActionLabel).toBe('SHOW BOT ACTIVITY')

    ctx.isShowSandbox = true
    useSandboxTableActionLabel.methods.setTableActionLabel.call(ctx)
    expect(ctx.tableActionLabel).toBe('HIDE BOT ACTIVITY')
  })

  it('handleActivity toggles sandbox state and updates table action label', () => {
    const ctx = buildCtx()
    ctx.setTableActionLabel = jest.fn()

    useSandboxTableActionLabel.methods.handleActivity.call(ctx)

    expect(ctx.isShowSandbox).toBe(true)
    expect(ctx.setTableActionLabel).toHaveBeenCalled()
  })

  it('tableActionLabel watcher updates filters and payload for sandbox on/off', () => {
    const ctx = buildCtx()
    ctx.isShowSandbox = true
    ctx.$refs.refTable.filterValues = { activityType: { selectValue: '0' } }

    useSandboxTableActionLabel.watch.tableActionLabel.call(ctx, 'HIDE BOT ACTIVITY')

    expect(ctx.tableOptions.addButton.label).toBe('HIDE BOT ACTIVITY')
    expect(ctx.tableOptions.addButton.tooltip).toBe('HIDE BOT ACTIVITY')
    expect(ctx.tableOptions.columns[0].filterableItems).toEqual([
      { text: 'Human Activity', value: '0' },
      { text: 'Bot Activity', value: '1' }
    ])
    expect(ctx.axiosPayload.activityType).toBe(2)
    expect(ctx.$refs.refTable.filterValues.activityType.selectValue).toBe('0,1')
    expect(ctx.$refs.refTable.reRenderFilters).toHaveBeenCalled()
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('columnFilterChanged maps activityType from filter value and calls data fetch', () => {
    const ctx = buildCtx()
    columnFilterChanged.mockReturnValue([{ FieldName: 'activityType', Value: '1' }])

    useSandboxTableActionLabel.methods.columnFilterChanged.call(ctx, { activityType: '1' })

    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([
      { FieldName: 'activityType', Value: '1' }
    ])
    expect(ctx.axiosPayload.activityType).toBe(1)
    expect(ctx.callForData).toHaveBeenCalled()
  })

  it('columnFilterCleared resets activityType based on sandbox visibility', () => {
    const ctx = buildCtx()
    ctx.isShowSandbox = true
    columnFilterCleared.mockReturnValue([])

    useSandboxTableActionLabel.methods.columnFilterCleared.call(ctx, PROPERTY_STORE.ACTIVITYTYPE)

    expect(ctx.axiosPayload.filter.FilterGroups[0].FilterItems).toEqual([])
    expect(ctx.axiosPayload.activityType).toBe(2)
    expect(ctx.callForData).toHaveBeenCalled()
  })
})
