import PhishingParentTable from '@/components/CampaignManager/CampaignManagerParentTable.vue'
import SmishingParentTable from '@/components/SmishingCampaignManager/CampaignManagerParentTable.vue'
import CallbackParentTable from '@/components/CallbackCampaignManager/CampaignManagerParentTable.vue'
import QuishingParentTable from '@/components/QuishingCampaignManager/QuishingCampaignManagerParentTable.vue'
import InvestigationsView from '@/views/Investigations.vue'

// Every surface that exposes applyStatusFilter shares the same contract (used
// by the command palette's "Filters" presets). Exercise the method in
// isolation (no full mount) across all of them to guarantee parity. Each entry
// is [label, component, tableRefName].
const STATUS_FIELD = 'status' // PROPERTY_STORE.STATUS, shared everywhere

const TABLES = [
  ['Phishing', PhishingParentTable, 'refTable'],
  ['Smishing', SmishingParentTable, 'refTable'],
  ['Callback', CallbackParentTable, 'refTable'],
  ['Quishing', QuishingParentTable, 'refTable'],
  ['Investigations', InvestigationsView, 'investigationTable']
]

const makeCtx = refName => ({
  columnFilterChanged: jest.fn(),
  $refs: {
    [refName]: {
      filterValues: { someOtherCol: { selectValue: 'x' } },
      reRenderFilters: jest.fn()
    }
  }
})

describe.each(TABLES)('%s applyStatusFilter', (_name, Component, refName) => {
  const apply = (ctx, values) =>
    Component.methods.applyStatusFilter.call(ctx, values)
  const ctxFor = () => makeCtx(refName)

  let setItemSpy
  beforeEach(() => {
    setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
  })
  afterEach(() => setItemSpy.mockRestore())

  it('applies the status filter via the shared columnFilterChanged path', () => {
    const ctx = ctxFor()
    apply(ctx, ['Running'])
    expect(ctx.columnFilterChanged).toHaveBeenCalledWith({
      Value: 'Running',
      FieldName: STATUS_FIELD,
      Operator: 'Include'
    })
  })

  it('joins multiple statuses into a comma-separated value', () => {
    const ctx = ctxFor()
    apply(ctx, ['Running', 'Completed'])
    expect(ctx.columnFilterChanged).toHaveBeenCalledWith(
      expect.objectContaining({ Value: 'Running,Completed' })
    )
  })

  it('syncs the filter funnel UI, merging with other active filters', () => {
    const ctx = ctxFor()
    apply(ctx, ['Running'])
    expect(ctx.$refs[refName].reRenderFilters).toHaveBeenCalledWith({
      someOtherCol: { selectValue: 'x' },
      [STATUS_FIELD]: {
        textValue: '',
        selectValue: 'Running',
        fieldName: STATUS_FIELD
      }
    })
  })

  it('is transient — it never writes to saved-filter localStorage', () => {
    const ctx = ctxFor()
    apply(ctx, ['Running'])
    expect(setItemSpy).not.toHaveBeenCalled()
  })

  it('ignores empty / non-array input', () => {
    const ctx = ctxFor()
    apply(ctx, [])
    apply(ctx, undefined)
    expect(ctx.columnFilterChanged).not.toHaveBeenCalled()
  })
})
