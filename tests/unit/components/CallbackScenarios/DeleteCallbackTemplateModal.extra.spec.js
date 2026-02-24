jest.mock('@/api/callback', () => ({
  __esModule: true,
  default: {
    deleteCallbackTemplate: jest.fn(() => Promise.resolve()),
    bulkDeleteCallbackTemplates: jest.fn(() => Promise.resolve())
  }
}))

import { shallowMount } from '@vue/test-utils'
import DeleteCallbackTemplateModal from '@/components/CallbackScenarios/DeleteCallbackTemplateModal.vue'
import CallbackService from '@/api/callback'

describe('DeleteCallbackTemplateModal.vue (extra coverage)', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(DeleteCallbackTemplateModal, {
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

  it('getBodyText returns single template text when not multiple', () => {
    const wrapper = createWrapper({
      isMultiple: false,
      selectedTemplate: { name: 'My Template' }
    })
    expect(wrapper.vm.getBodyText).toBe('My Template will be deleted.')
  })

  it('getBodyText returns multiple count when multiple', () => {
    const wrapper = createWrapper({ isMultiple: true, templateCount: 4 })
    expect(wrapper.vm.getBodyText).toBe('4 email templates will be deleted.')
  })

  it('closeModal emits handleCloseModal', () => {
    const wrapper = createWrapper()
    wrapper.vm.closeModal()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('handleDelete single calls deleteCallbackTemplate and emits', async () => {
    const template = { resourceId: 't1', name: 'A' }
    const wrapper = createWrapper({
      isMultiple: false,
      selectedTemplate: template
    })
    wrapper.vm.handleDelete()
    await new Promise((r) => setTimeout(r, 0))

    expect(CallbackService.deleteCallbackTemplate).toHaveBeenCalledWith('t1')
    expect(wrapper.emitted('handleSuccessDeleteAction')).toBeTruthy()
    expect(wrapper.emitted('handleCloseModal')).toBeTruthy()
  })

  it('handleDelete multiple calls bulkDeleteCallbackTemplates and emits', async () => {
    const payload = { ids: ['t1', 't2'] }
    const wrapper = createWrapper({
      isMultiple: true,
      multipleDeletePayload: payload
    })
    wrapper.vm.handleDelete()
    await new Promise((r) => setTimeout(r, 0))

    expect(CallbackService.bulkDeleteCallbackTemplates).toHaveBeenCalledWith(payload)
    expect(wrapper.emitted('on-success-multiple')).toBeTruthy()
  })
})
