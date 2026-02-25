import { shallowMount } from '@vue/test-utils'
import NewEditDomain from '@/components/Settings/Domains/NewEditDomain.vue'
import { createDomain, getDomainEditData, updateDomain } from '@/api/domains'
import * as helperFunctions from '@/utils/helperFunctions'
import * as commonFunctions from '@/utils/functions'

jest.mock('@/api/domains', () => ({
  getDomainEditData: jest.fn(),
  createDomain: jest.fn(() => Promise.resolve()),
  updateDomain: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/helperFunctions', () => ({
  getAvailableForListFromBackend: jest.fn(() => [{ type: 'Tenant', resourceId: 't1' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Settings NewEditDomain.vue', () => {
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
    getDomainEditData.mockResolvedValue({
      data: {
        data: {
          resourceId: 'domain-default',
          domain: 'a.test',
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
    isDifferentSpy = jest.spyOn(commonFunctions, 'isDifferent').mockReturnValue(true)
    scrollToComponentSpy = jest.spyOn(commonFunctions, 'scrollToComponent').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('computes title for create and edit', () => {
    expect(createWrapper({ isEdit: false, resourceId: null }).vm.getTitle).toBe('Create New Domain')
    expect(createWrapper({ isEdit: true, resourceId: 'domain-1' }).vm.getTitle).toBe('Edit Domain')
  })

  it('returns DNS record input props by record type', () => {
    const wrapper = createWrapper()
    wrapper.vm.formValues.recordTypeId = '2'
    expect(wrapper.vm.getPropsByRecordTypeId.placeholder).toBe('Enter IP Address')
    wrapper.vm.formValues.recordTypeId = '1'
    expect(wrapper.vm.getPropsByRecordTypeId.placeholder).toContain('Server name')
  })

  it('watcher assigns default recordTypeId when customize details opened', async () => {
    const wrapper = createWrapper()
    wrapper.vm.formValues.recordTypeId = null
    await wrapper.setData({ isShowCustomizeDnsRecordsDetail: false })
    await wrapper.setData({ isShowCustomizeDnsRecordsDetail: true })
    expect(wrapper.vm.formValues.recordTypeId).toBe('2')
  })

  it('created loads edit data and uses nonEditableAvailableForRequests fallback', async () => {
    const wrapper = createWrapper({ isEdit: true, resourceId: 'domain-7' })
    await flushPromises()

    expect(getDomainEditData).toHaveBeenCalledWith('domain-7')
    expect(helperFunctions.getAvailableForListFromBackend).toHaveBeenCalledWith([])
    expect(wrapper.vm.nonEditableAvailableForRequests).toEqual([{ type: 'Tenant', resourceId: 't1' }])
    expect(wrapper.vm.formValues.domain).toBe('a.test')
    expect(wrapper.vm.formValues.recordTypeId).toBe('2')
  })

  it('onTestConnectionValuesChange saves with create and clears dns record fields when customize disabled', async () => {
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

    expect(createDomain).toHaveBeenCalledWith(expect.objectContaining({ domain: 'x.test' }))
    expect(wrapper.vm.formValues.recordTypeId).toBe(null)
    expect(wrapper.vm.formValues.dnsRecord).toBe(null)
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false, true])
  })

  it('onTestConnectionValuesChange saves with update in edit mode', async () => {
    const wrapper = createWrapper({ isEdit: true, resourceId: 'domain-9' })
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

    expect(updateDomain).toHaveBeenCalledWith(expect.objectContaining({ domain: 'edit.test' }), 'domain-9')
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
  })

  it('cancelDomain handles unchanged and changed forms', () => {
    const wrapper = createWrapper()
    wrapper.vm.resetForm = jest.fn()

    isDifferentSpy.mockReturnValueOnce(false)
    wrapper.vm.cancelDomain()
    expect(wrapper.vm.resetForm).toHaveBeenCalledTimes(1)

    isDifferentSpy.mockReturnValueOnce(true)
    wrapper.vm.cancelDomain()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('handleTestConnectionClick calls testConnection when valid and scrolls error when invalid', () => {
    const wrapper = createWrapper()
    jest.useFakeTimers()
    const messageEl = { id: 'validation-message' }
    wrapper.vm.$el = { querySelector: jest.fn(() => ({ id: 'test-connection-row' })) }
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        validateAvailableFor: jest.fn(),
        isAvailableForValid: true
      },
      domainForm: {
        validate: jest.fn(() => true),
        $el: { querySelector: jest.fn(() => messageEl) }
      },
      testConnection: { testConnection: jest.fn() }
    }

    wrapper.vm.handleTestConnectionClick(true)
    jest.runAllTimers()
    expect(wrapper.vm.$refs.testConnection.testConnection).toHaveBeenCalledWith(true)

    wrapper.vm.$refs.refMakeAvailableFor.isAvailableForValid = false
    wrapper.vm.$refs.domainForm.validate = jest.fn(() => false)
    wrapper.vm.handleTestConnectionClick(false)
    expect(scrollToComponentSpy).toHaveBeenCalledWith(messageEl)
    jest.useRealTimers()
  })
})
