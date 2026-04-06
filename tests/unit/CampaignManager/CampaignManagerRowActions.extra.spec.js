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

  it('handleItemClick maps Idle, Completed, and Canceled actions to on-launch', () => {
    const wrapper = mountComponent()
    const innerRow = { id: 'r1', frequency: 0 }
    wrapper.vm.scope = { row: innerRow, $index: 0 }

    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.IDLE })
    expect(wrapper.emitted('on-launch')[0][0]).toEqual(innerRow)

    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.COMPLETE })
    expect(wrapper.emitted('on-launch')[1][0]).toEqual(innerRow)

    wrapper.vm.handleItemClick({ action: ACTION_STATUSES.CANCEL })
    expect(wrapper.emitted('on-launch')[2][0]).toEqual(innerRow)
  })

  it('marks delete action disabled when delete permission is false', () => {
    const wrapper = shallowMount(CampaignManagerRowActions, {
      localVue,
      propsData: {
        scope: { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 0 },
        rowActions: []
      },
      computed: {
        getCampaignManagerParentPreviewPermissions: () => true,
        getCampaignManagerParentCreatePermissions: () => true,
        getCampaignManagerParentDeletePermissions: () => false,
        getCampaignManagerParentUpdatePermissions: () => true
      },
      stubs: {
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VMenu: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })
    const deleteItem = wrapper.vm.getItems.find((i) => i.action === 'on-delete')
    expect(deleteItem.disabled).toBe(true)
  })

  it('getItems for Error status uses else branch like Paused (no launch/duplicate)', () => {
    const wrapper = shallowMount(CampaignManagerRowActions, {
      localVue,
      propsData: {
        scope: { row: { status: ACTION_STATUSES.ERROR, frequency: 0 }, $index: 0 },
        rowActions: [],
        isQuishingPrintPreview: false
      },
      computed: {
        getCampaignManagerParentPreviewPermissions: () => true,
        getCampaignManagerParentCreatePermissions: () => true,
        getCampaignManagerParentDeletePermissions: () => true,
        getCampaignManagerParentUpdatePermissions: () => true
      },
      stubs: {
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VMenu: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })
    const items = wrapper.vm.getItems
    expect(items.some((i) => i.action === 'on-edit')).toBe(true)
    expect(items.some((i) => i.action === 'on-delete')).toBe(true)
    expect(items.some((i) => i.action === 'on-launch')).toBe(false)
  })

  it('getItems for Paused status uses else branch (edit, delete; no new instance / duplicate)', () => {
    const wrapper = shallowMount(CampaignManagerRowActions, {
      localVue,
      propsData: {
        scope: { row: { status: ACTION_STATUSES.PAUSE, frequency: 0 }, $index: 0 },
        rowActions: [],
        isQuishingPrintPreview: false
      },
      computed: {
        getCampaignManagerParentPreviewPermissions: () => true,
        getCampaignManagerParentCreatePermissions: () => true,
        getCampaignManagerParentDeletePermissions: () => true,
        getCampaignManagerParentUpdatePermissions: () => true
      },
      stubs: {
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VMenu: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })
    const items = wrapper.vm.getItems
    expect(items.some((i) => i.action === 'on-edit')).toBe(true)
    expect(items.some((i) => i.action === 'on-delete')).toBe(true)
    expect(items.some((i) => i.action === 'on-launch')).toBe(false)
    expect(items.some((i) => i.action === 'on-duplicate')).toBe(false)
  })

  it('marks new instance action disabled when create permission is false', () => {
    const wrapper = shallowMount(CampaignManagerRowActions, {
      localVue,
      propsData: {
        scope: { row: { status: ACTION_STATUSES.IDLE, frequency: 0 }, $index: 0 },
        rowActions: []
      },
      computed: {
        getCampaignManagerParentPreviewPermissions: () => true,
        getCampaignManagerParentCreatePermissions: () => false,
        getCampaignManagerParentDeletePermissions: () => true,
        getCampaignManagerParentUpdatePermissions: () => true
      },
      stubs: {
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VMenu: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })
    const ni = wrapper.vm.getItems.find(
      (i) => i.id === 'btn-new-instance-item-row-actions-campaign-manager'
    )
    expect(ni.disabled).toBe(true)
    expect(String(ni.disabledText)).toContain('Create')
  })

  it('marks edit action disabled when row frequency is set (recurring campaign)', () => {
    const wrapper = shallowMount(CampaignManagerRowActions, {
      localVue,
      propsData: {
        scope: { row: { status: ACTION_STATUSES.IDLE, frequency: 1 }, $index: 0 },
        rowActions: []
      },
      computed: {
        getCampaignManagerParentPreviewPermissions: () => true,
        getCampaignManagerParentCreatePermissions: () => true,
        getCampaignManagerParentDeletePermissions: () => true,
        getCampaignManagerParentUpdatePermissions: () => true
      },
      stubs: {
        VTooltip: true,
        VBtn: true,
        VIcon: true,
        VMenu: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })
    const edit = wrapper.vm.getItems.find((i) => i.action === 'on-edit')
    expect(edit.disabled).toBe(true)
    expect(String(edit.disabledText)).toContain('frequency')
  })
})
