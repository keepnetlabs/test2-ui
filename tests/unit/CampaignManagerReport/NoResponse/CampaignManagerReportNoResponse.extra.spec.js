import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportNoResponse from '@/components/CampaignManagerReport/NoResponse/CampaignManagerReportNoResponse'

describe('CampaignManagerReportNoResponse.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = () =>
    shallowMount(CampaignManagerReportNoResponse, {
      localVue,
      propsData: {
        id: 'id-1',
        instanceGroup: 'group-1',
        customFields: []
      },
      stubs: {
        CampaignManagerReportResendDialog: true,
        CampaignManagerReportHeader: true,
        CampaignManagerReportNoResponseTable: true
      }
    })

  it('handleSelectionChange updates resend count for positive and zero values', () => {
    const wrapper = mountComponent()
    wrapper.vm.handleSelectionChange(8)
    expect(wrapper.vm.resendItemCount).toBe(8)

    wrapper.vm.handleSelectionChange(0)
    expect(wrapper.vm.resendItemCount).toBe(0)
  })

  it('handleOnResend sets payload and toggles resend dialog', async () => {
    const wrapper = mountComponent()
    const payload = [{ userId: 99 }]

    wrapper.vm.handleOnResend(payload)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.resendPayload).toEqual(payload)
    expect(wrapper.vm.isShowResendDialog).toBe(true)
  })
})
