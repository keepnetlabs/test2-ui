import { shallowMount } from '@vue/test-utils'
import Logos from '@/components/PhishingReporter/Logos.vue'

describe('Logos.vue', () => {
  const createWrapper = (propsData = {}) =>
    shallowMount(Logos, {
      propsData: {
        wrapperClasses: 'my-wrapper',
        hasMidMargin: false,
        ...propsData
      }
    })

  it('renders with wrapper class and expected logo images', () => {
    const wrapper = createWrapper()
    expect(wrapper.classes()).toContain('my-wrapper')
    const imgs = wrapper.findAll('img')
    expect(imgs.length).toBe(3)
    expect(imgs.at(0).attributes('alt')).toBe('g-suite-logo')
    expect(imgs.at(1).attributes('alt')).toBe('outlook-logo')
    expect(imgs.at(2).attributes('alt')).toBe('microsoft-365-logo')
  })

  it('adds mid margin class to outlook image when enabled', () => {
    const wrapper = createWrapper({ hasMidMargin: true })
    const outlookImg = wrapper.find('img[alt="outlook-logo"]')
    expect(outlookImg.classes()).toContain('mx-6')
  })
})
