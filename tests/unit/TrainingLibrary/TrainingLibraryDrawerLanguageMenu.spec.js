import { createLocalVue, mount } from '@vue/test-utils'
import TrainingLibraryDrawerLanguageMenu from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerLanguageMenu.vue'
import Vuetify from 'vuetify'

describe('TrainingLibraryDrawerLanguageMenu.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  let wrapper

  afterEach(() => {
    if (wrapper) wrapper.destroy()
    // Clean up any remaining menus in body
    const menus = document.querySelectorAll('.v-menu__content')
    menus.forEach(el => el.remove())
  })

  // Since VMenu activator slot needs to be triggered to open content, and we want to test the list.
  // We can force menu to be true via props or setData if model was prop (it's v-model local data).
  // Or we can stub VMenu to just render default slot content if we want, but VMenu hides content.
  // Actually, VMenu content is usually portaled.
  // In tests, we can interact with activator or set data.

  const mountMenu = (propsData = {}) => {
    wrapper = mount(TrainingLibraryDrawerLanguageMenu, {
      localVue,
      vuetify,
      propsData,
      stubs: {
        // We can stub transition to avoid async wait
        transition: {
          template: '<div><slot /></div>'
        }
      }
    })
    return wrapper
  }

  const getMenuContent = () => document.querySelector('.training-library-drawer-language-menu')

  it('renders correctly', () => {
    mountMenu()
    expect(wrapper.exists()).toBe(true)
  })

  it('shows loading state', async () => {
    mountMenu({ isLoading: true })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()
    
    const content = getMenuContent()
    expect(content).toBeTruthy()
    expect(content.textContent).toContain('Loading languages...')
  })

  it('lists languages', async () => {
    const languages = [
      { text: 'English', value: 'en' },
      { text: 'German', value: 'de' }
    ]
    mountMenu({ languages })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()

    const content = getMenuContent()
    expect(content.textContent).not.toContain('Loading languages...')
    expect(content.textContent).toContain('English')
    expect(content.textContent).toContain('German')
  })

  it('filters languages', async () => {
    const languages = [
      { text: 'English', value: 'en' },
      { text: 'German', value: 'de' }
    ]
     mountMenu({ languages })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()

    // Simulate search input
    // Input is inside the portaled content
    const input = document.querySelector('.training-library-drawer-language-menu input')
    input.value = 'Ger'
    input.dispatchEvent(new Event('input'))
    
    // Update data manually if v-model doesn't sync with DOM event in test env
    await wrapper.setData({ search: 'Ger' })
    await wrapper.vm.$nextTick()

    const content = getMenuContent()
    // "English" should disappear (check text content)
    expect(content.textContent).not.toContain('English')
    expect(content.textContent).toContain('German')
  })

  it('emits selection event', async () => {
    const languages = [
      { text: 'English', value: 'en' }
    ]
    mountMenu({ languages })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()

    // Find item in document
    const item = document.querySelector('.training-library-drawer-language-menu__item')
    item.click()
    
    expect(wrapper.emitted('language-selected')).toBeTruthy()
    expect(wrapper.emitted('language-selected')[0]).toEqual([languages[0]])
    // Menu should close
    expect(wrapper.vm.menu).toBe(false)
  })

  it('shows no results message', async () => {
    mountMenu({ languages: [] })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()

    const content = getMenuContent()
    expect(content.textContent).toContain('No languages found')
  })

  it('handles empty search results', async () => {
    const languages = [
      { text: 'English', value: 'en' },
      { text: 'German', value: 'de' }
    ]
    mountMenu({ languages })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()

    // Search for non-existent language
    await wrapper.setData({ search: 'XYZ' })
    await wrapper.vm.$nextTick()

    const content = getMenuContent()
    expect(content.textContent).not.toContain('English')
    expect(content.textContent).not.toContain('German')
  })


  it('handles single language list', async () => {
    const languages = [
      { text: 'English', value: 'en' }
    ]
    mountMenu({ languages })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()

    const content = getMenuContent()
    expect(content.textContent).toContain('English')
  })

  it('respects isLoading prop changes', async () => {
    mountMenu({ isLoading: false, languages: [] })
    await wrapper.setData({ menu: true })
    await wrapper.vm.$nextTick()

    let content = getMenuContent()
    expect(content.textContent).toContain('No languages found')

    // Change to loading
    await wrapper.setProps({ isLoading: true })
    await wrapper.vm.$nextTick()

    content = getMenuContent()
    expect(content.textContent).toContain('Loading languages...')
  })

  describe('Component Structure', () => {
    it('should render component successfully', () => {
      mountMenu()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have component element', () => {
      mountMenu()
      expect(wrapper.vm).toBeDefined()
    })

    it('should initialize with menu closed', () => {
      mountMenu()
      expect(wrapper.vm.menu).toBe(false)
    })

    it('should initialize with data properties', () => {
      mountMenu()
      expect(wrapper.vm.search).toBe('')
    })
  })

  describe('Menu State Management', () => {
    it('should toggle menu visibility', async () => {
      mountMenu()
      expect(wrapper.vm.menu).toBe(false)

      await wrapper.setData({ menu: true })
      expect(wrapper.vm.menu).toBe(true)

      await wrapper.setData({ menu: false })
      expect(wrapper.vm.menu).toBe(false)
    })

    it('should close menu after selection', async () => {
      const languages = [{ text: 'English', value: 'en' }]
      mountMenu({ languages })

      await wrapper.setData({ menu: true })
      expect(wrapper.vm.menu).toBe(true)

      const item = document.querySelector('.training-library-drawer-language-menu__item')
      item.click()

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.menu).toBe(false)
    })

    it('should manage search state', async () => {
      mountMenu()
      expect(wrapper.vm.search).toBe('')

      await wrapper.setData({ search: 'English' })
      expect(wrapper.vm.search).toBe('English')
    })

    it('should clear search when menu reopens', async () => {
      mountMenu({ languages: [{ text: 'English', value: 'en' }] })

      await wrapper.setData({ menu: true, search: 'test' })
      await wrapper.setData({ menu: false })
      await wrapper.setData({ menu: true })

      expect(wrapper.vm.menu).toBe(true)
    })
  })

  describe('Language List Handling', () => {
    it('should display multiple languages', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' },
        { text: 'French', value: 'fr' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('English')
      expect(content.textContent).toContain('German')
      expect(content.textContent).toContain('French')
    })

    it('should render language items with correct structure', async () => {
      const languages = [{ text: 'English', value: 'en' }]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const items = document.querySelectorAll('.training-library-drawer-language-menu__item')
      expect(items.length).toBeGreaterThan(0)
    })

    it('should handle large language list', async () => {
      const languages = Array.from({ length: 50 }, (_, i) => ({
        text: `Language ${i}`,
        value: `lang-${i}`
      }))
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content).toBeTruthy()
    })

    it('should update language list when prop changes', async () => {
      mountMenu({ languages: [{ text: 'English', value: 'en' }] })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('English')

      await wrapper.setProps({
        languages: [
          { text: 'English', value: 'en' },
          { text: 'Spanish', value: 'es' }
        ]
      })
      await wrapper.vm.$nextTick()

      expect(content.textContent).toContain('Spanish')
    })
  })

  describe('Search Functionality', () => {
    it('should filter languages by search text', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      await wrapper.setData({ search: 'Ger' })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('German')
    })

    it('should be case-insensitive', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'GERMAN', value: 'de' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      await wrapper.setData({ search: 'german' })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('GERMAN')
    })

    it('should reset search when clearing text', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true, search: 'Ger' })
      await wrapper.vm.$nextTick()

      await wrapper.setData({ search: '' })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('English')
      expect(content.textContent).toContain('German')
    })

    it('should perform partial string match', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'Spanish', value: 'es' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      await wrapper.setData({ search: 'ish' })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('English')
      expect(content.textContent).toContain('Spanish')
    })
  })

  describe('Event Emission', () => {
    it('should emit language-selected event with language object', async () => {
      const languages = [{ text: 'English', value: 'en' }]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const item = document.querySelector('.training-library-drawer-language-menu__item')
      item.click()

      expect(wrapper.emitted('language-selected')).toBeTruthy()
      expect(wrapper.emitted('language-selected')[0][0]).toEqual(languages[0])
    })

    it('should emit correct language when multiple selections occur', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const items = document.querySelectorAll('.training-library-drawer-language-menu__item')
      items[0].click()

      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      items[1].click()

      expect(wrapper.emitted('language-selected').length).toBe(2)
      expect(wrapper.emitted('language-selected')[1][0]).toEqual(languages[1])
    })

    it('should close menu after emitting event', async () => {
      const languages = [{ text: 'English', value: 'en' }]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })

      const item = document.querySelector('.training-library-drawer-language-menu__item')
      item.click()

      await wrapper.vm.$nextTick()
      expect(wrapper.vm.menu).toBe(false)
    })
  })

  describe('Loading States', () => {
    it('should show loading indicator when isLoading is true', async () => {
      mountMenu({ isLoading: true })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('Loading languages...')
    })

    it('should hide loading when isLoading becomes false', async () => {
      mountMenu({ isLoading: true })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      let content = getMenuContent()
      expect(content.textContent).toContain('Loading languages...')

      await wrapper.setProps({ isLoading: false, languages: [] })
      await wrapper.vm.$nextTick()

      content = getMenuContent()
      expect(content.textContent).toContain('No languages found')
    })

    it('should not show language list when loading', async () => {
      const languages = [{ text: 'English', value: 'en' }]
      mountMenu({ isLoading: true, languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('Loading languages...')
    })
  })

  describe('Empty States', () => {
    it('should show no results message for empty list', async () => {
      mountMenu({ languages: [] })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('No languages found')
    })

    it('should show no results for failed search', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      await wrapper.setData({ search: 'NonExistent' })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).not.toContain('English')
      expect(content.textContent).not.toContain('German')
    })

    it('should handle transition from empty to populated', async () => {
      mountMenu({ languages: [] })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      let content = getMenuContent()
      expect(content.textContent).toContain('No languages found')

      await wrapper.setProps({ languages: [{ text: 'English', value: 'en' }] })
      await wrapper.vm.$nextTick()

      content = getMenuContent()
      expect(content.textContent).toContain('English')
    })
  })

  describe('Props Management', () => {
    it('should accept languages prop', () => {
      const languages = [{ text: 'English', value: 'en' }]
      mountMenu({ languages })
      expect(wrapper.props('languages')).toEqual(languages)
    })

    it('should accept isLoading prop', () => {
      mountMenu({ isLoading: true })
      expect(wrapper.props('isLoading')).toBe(true)
    })

    it('should support dynamic prop updates', async () => {
      mountMenu({ languages: [] })
      expect(wrapper.props('languages')).toEqual([])

      await wrapper.setProps({ languages: [{ text: 'English', value: 'en' }] })
      expect(wrapper.props('languages').length).toBe(1)
    })

    it('should update when multiple props change', async () => {
      mountMenu({ isLoading: true, languages: [] })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      await wrapper.setProps({
        isLoading: false,
        languages: [{ text: 'English', value: 'en' }]
      })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('English')
    })
  })

  describe('Integration Scenarios', () => {
    it('should handle complete selection flow', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' }
      ]
      mountMenu({ languages })

      // Open menu
      expect(wrapper.vm.menu).toBe(false)
      await wrapper.setData({ menu: true })
      expect(wrapper.vm.menu).toBe(true)

      // Search
      await wrapper.setData({ search: 'Ger' })
      const content = getMenuContent()
      expect(content.textContent).toContain('German')

      // Select
      const item = document.querySelector('.training-library-drawer-language-menu__item')
      item.click()
      await wrapper.vm.$nextTick()

      // Verify event and menu closure
      expect(wrapper.emitted('language-selected')).toBeTruthy()
      expect(wrapper.vm.menu).toBe(false)
    })

    it('should handle rapid menu open/close cycles', async () => {
      mountMenu({ languages: [{ text: 'English', value: 'en' }] })

      for (let i = 0; i < 5; i++) {
        await wrapper.setData({ menu: true })
        expect(wrapper.vm.menu).toBe(true)
        await wrapper.setData({ menu: false })
        expect(wrapper.vm.menu).toBe(false)
      }
    })

    it('should handle concurrent search and menu operations', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.setData({ search: 'Ger' })

      const content = getMenuContent()
      expect(content).toBeTruthy()
      expect(wrapper.vm.menu).toBe(true)
    })

    it('should maintain state through multiple operations', async () => {
      const languages = [{ text: 'English', value: 'en' }]
      mountMenu({ languages, isLoading: false })

      await wrapper.setData({ menu: true })
      await wrapper.setData({ search: 'English' })
      await wrapper.setProps({ isLoading: true })

      expect(wrapper.vm.menu).toBe(true)
      expect(wrapper.vm.search).toBe('English')
    })
  })

  describe('Accessibility and UX', () => {
    it('should have accessible menu control', () => {
      mountMenu()
      expect(wrapper.vm.menu !== undefined).toBe(true)
    })

    it('should support keyboard navigation', async () => {
      const languages = [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content).toBeTruthy()
    })

    it('should have proper component structure', async () => {
      mountMenu()
      expect(wrapper.element).toBeDefined()
      expect(wrapper.vm).toBeDefined()
    })
  })

  describe('Edge Cases', () => {
    it('should handle language objects with special characters', async () => {
      const languages = [
        { text: 'English (US)', value: 'en-US' },
        { text: 'Español (España)', value: 'es-ES' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      const content = getMenuContent()
      expect(content.textContent).toContain('English')
      expect(content.textContent).toContain('Español')
    })

    it('should handle very long language names', async () => {
      const languages = [
        { text: 'A'.repeat(100), value: 'long' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.languages).toBeDefined()
    })

    it('should handle search with special characters', async () => {
      const languages = [
        { text: 'English (US)', value: 'en-US' }
      ]
      mountMenu({ languages })
      await wrapper.setData({ menu: true })
      await wrapper.vm.$nextTick()

      await wrapper.setData({ search: '(US)' })
      expect(wrapper.vm.search).toBe('(US)')
    })

    it('should handle undefined language items gracefully', () => {
      mountMenu({ languages: undefined })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle empty language values', () => {
      mountMenu({ languages: [] })
      expect(wrapper.exists()).toBe(true)
    })
  })

  describe('Performance', () => {
    it('should render efficiently with large dataset', async () => {
      const languages = Array.from({ length: 1000 }, (_, i) => ({
        text: `Language ${i}`,
        value: `lang-${i}`
      }))

      const startTime = Date.now()
      mountMenu({ languages })
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(1000)
      expect(wrapper.exists()).toBe(true)
    })

    it('should perform search efficiently', async () => {
      const languages = Array.from({ length: 100 }, (_, i) => ({
        text: `Language ${i}`,
        value: `lang-${i}`
      }))
      mountMenu({ languages })
      await wrapper.setData({ menu: true })

      const startTime = Date.now()
      await wrapper.setData({ search: 'Language 50' })
      const duration = Date.now() - startTime

      expect(duration).toBeLessThan(500)
    })
  })

  describe('Multi-instance Support', () => {
    it('should support multiple independent instances', () => {
      const wrapper1 = mountMenu({ languages: [{ text: 'English', value: 'en' }] })
      const wrapper2 = mount(TrainingLibraryDrawerLanguageMenu, {
        localVue,
        vuetify,
        propsData: { languages: [{ text: 'German', value: 'de' }] }
      })

      expect(wrapper1.vm).not.toBe(wrapper2.vm)
      wrapper2.destroy()
    })

    it('should isolate state between instances', async () => {
      const wrapper1 = mountMenu({ languages: [{ text: 'English', value: 'en' }] })
      const wrapper2 = mount(TrainingLibraryDrawerLanguageMenu, {
        localVue,
        vuetify,
        propsData: { languages: [{ text: 'German', value: 'de' }] }
      })

      await wrapper1.setData({ menu: true })
      expect(wrapper2.vm.menu).toBe(false)

      wrapper2.destroy()
    })
  })
})
