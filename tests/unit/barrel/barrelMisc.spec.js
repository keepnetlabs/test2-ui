// Remaining barrel branches: the config panel, the report Email-Role column mixin, the
// scenario method-type injection, and the report-summary barrel rows.
jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: { getSingle: jest.fn(() => Promise.resolve([])) }
}))

import CampaignManagerBarrelOptions from '@/components/CampaignManager/BarrelOptions/CampaignManagerBarrelOptions.vue'
import barrelEmailRoleColumnMixin from '@/components/CampaignManagerReport/barrelEmailRoleColumnMixin'
import CommonSimulatorNewScenario from '@/components/Common/Simulator/CommonSimulatorNewScenario.vue'
import CampaignManagerReportSummary from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummary.vue'
import { COLUMNS } from '@/components/CampaignManagerReport/Opened/utils'

describe('CampaignManagerBarrelOptions.update', () => {
  it('emits input with the changed key merged into the existing value', () => {
    const emit = jest.fn()
    CampaignManagerBarrelOptions.methods.update.call(
      { value: { delayMinutes: 60, orderType: 1 }, $emit: emit },
      'orderType',
      2
    )
    expect(emit).toHaveBeenCalledWith('input', { delayMinutes: 60, orderType: 2 })
  })

  it('preserves other keys when toggling a boolean switch', () => {
    const emit = jest.fn()
    CampaignManagerBarrelOptions.methods.update.call(
      { value: { skipPayloadIfReported: true, responsiveDelivery: false }, $emit: emit },
      'responsiveDelivery',
      true
    )
    expect(emit).toHaveBeenCalledWith('input', {
      skipPayloadIfReported: true,
      responsiveDelivery: true
    })
  })
})

describe('CampaignManagerBarrelOptions — Urgent Flag under DEC', () => {
  const displayed = CampaignManagerBarrelOptions.computed.displayedUrgentFlagType
  const decWatcher = CampaignManagerBarrelOptions.watch.decSelected.handler

  it('displays None (0) when DEC is selected, regardless of stored value', () => {
    expect(displayed.call({ decSelected: true, value: { urgentFlagType: 2 } })).toBe(0)
  })

  it('displays the stored value when DEC is not selected', () => {
    expect(displayed.call({ decSelected: false, value: { urgentFlagType: 2 } })).toBe(2)
  })

  it('forces urgentFlagType to None when DEC becomes active and value is non-None', () => {
    const update = jest.fn()
    decWatcher.call({ value: { urgentFlagType: 3 }, update }, true)
    expect(update).toHaveBeenCalledWith('urgentFlagType', 0)
  })

  it('does not emit when DEC is active but value is already None', () => {
    const update = jest.fn()
    decWatcher.call({ value: { urgentFlagType: 0 }, update }, true)
    expect(update).not.toHaveBeenCalled()
  })

  it('does not touch the value when DEC is not selected', () => {
    const update = jest.fn()
    decWatcher.call({ value: { urgentFlagType: 2 }, update }, false)
    expect(update).not.toHaveBeenCalled()
  })
})

describe('barrelEmailRoleColumnMixin', () => {
  const visibilityFn = barrelEmailRoleColumnMixin.computed.isBarrelReportColumnVisible
  const sync = barrelEmailRoleColumnMixin.methods.syncBarrelEmailRoleColumn

  it('isBarrelReportColumnVisible reflects injected barrel state', () => {
    expect(visibilityFn.call({ reportBarrelState: { isBarrel: true } })).toBe(true)
    expect(visibilityFn.call({ reportBarrelState: { isBarrel: false } })).toBe(false)
    expect(visibilityFn.call({ reportBarrelState: null })).toBe(false)
  })

  it('inserts the Email Role column right after the scenario-name anchor when barrel', () => {
    const columns = [
      { property: 'fullName' },
      { property: COLUMNS.PHISHING_SCENARIO_NAME.property },
      { property: 'activityType' }
    ]
    sync.call({ isBarrelReportColumnVisible: true, tableOptions: { columns } })
    const idx = columns.findIndex((c) => c.property === 'barrelEmailRole')
    const anchor = columns.findIndex((c) => c.property === COLUMNS.PHISHING_SCENARIO_NAME.property)
    expect(idx).toBe(anchor + 1)
  })

  it('appends at the end when no anchor column exists', () => {
    const columns = [{ property: 'fullName' }, { property: 'activityType' }]
    sync.call({ isBarrelReportColumnVisible: true, tableOptions: { columns } })
    expect(columns[columns.length - 1].property).toBe('barrelEmailRole')
  })

  it('does not insert twice (idempotent)', () => {
    const columns = [{ property: COLUMNS.PHISHING_SCENARIO_NAME.property }]
    const ctx = { isBarrelReportColumnVisible: true, tableOptions: { columns } }
    sync.call(ctx)
    sync.call(ctx)
    expect(columns.filter((c) => c.property === 'barrelEmailRole')).toHaveLength(1)
  })

  it('removes the column when no longer a barrel campaign', () => {
    const columns = [
      { property: COLUMNS.PHISHING_SCENARIO_NAME.property },
      { ...COLUMNS.BARREL_EMAIL_ROLE }
    ]
    sync.call({ isBarrelReportColumnVisible: false, tableOptions: { columns } })
    expect(columns.find((c) => c.property === 'barrelEmailRole')).toBeUndefined()
  })

  it('is a no-op when tableOptions.columns is not an array', () => {
    expect(() =>
      sync.call({ isBarrelReportColumnVisible: true, tableOptions: {} })
    ).not.toThrow()
  })
})

describe('CommonSimulatorNewScenario — Double Barrel method injection', () => {
  const getMethodTypes = CommonSimulatorNewScenario.computed.getMethodTypes
  const getMethodText = CommonSimulatorNewScenario.computed.getMethodText
  const getSelectedMethod = CommonSimulatorNewScenario.computed.getSelectedMethod

  it('injects Double Barrel for phishing when missing from lookup', () => {
    const items = getMethodTypes.call({
      isPhishing: true,
      scenarioDetailsLookup: { methodTypes: [{ text: 'Click Only', value: '1' }] }
    })
    expect(items.find((m) => m.value === '6')).toEqual({ text: 'Double Barrel', value: '6' })
  })

  it('does not duplicate Double Barrel if the lookup already returns it', () => {
    const items = getMethodTypes.call({
      isPhishing: true,
      scenarioDetailsLookup: { methodTypes: [{ text: 'Double Barrel', value: '6' }] }
    })
    expect(items.filter((m) => m.value === '6')).toHaveLength(1)
  })

  it('does not inject Double Barrel for non-phishing', () => {
    const items = getMethodTypes.call({ isPhishing: false, scenarioDetailsLookup: { methodTypes: [] } })
    expect(items.find((m) => m.value === '6')).toBeUndefined()
  })

  it('getMethodText resolves the injected Double Barrel label', () => {
    const ctx = {
      isPhishing: true,
      scenarioDetailsLookup: { methodTypes: [{ text: 'Click Only', value: '1' }] },
      formValues: { methodTypeId: '6' }
    }
    ctx.getMethodTypes = getMethodTypes.call(ctx)
    expect(getMethodText.call(ctx)).toBe('Double Barrel')
  })

  it('getSelectedMethod returns "" for Double Barrel (no SCENARIO_METHODS index)', () => {
    expect(getSelectedMethod.call({ formValues: { methodTypeId: '6' } })).toBe('')
  })
})

describe('CampaignManagerReportSummary — barrel rows', () => {
  // Barrel options are delivery behaviour, so they render in the Email Delivery card.
  const fn = CampaignManagerReportSummary.computed.getEmailDeliveryData
  const baseCtx = (barrelOptions) => ({
    campaignSummary: {
      campaignInfo: { endDate: '1', totalTargetUserCount: 0, categoryDistributionType: 'Manually' },
      settings: { duration: '5' },
      barrelOptions
    },
    targetGroups: [],
    phishingScenarios: [],
    languageOptions: []
  })

  it('adds humanized barrel rows when barrelOptions present', () => {
    const items = fn.call(
      baseCtx({
        orderType: 'LureFirst',
        delayMinutes: 60,
        skipPayloadIfReported: true,
        responsiveDelivery: false,
        urgentFlagType: 'PayloadOnly'
      })
    )
    expect(items['Barrel Send Order']).toBe('Lure First')
    expect(items['Barrel Delay']).toBe('60 minutes')
    expect(items['Skip Payload If Reported']).toBe('Yes')
    expect(items['Responsive Delivery']).toBe('No')
    expect(items['Barrel Urgent Flag']).toBe('Payload Only')
  })

  it('omits barrel rows entirely for non-barrel campaigns', () => {
    const items = fn.call(baseCtx(undefined))
    expect(items).not.toHaveProperty('Barrel Send Order')
    expect(items).not.toHaveProperty('Barrel Delay')
  })
})
