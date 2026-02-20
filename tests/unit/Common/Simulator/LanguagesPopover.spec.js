import LanguagesPopover from '@/components/Common/Simulator/LanguagesColumn/LanguagesPopover.vue'
import { shallowMount } from '@vue/test-utils'

describe('LanguagesPopover.vue', () => {
  it('filterByQuery returns full list for empty query and filters case-insensitively', () => {
    const list = ['English', 'Turkish', 'German']

    expect(LanguagesPopover.methods.filterByQuery.call({ searchQuery: '' }, list)).toEqual(list)
    expect(LanguagesPopover.methods.filterByQuery.call({ searchQuery: '  EN ' }, list)).toEqual([
      'English'
    ])
  })

  it('filteredPreferredLanguages and filteredNonPreferredLanguages sanitize invalid props', () => {
    const ctx = {
      searchQuery: '',
      preferredLanguages: null,
      nonPreferredLanguages: undefined,
      filterByQuery: (items) => LanguagesPopover.methods.filterByQuery.call(ctx, items)
    }

    expect(LanguagesPopover.computed.filteredPreferredLanguages.call(ctx)).toEqual([])
    expect(LanguagesPopover.computed.filteredNonPreferredLanguages.call(ctx)).toEqual([])
  })

  it('filtered lists apply search query to preferred and non-preferred sets', () => {
    const ctx = {
      searchQuery: 'en',
      preferredLanguages: ['English', 'Turkish'],
      nonPreferredLanguages: ['German', 'French'],
      filterByQuery: (items) => LanguagesPopover.methods.filterByQuery.call(ctx, items)
    }

    expect(LanguagesPopover.computed.filteredPreferredLanguages.call(ctx)).toEqual(['English'])
    expect(LanguagesPopover.computed.filteredNonPreferredLanguages.call(ctx)).toEqual(['French'])
  })

  it('filterByQuery safely handles null/empty list items', () => {
    const list = ['English', null, '', 'Turkish']
    const result = LanguagesPopover.methods.filterByQuery.call({ searchQuery: 'tu' }, list)
    expect(result).toEqual(['Turkish'])
  })

  it('props defaults are stable', () => {
    expect(LanguagesPopover.props.preferredLanguages.default()).toEqual([])
    expect(LanguagesPopover.props.nonPreferredLanguages.default()).toEqual([])
    expect(LanguagesPopover.props.onClose.default).toBeNull()
  })

  it('accepts onClose callback prop for template close action wiring', () => {
    const onClose = jest.fn()
    expect(LanguagesPopover.props.onClose.type).toBe(Function)
    expect(onClose).toBeDefined()
  })

  it('renders empty state when both filtered lists are empty', async () => {
    const wrapper = shallowMount(LanguagesPopover, {
      propsData: {
        preferredLanguages: ['English'],
        nonPreferredLanguages: ['German']
      },
      stubs: {
        VTextField: true,
        VIcon: true
      }
    })

    await wrapper.setData({ searchQuery: 'zzzz' })
    expect(wrapper.find('.languages-popover__empty').exists()).toBe(true)
    expect(wrapper.find('.languages-popover__empty').text()).toBe('No languages found')
  })

  it('shows section divider only when both preferred and non-preferred filtered lists have items', async () => {
    const wrapper = shallowMount(LanguagesPopover, {
      propsData: {
        preferredLanguages: ['English'],
        nonPreferredLanguages: ['German']
      },
      stubs: {
        VTextField: true,
        VIcon: true
      }
    })

    await wrapper.setData({ searchQuery: '' })
    expect(wrapper.find('.languages-popover__section-divider').exists()).toBe(true)

    await wrapper.setData({ searchQuery: 'en' })
    expect(wrapper.find('.languages-popover__section-divider').exists()).toBe(false)
  })

  it('invokes onClose callback when close icon is clicked', async () => {
    const onClose = jest.fn()
    const wrapper = shallowMount(LanguagesPopover, {
      propsData: {
        preferredLanguages: ['English'],
        nonPreferredLanguages: [],
        onClose
      },
      stubs: {
        VTextField: true,
        VIcon: true
      }
    })

    await wrapper.find('.languages-popover__close-btn').trigger('click')
    expect(onClose).toHaveBeenCalled()
  })
})
