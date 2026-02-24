import { shallowMount } from '@vue/test-utils'
import CommonCampaignManagerCancelCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCancelCampaignDialog.vue'
import CommonCampaignManagerCreateNewInstanceDialog from '@/components/Common/CampaignManager/CommonCampaignManagerCreateNewInstanceDialog.vue'

describe('Common campaign manager action dialogs (extra)', () => {
  it('cancel dialog keeps constants and emits on repeated confirm/close', () => {
    const item = { id: 'cmp-1' }
    const wrapper = shallowMount(CommonCampaignManagerCancelCampaignDialog, {
      propsData: {
        status: true,
        item,
        isActionButtonDisabled: true
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleConfirm()
    wrapper.vm.handleConfirm()
    wrapper.vm.handleClose()
    wrapper.vm.handleClose()

    expect(wrapper.vm.CONSTANTS).toEqual({
      icon: 'mdi-close',
      title: 'Cancel The Campaign',
      content: 'Do you want to cancel this campaign?'
    })
    expect(wrapper.emitted('on-confirm')).toEqual([[item], [item]])
    expect(wrapper.emitted('on-close')).toHaveLength(2)
  })

  it('create-new-instance dialog data defaults and emits current resourceId', async () => {
    const wrapper = shallowMount(CommonCampaignManagerCreateNewInstanceDialog, {
      propsData: {
        status: true,
        resourceId: 'res-1'
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(wrapper.vm.isActionButtonDisabled).toBe(false)
    expect(wrapper.vm.isMultipleDelete).toBe(false)
    expect(wrapper.vm.multipleDeletedUserCount).toBe(0)

    wrapper.vm.handleConfirm()
    await wrapper.setProps({ resourceId: 'res-2' })
    wrapper.vm.handleConfirm()

    expect(wrapper.emitted('on-confirm')).toEqual([['res-1'], ['res-2']])
  })

  it('cancel dialog supports missing item and keeps disabled prop value', () => {
    const wrapper = shallowMount(CommonCampaignManagerCancelCampaignDialog, {
      propsData: {
        status: false,
        isActionButtonDisabled: false
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleConfirm()
    wrapper.vm.handleClose()

    expect(wrapper.props('status')).toBe(false)
    expect(wrapper.props('isActionButtonDisabled')).toBe(false)
    expect(wrapper.emitted('on-confirm')).toEqual([[undefined]])
    expect(wrapper.emitted('on-close')).toHaveLength(1)
  })

  it('create-new-instance dialog emits close repeatedly and exposes constants', () => {
    const wrapper = shallowMount(CommonCampaignManagerCreateNewInstanceDialog, {
      propsData: {
        status: true,
        resourceId: undefined
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    wrapper.vm.handleClose()
    wrapper.vm.handleClose()
    wrapper.vm.handleConfirm()

    expect(wrapper.vm.CONSTANTS).toEqual({
      icon: '$custom-new-instance',
      title: 'Create New Run',
      content: 'Do you want to create a new run?'
    })
    expect(wrapper.emitted('on-close')).toHaveLength(2)
    expect(wrapper.emitted('on-confirm')).toEqual([[undefined]])
  })
})
