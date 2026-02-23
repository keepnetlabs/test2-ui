import { shallowMount } from '@vue/test-utils'
import CampaignManagerScheduleDialog from '@/components/CallbackCampaignManager/CampaignManagerScheduleDialog.vue'

describe('CallbackCampaignManager/CampaignManagerScheduleDialog.vue', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(CampaignManagerScheduleDialog, {
      propsData: {
        status: true,
        campaignName: 'Callback Campaign A',
        selectedFrequency: 'Weekly',
        items: [{ scenarioName: 'S1', scheduleDate: '2026-02-23' }],
        ...propsData
      },
      stubs: {
        AppDialog: true,
        DatatableLoading: true
      }
    })

  it('has expected name and constant title/icon', () => {
    const wrapper = mountComponent()
    expect(wrapper.vm.$options.name).toBe('CampaignManagerItemDeleteDialog')
    expect(wrapper.vm.CONSTANTS.icon).toBe('mdi-calendar-range')
    expect(wrapper.vm.CONSTANTS.title).toBe('Callback Scenarios Frequency Schedule')
  })

  it('computed subtitle returns campaign name or empty string', () => {
    const withName = mountComponent({ campaignName: 'X' })
    expect(withName.vm.getSubtitle).toBe('X')

    const withoutName = mountComponent({ campaignName: undefined })
    expect(withoutName.vm.getSubtitle).toBe('')
  })

  it('closeModal and handleDelete emit expected events', () => {
    const wrapper = mountComponent()
    wrapper.vm.closeModal()
    wrapper.vm.handleDelete()

    expect(wrapper.emitted('on-close')).toBeTruthy()
    expect(wrapper.emitted('on-delete')[0][0]).toBe(undefined)
  })

  it('handleDelete emits payload when item exists on context', () => {
    const emit = jest.fn()
    CampaignManagerScheduleDialog.methods.handleDelete.call({
      item: { id: 'x1' },
      $emit: emit
    })

    expect(emit).toHaveBeenCalledWith('on-delete', { id: 'x1' })
  })
})
