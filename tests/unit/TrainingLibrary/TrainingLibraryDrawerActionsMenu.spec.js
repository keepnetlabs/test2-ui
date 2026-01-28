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
    expect(items.some(i => i.action === 'edit')).toBe(false)

    const wrapper2 = mountMenu({ isEditable: true })
    const items2 = wrapper2.vm.otherItems
    expect(items2.some(i => i.action === 'edit')).toBe(true)
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
})
