import { shallowMount } from '@vue/test-utils'
import LDAPSettings from '@/components/Company Settings/LDAP/LDAPSettings.vue'
import LDAPService from '@/api/ldap'
import * as commonFunctions from '@/utils/functions'

jest.mock('@/api/ldap', () => ({
  testLDAPConnection: jest.fn(() => Promise.resolve())
}))

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('LDAPSettings.vue', () => {
  const createWrapper = (overrides = {}) =>
    shallowMount(LDAPSettings, {
      propsData: {
        initialFormData: null,
        isLoading: false,
        fieldMappings: [],
        ...(overrides.propsData || {})
      },
      stubs: {
        DatatableLoading: true,
        FormGroup: true,
        InputUrl: true,
        SaveChangesButton: true,
        VForm: true,
        VTextField: true,
        VTextarea: true,
        VSwitch: true,
        VBtn: true,
        VIcon: true
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getLDAPSettingCreatePermission': true,
            'permissions/getLDAPSettingUpdatePermission': true
          }
        },
        ...(overrides.mocks || {})
      }
    })

  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(commonFunctions, 'isDifferent').mockReturnValue(true)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('maps initialFormData into formData via watcher', async () => {
    const wrapper = createWrapper()

    await wrapper.setProps({
      initialFormData: {
        url: 'ldap://srv',
        username: 'bind',
        password: 'pwd',
        baseDN: 'DC=acme,DC=corp',
        relativeDN: ['CN=Users', 'OU=IT'],
        isActive: false,
        fieldMappings: [{ ldapFieldResourceId: 'x' }]
      }
    })

    expect(wrapper.vm.formData).toEqual({
      url: 'ldap://srv',
      username: 'bind',
      password: 'pwd',
      baseDN: 'DC=acme,DC=corp',
      relativeDNs: 'CN=Users\nOU=IT',
      isActive: false
    })
    expect(wrapper.vm.copyFormData).toEqual(wrapper.vm.formData)
  })

  it('computed getSwitchLabel and getDisabledStyle reflect form state', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.getSwitchLabel).toBe('Enable')

    await wrapper.setData({ isFormValid: false })
    expect(wrapper.vm.getDisabledStyle).toEqual(wrapper.vm.disabledStyle)

    await wrapper.setData({ isFormValid: true, formData: { ...wrapper.vm.formData, isActive: false } })
    expect(wrapper.vm.getSwitchLabel).toBe('Disable')
    expect(wrapper.vm.getDisabledStyle).toEqual({})
  })

  it('computed getTestConnectionButtonStyle uses width by connection status', async () => {
    const wrapper = createWrapper()

    await wrapper.setData({ isTestingConnection: true, isFormValid: true })
    expect(wrapper.vm.getTestConnectionButtonStyle.width).toBe('210px')

    await wrapper.setData({ isTestingConnection: false, isTestConnectionValid: true, isFormValid: true })
    expect(wrapper.vm.getTestConnectionButtonStyle.width).toBe('185px')

    await wrapper.setData({ isTestingConnection: false, isTestConnectionValid: false, isFormValid: true })
    expect(wrapper.vm.getTestConnectionButtonStyle.width).toBe('160px')
  })

  it('computed getButtonStyle handles permission, diff and validation branches', async () => {
    const wrapperNoPermission = createWrapper({
      propsData: {
        initialFormData: { url: 'ldap://srv' }
      },
      mocks: {
        $store: {
          getters: {
            'permissions/getLDAPSettingCreatePermission': true,
            'permissions/getLDAPSettingUpdatePermission': false
          }
        }
      }
    })
    expect(wrapperNoPermission.vm.getButtonStyle).toEqual(wrapperNoPermission.vm.disabledStyle)

    const wrapperNoDiff = createWrapper({
      propsData: { initialFormData: { url: 'ldap://srv' } }
    })
    commonFunctions.isDifferent.mockReturnValueOnce(false)
    expect(wrapperNoDiff.vm.getButtonStyle).toEqual(wrapperNoDiff.vm.disabledStyle)

    const wrapperDisabledByForm = createWrapper()
    await wrapperDisabledByForm.setData({ isFormValid: false, isTestingConnection: false })
    expect(wrapperDisabledByForm.vm.getButtonStyle).toEqual(wrapperDisabledByForm.vm.disabledStyle)

    await wrapperDisabledByForm.setData({ isFormValid: true, isTestingConnection: false })
    expect(wrapperDisabledByForm.vm.getButtonStyle).toEqual({})
  })

  it('relativeDNsRule validates lines', () => {
    const wrapper = createWrapper()

    expect(wrapper.vm.relativeDNsRule('')).toBe(true)
    expect(wrapper.vm.relativeDNsRule('CN=Users\nOU=IT')).toBe(true)
    expect(wrapper.vm.relativeDNsRule('@@bad')).toBe('Invalid relative DNs format')
  })

  it('checkTestConnectionValidityByParam resets test validity when value changes', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ isTestConnectionValid: true })

    wrapper.vm.checkTestConnectionValidityByParam('new', 'old')
    expect(wrapper.vm.isTestConnectionValid).toBe(false)
  })

  it('handleTestConnection success updates flags and can chain handleSubmit', async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleSubmit = jest.fn()
    await wrapper.setData({
      formData: {
        url: 'ldap://srv',
        username: 'bind',
        password: 'pwd',
        baseDN: 'DC=acme,DC=corp',
        relativeDNs: 'CN=Users\nOU=IT',
        isActive: true
      }
    })

    wrapper.vm.handleTestConnection(true)
    await flushPromises()

    expect(LDAPService.testLDAPConnection).toHaveBeenCalledWith({
      url: 'ldap://srv',
      password: 'pwd',
      username: 'bind',
      baseDN: 'DC=acme,DC=corp',
      relativeDN: ['CN=Users', 'OU=IT']
    })
    expect(wrapper.vm.isTestConnectionValid).toBe(true)
    expect(wrapper.vm.isTestingConnection).toBe(false)
    expect(wrapper.vm.handleSubmit).toHaveBeenCalled()
  })

  it('handleTestConnection failure clears valid flag', async () => {
    LDAPService.testLDAPConnection.mockRejectedValueOnce(new Error('failed'))
    const wrapper = createWrapper()
    await wrapper.setData({ isTestConnectionValid: true })

    wrapper.vm.handleTestConnection(false)
    await flushPromises()

    expect(wrapper.vm.isTestConnectionValid).toBe(false)
    expect(wrapper.vm.isTestingConnection).toBe(false)
  })

  it('handleSubmit emits payload when test is valid', async () => {
    const wrapper = createWrapper({
      propsData: {
        fieldMappings: [
          { ldapFieldResourceId: 'ldap-1', appField: 'email' },
          { ldapFieldResourceId: '', appField: 'name' }
        ]
      }
    })
    await wrapper.setData({
      formData: {
        url: 'ldap://srv',
        username: 'bind',
        password: 'pwd',
        baseDN: 'DC=acme,DC=corp',
        relativeDNs: 'CN=Users\nOU=IT',
        isActive: false
      }
    })
    await wrapper.setData({ isTestConnectionValid: true })

    wrapper.vm.handleSubmit()

    expect(wrapper.emitted('on-submit')[0][0]).toEqual({
      url: 'ldap://srv',
      username: 'bind',
      password: 'pwd',
      baseDN: 'DC=acme,DC=corp',
      relativeDN: ['CN=Users', 'OU=IT'],
      isActive: false,
      fieldMappings: [{ ldapFieldResourceId: 'ldap-1', appField: 'email' }]
    })
    expect(wrapper.vm.copyFormData).toEqual(wrapper.vm.formData)
  })

  it('handleSubmit triggers test connection when not validated yet', () => {
    const wrapper = createWrapper()
    wrapper.vm.handleTestConnection = jest.fn()
    wrapper.setData({ isTestConnectionValid: false })

    wrapper.vm.handleSubmit()

    expect(wrapper.vm.handleTestConnection).toHaveBeenCalledWith(true)
    expect(wrapper.emitted('on-submit')).toBeFalsy()
  })
})
