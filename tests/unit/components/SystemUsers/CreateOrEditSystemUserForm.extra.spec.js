import { shallowMount, RouterLinkStub } from '@vue/test-utils'
import CreateOrEditSystemUserForm from '@/components/SystemUsers/CreateOrEditSystemUserForm.vue'

describe('CreateOrEditSystemUserForm.vue (Bypass IP Restriction hint)', () => {
  const WARNING = '.system-user-authentication-overrides__warning'
  const IP_RESTRICTIONS_ROUTE = '/company/company-settings?tab=ip-restrictions'

  const createWrapper = (propsData = {}) =>
    shallowMount(CreateOrEditSystemUserForm, {
      propsData: {
        formValues: {
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          statusId: null,
          roleResourceIdList: [],
          bypassSsoRedirect: false,
          bypassMfa: false,
          bypassIpRestriction: false
        },
        roleItems: [],
        statusItems: [],
        isSameUser: false,
        isSsoConfigured: true,
        hasIpRestrictions: true,
        ...propsData
      },
      stubs: { RouterLink: RouterLinkStub }
    })

  it('shows a reason and an actionable link when IP restriction is not configured', () => {
    const wrapper = createWrapper({ hasIpRestrictions: false })

    const warning = wrapper.find(WARNING)
    expect(warning.exists()).toBe(true)
    expect(warning.text()).toContain("IP restriction isn't configured yet.")

    const link = warning.findComponent(RouterLinkStub)
    expect(link.exists()).toBe(true)
    expect(link.text()).toContain('Set it up')
    expect(link.props('to')).toBe(IP_RESTRICTIONS_ROUTE)
  })

  it('opens the IP Restrictions settings in a new tab without leaving the form', () => {
    const wrapper = createWrapper({ hasIpRestrictions: false })
    const link = wrapper.findComponent(RouterLinkStub)

    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener')
  })

  it('disables the Bypass IP Restriction toggle when IP restriction is not configured', () => {
    const wrapper = createWrapper({ hasIpRestrictions: false })
    const toggle = wrapper.find('#input--system-user-bypass-ip-restriction')

    expect(toggle.attributes('disabled')).toBeTruthy()
  })

  it('hides the hint and link and keeps the toggle enabled when IP restriction is configured', () => {
    const wrapper = createWrapper({ hasIpRestrictions: true })

    expect(wrapper.find(WARNING).exists()).toBe(false)
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false)

    const toggle = wrapper.find('#input--system-user-bypass-ip-restriction')
    expect(toggle.attributes('disabled')).toBeFalsy()
  })
})
