import { shallowMount } from '@vue/test-utils'
import CampaignManagerReportSummaryResendDialog from '@/components/CampaignManagerReport/Summary/CampaignManagerReportSummaryResendDialog'

describe('CampaignManagerReportSummaryResendDialog.vue', () => {
  const createWrapper = (propsData = {}, expired = false) =>
    shallowMount(CampaignManagerReportSummaryResendDialog, {
      propsData: {
        status: true,
        isActionButtonDisabled: false,
        items: {
          notDelivered: 1,
          openedEmail: 2,
          clickedEmail: 3,
          submittedEmail: 4,
          mfa: 5,
          attachmentOpenedEmail: 6,
          noResponseEmail: 7
        },
        phishingScenarioName: 'Scenario 1',
        ...propsData
      },
      provide: {
        campaignDurationExpired: () => expired
      },
      stubs: {
        AppDialog: {
          template:
            '<div><slot name="app-dialog-body" /><slot name="app-dialog-footer" /></div>'
        },
        AppDialogFooter: true,
        VTooltip: {
          template: '<div><slot name="activator" :on="{}" /><slot /></div>'
        },
        'v-checkbox': true
      }
    })

  it('computes action button disabled by props and selected types', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getActionButtonDisabled).toBe(true)

    await wrapper.setData({ types: [1, 2] })
    expect(wrapper.vm.getActionButtonDisabled).toBe(false)

    await wrapper.setProps({ isActionButtonDisabled: true })
    expect(wrapper.vm.getActionButtonDisabled).toBe(true)
  })

  it('emits close and confirm events', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ types: [3, 4] })

    wrapper.vm.closeModal()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')[0][0]).toEqual([3, 4])
  })

  it('renders checkboxes disabled when campaign duration expired', () => {
    const wrapper = createWrapper({}, true)

    const checkboxes = wrapper.findAll('v-checkbox-stub')
    expect(checkboxes.length).toBeGreaterThan(0)
    const disabledProps = checkboxes.wrappers.map((item) => item.props('disabled'))
    expect(disabledProps).toContain(true)
  })
})
