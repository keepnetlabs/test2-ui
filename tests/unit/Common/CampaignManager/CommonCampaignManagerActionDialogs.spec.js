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
  })
})
