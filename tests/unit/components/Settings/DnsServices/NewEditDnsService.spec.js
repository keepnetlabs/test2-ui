import { shallowMount } from '@vue/test-utils'
import NewEditDnsService from '@/components/Settings/DnsServices/NewEditDnsService.vue'
import { createDnsServiceList, getDnsService, updateDnsServiceList } from '@/api/dnsServices'
import * as helperFunctions from '@/utils/helperFunctions'
import * as commonFunctions from '@/utils/functions'

jest.mock('@/api/dnsServices', () => ({
  getDnsService: jest.fn(),
  updateDnsServiceList: jest.fn(() => Promise.resolve()),
  createDnsServiceList: jest.fn(() => Promise.resolve())
}))

jest.mock('@/utils/helperFunctions', () => ({
  getAvailableForListFromBackend: jest.fn(() => [{ type: 'Tenant', resourceId: 't1' }])
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Settings NewEditDnsService.vue', () => {
  let isDifferentSpy
  let scrollToComponentSpy

  const createWrapper = (propsData = {}) =>
    shallowMount(NewEditDnsService, {
      propsData: {
        status: true,
        isEdit: false,
        resourceId: null,
        ...propsData
      },
      mocks: {
        $store: {
          dispatch: jest.fn()
        }
      },
      stubs: {
        AppModal: true,
        TestConnection: true,
        AppModalBodyHeader: true,
        FormGroup: true,
        MakeAvailableFor: true,
        KSelect: true,
        InputEmail: true,
        InputEntityName: true,
        AppModalFooter: true
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    getDnsService.mockResolvedValue({
      data: {
        data: {
          resourceId: 'dns-default',
          dnsServiceProviderTypeId: 1,
          dnsServiceProviderName: 'Cloudflare',
          username: 'mail@acme.com',
          password: 'secret',
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
    expect(createWrapper({ isEdit: false, resourceId: null }).vm.getTitle).toBe(
      'Create New DNS Provider Integration'
    )
    expect(createWrapper({ isEdit: true, resourceId: 'dns-1' }).vm.getTitle).toBe(
      'Edit DNS Provider Integration'
    )
  })

  it('created loads edit data and initializes nonEditableAvailableForRequests fallback', async () => {
    const wrapper = createWrapper({ isEdit: true, resourceId: 'dns-7' })
    await flushPromises()

    expect(getDnsService).toHaveBeenCalledWith('dns-7')
    expect(helperFunctions.getAvailableForListFromBackend).toHaveBeenCalledWith([])
    expect(wrapper.vm.nonEditableAvailableForRequests).toEqual([{ type: 'Tenant', resourceId: 't1' }])
    expect(wrapper.vm.availableForRequests[0].type).toBe('MyCompanyOnly')
  })

  it('testConnectionValues handles failed test path', () => {
    const wrapper = createWrapper()
    const messageEl = { id: 'validation' }
    wrapper.vm.$refs = {
      dnsForm: { $el: { querySelector: jest.fn(() => messageEl) } }
    }
    wrapper.vm.saveButtonDisabled = true

    wrapper.vm.testConnectionValues(false, false)

    expect(wrapper.vm.saveButtonDisabled).toBe(false)
    expect(scrollToComponentSpy).toHaveBeenCalledWith(messageEl)
  })

  it('testConnectionValues saves with update in edit mode', async () => {
    const wrapper = createWrapper({ isEdit: true, resourceId: 'dns-9' })
    wrapper.vm.formValues = {
      dnsServiceProviderTypeId: 1,
      dnsServiceProviderName: 'Provider',
      username: 'a@b.com',
      password: 'x',
      resourceId: 'dns-9'
    }
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        getAvailableForValues: jest.fn(() => [{ type: 'MyCompanyOnly', resourceId: null }])
      }
    }
    wrapper.vm.saveButtonDisabled = true

    wrapper.vm.testConnectionValues(true, true)
    await flushPromises()

    expect(updateDnsServiceList).toHaveBeenCalledWith(
      expect.objectContaining({
        dnsServiceProviderName: 'Provider',
        availableForRequests: [{ type: 'MyCompanyOnly', resourceId: null }]
      }),
      'dns-9'
    )
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false, true])
  })

  it('testConnectionValues saves with create in create mode', async () => {
    const wrapper = createWrapper({ isEdit: false })
    wrapper.vm.formValues = {
      dnsServiceProviderTypeId: 1,
      dnsServiceProviderName: 'Provider',
      username: 'a@b.com',
      password: 'x'
    }
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        getAvailableForValues: jest.fn(() => [{ type: 'MyCompanyOnly', resourceId: null }])
      }
    }
    wrapper.vm.saveButtonDisabled = true

    wrapper.vm.testConnectionValues(true, true)
    await flushPromises()

    expect(createDnsServiceList).toHaveBeenCalledWith(
      expect.objectContaining({
        dnsServiceProviderName: 'Provider',
        availableForRequests: [{ type: 'MyCompanyOnly', resourceId: null }]
      })
    )
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false, true])
  })

  it('cancelDns closes directly when unchanged and opens leaving dialog when changed', () => {
    const wrapper = createWrapper()
    wrapper.vm.resetForm = jest.fn()

    isDifferentSpy.mockReturnValueOnce(false)
    wrapper.vm.cancelDns()
    expect(wrapper.vm.resetForm).toHaveBeenCalledTimes(1)

    isDifferentSpy.mockReturnValueOnce(true)
    wrapper.vm.cancelDns()
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({ show: true, callback: expect.any(Function) })
    )
  })

  it('handleTestConnectionClick validates and calls testConnection for changed form', () => {
    const wrapper = createWrapper()
    isDifferentSpy.mockReturnValueOnce(true)
    wrapper.vm.formValues = { dnsServiceProviderName: 'Changed' }
    wrapper.vm.$refs = {
      dnsForm: { validate: jest.fn(() => true), $el: { querySelector: jest.fn() } },
      refMakeAvailableFor: {
        validateAvailableFor: jest.fn(),
        isAvailableForValid: true
      },
      testConnection: { testConnection: jest.fn() }
    }

    wrapper.vm.handleTestConnectionClick(true)

    expect(wrapper.vm.$refs.testConnection.testConnection).toHaveBeenCalledWith(true, false)
    expect(wrapper.vm.testedFormValues).toEqual({ dnsServiceProviderName: 'Changed' })
  })

  it('handleTestConnectionClick uses existing status when form is unchanged', () => {
    const wrapper = createWrapper()
    isDifferentSpy.mockReturnValueOnce(false)
    wrapper.vm.isSuccessfullyTested = true
    wrapper.vm.$refs = { testConnection: { testConnection: jest.fn() } }

    wrapper.vm.handleTestConnectionClick(true)

    expect(wrapper.vm.$refs.testConnection.testConnection).toHaveBeenCalledWith(true, true)
  })
})
