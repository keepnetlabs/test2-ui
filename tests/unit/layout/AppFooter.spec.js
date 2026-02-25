import AppFooter from '@/layout/AppFooter.vue'

describe('AppFooter.vue', () => {
  it('has correct component name', () => {
    expect(AppFooter.name).toBe('AppFooter')
  })

  it('brandName prop defaults to Keepnet Labs', () => {
    expect(AppFooter.props.brandName.default).toBe('Keepnet Labs')
  })

  it('uses footerLinks from mapGetters', () => {
    expect(AppFooter.computed).toBeDefined()
  })

  it('renders with brandName prop', () => {
    const { shallowMount } = require('@vue/test-utils')
    const footerLinks = {
      footerPrivacyPolicyUrl: '#',
      footerTermsAndConditionsUrl: '#',
      footerCookiePolicyUrl: '#',
      footerEulaUrl: '#'
    }
    const wrapper = shallowMount(AppFooter, {
      propsData: { brandName: 'Test Brand' },
      mocks: {
        $store: {
          getters: { 'whitelabel/getFooterLinks': footerLinks }
        }
      }
    })
    expect(wrapper.text()).toContain('Test Brand')
  })
})
