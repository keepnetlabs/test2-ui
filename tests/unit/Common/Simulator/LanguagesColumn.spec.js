import LanguagesColumn from '@/components/Common/Simulator/LanguagesColumn/LanguagesColumn.vue'
import { shallowMount } from '@vue/test-utils'

describe('LanguagesColumn.vue', () => {
  it('languages normalizes string/array values and filters falsy items', () => {
    expect(LanguagesColumn.computed.languages.call({ value: 'English' })).toEqual(['English'])
    expect(LanguagesColumn.computed.languages.call({ value: ['English', '', null, 'Turkish'] })).toEqual([
      'English',
      'Turkish'
    ])
    expect(LanguagesColumn.computed.languages.call({ value: null })).toEqual([])
  })

  it('firstLanguage and overflowCount derive from normalized language list', () => {
    const ctx = { languages: ['English', 'Turkish', 'German'] }
    expect(LanguagesColumn.computed.firstLanguage.call(ctx)).toBe('English')
    expect(LanguagesColumn.computed.overflowCount.call(ctx)).toBe(2)
  })

  it('preferredTexts trims/lowercases preferred language types', () => {
    const ctx = {
      preferredLanguageTypes: [{ text: ' English ' }, { text: 'Turkish' }, { text: '' }, {}]
    }

    expect(LanguagesColumn.computed.preferredTexts.call(ctx)).toEqual(['english', 'turkish'])
  })

  it('overflowLanguages returns tail items only', () => {
    expect(LanguagesColumn.computed.overflowLanguages.call({ languages: ['English'] })).toEqual([])
    expect(
      LanguagesColumn.computed.overflowLanguages.call({ languages: ['English', 'Turkish', 'German'] })
    ).toEqual(['Turkish', 'German'])
  })

  it('overflowPreferredLanguages and overflowNonPreferredLanguages split by preferred set', () => {
    const ctx = {
      preferredTexts: ['english', 'turkish'],
      overflowLanguages: ['Turkish', 'German', 'English UK']
    }

    expect(LanguagesColumn.computed.overflowPreferredLanguages.call(ctx)).toEqual([
      'Turkish',
      'English UK'
    ])
    expect(LanguagesColumn.computed.overflowNonPreferredLanguages.call(ctx)).toEqual(['German'])
  })

  it('handleClosePopover closes popover state', () => {
    const ctx = { isPopoverOpen: true }

    LanguagesColumn.methods.handleClosePopover.call(ctx)
    expect(ctx.isPopoverOpen).toBe(false)
  })

  it('renders empty text when there are no languages', () => {
    const wrapper = shallowMount(LanguagesColumn, {
      propsData: {
        value: [],
        emptyText: 'No language'
      },
      stubs: {
        VMenu: true,
        LanguagesPopover: true
      }
    })

    expect(wrapper.find('.languages-column__empty').text()).toBe('No language')
  })

  it('renders singular/plural overflow label based on overflow count', () => {
    const VMenuStub = {
      name: 'VMenu',
      props: ['value'],
      template:
        '<div><slot name="activator" :on="{}" :attrs="{}" /><slot /></div>'
    }

    const singular = shallowMount(LanguagesColumn, {
      propsData: {
        value: ['English', 'Turkish']
      },
      stubs: {
        VMenu: VMenuStub,
        LanguagesPopover: true
      }
    })
    expect(singular.find('.languages-column__overflow').text()).toContain('+1 language')

    const plural = shallowMount(LanguagesColumn, {
      propsData: {
        value: ['English', 'Turkish', 'German']
      },
      stubs: {
        VMenu: VMenuStub,
        LanguagesPopover: true
      }
    })
    expect(plural.find('.languages-column__overflow').text()).toContain('+2 languages')
  })

  it('passes on-close handler to popover and closes popover when invoked', () => {
    const wrapper = shallowMount(LanguagesColumn, {
      propsData: {
        value: ['English', 'Turkish', 'German']
      },
      stubs: {
        VMenu: {
          name: 'VMenu',
          props: ['value'],
          template: '<div><slot name="activator" :on="{}" :attrs="{}" /><slot /></div>'
        },
        LanguagesPopover: {
          name: 'LanguagesPopover',
          props: ['preferredLanguages', 'nonPreferredLanguages', 'onClose'],
          template: '<div class="popover-stub" />'
        }
      }
    })

    wrapper.setData({ isPopoverOpen: true })
    const popover = wrapper.findComponent({ name: 'LanguagesPopover' })
    expect(typeof popover.props('onClose')).toBe('function')

    popover.props('onClose')()
    expect(wrapper.vm.isPopoverOpen).toBe(false)
  })
})
