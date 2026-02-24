import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerReportResendDialog from '@/components/CampaignManagerReport/CampaignManagerReportResendDialog'

describe('CampaignManagerReportResendDialog.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerReportResendDialog, {
      localVue,
      propsData: {
        status: true,
        payload: {},
        resendItemCount: 0,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('getResendText returns default when payload is undefined', () => {
    const wrapper = mountComponent({ payload: undefined })
    expect(wrapper.vm.getResendText).toContain('users you selected')
  })

  it('getResendText returns default when payload is null', () => {
    const wrapper = mountComponent({ payload: null })
    expect(wrapper.vm.getResendText).toContain('users you selected')
  })

  it('getResendText returns default when payload.items is empty array', () => {
    const wrapper = mountComponent({ payload: { items: [] } })
    expect(wrapper.vm.getResendText).toContain('users you selected')
  })

  it('getResendText uses payload.items when resendItemCount is 0 and payload has items', () => {
    const wrapper = mountComponent({
      resendItemCount: 0,
      payload: { items: [{ id: 1 }, { id: 2 }] }
    })
    expect(wrapper.vm.getResendText).toContain('2 users')
  })

  it('getResendText uses singular "user" for single payload item', () => {
    const wrapper = mountComponent({
      resendItemCount: 0,
      payload: { items: [{ id: 1 }] }
    })
    expect(wrapper.vm.getResendText).toContain('1 user')
    expect(wrapper.vm.getResendText).not.toContain('1 users')
  })

  it('getResendText prioritizes resendItemCount over payload', () => {
    const wrapper = mountComponent({
      resendItemCount: 2,
      payload: { items: [{ id: 1 }, { id: 2 }, { id: 3 }] }
    })
    expect(wrapper.vm.getResendText).toContain('2 users')
  })
})
