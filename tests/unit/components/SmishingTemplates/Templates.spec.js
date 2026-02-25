jest.mock('@/api/smishing', () => ({
  searchTextMessageTemplates: jest.fn(() =>
    Promise.resolve({ data: { data: { results: [] }, totalNumberOfRecords: 0, totalNumberOfPages: 0, pageNumber: 1 } })
  ),
  exportTextMessageTemplates: jest.fn(() => Promise.resolve({ data: 'mock-file' }))
}))

import { shallowMount } from '@vue/test-utils'
import Templates from '@/components/SmishingTemplates/Templates.vue'

describe('SmishingTemplates Templates.vue', () => {
  it('changeNewEmailTemplateModalStatus sets modalStatus', () => {
    const wrapper = shallowMount(Templates, {
      mocks: {
        $store: {
          getters: { 'permissions/getSmishingTextMessageTemplatesSearchPermissions': true }
        }
      },
      stubs: {
        NewSmishingTemplate: true,
        DeleteTemplateModal: true,
        DataTable: true,
        AppDialog: true,
        DatatableLoading: true
      }
    })
    wrapper.vm.changeNewEmailTemplateModalStatus(true)
    expect(wrapper.vm.modalStatus).toBe(true)
    wrapper.vm.changeNewEmailTemplateModalStatus(false)
    expect(wrapper.vm.modalStatus).toBe(false)
  })

  it('handleEdit sets editableFormValues and modalStatus', () => {
    const wrapper = shallowMount(Templates, {
      mocks: {
        $store: {
          getters: { 'permissions/getSmishingTextMessageTemplatesSearchPermissions': true }
        }
      },
      stubs: {
        NewSmishingTemplate: true,
        DeleteTemplateModal: true,
        DataTable: true,
        AppDialog: true,
        DatatableLoading: true
      }
    })
    const row = { name: 'Template 1' }
    wrapper.vm.handleEdit(row, false)
    expect(wrapper.vm.editableFormValues).toBe(row)
    expect(wrapper.vm.modalStatus).toBe(true)
    expect(wrapper.vm.isEdit).toBe(true)
  })
})
