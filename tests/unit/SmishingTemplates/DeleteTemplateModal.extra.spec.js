import { shallowMount } from '@vue/test-utils'
import DeleteTemplateModal from '@/components/SmishingTemplates/DeleteTemplateModal.vue'
import SmishingService from '@/api/smishing'

jest.mock('@/api/smishing', () => ({
  deleteTextMessageTemplate: jest.fn(() => Promise.resolve()),
  bulkDeleteTextMessageTemplates: jest.fn(() => Promise.resolve())
}))

describe('DeleteTemplateModal.vue (extra branch coverage)', () => {
  const mountComponent = (propsData = {}) =>
    shallowMount(DeleteTemplateModal, {
      propsData: {
        status: true,
        selectedEmailTemplate: { name: 'Template A', resourceId: 'r1' },
        ...propsData
      },
      stubs: { AppDialog: true, AppDialogFooter: true }
    })

  it('getBodyText returns templateCount text when isMultiple is true', () => {
    const wrapper = mountComponent({
      isMultiple: true,
      templateCount: 5
    })
    expect(wrapper.vm.getBodyText).toContain('5 smishing templates will be deleted')
  })

  it('getBodyText returns selectedEmailTemplate name when isMultiple is false', () => {
    const wrapper = mountComponent({
      isMultiple: false,
      selectedEmailTemplate: { name: 'My Template', resourceId: 'r1' }
    })
    expect(wrapper.vm.getBodyText).toContain('My Template will be deleted')
  })

  it('getBodyText handles selectedEmailTemplate undefined when isMultiple is false', () => {
    const wrapper = mountComponent({
      isMultiple: false,
      selectedEmailTemplate: undefined
    })
    expect(wrapper.vm.getBodyText).toContain('undefined will be deleted')
  })

  it('handleDelete calls bulkDelete when isMultiple is true', async () => {
    const wrapper = mountComponent({
      isMultiple: true,
      multipleDeletePayload: { ids: ['1', '2'] }
    })
    wrapper.vm.handleDelete()
    await Promise.resolve()
    expect(SmishingService.bulkDeleteTextMessageTemplates).toHaveBeenCalledWith({
      ids: ['1', '2']
    })
    expect(wrapper.emitted('on-success-multiple')).toBeTruthy()
  })

  it('handleDelete calls deleteTextMessageTemplate when isMultiple is false', async () => {
    const wrapper = mountComponent({
      isMultiple: false,
      selectedEmailTemplate: { name: 'T1', resourceId: 'res-1' }
    })
    wrapper.vm.handleDelete()
    await Promise.resolve()
    expect(SmishingService.deleteTextMessageTemplate).toHaveBeenCalledWith('res-1')
    expect(wrapper.emitted('on-success')).toBeTruthy()
    expect(wrapper.emitted('on-success')[0][0]).toEqual({ name: 'T1', resourceId: 'res-1' })
  })
})
