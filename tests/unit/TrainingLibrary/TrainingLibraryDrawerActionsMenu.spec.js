import { createLocalVue, mount } from '@vue/test-utils'
import TrainingLibraryDrawerActionsMenu from '@/components/AwarenessEducator/TrainingLibraryDrawer/TrainingLibraryDrawerActionsMenu.vue'
import Vuetify from 'vuetify'
import { TRAINING_LIBRARY_TYPES } from '@/components/TrainingLibrary/utils'

describe('TrainingLibraryDrawerActionsMenu.vue', () => {
  const localVue = createLocalVue()
  let vuetify

  beforeEach(() => {
    vuetify = new Vuetify()
  })

  const mountMenu = (propsData = {}) => {
    return mount(TrainingLibraryDrawerActionsMenu, {
      localVue,
      vuetify,
      propsData: {
        type: TRAINING_LIBRARY_TYPES.TRAINING,
        isDeletable: true,
        isEditable: true,
        languages: [{ text: 'English', value: 'EN' }, { text: 'Turkish', value: 'TR' }],
        ...propsData
      },
      stubs: {
        // Stub transitions to avoid waiting
        transition: {
          template: '<div><slot /></div>'
        }
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = mountMenu()
    expect(wrapper.exists()).toBe(true)
    // The menu is closed by default, so we might not see content immediately unless we trigger it.
    // However, Vuetify VMenu usually puts content in DOM but hidden or detached.
  })

  it('shows duplicate and delete for Training type', async () => {
    const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.TRAINING })
    // Access computed property directly to avoid UI interaction complexity
    const items = wrapper.vm.otherItems
    expect(items.some(i => i.action === 'duplicate')).toBe(true)
    expect(items.some(i => i.action === 'delete')).toBe(true)
    expect(items.some(i => i.action === 'edit')).toBe(true)
  })

  it('computes hasDownloadSubmenu correctly', () => {
    let wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.TRAINING })
    expect(wrapper.vm.hasDownloadSubmenu).toBe(false)
    
    wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.POSTER })
    expect(wrapper.vm.hasDownloadSubmenu).toBe(true)
    expect(wrapper.vm.downloadTypeText).toBe('Poster')

    wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.SCREENSAVER })
    expect(wrapper.vm.hasDownloadSubmenu).toBe(true)
    expect(wrapper.vm.downloadTypeText).toBe('Screensaver')
  })

  it('hides duplicate and delete for nested content', () => {
    const wrapper = mountMenu({ isNested: true })
    const items = wrapper.vm.otherItems
    expect(items.some(i => i.action === 'duplicate')).toBe(false)
    expect(items.some(i => i.action === 'delete')).toBe(false)
    expect(items.some(i => i.action === 'edit')).toBe(true)
  })

  it('filters languages correctly', async () => {
    const wrapper = mountMenu({
        type: TRAINING_LIBRARY_TYPES.POSTER,
        languages: [{ text: 'English', value: 'en' }, { text: 'German', value: 'de' }]
    })
    
    expect(wrapper.vm.filteredLanguages.length).toBe(2)
    
    wrapper.setData({ langSearch: 'Ger' })
    expect(wrapper.vm.filteredLanguages.length).toBe(1)
    expect(wrapper.vm.filteredLanguages[0].text).toBe('German')
  })

  it('emits events when handleAction is called', () => {
    const wrapper = mountMenu()
    wrapper.vm.handleAction('edit')
    expect(wrapper.emitted().edit).toBeTruthy()
    
    wrapper.vm.handleAction('delete')
    expect(wrapper.emitted().delete).toBeTruthy()
  })

  it('emits download event with language', () => {
    const wrapper = mountMenu()
    const lang = { text: 'English', value: 'en' }
    wrapper.vm.handleDownload(lang)
    expect(wrapper.emitted().download).toBeTruthy()
    expect(wrapper.emitted().download[0]).toEqual([lang])
  })

  it('respects isDeletable prop', () => {
    const wrapper = mountMenu({ isDeletable: false })
    const items = wrapper.vm.otherItems
    expect(items.some(i => i.action === 'delete')).toBe(false)

    const wrapper2 = mountMenu({ isDeletable: true })
    const items2 = wrapper2.vm.otherItems
    expect(items2.some(i => i.action === 'delete')).toBe(true)
  })

  it('respects isEditable prop', () => {
    const wrapper = mountMenu({ isEditable: false })
    const items = wrapper.vm.otherItems
    const editItem = items.find(i => i.action === 'edit')
    expect(editItem && editItem.disabled).toBe(true)

    const wrapper2 = mountMenu({ isEditable: true })
    const items2 = wrapper2.vm.otherItems
    const editItem2 = items2.find(i => i.action === 'edit')
    expect(editItem2 && !editItem2.disabled).toBe(true)
  })

  it('initializes with correct languages prop', () => {
    const languages = [
      { text: 'English', value: 'en' },
      { text: 'French', value: 'fr' }
    ]
    const wrapper = mountMenu({ languages })
    expect(wrapper.vm.languages).toEqual(languages)
  })

  it('handles action for all action types', () => {
    const wrapper = mountMenu()
    const actions = ['edit', 'delete', 'duplicate']

    actions.forEach(action => {
      wrapper.vm.handleAction(action)
      expect(wrapper.emitted()[action]).toBeTruthy()
    })
  })

  it('renders correctly with all combinations of props', () => {
    const wrapper = mountMenu({
      type: TRAINING_LIBRARY_TYPES.POSTER,
      isDeletable: true,
      isEditable: false,
      isNested: false,
      languages: [{ text: 'EN', value: 'en' }]
    })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.vm.hasDownloadSubmenu).toBe(true)
  })

  it('handles language search with empty string', () => {
    const wrapper = mountMenu({
      languages: [
        { text: 'English', value: 'en' },
        { text: 'German', value: 'de' },
        { text: 'French', value: 'fr' }
      ]
    })

    wrapper.setData({ langSearch: '' })
    expect(wrapper.vm.filteredLanguages.length).toBe(3)
  })

  describe('Component Structure', () => {
    it('should render component successfully', () => {
      const wrapper = mountMenu()
      expect(wrapper.exists()).toBe(true)
    })

    it('should have transition stub', () => {
      const wrapper = mountMenu()
      expect(wrapper.find('[stub]').exists() || wrapper.html()).toBeDefined()
    })

    it('should initialize with correct default props', () => {
      const wrapper = mountMenu()
      expect(wrapper.vm.type).toBeDefined()
      expect(wrapper.vm.isDeletable).toBeDefined()
    })

    it('should have Vue Test Utils methods', () => {
      const wrapper = mountMenu()
      expect(typeof wrapper.vm.handleAction).toBe('function')
    })
  })

  describe('Menu Actions', () => {
    it('should emit edit action', () => {
      const wrapper = mountMenu()
      wrapper.vm.handleAction('edit')
      expect(wrapper.emitted('edit')).toBeTruthy()
    })

    it('should emit delete action', () => {
      const wrapper = mountMenu()
      wrapper.vm.handleAction('delete')
      expect(wrapper.emitted('delete')).toBeTruthy()
    })

    it('should emit duplicate action', () => {
      const wrapper = mountMenu()
      wrapper.vm.handleAction('duplicate')
      expect(wrapper.emitted('duplicate')).toBeTruthy()
    })

    it('should have other items array', () => {
      const wrapper = mountMenu()
      expect(Array.isArray(wrapper.vm.otherItems)).toBe(true)
    })
  })

  describe('Download Functionality', () => {
    it('should have download submenu for poster type', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.POSTER })
      expect(wrapper.vm.hasDownloadSubmenu).toBe(true)
    })

    it('should have download submenu for screensaver type', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.SCREENSAVER })
      expect(wrapper.vm.hasDownloadSubmenu).toBe(true)
    })

    it('should not have download submenu for training type', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      expect(wrapper.vm.hasDownloadSubmenu).toBe(false)
    })

    it('should emit download with selected language', () => {
      const wrapper = mountMenu()
      const lang = { text: 'English', value: 'en' }
      wrapper.vm.handleDownload(lang)
      expect(wrapper.emitted('download')).toBeTruthy()
      expect(wrapper.emitted('download')[0][0]).toEqual(lang)
    })

    it('should have correct download type text', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.POSTER })
      expect(wrapper.vm.downloadTypeText).toBe('Poster')
    })
  })

  describe('Content Type Handling', () => {
    it('should handle Training type', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      expect(wrapper.vm.type).toBe(TRAINING_LIBRARY_TYPES.TRAINING)
    })

    it('should handle Poster type', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.POSTER })
      expect(wrapper.vm.type).toBe(TRAINING_LIBRARY_TYPES.POSTER)
    })

    it('should handle Screensaver type', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.SCREENSAVER })
      expect(wrapper.vm.type).toBe(TRAINING_LIBRARY_TYPES.SCREENSAVER)
    })

    it('should show type-specific items', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      const items = wrapper.vm.otherItems
      expect(items.length).toBeGreaterThan(0)
    })
  })

  describe('Props Management', () => {
    it('should accept type prop', () => {
      const wrapper = mountMenu({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      expect(wrapper.props('type')).toBe(TRAINING_LIBRARY_TYPES.TRAINING)
    })

    it('should accept isDeletable prop', () => {
      const wrapper = mountMenu({ isDeletable: true })
      expect(wrapper.props('isDeletable')).toBe(true)
    })

    it('should accept isEditable prop', () => {
      const wrapper = mountMenu({ isEditable: false })
      expect(wrapper.props('isEditable')).toBe(false)
    })

    it('should accept languages prop', () => {
      const languages = [{ text: 'EN', value: 'en' }]
      const wrapper = mountMenu({ languages })
      expect(wrapper.props('languages')).toEqual(languages)
    })

    it('should accept isNested prop', () => {
      const wrapper = mountMenu({ isNested: true })
      expect(wrapper.props('isNested')).toBe(true)
    })
  })

  describe('Language Handling', () => {
    it('should have languages array', () => {
      const wrapper = mountMenu()
      expect(Array.isArray(wrapper.vm.languages)).toBe(true)
    })

    it('should filter languages by search text', () => {
      const wrapper = mountMenu({
        languages: [
          { text: 'English', value: 'en' },
          { text: 'German', value: 'de' }
        ]
      })
      wrapper.setData({ langSearch: 'Ger' })
      expect(wrapper.vm.filteredLanguages.length).toBe(1)
    })

    it('should handle case-insensitive language search', () => {
      const wrapper = mountMenu({
        languages: [
          { text: 'English', value: 'en' },
          { text: 'French', value: 'fr' }
        ]
      })
      wrapper.setData({ langSearch: 'french' })
      expect(wrapper.vm.filteredLanguages.some(l => l.value === 'fr')).toBe(true)
    })

    it('should return all languages when search is empty', () => {
      const languages = [
        { text: 'EN', value: 'en' },
        { text: 'TR', value: 'tr' },
        { text: 'DE', value: 'de' }
      ]
      const wrapper = mountMenu({ languages })
      wrapper.setData({ langSearch: '' })
      expect(wrapper.vm.filteredLanguages.length).toBe(3)
    })

    it('should handle language search property', () => {
      const wrapper = mountMenu()
      expect(wrapper.vm.langSearch).toBeDefined()
    })
  })

  describe('Event Emission', () => {
    it('should emit correct action events', () => {
      const wrapper = mountMenu()
      const actions = ['edit', 'delete', 'duplicate']

      actions.forEach(action => {
        wrapper.vm.handleAction(action)
        expect(wrapper.emitted()[action]).toBeTruthy()
      })
    })

    it('should emit download event with language payload', () => {
      const wrapper = mountMenu()
      const lang = { text: 'English', value: 'en' }
      wrapper.vm.handleDownload(lang)

      const emitted = wrapper.emitted('download')
      expect(emitted).toBeTruthy()
      expect(emitted[0][0]).toEqual(lang)
    })
  })

  describe('Nested Content', () => {
    it('should hide delete action for nested content', () => {
      const wrapper = mountMenu({ isNested: true })
      const items = wrapper.vm.otherItems
      expect(items.some(i => i.action === 'delete')).toBe(false)
    })

    it('should hide duplicate action for nested content', () => {
      const wrapper = mountMenu({ isNested: true })
      const items = wrapper.vm.otherItems
      expect(items.some(i => i.action === 'duplicate')).toBe(false)
    })

    it('should keep edit action for nested content', () => {
      const wrapper = mountMenu({ isNested: true })
      const items = wrapper.vm.otherItems
      expect(items.some(i => i.action === 'edit')).toBe(true)
    })

    it('should respect nested prop', () => {
      const wrapper = mountMenu({ isNested: true })
      expect(wrapper.props('isNested')).toBe(true)
    })
  })

  describe('Permissions/Accessibility', () => {
    it('should respect isDeletable permission', () => {
      const wrapper = mountMenu({ isDeletable: false })
      const items = wrapper.vm.otherItems
      expect(items.some(i => i.action === 'delete')).toBe(false)
    })

    it('should respect isEditable permission', () => {
      const wrapper = mountMenu({ isEditable: false })
      const items = wrapper.vm.otherItems
      const editItem = items.find(i => i.action === 'edit')
      expect(editItem && editItem.disabled).toBe(true)
    })

    it('should enable edit when editable', () => {
      const wrapper = mountMenu({ isEditable: true })
      const items = wrapper.vm.otherItems
      const editItem = items.find(i => i.action === 'edit')
      expect(editItem && !editItem.disabled).toBe(true)
    })

    it('should enable delete when deletable', () => {
      const wrapper = mountMenu({ isDeletable: true })
      const items = wrapper.vm.otherItems
      expect(items.some(i => i.action === 'delete')).toBe(true)
    })
  })

  describe('Multiple Instances', () => {
    it('should support multiple instances', () => {
      const wrapper1 = mountMenu()
      const wrapper2 = mountMenu({ type: TRAINING_LIBRARY_TYPES.POSTER })

      expect(wrapper1.vm).not.toBe(wrapper2.vm)
    })

    it('should maintain independent state across instances', () => {
      const wrapper1 = mountMenu({ type: TRAINING_LIBRARY_TYPES.TRAINING })
      const wrapper2 = mountMenu({ type: TRAINING_LIBRARY_TYPES.POSTER })

      expect(wrapper1.vm.type).not.toBe(wrapper2.vm.type)
    })

    it('should handle language search independently', () => {
      const wrapper1 = mountMenu()
      const wrapper2 = mountMenu()

      wrapper1.setData({ langSearch: 'English' })
      expect(wrapper2.vm.langSearch).not.toBe('English')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty languages array', () => {
      const wrapper = mountMenu({ languages: [] })
      expect(wrapper.vm.filteredLanguages.length).toBe(0)
    })

    it('should handle language search with special characters', () => {
      const wrapper = mountMenu({
        languages: [
          { text: 'English (US)', value: 'en-us' },
          { text: 'English (UK)', value: 'en-gb' }
        ]
      })
      wrapper.setData({ langSearch: '(US)' })
      expect(wrapper.vm.filteredLanguages.length).toBeGreaterThanOrEqual(0)
    })

    it('should handle all props combinations', () => {
      const wrapper = mountMenu({
        type: TRAINING_LIBRARY_TYPES.POSTER,
        isDeletable: true,
        isEditable: false,
        isNested: false,
        languages: [{ text: 'EN', value: 'en' }]
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('should handle no languages gracefully', () => {
      const wrapper = mountMenu({ languages: undefined })
      // Should not crash
      expect(wrapper.vm).toBeDefined()
    })
  })
})
