import { shallowMount } from '@vue/test-utils'
import UsersDashboardHeader from '@/components/UsersDashboard/UsersDashboardHeader.vue'

describe('UsersDashboardHeader.vue', () => {
  const createWrapper = (getterOverrides = {}) =>
    shallowMount(UsersDashboardHeader, {
      stubs: {
        KSelect: true,
        UsersDashboardUserMenu: true,
        InputPhone: true,
        'v-skeleton-loader': true
      },
      mocks: {
        $store: {
          getters: {
            'usersDashboard/getLanguage': 'en-GB',
            'login/loginWhiteLabel': { mainLogoUrl: 'https://cdn.example/logo.png' },
            ...getterOverrides
          },
          dispatch: jest.fn()
        }
      }
    })

  it('renders and has expected component name', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.$options.name).toBe('UsersDashboardHeader')
  })

  it('computes current language label from selected language', () => {
    const wrapper = createWrapper({
      'usersDashboard/getLanguage': 'de-DE'
    })
    expect(wrapper.vm.currentLanguageLabel).toBe('Deutsch (Deutschland)')
  })

  it('falls back to default current language label for unknown language', () => {
    const wrapper = createWrapper({
      'usersDashboard/getLanguage': 'xx-YY'
    })
    expect(wrapper.vm.currentLanguageLabel).toBe('English (United Kingdom)')
  })

  it('calls setLanguage action through handleLanguageChange', () => {
    const wrapper = createWrapper()

    wrapper.vm.handleLanguageChange('tr-TR')

    expect(wrapper.vm.$store.dispatch).toHaveBeenCalledWith('usersDashboard/setLanguage', 'tr-TR')
  })

  it('contains expected language items', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.availableLanguages.length).toBeGreaterThan(4)
    expect(wrapper.vm.availableLanguages[0]).toEqual(
      expect.objectContaining({ value: 'en-GB', countryCode: 'gb' })
    )
  })
})
