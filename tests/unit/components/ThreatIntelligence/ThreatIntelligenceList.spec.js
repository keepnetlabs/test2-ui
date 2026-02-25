jest.mock('@/api/threatIntelligence', () => ({
  getThreatIntelligenceList: jest.fn(() => Promise.resolve({ data: { data: { results: [] } } })),
  exportThreatIntelligence: jest.fn()
}))

import { shallowMount } from '@vue/test-utils'
import ThreatIntelligenceList from '@/components/ThreatIntelligence/ThreatIntelligenceList.vue'

describe('ThreatIntelligenceList.vue', () => {
  const createWrapper = () =>
    shallowMount(ThreatIntelligenceList, {
      mocks: {
        $store: {
          getters: {
            'permissions/getThreatIntelligencePermissionsSearch': true,
            'permissions/getThreatIntelligencePermissionsExport': true
          }
        }
      },
      stubs: { DataTable: true }
    })

  it('tableOptions has columns', () => {
    const wrapper = createWrapper()
    const opts = wrapper.vm.tableOptions
    expect(opts.columns).toBeDefined()
    expect(opts.columns.length).toBeGreaterThan(0)
    expect(opts.columns[0].property).toBe('email')
  })

  it('CONSTANTS has id', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.CONSTANTS.id).toBe('ThreatIntelligenceList')
  })
})
