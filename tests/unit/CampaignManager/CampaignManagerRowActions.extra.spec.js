import { createLocalVue, shallowMount } from '@vue/test-utils'
import CampaignManagerRowActions from '@/components/CampaignManager/CampaignManagerRowActions'
import { ACTION_STATUSES } from '@/components/CampaignManager/utils'

describe('CampaignManagerRowActions.vue (extra branch coverage)', () => {
  const localVue = createLocalVue()

  const mountComponent = (propsData = {}, options = {}) =>
    shallowMount(CampaignManagerRowActions, {
      localVue,
      propsData: {
        scope: { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 0 },
        rowActions: [],
        ...propsData
      },
      computed: {
        getCampaignManagerParentPreviewPermissions: () => true,
        getCampaignManagerParentCreatePermissions: () => true,
        getCampaignManagerParentDeletePermissions: () => true,
        getCampaignManagerParentUpdatePermissions: () => true
      },
      ...options
    })

  it('getItems else branch: other status returns edit, printPreview (when quishing), delete only', () => {
    const wrapper = mountComponent({
      scope: { row: { status: 'UnknownStatus', frequency: 0 }, $index: 0 },
      isQuishingPrintPreview: true
    })
    const items = wrapper.vm.getItems
    expect(items.some((i) => i.action === 'on-edit')).toBe(true)
    expect(items.some((i) => i.action === 'on-print-preview')).toBe(true)
    expect(items.some((i) => i.action === 'on-delete')).toBe(true)
    expect(items.some((i) => i.action === 'on-launch')).toBe(false)
    expect(items.some((i) => i.action === 'on-duplicate')).toBe(false)
  })

  it('getItems else branch without quishing: no printPreview', () => {
    const wrapper = mountComponent({
      scope: { row: { status: 'Other', frequency: 0 }, $index: 0 },
      isQuishingPrintPreview: false
    })
    const items = wrapper.vm.getItems
    expect(items.some((i) => i.action === 'on-print-preview')).toBe(false)
  })

  it('handleItemClick with on-print-preview emits correctly', () => {
    const wrapper = mountComponent()
    wrapper.vm.scope = { row: { id: 1 }, $index: 0 }
    wrapper.vm.handleItemClick({ action: 'on-print-preview' })
    expect(wrapper.emitted('on-print-preview')).toBeTruthy()
    expect(wrapper.emitted('on-print-preview')[0][0]).toEqual({ id: 1 })
  })

  it('handleItemClick with act.action not in mapped list uses act.action', () => {
    const wrapper = mountComponent()
    wrapper.vm.scope = { row: { id: 1 }, $index: 0 }
    wrapper.vm.handleItemClick({ action: 'on-preview' })
    expect(wrapper.emitted('on-preview')).toBeTruthy()
    expect(wrapper.emitted('on-preview')[0][0]).toEqual({ id: 1 })
  })
})
