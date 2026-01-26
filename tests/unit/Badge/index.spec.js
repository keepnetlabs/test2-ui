import { createLocalVue, mount } from '@vue/test-utils'
import Badge from '@/components/Badge.vue'
import Vuetify from 'vuetify'

describe('Badge.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  // Helper to mount the component
  const mountBadge = (propsData = {}) => {
    return mount(Badge, {
      localVue,
      vuetify,
      context: {
        props: {
          ...propsData
        }
      },
      stubs: {
        // Stub VTooltip slot behavior if needed, or rely on shallowMount.
        // Since it's a functional component using VTooltip, full mount or shallow mount might be tricky with tooltips.
        // Let's rely on mount but we might need to handle the tooltip activation or slots.
      }
    })
  }

  it('renders correctly with default props', () => {
    const wrapper = mountBadge({ text: 'Default Badge' })
    expect(wrapper.exists()).toBe(true)
    const badge = wrapper.find('.k-badge')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('Default Badge')
    expect(badge.classes()).toContain('k-badge')
    expect(badge.classes()).toContain('k-badge__sizes--medium') // Default size
  })

  it('applies correct class for sizes', () => {
    const sizes = ['small', 'mini', 'auto']
    const expectedClasses = ['k-badge__sizes--small', 'k-badge__sizes--mini', 'k-badge__sizes--auto']

    sizes.forEach((size, index) => {
      const wrapper = mountBadge({ text: 'Size Test', size })
      const badge = wrapper.find('.k-badge')
      expect(badge.classes()).toContain(expectedClasses[index])
    })
  })

  it('renders correctly with fullWidth prop', () => {
    const wrapper = mountBadge({ text: 'Full Width', fullWidth: true })
    const badge = wrapper.find('.k-badge')
    expect(badge.classes()).toContain('full-width')

    const wrapperFalse = mountBadge({ text: 'Not Full Width', fullWidth: false })
    const badgeFalse = wrapperFalse.find('.k-badge')
    expect(badgeFalse.classes()).not.toContain('full-width')
  })

  it('renders correctly with textBlack prop', () => {
    const wrapper = mountBadge({ text: 'Black Text', textBlack: true })
    const badge = wrapper.find('.k-badge')
    expect(badge.classes()).toContain('k-badge--text-black')
  })

  it('applies styles for outline prop true (default)', () => {
    // outline is default true
    const color = 'red'
    const wrapper = mountBadge({ text: 'Outline', color })
    const badge = wrapper.find('.k-badge')
    
    // getDynamicProps returns style array for outline=true: [{ border: ..., color: ... }, ...]
    const style = badge.element.style
    expect(style.borderColor).toBe('red')
    expect(style.color).toBe('red')
  })

  it('applies styles for outline prop false', () => {
    const color = 'blue'
    const wrapper = mountBadge({ text: 'Filled', outline: false, color })
    const badge = wrapper.find('.k-badge')
    
    // Actually, checking if the class 'k-badge--default' is present:
    expect(badge.classes()).toContain('k-badge--default')
  })

  it('hides border when hideBorder is true', () => {
    // Verify logical output of getDynamicProps directly since rendering style serialization is flaky
    const props = {
      outline: true,
      hideBorder: true,
      color: 'green',
      defaultBackgroundColor: '#fff'
    }
    const dynamicProps = Badge.getDynamicProps(props)
    // dynamicProps.style is an array: [{ border: ..., color: ... }, undefined] depending on usage
    // We expect the first element to have the border property.
    const styleObj = dynamicProps.style[0]
    expect(styleObj.border).toBe('none')
  })

  it('renders tooltip when isErrorState is true and errorStateValue is provided', () => {
    const wrapper = mountBadge({
      text: 'Error Badge',
      isErrorState: true,
      errorStateValue: 'Error Message'
    })
    
    // The structure changes to Div > VTooltip ...
    // But since VTooltip renders its activator slot by default, we expect to see the v-btn.
    // However, the wrapper itself might be the div now.
    expect(wrapper.element.tagName).toBe('DIV')
    
    // Check if v-btn is inside
    const btn = wrapper.find('.k-badge')
    expect(btn.exists()).toBe(true)
    
    // Note: Testing actual VTooltip content usually requires triggering events or looking at document body if attached to body.
    // For unit test, verifying the existence of the tooltip logic (the div wrapper) might be sufficient to distinguish from the v-else block.
  })
})
