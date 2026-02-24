import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportReplied from '@/components/CampaignManagerReport/Replied/CampaignManagerReportReplied'

describe('CampaignManagerReportReplied.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportReplied, {
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
        CampaignManagerReportRepliedTable: true,
        CampaignManagerReportRepliedDetailDialog: true
      }
    })

  it('returns password complexities when formDetails contains values', () => {
    const wrapper = mountComponent({
      formDetails: { passwordComplexityTypes: ['Lowercase', 'Uppercase'] }
    })
    expect(wrapper.vm.getPasswordComplexities).toEqual(['Lowercase', 'Uppercase'])
  })

  it('returns empty array when formDetails or complexity list is missing', () => {
    expect(mountComponent({ formDetails: undefined }).vm.getPasswordComplexities).toEqual([])
    expect(mountComponent({ formDetails: {} }).vm.getPasswordComplexities).toEqual([])
  })

  it('toggles detail dialog from event and clears selected row when closed', async () => {
    const wrapper = mountComponent()

    wrapper.vm.handleOnDetail({ id: 'row-7' })
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
    expect(wrapper.vm.selectedRow).toEqual({ id: 'row-7' })

    wrapper.vm.toggleShowDetailDialog()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
    expect(wrapper.vm.selectedRow).toBe(null)
  })

  it('opens resend dialog when resend payload arrives', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnResend([{ userId: 9 }])
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleOnDetail uses default empty row when payload is missing', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('handleSelectionChange updates resend item count', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(5)
    expect(wrapper.vm.resendItemCount).toBe(5)
  })
})
