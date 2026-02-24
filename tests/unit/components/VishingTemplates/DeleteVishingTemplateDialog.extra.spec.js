jest.mock('@/api/vishing', () => ({
  deleteVishingTemplate: jest.fn(() => Promise.resolve()),
  bulkDeleteVishingTemplates: jest.fn(() => Promise.resolve())
}))

import { shallowMount } from '@vue/test-utils'
import DeleteVishingTemplateDialog from '@/components/VishingTemplates/DeleteVishingTemplateDialog.vue'
import { deleteVishingTemplate, bulkDeleteVishingTemplates } from '@/api/vishing'

describe('DeleteVishingTemplateDialog.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteVishingTemplateDialog, {
      propsData: {
        status: true,
        selectedTemplate: { resourceId: 't1', name: 'Template A' },
        templateCount: 0,
        isMultiple: false,
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('getBodyText returns single template text when isMultiple is false', () => {
    const wrapper = createWrapper({
      isMultiple: false,
      selectedTemplate: { resourceId: 't1', name: 'My Template' }
    })
    expect(wrapper.vm.getBodyText).toBe('My Template will be deleted.')
  })

  it('getBodyText returns multiple template count when isMultiple is true', () => {
    const wrapper = createWrapper({ isMultiple: true, templateCount: 5 })
    expect(wrapper.vm.getBodyText).toBe('5 vishing templates will be deleted.')
  })

  it('getBodyText handles null selectedTemplate', () => {
    const wrapper = createWrapper({ isMultiple: false, selectedTemplate: null })
    expect(wrapper.vm.getBodyText).toBe('null will be deleted.')
  })

  it('handleDelete single: calls deleteVishingTemplate and emits on success', async () => {
    const wrapper = createWrapper({
      isMultiple: false,
      selectedTemplate: { resourceId: 't1', name: 'A' }
    })
    wrapper.vm.handleDelete()
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

    expect(deleteVishingTemplate).toHaveBeenCalledWith('t1')
    expect(bulkDeleteVishingTemplates).not.toHaveBeenCalled()
    expect(wrapper.emitted('handleSuccessDeleteAction')).toBeTruthy()
    expect(wrapper.emitted('handleSuccessDeleteAction')[0][0]).toEqual({
      resourceId: 't1',
      name: 'A'
    })
  })

  it('handleDelete multiple: calls bulkDeleteVishingTemplates and emits on-success-multiple', async () => {
    const payload = { ids: ['t1', 't2'] }
    const wrapper = createWrapper({
      isMultiple: true,
      multipleDeletePayload: payload
    })
    wrapper.vm.handleDelete()
    await wrapper.vm.$nextTick()
    await new Promise((r) => setTimeout(r, 0))

    expect(bulkDeleteVishingTemplates).toHaveBeenCalledWith(payload)
    expect(deleteVishingTemplate).not.toHaveBeenCalled()
    expect(wrapper.emitted('on-success-multiple')).toBeTruthy()
  })

  it('closeModal emits handleCloseModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })
})
