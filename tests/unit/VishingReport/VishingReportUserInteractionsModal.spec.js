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

describe('VishingReportUserInteractionsModal.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(VishingReportUserInteractionsModal, {
      propsData: {
        status: true,
        item: { resourceId: 'r1', firstName: 'John', lastName: 'Doe' },
        ...propsData
      },
      stubs: { AppDialog: true, DataTable: true, Badge: true }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('getSubtitle returns full name from item', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getSubtitle).toBe('John Doe')
  })

  it('getSubtitle handles missing item fields', () => {
    const wrapper = mountComponent({ item: {} })
    expect(wrapper.vm.getSubtitle).toBe(' ')
  })

  it('getCanRenderTooltip returns true for NotResponded + Answered By A Machine', () => {
    const wrapper = mountComponent()
    expect(
      wrapper.vm.getCanRenderTooltip({
        status: 'NotResponded',
        answeredBy: 'Answered By A Machine'
      })
    ).toBe(true)
  })

  it('getCanRenderTooltip returns true for Answered + not Human', () => {
    const wrapper = mountComponent()
    expect(
      wrapper.vm.getCanRenderTooltip({ status: 'Answered', answeredBy: 'Answered By A Machine' })
    ).toBe(true)
  })

  it('getCanRenderTooltip returns false for Answered + Human', () => {
    const wrapper = mountComponent()
    expect(
      wrapper.vm.getCanRenderTooltip({ status: 'Answered', answeredBy: 'Answered By A Human' })
    ).toBe(false)
  })

  it('getTooltipContent returns AnsweredByMachineTooltipText for NotResponded', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getTooltipContent({ status: 'NotResponded' })
    expect(result).toBeDefined()
    expect(typeof result).toBe('string')
  })

  it('getTooltipContent returns AnsweredByUnknownTooltipText for Answered', () => {
    const wrapper = mountComponent()
    const result = wrapper.vm.getTooltipContent({ status: 'Answered' })
    expect(result).toBeDefined()
  })

  it('getTooltipContent returns empty for other status', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.getTooltipContent({ status: 'Other' })).toBe('')
  })

  it('callForData fetches interactions and updates table', async () => {
    const wrapper = mountComponent()
    await flushPromises()
    expect(vishingApi.getVishingReportUsersInteractions).toHaveBeenCalled()
    expect(wrapper.vm.tableData).toHaveLength(1)
    expect(wrapper.vm.tableData[0].status).toBe('Answered')
  })

  it('handleClose emits on-close', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })
})
