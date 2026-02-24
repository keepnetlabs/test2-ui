import { shallowMount } from '@vue/test-utils'
import CallbackReportEnteredDigits from '@/components/CallbackReport/EnteredDigits/CallbackReportEnteredDigits.vue'

describe('CallbackReportEnteredDigits.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CallbackReportEnteredDigits, {
      propsData: {
        id: 'cb-1',
        instanceGroup: 'g1',
        customFields: [],
        ...propsData
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CallbackReportEnteredDigitsTable: true
      }
    })

  it('renders as Vue component', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm).toBeDefined()
  })

  it('handleSelectionChange updates resendItemCount', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(5)
    expect(wrapper.vm.resendItemCount).toBe(5)
  })

  it('handleOnDetail sets selectedRow and opens detail dialog', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail({ id: 'row-1' })
    expect(wrapper.vm.selectedRow).toEqual({ id: 'row-1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('handleOnDetail uses default empty object when row not provided', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
  })

  it('toggleShowDetailDialog clears selectedRow when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'r1' }
    wrapper.vm.isShowDetailDialog = true
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
  })

  it('toggleShowDetailDialog does not clear selectedRow when opening', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'r1' }
    wrapper.vm.isShowDetailDialog = false
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toEqual({ id: 'r1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })
})
