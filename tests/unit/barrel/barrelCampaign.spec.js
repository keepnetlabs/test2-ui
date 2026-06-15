// Barrel detection in CampaignManagerAddOrEditModal: tolerant per-scenario matching and the
// distribution-aware isBarrelCampaign gate that drives the barrel config panel + payload.
jest.mock('@/helper-classes/lookup-local-storage', () => ({
  __esModule: true,
  default: { getSingle: jest.fn(() => Promise.resolve([])) }
}))
jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return { ...actual, isDifferent: jest.fn(() => false) }
})

import CampaignManagerAddOrEditModal from '@/components/CampaignManager/CampaignManagerAddOrEditModal.vue'
import { SCENARIO_DISTRIBUTION } from '@/components/CampaignManager/utils'

const isDoubleBarrelScenario = CampaignManagerAddOrEditModal.methods.isDoubleBarrelScenario
const isBarrelCampaign = CampaignManagerAddOrEditModal.computed.isBarrelCampaign

describe('isDoubleBarrelScenario (tolerant match)', () => {
  it.each([
    ['method "Double Barrel"', { method: 'Double Barrel' }],
    ['method "DoubleBarrel"', { method: 'DoubleBarrel' }],
    ['method "double_barrel"', { method: 'double_barrel' }],
    ['method "double-barrel"', { method: 'double-barrel' }],
    ['numeric methodTypeId 6', { methodTypeId: 6 }],
    ['string methodTypeId "6"', { methodTypeId: '6' }],
    ['methodType "6"', { methodType: '6' }]
  ])('matches %s', (_label, scenario) => {
    expect(isDoubleBarrelScenario.call({}, scenario)).toBe(true)
  })

  it.each([
    ['Click Only', { method: 'Click Only' }],
    ['Attachment + methodTypeId 3', { method: 'Attachment', methodTypeId: 3 }],
    ['empty object', {}],
    ['null', null]
  ])('rejects %s', (_label, scenario) => {
    expect(isDoubleBarrelScenario.call({}, scenario)).toBe(false)
  })
})

describe('isBarrelCampaign (distribution-aware source)', () => {
  const ctx = (over) => ({ isDoubleBarrelScenario, ...over })

  it('uses phishingScenarioItems for non-manual distribution', () => {
    expect(
      isBarrelCampaign.call(
        ctx({
          scenarioDistribution: SCENARIO_DISTRIBUTION.AUTOMATICALLY ?? 1,
          phishingScenarioItems: [{ method: 'Double Barrel' }],
          selectedPhishingScenarios: [{ method: 'Click Only' }]
        })
      )
    ).toBe(true)
  })

  it('uses selectedPhishingScenarios for manual distribution', () => {
    expect(
      isBarrelCampaign.call(
        ctx({
          scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
          phishingScenarioItems: [{ method: 'Double Barrel' }],
          selectedPhishingScenarios: [{ method: 'Click Only' }]
        })
      )
    ).toBe(false)
  })

  it('is true when a manually-selected scenario is Double Barrel', () => {
    expect(
      isBarrelCampaign.call(
        ctx({
          scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
          phishingScenarioItems: [],
          selectedPhishingScenarios: [{ method: 'Click Only' }, { methodTypeId: 6 }]
        })
      )
    ).toBe(true)
  })

  it('is false when no scenario is Double Barrel', () => {
    expect(
      isBarrelCampaign.call(
        ctx({
          scenarioDistribution: SCENARIO_DISTRIBUTION.MANUALLY,
          phishingScenarioItems: [],
          selectedPhishingScenarios: [{ method: 'Click Only' }, { method: 'Attachment' }]
        })
      )
    ).toBe(false)
  })
})
