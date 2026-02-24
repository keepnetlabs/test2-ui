import { shallowMount } from '@vue/test-utils'
import NewEditDnsService from '@/components/QuishingSettings/DnsServices/NewEditDnsService.vue'
import QuishingService from '@/api/quishing'
import { getAvailableForListFromBackend } from '@/utils/helperFunctions'
import * as commonFunctions from '@/utils/functions'

jest.mock('@/api/quishing', () => ({
  getDnsService: jest.fn(),
  updateDnsService: jest.fn(() => Promise.resolve()),
  createDnsService: jest.fn(() => Promise.resolve())
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

describe('QuishingSettings NewEditDnsService.vue', () => {
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
    QuishingService.getDnsService.mockResolvedValue({
      data: {
        data: {
          resourceId: 'default-dns',
          dnsServiceProviderTypeId: 1,
          dnsServiceProviderName: 'Default',
          username: 'default@test.com',
          password: 'default',
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
    expect(createVm.getTitle).toBe('Create New DNS Provider Integration')
  })

  it('computes title for edit when resourceId is set', () => {
    const editVm = createWrapper({ isEdit: true, resourceId: 'dns-1' }).vm
    expect(editVm.getTitle).toBe('Edit DNS Provider Integration')
  })

  it('getBodySubtitle differs for create vs edit', () => {
    const createVm = createWrapper({ isEdit: false }).vm
    expect(createVm.getBodySubtitle).toBe('Create a DNS provider integration for quishing domains')

    const editVm = createWrapper({ isEdit: true }).vm
    expect(editVm.getBodySubtitle).toBe('Edit DNS provider integration for quishing domains')
  })

  it('created initializes initialFormValues for create mode', () => {
    const wrapper = createWrapper({ isEdit: false })
    expect(wrapper.vm.initialFormValues).toEqual(wrapper.vm.formValues)
  })

  it('created loads dns service in edit mode', async () => {
    QuishingService.getDnsService.mockResolvedValueOnce({
      data: {
        data: {
          resourceId: 'dns-1',
          dnsServiceProviderTypeId: 1,
          dnsServiceProviderName: 'Cloudflare',
          username: 'mail@acme.com',
          password: 'secret',
          availableForList: []
        }
      }
    })

    const wrapper = createWrapper({ isEdit: true, resourceId: 'dns-1' })
    await flushPromises()

    expect(QuishingService.getDnsService).toHaveBeenCalledWith('dns-1')
    expect(wrapper.vm.availableForRequests[0].type).toBe('MyCompanyOnly')
  })

  it('testConnectionValues handles failed test path', () => {
    const wrapper = createWrapper()
    const messageEl = { id: 'message' }
    wrapper.vm.$refs = {
      dnsForm: { $el: { querySelector: jest.fn(() => messageEl) } }
    }
    wrapper.vm.saveButtonDisabled = true

    wrapper.vm.testConnectionValues(false, false)

    expect(wrapper.vm.isSuccessfullyTested).toBe(false)
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
    expect(scrollToComponentSpy).toHaveBeenCalledWith(messageEl)
  })

  it('testConnectionValues saves via update in edit mode', async () => {
    const wrapper = createWrapper({ isEdit: true, resourceId: 'dns-9' })
    wrapper.vm.formValues = {
      dnsServiceProviderTypeId: 1,
      dnsServiceProviderName: 'Provider',
      username: 'a@b.com',
      password: 'x',
      resourceId: 'dns-9'
    }
    wrapper.vm.availableForRequests = [{ type: 'MyCompanyOnly' }]
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        getAvailableForValues: jest.fn(() => [{ type: 'MyCompanyOnly', resourceId: null }])
      }
    }
    wrapper.vm.isDuplicate = false
    wrapper.vm.saveButtonDisabled = true

    wrapper.vm.testConnectionValues(true, true)
    await flushPromises()

    expect(QuishingService.updateDnsService).toHaveBeenCalledWith(
      expect.objectContaining({
        dnsServiceProviderName: 'Provider',
        availableForRequests: [{ type: 'MyCompanyOnly', resourceId: null }]
      }),
      'dns-9'
    )
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false, true])
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
  })

  it('testConnectionValues saves via create in create mode', async () => {
    const wrapper = createWrapper({ isEdit: false })
    wrapper.vm.formValues = {
      dnsServiceProviderTypeId: 1,
      dnsServiceProviderName: 'Provider',
      username: 'a@b.com',
      password: 'x'
    }
    wrapper.vm.availableForRequests = [{ type: 'MyCompanyOnly' }]
    wrapper.vm.$refs = {
      refMakeAvailableFor: {
        getAvailableForValues: jest.fn(() => [{ type: 'MyCompanyOnly', resourceId: null }])
      }
    }
    wrapper.vm.saveButtonDisabled = true

    wrapper.vm.testConnectionValues(true, true)
    await flushPromises()

    expect(QuishingService.createDnsService).toHaveBeenCalledWith(
      expect.objectContaining({
        dnsServiceProviderName: 'Provider',
        availableForRequests: [{ type: 'MyCompanyOnly', resourceId: null }]
      })
    )
    expect(wrapper.emitted('changeStatus')[0]).toEqual([false, true])
    expect(wrapper.vm.saveButtonDisabled).toBe(false)
  })

  it('cancelDns closes directly when form is unchanged', () => {
    isDifferentSpy.mockReturnValueOnce(false)
    const wrapper = createWrapper()
    wrapper.vm.resetForm = jest.fn()

    wrapper.vm.cancelDns()

    expect(wrapper.vm.resetForm).toHaveBeenCalled()
    expect(wrapper.emitted('changeStatus')).toBeTruthy()
  })

  it('cancelDns opens leaving dialog when form is changed', () => {
    isDifferentSpy.mockReturnValueOnce(true)
    const wrapper = createWrapper()
    wrapper.vm.resetForm = jest.fn()

    wrapper.vm.cancelDns()

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith(
      'common/setIsShowLeavingDialog',
      expect.objectContaining({
        show: true,
        callback: expect.any(Function)
      })
    )

    const payload = wrapper.vm.$store.dispatch.mock.calls[0][1]
    payload.callback()
    expect(wrapper.vm.resetForm).toHaveBeenCalled()
    expect(wrapper.emitted('changeStatus')).toBeTruthy()
  })

  it('handleTestConnectionClick validates and calls testConnection for changed form', () => {
    isDifferentSpy.mockReturnValueOnce(true)
    const wrapper = createWrapper()
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

    expect(wrapper.vm.$refs.refMakeAvailableFor.validateAvailableFor).toHaveBeenCalledWith(
      wrapper.vm.availableForRequests
    )
    expect(wrapper.vm.$refs.testConnection.testConnection).toHaveBeenCalledWith(true, false)
    expect(wrapper.vm.testedFormValues).toEqual({ dnsServiceProviderName: 'Changed' })
  })

  it('handleTestConnectionClick uses existing test status when form is unchanged', () => {
    isDifferentSpy.mockReturnValueOnce(false)
    const wrapper = createWrapper()
    wrapper.vm.isSuccessfullyTested = true
    wrapper.vm.$refs = {
      testConnection: { testConnection: jest.fn() }
    }

    wrapper.vm.handleTestConnectionClick(true)

    expect(wrapper.vm.$refs.testConnection.testConnection).toHaveBeenCalledWith(true, true)
  })
})
