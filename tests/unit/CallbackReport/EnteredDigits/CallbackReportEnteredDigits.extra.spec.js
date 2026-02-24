import { shallowMount } from '@vue/test-utils'
import CallbackReportEnteredDigits from '@/components/CallbackReport/EnteredDigits/CallbackReportEnteredDigits.vue'

describe('CallbackReportEnteredDigits.vue (extra branch coverage)', () => {
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

  it('handleSelectionChange with 0', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(0)
    expect(wrapper.vm.resendItemCount).toBe(0)
  })

  it('handleOnDetail with full row object', () => {
    const wrapper = mountComponent()
    const row = { id: 'r1', firstName: 'John', lastName: 'Doe' }
    wrapper.vm.handleOnDetail(row)
    expect(wrapper.vm.selectedRow).toEqual(row)
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })
})
