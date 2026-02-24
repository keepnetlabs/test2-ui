import { shallowMount } from '@vue/test-utils'
import DeleteNotificationTemplateModal from '@/components/Company Settings/DeleteNotificationTemplateModal.vue'

describe('DeleteNotificationTemplateModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteNotificationTemplateModal, {
      propsData: {
        status: true,
        selectedItem: { resourceId: 't1', name: 'Template A' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('getTitle returns Delete Notification Template', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getTitle).toBe('Delete Notification Template')
  })

  it('getSubtitle returns selectedItem name', () => {
    const wrapper = createWrapper({ selectedItem: { name: 'My Template' } })
    expect(wrapper.vm.getSubtitle).toBe('My Template')
  })

  it('handleDelete emits handleDelete with resourceId', () => {
    const wrapper = createWrapper({ selectedItem: { resourceId: 'r1', name: 'X' } })
    wrapper.vm.handleDelete()
    expect(wrapper.emitted('handleDelete')).toEqual([['r1']])
  })

  it('handleCloseDialog emits closeDialog', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleCloseDialog()
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })
})
