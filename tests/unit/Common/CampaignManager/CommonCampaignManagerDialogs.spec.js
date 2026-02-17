import { shallowMount } from '@vue/test-utils'
import CommonCampaignManagerDeleteDialog from '@/components/Common/CampaignManager/CommonCampaignManagerDeleteDialog.vue'
import CommonCampaignManagerLaunchCampaignDialog from '@/components/Common/CampaignManager/CommonCampaignManagerLaunchCampaignDialog.vue'

describe('Common campaign manager dialogs', () => {
  it('CommonCampaignManagerDeleteDialog computes content/subtitle for single and multiple', () => {
    const singleWrapper = shallowMount(CommonCampaignManagerDeleteDialog, {
      propsData: {
        status: true,
        item: { name: 'Campaign A' },
        isMultiple: false,
        userCount: 0
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(singleWrapper.vm.getContent).toBe('Campaign A will be deleted.')
    expect(singleWrapper.vm.getSubTitle).toBe('Campaign will deleted permanently')

    const multipleWrapper = shallowMount(CommonCampaignManagerDeleteDialog, {
      propsData: {
        status: true,
        item: { name: 'Campaign A' },
        isMultiple: true,
        userCount: 3
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(multipleWrapper.vm.getContent).toBe('3 campaign(s) will be deleted')
    expect(multipleWrapper.vm.getSubTitle).toBe('3 campaign(s) will deleted permanently')
  })

  it('CommonCampaignManagerDeleteDialog emits correct delete events', () => {
    const singleWrapper = shallowMount(CommonCampaignManagerDeleteDialog, {
      propsData: {
        status: true,
        item: { name: 'Campaign A', id: 1 },
        isMultiple: false
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })
    singleWrapper.vm.handleDelete()
    expect(singleWrapper.emitted('on-delete')).toEqual([[{ name: 'Campaign A', id: 1 }]])

    const multipleWrapper = shallowMount(CommonCampaignManagerDeleteDialog, {
      propsData: {
        status: true,
        isMultiple: true,
        userCount: 2
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })
    multipleWrapper.vm.handleDelete()
    expect(multipleWrapper.emitted('on-multiple-delete')).toBeTruthy()
  })

  it('CommonCampaignManagerDeleteDialog emits on-close and handles missing item safely', () => {
    const wrapper = shallowMount(CommonCampaignManagerDeleteDialog, {
      propsData: {
        status: true,
        item: null,
        isMultiple: false
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(wrapper.vm.getContent).toBe('null will be deleted.')
    expect(wrapper.vm.CONSTANTS.title).toBe('Delete Campaign(s)?')

    wrapper.vm.closeModal()
    expect(wrapper.emitted('on-close')).toBeTruthy()
  })

  it('CommonCampaignManagerLaunchCampaignDialog emits close and confirm with item', () => {
    const item = { name: 'Launch me', id: 'cmp-1' }
    const wrapper = shallowMount(CommonCampaignManagerLaunchCampaignDialog, {
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
    expect(wrapper.vm.CONSTANTS.content).toBe('Do you want to launch this campaign?')
  })
})
