jest.mock('@/api/awarenessEducator', () => ({
  getDefaultCertificateTemplate: jest.fn(() =>
    Promise.resolve({ data: { data: { template: '<h1>Default</h1>' } } })
  ),
  getCertificate: jest.fn(() =>
    Promise.resolve({
      data: {
        data: {
          name: 'Cert 1',
          description: 'Desc',
          template: '<p>T</p>',
          availableForList: [{ type: 'MyCompanyOnly' }]
        }
      }
    })
  ),
  updateCertificate: jest.fn(() => Promise.resolve()),
  createCertificate: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/functions', () => {
  const actual = jest.requireActual('@/utils/functions')
  return {
    ...actual,
    scrollToComponent: jest.fn()
  }
})

import NewCertificatesModal from '@/components/AwarenessEducator/Certificates/NewCertificatesModal.vue'
import AwarenessEducatorService from '@/api/awarenessEducator'
import { scrollToComponent } from '@/utils/functions'

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('NewCertificatesModal.vue methods/computed', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('computed modal titles switch by selected item and duplicate flag', () => {
    const base = { selectedItem: null, isDuplicate: false }
    expect(NewCertificatesModal.computed.getModalTitle.call(base)).toBeDefined()

    const editCtx = {
      selectedItem: { id: 1 },
      isDuplicate: false,
      getSelectedItemTitle: NewCertificatesModal.computed.getSelectedItemTitle.call({
        isDuplicate: false
      })
    }
    expect(NewCertificatesModal.computed.getSelectedItemTitle.call(editCtx)).toBeDefined()
  })

  it('computed subtitles and body title return expected values', () => {
    expect(NewCertificatesModal.computed.getBodyTitle.call({})).toBeDefined()

    const createCtx = { selectedItem: null, getSelectedItemSubTitle: 'x' }
    expect(NewCertificatesModal.computed.getBodySubtitle.call(createCtx)).toBeDefined()

    const duplicateCtx = { isDuplicate: true }
    expect(NewCertificatesModal.computed.getSelectedItemSubTitle.call(duplicateCtx)).toBeDefined()
  })

  it('getDefaultCertificateTemplate sets template only when item is not selected', async () => {
    const ctx = {
      loading: false,
      selectedItem: null,
      formData: { template: '' }
    }

    NewCertificatesModal.methods.getDefaultCertificateTemplate.call(ctx)
    await flushPromises()

    expect(ctx.formData.template).toBe('<h1>Default</h1>')
    expect(ctx.loading).toBe(false)
  })

  it('getDefaultCertificateTemplate does not override template when selectedItem exists', async () => {
    const ctx = {
      loading: false,
      selectedItem: { id: 3 },
      formData: { template: '<p>keep</p>' }
    }

    NewCertificatesModal.methods.getDefaultCertificateTemplate.call(ctx)
    await flushPromises()

    expect(ctx.formData.template).toBe('<p>keep</p>')
    expect(ctx.loading).toBe(false)
  })

  it('callForData fills form and appends copy suffix in duplicate mode', async () => {
    const setMakeAvailableForData = jest.fn()
    const ctx = {
      loading: false,
      selectedItem: { id: 12 },
      isDuplicate: true,
      formData: {
        name: '',
        description: '',
        template: '',
        availableForRequests: []
      },
      setMakeAvailableForData
    }

    NewCertificatesModal.methods.callForData.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.getCertificate).toHaveBeenCalledWith(12)
    expect(ctx.formData.name).toBe('Cert 1 - Copy')
    expect(ctx.formData.description).toBe('Desc')
    expect(ctx.formData.template).toBe('<p>T</p>')
    expect(setMakeAvailableForData).toHaveBeenCalled()
    expect(ctx.loading).toBe(false)
  })

  it('callForData keeps original name in edit mode', async () => {
    const setMakeAvailableForData = jest.fn()
    const ctx = {
      loading: false,
      selectedItem: { id: 13 },
      isDuplicate: false,
      formData: {
        name: '',
        description: '',
        template: '',
        availableForRequests: []
      },
      setMakeAvailableForData
    }

    NewCertificatesModal.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.formData.name).toBe('Cert 1')
    expect(setMakeAvailableForData).toHaveBeenCalled()
  })

  it('callForData safely applies default values when api payload is empty', async () => {
    AwarenessEducatorService.getCertificate.mockResolvedValueOnce({ data: { data: {} } })
    const setMakeAvailableForData = jest.fn()
    const ctx = {
      loading: false,
      selectedItem: { id: 14 },
      isDuplicate: false,
      formData: {
        name: 'old',
        description: 'old',
        template: 'old',
        availableForRequests: []
      },
      setMakeAvailableForData
    }

    NewCertificatesModal.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.formData.name).toBe('')
    expect(ctx.formData.description).toBe('')
    expect(ctx.formData.template).toBe('')
    expect(setMakeAvailableForData).toHaveBeenCalledWith([])
    expect(ctx.loading).toBe(false)
  })

  it('setMakeAvailableForData falls back to MyCompanyOnly when list mapping is empty', () => {
    const ctx = {
      $refs: {
        refMakeAvailableFor: {
          getAvailableForListFromBackend: jest.fn(() => [])
        }
      },
      formData: { availableForRequests: [] }
    }

    NewCertificatesModal.methods.setMakeAvailableForData.call(ctx, [{ id: 'x' }])
    expect(ctx.formData.availableForRequests[0].type).toBe('MyCompanyOnly')
  })

  it('submit calls updateCertificate when selected item exists and not duplicate', async () => {
    const emit = jest.fn()
    const ctx = {
      saveDisable: false,
      selectedItem: { id: 7 },
      isDuplicate: false,
      formData: { name: 'A', description: 'B', template: '<p/>' },
      $emit: emit,
      $refs: {
        refForm: { validate: jest.fn(() => true) }
      }
    }

    NewCertificatesModal.methods.submit.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.updateCertificate).toHaveBeenCalledWith(ctx.formData, 7)
    expect(emit).toHaveBeenCalledWith('on-close', true)
    expect(ctx.saveDisable).toBe(false)
  })

  it('submit calls createCertificate for create mode', async () => {
    const emit = jest.fn()
    const ctx = {
      saveDisable: false,
      selectedItem: null,
      isDuplicate: false,
      formData: { name: 'A', description: 'B', template: '<p/>' },
      $emit: emit,
      $refs: {
        refForm: { validate: jest.fn(() => true) }
      }
    }

    NewCertificatesModal.methods.submit.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.createCertificate).toHaveBeenCalledWith(ctx.formData)
    expect(emit).toHaveBeenCalledWith('on-close', true)
  })

  it('submit calls createCertificate in duplicate mode', async () => {
    const emit = jest.fn()
    const ctx = {
      saveDisable: false,
      selectedItem: { id: 9 },
      isDuplicate: true,
      formData: { name: 'Copy', description: 'B', template: '<p/>' },
      $emit: emit,
      $refs: {
        refForm: { validate: jest.fn(() => true) }
      }
    }

    NewCertificatesModal.methods.submit.call(ctx)
    await flushPromises()

    expect(AwarenessEducatorService.createCertificate).toHaveBeenCalledWith(ctx.formData)
    expect(AwarenessEducatorService.updateCertificate).not.toHaveBeenCalled()
    expect(emit).toHaveBeenCalledWith('on-close', true)
  })

  it('submit scrolls to first error when form validation fails', async () => {
    const errorEl = { id: 'err' }
    const nextTick = jest.fn((cb) => cb())
    const ctx = {
      $nextTick: nextTick,
      $refs: {
        refForm: {
          validate: jest.fn(() => false),
          $el: { querySelector: jest.fn(() => errorEl) }
        }
      }
    }

    NewCertificatesModal.methods.submit.call(ctx)

    expect(nextTick).toHaveBeenCalled()
    expect(scrollToComponent).toHaveBeenCalledWith(errorEl)
  })

  it('getDefaultCertificateTemplate flips loading state around request', async () => {
    const ctx = {
      loading: false,
      selectedItem: null,
      formData: { template: '' }
    }

    NewCertificatesModal.methods.getDefaultCertificateTemplate.call(ctx)
    expect(ctx.loading).toBe(true)
    await flushPromises()
    expect(ctx.loading).toBe(false)
  })

  it('created calls getDefaultCertificateTemplate when selectedItem is missing', () => {
    const getDefaultCertificateTemplate = jest.fn()
    const callForData = jest.fn()
    NewCertificatesModal.created.call({
      selectedItem: null,
      getDefaultCertificateTemplate,
      callForData
    })

    expect(getDefaultCertificateTemplate).toHaveBeenCalled()
    expect(callForData).not.toHaveBeenCalled()
  })

  it('created calls callForData when selectedItem exists', () => {
    const getDefaultCertificateTemplate = jest.fn()
    const callForData = jest.fn()
    NewCertificatesModal.created.call({
      selectedItem: { id: 5 },
      getDefaultCertificateTemplate,
      callForData
    })

    expect(callForData).toHaveBeenCalled()
    expect(getDefaultCertificateTemplate).not.toHaveBeenCalled()
  })

  it('handleEditHtmlTemplate updates template and handleClose emits close event', () => {
    const emit = jest.fn()
    const ctx = {
      formData: { template: '' },
      $emit: emit
    }

    NewCertificatesModal.methods.handleEditHtmlTemplate.call(ctx, '<div>edited</div>')
    expect(ctx.formData.template).toBe('<div>edited</div>')

    NewCertificatesModal.methods.handleClose.call(ctx)
    expect(emit).toHaveBeenCalledWith('on-close')
  })

  it('setMakeAvailableForData uses backend mapped values when available', () => {
    const mapped = [{ id: 'AllCompanies', type: 'AllCompanies' }]
    const ctx = {
      $refs: {
        refMakeAvailableFor: {
          getAvailableForListFromBackend: jest.fn(() => mapped)
        }
      },
      formData: { availableForRequests: [] }
    }

    NewCertificatesModal.methods.setMakeAvailableForData.call(ctx, [{ id: 'backend' }])
    expect(ctx.formData.availableForRequests).toEqual(mapped)
  })

  it('setMakeAvailableForData falls back when ref is missing or available list is empty', () => {
    const ctxNoRef = { $refs: {}, formData: { availableForRequests: [] } }
    NewCertificatesModal.methods.setMakeAvailableForData.call(ctxNoRef, [{ id: 'x' }])
    expect(ctxNoRef.formData.availableForRequests[0].type).toBe('MyCompanyOnly')

    const ctxEmptyList = {
      $refs: {
        refMakeAvailableFor: { getAvailableForListFromBackend: jest.fn(() => [{ id: 'x' }]) }
      },
      formData: { availableForRequests: [] }
    }
    NewCertificatesModal.methods.setMakeAvailableForData.call(ctxEmptyList, [])
    expect(ctxEmptyList.formData.availableForRequests[0].type).toBe('MyCompanyOnly')
  })

  it('getModalTitle resolves to selected-item title when selected item exists', () => {
    const ctx = { selectedItem: { id: 10 }, getSelectedItemTitle: 'Edit Certificate' }
    expect(NewCertificatesModal.computed.getModalTitle.call(ctx)).toBe('Edit Certificate')
  })

  it('selected item computed values switch explicitly for duplicate/edit modes', () => {
    expect(NewCertificatesModal.computed.getSelectedItemTitle.call({ isDuplicate: true })).toBeDefined()
    expect(NewCertificatesModal.computed.getSelectedItemTitle.call({ isDuplicate: false })).toBeDefined()
    expect(NewCertificatesModal.computed.getSelectedItemSubTitle.call({ isDuplicate: true })).toBeDefined()
    expect(NewCertificatesModal.computed.getSelectedItemSubTitle.call({ isDuplicate: false })).toBeDefined()
  })

  it('callForData handles missing response data and still clears loading', async () => {
    AwarenessEducatorService.getCertificate.mockResolvedValueOnce({})
    const setMakeAvailableForData = jest.fn()
    const ctx = {
      loading: false,
      selectedItem: { id: 55 },
      isDuplicate: false,
      formData: { name: 'x', description: 'y', template: 'z', availableForRequests: [] },
      setMakeAvailableForData
    }

    NewCertificatesModal.methods.callForData.call(ctx)
    await flushPromises()

    expect(ctx.formData.name).toBe('')
    expect(ctx.formData.description).toBe('')
    expect(ctx.formData.template).toBe('')
    expect(setMakeAvailableForData).toHaveBeenCalledWith([])
    expect(ctx.loading).toBe(false)
  })
})
