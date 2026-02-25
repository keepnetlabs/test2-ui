jest.mock('@/api/quishing', () => ({
  searchLandingPageList: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          results: [],
          totalNumberOfRecords: 0,
          totalNumberOfPages: 0,
          pageNumber: 1
        }
      }
    })
  ),
  exportLandingPageTemplates: jest.fn(() => Promise.resolve(new Blob()))
}))

globalThis.URL = { createObjectURL: jest.fn(() => 'blob:mock') }

import { shallowMount } from '@vue/test-utils'
import QuishingLandingPageTemplatesTable from '@/components/QuishingLandingPageTemplates/QuishingLandingPageTemplatesTable.vue'
import QuishingService from '@/api/quishing'

describe('QuishingLandingPageTemplatesTable.vue', () => {
  let wrapper

  const createWrapper = (opts = {}) => {
    return shallowMount(QuishingLandingPageTemplatesTable, {
      mocks: {
        $store: {
          getters: {
            'permissions/getQuishingLandingPageTemplatesEditPermissions': true,
            'permissions/getQuishingLandingPageTemplatesDeletePermissions': true,
            'permissions/getQuishingLandingPageTemplatesExportPermissions': true,
            'permissions/getQuishingLandingPageTemplatesCreatePermissions': true
          }
        }
      },
      ...opts
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders', () => {
    wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('handleEmitLandingPageTemplateModal emits on-edit-or-new', () => {
    wrapper = createWrapper()
    wrapper.vm.handleEmitLandingPageTemplateModal({ id: 1 }, false)
    expect(wrapper.emitted('on-edit-or-new')).toEqual([[{ id: 1 }, false]])
  })

  it('handlePreview emits on-preview', () => {
    wrapper = createWrapper()
    wrapper.vm.handlePreview({ id: 1 })
    expect(wrapper.emitted('on-preview')).toEqual([[{ id: 1 }]])
  })

  it('handleDelete emits on-delete', () => {
    wrapper = createWrapper()
    wrapper.vm.handleDelete({ id: 1 })
    expect(wrapper.emitted('on-delete')).toEqual([[{ id: 1 }]])
  })

  it('handleMultipleDelete emits on-multiple-delete with payload', () => {
    wrapper = createWrapper()
    const selections = []
    const excludedItems = []
    const selectAll = false
    wrapper.vm.handleMultipleDelete(selections, excludedItems, selectAll)
    expect(wrapper.emitted('on-multiple-delete')).toBeTruthy()
    const emitted = wrapper.emitted('on-multiple-delete')[0][0]
    expect(emitted.selections).toEqual(selections)
    expect(emitted.excludedItems).toEqual(excludedItems)
    expect(emitted.selectAll).toBe(false)
    expect(emitted.axiosPayload).toBeDefined()
    expect(emitted.serverSideProps).toBeDefined()
  })

  it('exportLandingPageTemplates calls QuishingService and creates download link', async () => {
    wrapper = createWrapper()
    const exportTypes = ['CSV']
    const reportAllPages = false
    const pageNumber = 1
    const pageSize = 10
    wrapper.vm.exportLandingPageTemplates({
      exportTypes,
      reportAllPages,
      pageNumber,
      pageSize
    })
    await wrapper.vm.$nextTick()
    expect(QuishingService.exportLandingPageTemplates).toHaveBeenCalled()
  })
})
