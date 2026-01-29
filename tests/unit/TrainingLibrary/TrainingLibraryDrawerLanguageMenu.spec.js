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
})
