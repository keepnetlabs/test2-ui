import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportSubmittedData from '@/components/CampaignManagerReport/SubmittedData/CampaignManagerReportSubmittedData'

describe('CampaignManagerReportSubmittedData.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportSubmittedData, {
      localVue,
      propsData: {
        id: 'id-1',
        instanceGroup: 'group-1',
        customFields: [],
        ...propsData
      },
      stubs: {
        CampaignManagerReportHeader: true,
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportSubmittedTable: true,
        CampaignManagerReportSubmittedItemDetailDialog: true
      }
    })

  it('returns password complexity list from formDetails when available', () => {
    const wrapper = mountComponent({
      formDetails: { passwordComplexityTypes: ['Numeric'] }
    })
    expect(wrapper.vm.getPasswordComplexities).toEqual(['Numeric'])
  })

  it('returns empty array when formDetails or complexity list is missing', () => {
    expect(mountComponent({ formDetails: undefined }).vm.getPasswordComplexities).toEqual([])
    expect(mountComponent({ formDetails: {} }).vm.getPasswordComplexities).toEqual([])
  })

  it('toggles detail dialog and clears selectedRow when closing', async () => {
    const wrapper = mountComponent()

    wrapper.vm.handleOnDetail({ id: 'sub-2' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual({ id: 'sub-2' })

    wrapper.vm.toggleShowDetailDialog()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('opens resend dialog when resend payload arrives', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnResend([{ userId: 99 }])
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleOnDetail uses empty object when no row is provided', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('handleSelectionChange updates resend item count', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(8)
    expect(wrapper.vm.resendItemCount).toBe(8)
  })
})
