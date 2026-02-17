import { shallowMount } from '@vue/test-utils'
import CommonCampaignManagerCancelCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCancelCampaignDialog.vue'
import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog.vue'

describe('Common campaign manager action dialogs', () => {
  it('CommonCampaignManagerCancelCampaignDialog emits close and confirm with item', () => {
    const item = { id: 'cmp-9', name: 'Q4 Campaign' }
    const wrapper = shallowMount(CommonCampaignManagerCancelCampaignDialog, {
      propsData: {
        status: true,
        item,
        isActionButtonDisabled: false
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleClose()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toEqual([[item]])
    expect(wrapper.vm.CONSTANTS.title).toBe('Cancel The Campaign')
    expect(wrapper.vm.CONSTANTS.content).toBe('Do you want to cancel this campaign?')
  })

  it('CommonCampaignManagerCreateNewInstanceDialog emits close and confirm with resourceId', () => {
    const wrapper = shallowMount(CommonCampaignManagerCreateNewInstanceDialog, {
      propsData: {
        status: true,
        resourceId: 'res-123'
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleClose()
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-confirm')).toEqual([['res-123']])
    expect(wrapper.vm.CONSTANTS.title).toBe('Create New Instance')
    expect(wrapper.vm.CONSTANTS.icon).toBe('$custom-new-instance')
  })

  it('CommonCampaignManagerCreateNewInstanceDialog emits undefined when resourceId is absent', () => {
    const wrapper = shallowMount(CommonCampaignManagerCreateNewInstanceDialog, {
      propsData: {
        status: true
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toEqual([[undefined]])
  })

  it('CommonCampaignManagerCancelCampaignDialog has expected constants and close behavior', () => {
    const wrapper = shallowMount(CommonCampaignManagerCancelCampaignDialog, {
      propsData: {
        status: true,
        isActionButtonDisabled: true
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-close')
    expect(wrapper.vm.CONSTANTS.content).toBe('Do you want to cancel this campaign?')
    wrapper.vm.handleClose()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('CommonCampaignManagerCreateNewInstanceDialog has expected constants content', () => {
    const wrapper = shallowMount(CommonCampaignManagerCreateNewInstanceDialog, {
      propsData: {
        status: true,
        resourceId: 'res-77'
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(wrapper.vm.CONSTANTS.content).toBe('Do you want to create a new instance?')
    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
  })

  it('CommonCampaignManagerCancelCampaignDialog emits undefined item when item prop is absent', () => {
    const wrapper = shallowMount(CommonCampaignManagerCancelCampaignDialog, {
      propsData: {
        status: true
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleConfirm()
    expect(wrapper.emitted('on-confirm')).toEqual([[undefined]])
  })

  it('CommonCampaignManagerCreateNewInstanceDialog close action can be emitted multiple times', () => {
    const wrapper = shallowMount(CommonCampaignManagerCreateNewInstanceDialog, {
      propsData: {
        status: true,
        resourceId: 'res-repeat'
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleClose()
    wrapper.vm.handleClose()

    expect(wrapper.emitted('on-close')).toHaveLength(2)
  })
})
