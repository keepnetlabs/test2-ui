import { shallowMount } from '@vue/test-utils'
import NewEditDomain from '@/components/SmishingSettings/Domains/NewEditDomain.vue'
import SmishingService from '@/api/smishing'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import * as commonFunctions from '@/utils/functions'

jest.mock('@/api/smishing', () => ({
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

describe('NewEditDomain.vue', () => {
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
    SmishingService.getDomainEditData.mockResolvedValue({
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

  it('computes title for create and edit states', () => {
    const createVm = createWrapper({ isEdit: false, resourceId: null }).vm
    expect(createVm.getTitle).toBe('Create New Domain')

    const editVm = createWrapper({ isEdit: false, resourceId: 'domain-1' }).vm
    expect(editVm.getTitle).toBe('Edit Domain')
  })

  it('computed helpers return expected values', () => {
    const wrapper = createWrapper()
    wrapper.vm.formValues.recordTypeId = '2'
    expect(wrapper.vm.isShowCustomizeDnsRecords).toBe(true)
    expect(wrapper.vm.getPropsByRecordTypeId.placeholder).toBe('Enter IP Address')

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

  it('created loads edit data and fallback available-for values', async () => {
    SmishingService.getDomainEditData.mockResolvedValueOnce({
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

    expect(SmishingService.getDomainEditData).toHaveBeenCalledWith('domain-7')
    expect(getAvailableForListFromBackend).toHaveBeenCalledWith([])
    expect(wrapper.vm.formValues.domain).toBe('x.test')
    expect(wrapper.vm.formValues.recordTypeId).toBe('2')
    expect(wrapper.vm.availableForRequests[0].type).toBe('MyCompanyOnly')
  })

  it('onTestConnection handlers update save button flags', () => {
    const wrapper = createWrapper()

    wrapper.vm.onTestConnectionLoadingChange(true)
    expect(wrapper.vm.saveButtonDisabled).toBe(false)

    wrapper.vm.onTestConnectionSaveButtonDisabledChange(true)
    expect(wrapper.vm.saveButtonDisabled).toBe(true)
  })

  it('onTestConnectionValuesChange saves with create and keeps payload values from pre-clear state', async () => {
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

    expect(SmishingService.createDomain).toHaveBeenCalledWith(
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

    expect(SmishingService.updateDomain).toHaveBeenCalledWith(
      expect.objectContaining({ domain: 'edit.test' }),
      'domain-9'
    )
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
  })

  it('cancelDomain closes directly when unchanged and opens dialog when changed', () => {
    const wrapper = createWrapper()
    wrapper.vm.resetForm = jest.fn()

    isDifferentSpy.mockReturnValueOnce(false)
    wrapper.vm.cancelDomain()
    expect(wrapper.vm.resetForm).toHaveBeenCalled()
    expect(wrapper.emitted('changeStatus')).toBeTruthy()

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

  it('handleTestConnectionClick scrolls validation error and re-enables save button', () => {
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
