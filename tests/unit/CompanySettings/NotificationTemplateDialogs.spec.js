import { shallowMount } from '@vue/test-utils'
import DeleteNotificationTemplateModal from '@/components/Company Settings/DeleteNotificationTemplateModal.vue'
import DefaultTemplateDeleteWarningModal from '@/components/Company Settings/DefaultTemplateDeleteWarningModal.vue'

describe('Company Settings notification template dialogs', () => {
  it('DeleteNotificationTemplateModal computes title/subtitle and emits actions', () => {
    const wrapper = shallowMount(DeleteNotificationTemplateModal, {
      propsData: {
        status: true,
        selectedItem: { name: 'Welcome Template', resourceId: 'tpl-11' }
      },
      stubs: {
        AppDialog: true,
        AppDialogFooter: true
      }
    })

    expect(wrapper.vm.getTitle).toBe('Delete Notification Template')
    expect(wrapper.vm.getSubtitle).toBe('Welcome Template')

    wrapper.vm.handleDelete()
    wrapper.vm.handleCloseDialog()

    expect(wrapper.emitted('handleDelete')).toEqual([['tpl-11']])
    expect(wrapper.emitted('closeDialog')).toBeTruthy()
  })

  it('DefaultTemplateDeleteWarningModal emits closeOverlay', () => {
    const wrapper = shallowMount(DefaultTemplateDeleteWarningModal, {
      propsData: {
        status: true,
        templateName: 'Default SMTP'
      },
      stubs: {
        AppDialog: true,
        VBtn: true
      }
    })

    wrapper.vm.closeOverlay()
    expect(wrapper.emitted('closeOverlay')).toBeTruthy()
  })
})
