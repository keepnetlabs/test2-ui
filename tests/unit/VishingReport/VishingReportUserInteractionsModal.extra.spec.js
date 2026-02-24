import { shallowMount } from '@vue/test-utils'
import VishingReportUserInteractionsModal from '@/components/VishingReport/VishingReportUserInteractionsModal.vue'
import * as vishingApi from '@/api/vishing'

jest.mock('@/api/vishing', () => ({
  getVishingReportUsersInteractions: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [{ status: 'Answered', callDate: '2024-01-01', callDuration: '00:30' }]
        }
      }
    })
  )
}))

const flushPromises = () => new Promise((r) => setTimeout(r, 0))

describe('VishingReportUserInteractionsModal.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportUserInteractionsModal, {
      propsData: {
        status: true,
        item: { resourceId: 'r1', firstName: 'John', lastName: 'Doe' },
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true }
    })

  it('getCanRenderTooltip returns false for empty row', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getCanRenderTooltip({})).toBe(false)
  })

  it('getCanRenderTooltip returns false for NotResponded without answeredBy', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getCanRenderTooltip({ status: 'NotResponded' })).toBe(false)
  })

  it('callForData handles empty results', async () => {
    vishingApi.getVishingReportUsersInteractions.mockResolvedValueOnce({
      data: { data: { results: [] } }
    })
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.vm.tableData).toEqual([])
  })

  it('callForData handles missing data in response', async () => {
    vishingApi.getVishingReportUsersInteractions.mockResolvedValueOnce({ data: {} })
    const wrapper = mountComponent()
    await flushPromises()
    expect(wrapper.vm.tableData).toEqual([])
  })
})
