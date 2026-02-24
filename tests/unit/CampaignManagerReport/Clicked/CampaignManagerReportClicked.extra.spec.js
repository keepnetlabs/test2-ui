import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportClicked from '@/components/CampaignManagerReport/Clicked/CampaignManagerReportClicked'

describe('CampaignManagerReportClicked.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(CampaignManagerReportClicked, {
      localVue,
      propsData: {
        id: 'id-1',
        instanceGroup: 'group-1',
        customFields: []
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportClickedItemDetailDialog: true,
        CampaignManagerReportClickedTable: true
      }
    })

  it('handleOnResend sets payload and opens resend dialog', async () => {
    const wrapper = mountComponent()
    const payload = [{ userId: 1 }]

    wrapper.vm.handleOnResend(payload)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.resendPayload).toEqual(payload)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })

  it('handleOnDetail sets selected row and opens detail dialog', async () => {
    const wrapper = mountComponent()

    wrapper.vm.handleOnDetail({ id: 'row-1' })
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.selectedRow).toEqual({ id: 'row-1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)
  })

  it('handleOnDetail falls back to empty object when row is missing', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleOnDetail()
    expect(wrapper.vm.selectedRow).toEqual({})
  })

  it('toggleShowDetailDialog clears selected row only when closing', () => {
    const wrapper = mountComponent()
    wrapper.vm.selectedRow = { id: 'row-1' }
    wrapper.vm.isShowDetailDialog = false
    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toEqual({ id: 'row-1' })
    expect(wrapper.vm.isShowDetailDialog).toBe(true)

    wrapper.vm.toggleShowDetailDialog()
    expect(wrapper.vm.selectedRow).toBe(null)
    expect(wrapper.vm.isShowDetailDialog).toBe(false)
  })
})
