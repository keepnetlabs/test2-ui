import { shallowMount } from '@vue/test-utils'
import NewEditDomain from '@/components/QuishingSettings/Domains/NewEditDomain.vue'
import QuishingService from '@/api/quishing'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import * as commonFunctions from '@/utils/functions'

jest.mock('@/api/quishing', () => ({
  getDomainEditData: jest.fn(),
  createDomain: jest.fn(() => Promise.resolve()),
  updateDomain: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/helperFunctions', () => ({
  getAvailableForListFromBackend: jest.fn(() => [{ type: 'Tenant', resourceId: 't1' }])
}))

jest.mock('@/components/Common/MakeAvailableFor/MakeAvailableFor', () => ({
  name: 'MakeAvailableFor',
  render(h) {
    return h('div')
  }
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('QuishingSettings NewEditDomain.vue', () => {
  let isDifferentSpy
  let scrollToComponentSpy

  const createWrapper = (propsData = {}, storeOverrides = {}) =>
    shallowMount(NewEditDomain, {
      propsData: {
        status: true,
        isEdit: false,
        domainData: {
          dnsServiceProviders: [{ text: 'DNS 1', value: '1' }],
          recordTypes: [
            { text: 'CNAME', value: '1' },
            { text: 'A', value: '2' }
          ],
          proxyStatuses: [{ text: 'Enabled', value: '1' }],
          urlSchemas: [{ text: 'https', value: '1' }]
        },
        ...propsData
      },
      mocks: {
        $store: {
          state: {
            auth: {
              userRoleName: 'SystemAdmin'
            }
          },
          dispatch: jest.fn(),
          ...storeOverrides
        }
      },
      stubs: {
        AppModal: true,
        AppModalBodyHeader: true,
        FormGroup: true,
        KSelect: true,
        InputEntityName: true,
        TestConnection: true,
        MakeAvailableFor: true,
        AppModalFooter: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    QuishingService.getDomainEditData.mockResolvedValue({
      data: {
        data: {
          resourceId: 'default',
          domain: 'a.test',
          recordTypeId: 2,
          dnsServiceProviderId: 1,
          dnsRecord: '1.1.1.1',
          proxyStatusId: 1,
          urlSchemaTypeId: 1,
          zoneId: 'zone',
          availableForList: []
        }
      }
    })
    isDifferentSpy = jest.spyOn(commonFunctions, 'isDifferent').mockReturnValue(true)
    scrollToComponentSpy = jest.spyOn(commonFunctions, 'scrollToComponent').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('computes title for create when resourceId is null', () => {
    const createVm = createWrapper({ isEdit: false, resourceId: null }).vm
    expect(createVm.getTitle).toBe('Create New Domain')
  })

  it('computes title for edit when resourceId is set', () => {
    const editVm = createWrapper({ isEdit: true, resourceId: 'domain-1' }).vm
    expect(editVm.getTitle).toBe('Edit Domain')
  })

  it('getBodyTitle and getBodySubtitle differ for create vs edit', () => {
    const createVm = createWrapper({ isEdit: false }).vm
    expect(createVm.getBodyTitle).toBe('New Domain')
    expect(createVm.getBodySubtitle).toBe('Create a quishing domain for your quishing landing pages')

    const editVm = createWrapper({ isEdit: true }).vm
    expect(editVm.getBodyTitle).toBe('Edit Domain')
    expect(editVm.getBodySubtitle).toBe('Edit quishing domain for your quishing landing pages')
  })

  it('computed helpers return expected values when recordTypeId is A', () => {
    const wrapper = createWrapper()
    wrapper.vm.formValues.recordTypeId = '2'
    expect(wrapper.vm.isShowCustomizeDnsRecords).toBe(true)
    expect(wrapper.vm.getPropsByRecordTypeId.placeholder).toBe('Enter IP Address')
  })

  it('computed helpers return expected values when recordTypeId is CNAME', () => {
    const wrapper = createWrapper()
    wrapper.vm.formValues.recordTypeId = '1'
    expect(wrapper.vm.getPropsByRecordTypeId.placeholder).toContain('Server name')
  })

  it('watcher sets recordTypeId when customize details opened', async () => {
    const wrapper = createWrapper()
    wrapper.vm.formValues.recordTypeId = null
    await wrapper.setData({ isShowCustomizeDnsRecordsDetail: false })

    await wrapper.setData({ isShowCustomizeDnsRecordsDetail: true })

    expect(wrapper.vm.formValues.recordTypeId).toBe('2')
  })

  it('created loads edit data in edit mode', async () => {
    QuishingService.getDomainEditData.mockResolvedValueOnce({
      data: {
        data: {
          resourceId: 'domain-7',
          domain: 'x.test',
          recordTypeId: 2,
          dnsServiceProviderId: 1,
          dnsRecord: '1.1.1.1',
          proxyStatusId: 1,
          urlSchemaTypeId: 1,
          zoneId: 'zone-1',
          availableForList: []
        }
      }
    })

    const wrapper = createWrapper({ isEdit: true, resourceId: 'domain-7' })
    await flushPromises()

    expect(QuishingService.getDomainEditData).toHaveBeenCalledWith('domain-7')
    expect(getAvailableForListFromBackend).toHaveBeenCalledWith([])
    expect(wrapper.vm.formValues.domain).toBe('x.test')
    expect(wrapper.vm.formValues.recordTypeId).toBe('2')
    expect(wrapper.vm.availableForRequests[0].type).toBe('MyCompanyOnly')
  })

  it('onTestConnectionLoadingChange updates saveButtonDisabled', () => {
    const wrapper = createWrapper()

    wrapper.vm.onTestConnectionLoadingChange(true)
    expect(wrapper.vm.saveButtonDisabled).toBe(false)

    wrapper.vm.onTestConnectionSaveButtonDisabledChange(true)
    expect(wrapper.vm.saveButtonDisabled).toBe(true)
  })

  it('onTestConnectionValuesChange saves with create', async () => {
    const wrapper = createWrapper()
    wrapper.vm.isShowCustomizeDnsRecordsDetail = false
    wrapper.vm.formValues = {
      domain: 'x.test',
      recordTypeId: '2',
      dnsServiceProviderId: '1',
      dnsRecord: '1.1.1.1',
      proxyStatusId: '1',
      urlSchemaTypeId: '1',
      zoneId: 'z1',
      active: true,
      resourceId: null
    }
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        getAvailableForValues: jest.fn(() => [{ type: 'MyCompanyOnly', resourceId: null }])
      }
    }

    wrapper.vm.onTestConnectionValuesChange(true, true)
    await flushPromises()

    expect(QuishingService.createDomain).toHaveBeenCalledWith(
      expect.objectContaining({
        domain: 'x.test',
        recordTypeId: '2',
        dnsRecord: '1.1.1.1'
      })
    )
    expect(wrapper.vm.formValues.recordTypeId).toBe(null)
    expect(wrapper.vm.formValues.dnsRecord).toBe(null)
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false, true])
  })

  it('onTestConnectionValuesChange saves with update in edit mode', async () => {
    const wrapper = createWrapper()
    wrapper.vm.isEdit = true
    wrapper.vm.resourceId = 'domain-9'
    wrapper.vm.formValues = {
      domain: 'edit.test',
      recordTypeId: '2',
      dnsServiceProviderId: '1',
      dnsRecord: '2.2.2.2',
      proxyStatusId: '1',
      urlSchemaTypeId: '1',
      zoneId: 'z2',
      active: true,
      resourceId: 'domain-9'
    }
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        getAvailableForValues: jest.fn(() => [{ type: 'Tenant', resourceId: 't1' }])
      }
    }

    wrapper.vm.onTestConnectionValuesChange(true, true)
    await flushPromises()

    expect(QuishingService.updateDomain).toHaveBeenCalledWith(
      expect.objectContaining({ domain: 'edit.test' }),
      'domain-9'
    )
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
  })

  it('cancelDomain closes directly when unchanged', () => {
    const wrapper = createWrapper()
    wrapper.vm.resetForm = jest.fn()

    isDifferentSpy.mockReturnValueOnce(false)
    wrapper.vm.cancelDomain()

    expect(wrapper.vm.resetForm).toHaveBeenCalled()
    expect(wrapper.emitted('changeStatus')).toBeTruthy()
  })

  it('cancelDomain opens leaving dialog when changed', () => {
    const wrapper = createWrapper()
    wrapper.vm.resetForm = jest.fn()

    isDifferentSpy.mockReturnValueOnce(true)
    wrapper.vm.cancelDomain()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('handleTestConnectionClick validates and calls testConnection', () => {
    const wrapper = createWrapper()
    const testConnection = jest.fn()
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        validateAvailableFor: jest.fn(),
        isAvailableForValid: true
      },
      domainForm: {
        validate: jest.fn(() => true),
        $el: { querySelector: jest.fn(() => ({ id: 'msg' })) }
      },
      testConnection: { testConnection }
    }
    wrapper.vm.$el = { querySelector: jest.fn(() => ({ id: 'test-connection-row' })) }
    jest.useFakeTimers()

    wrapper.vm.handleTestConnectionClick(true)
    jest.runAllTimers()

    expect(testConnection).toHaveBeenCalledWith(true)
    expect(scrollToComponentSpy).toHaveBeenCalledWith({ id: 'test-connection-row' })
    jest.useRealTimers()
  })

  it('handleTestConnectionClick scrolls validation error when invalid', () => {
    const wrapper = createWrapper()
    const validationMessageEl = { id: 'validation-message' }
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        validateAvailableFor: jest.fn(),
        isAvailableForValid: false
      },
      domainForm: {
        validate: jest.fn(() => false),
        $el: { querySelector: jest.fn(() => validationMessageEl) }
      },
      testConnection: { testConnection: jest.fn() }
    }

    wrapper.vm.handleTestConnectionClick(false)

    expect(wrapper.vm.saveButtonDisabled).toBe(false)
    expect(scrollToComponentSpy).toHaveBeenCalledWith(validationMessageEl)
  })
})
