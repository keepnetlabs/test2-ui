import AppFooter from '@/layout/AppFooter.vue'
import { shallowMount } from '@vue/test-utils'

describe('AppFooter.vue', () => {
  const createWrapper = (options = {}) =>
    shallowMount(AppFooter, {
      propsData: {
        brandName: 'Test Brand',
        ...(options.propsData || {})
      },
      mocks: {
        $store: {
          getters: {
            'whitelabel/getFooterLinks': {
              footerPrivacyPolicyUrl: '/privacy',
              footerTermsAndConditionsUrl: '/terms',
              footerCookiePolicyUrl: '/cookie',
              footerEulaUrl: '/eula'
            }
          }
        }
      }
    })

  it('has correct component name', () => {
    expect(AppFooter.name).toBe('AppFooter')
  })

  it('brandName prop defaults to Keepnet Labs', () => {
    expect(AppFooter.props.brandName.default).toBe('Keepnet Labs')
    expect(AppFooter.props.brandName.type).toBe(String)
  })

  it('uses footerLinks from mapGetters', () => {
    expect(AppFooter.computed).toBeDefined()
  })

  it('renders with brandName prop', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Test Brand')
  })

  it('renders footer links from store getter', () => {
    const wrapper = createWrapper()

    const anchors = wrapper.findAll('a')
    expect(anchors.at(0).attributes('href')).toBe('/privacy')
    expect(anchors.at(1).attributes('href')).toBe('/terms')
    expect(anchors.at(2).attributes('href')).toBe('/cookie')
    expect(anchors.at(3).attributes('href')).toBe('/eula')
  })

  it('renders all policy labels and opens links in new tab', () => {
    const wrapper = createWrapper()
    const anchors = wrapper.findAll('a')

    expect(wrapper.text()).toContain('Privacy Policy')
    expect(wrapper.text()).toContain('Terms and Conditions')
    expect(wrapper.text()).toContain('Cookie Policy')
    expect(wrapper.text()).toContain('EULA')

    expect(anchors.at(0).attributes('target')).toBe('_blank')
    expect(anchors.at(1).attributes('target')).toBe('_blank')
    expect(anchors.at(2).attributes('target')).toBe('_blank')
    expect(anchors.at(3).attributes('target')).toBe('_blank')
  })

  it('shows current year in footer text', () => {
    const wrapper = createWrapper()
    const year = String(new Date().getFullYear())
    expect(wrapper.text()).toContain(year)
  })
})
