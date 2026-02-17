import { shallowMount } from '@vue/test-utils'
import UsersDashboardUserMenu from '@/components/UsersDashboard/UsersDashboardUserMenu.vue'

describe('UsersDashboardUserMenu.vue', () => {
  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardUserMenu, {
      stubs: {
        VBtn: true,
        VIcon: true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getUserInfo': {
              name: 'John Doe',
              email: 'john@example.com',
              department: 'IT',
              phoneNumber: '+1 555 111',
              preferredLanguage: ''
            },
            'usersDashboard/getLanguage': 'en-US',
            'usersDashboard/getLabels': {
              userMenuEmail: 'Email',
              userMenuDepartment: 'Department',
              userMenuPhoneNumber: 'Phone Number',
              userMenuPreferredLanguage: 'Preferred Language',
              userMenuLogout: 'Logout'
            },
            ...getterOverrides
          },
          dispatch: jest.fn()
        },
        $router: {
          push: jest.fn()
        }
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardUserMenu')
  })

  it('toggles menu visibility', async () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.isMenuOpen).toBe(false)

    wrapper.vm.toggleMenu()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isMenuOpen).toBe(true)

    wrapper.vm.toggleMenu()
    expect(wrapper.vm.isMenuOpen).toBe(false)
  })

  it('computes preferred language from language code when user preferredLanguage is empty', () => {
    const wrapper = createWrapper({
      'usersDashboard/getUserInfo': { preferredLanguage: '' },
      'usersDashboard/getLanguage': 'de-DE'
    })
    expect(wrapper.vm.preferredLanguageText).toBe('Deutsch (Deutschland)')
  })

  it('uses user preferredLanguage when provided', () => {
    const wrapper = createWrapper({
      'usersDashboard/getUserInfo': { preferredLanguage: 'Portuguese (Brazil)' }
    })
    expect(wrapper.vm.preferredLanguageText).toBe('Portuguese (Brazil)')
  })

  it('handles outside click by closing menu', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ isMenuOpen: true })
    wrapper.vm.$el = { contains: jest.fn(() => false) }

    wrapper.vm.handleClickOutside({ target: {} })
    expect(wrapper.vm.isMenuOpen).toBe(false)
  })

  it('does not close menu on inside click', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ isMenuOpen: true })
    wrapper.vm.$el = { contains: jest.fn(() => true) }

    wrapper.vm.handleClickOutside({ target: {} })
    expect(wrapper.vm.isMenuOpen).toBe(true)
  })

  it('dispatches logout and redirects on handleLogout', async () => {
    const wrapper = createWrapper()
    await wrapper.setData({ isMenuOpen: true })

    wrapper.vm.handleLogout()

    expect(wrapper.vm.isMenuOpen).toBe(false)
    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('usersDashboard/logout')
    expect(wrapper.vm.$router.push).toHaveBeenCalledWith('/users-dashboard-login')
  })

  it('registers and unregisters click listener in lifecycle hooks', () => {
    const addSpy = jest.spyOn(document, 'addEventListener')
    const removeSpy = jest.spyOn(document, 'removeEventListener')
    const wrapper = createWrapper()

    expect(addSpy).toHaveBeenCalledWith('click', wrapper.vm.handleClickOutside)
    wrapper.destroy()
    expect(removeSpy).toHaveBeenCalledWith('click', wrapper.vm.handleClickOutside)

    addSpy.mockRestore()
    removeSpy.mockRestore()
  })
})
