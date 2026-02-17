import { shallowMount } from '@vue/test-utils'
import AppendableMergeTag from '@/components/Common/Others/AppendableMergeTag.vue'
import BrowserToolbar from '@/components/Common/Others/BrowserToolbar.vue'
import RedFlagTooltip from '@/components/Common/Others/RedFlagTooltip.vue'

jest.mock('@/utils/functions', () => ({
  createRandomCryptStringNumber: jest.fn(() => '123')
}))

describe('Common others mini components', () => {
  it('AppendableMergeTag emits on-add-merge-tag with selected tag', () => {
    const wrapper = shallowMount(AppendableMergeTag, {
      stubs: {
        VMenu: true,
        VIcon: true,
        VList: true,
        VListItem: true,
        VListItemTitle: true
      }
    })

    expect(wrapper.vm.$options.name).toBe('AppendableMergeTag')
    expect(wrapper.vm.mergeTags).toEqual([{ name: 'Email', value: '{EMAIL}' }])

    wrapper.vm.addMergeTag('{EMAIL}')
    expect(wrapper.emitted('on-add-merge-tag')).toEqual([['{EMAIL}']])
  })

  it('BrowserToolbar formats url with random number and page order', () => {
    const wrapper = shallowMount(BrowserToolbar, {
      propsData: {
        url: 'https://example.com/?t=',
        pageIndex: 1,
        showToolbar: true
      }
    })

    expect(wrapper.vm.$options.name).toBe('BrowserToolbar')
    expect(wrapper.vm.formattedUrl).toBe('https://example.com/?t=123&order=2')
    expect(wrapper.find('.browser-toolbar').exists()).toBe(true)
  })

  it('BrowserToolbar hides content when showToolbar is false', () => {
    const wrapper = shallowMount(BrowserToolbar, {
      propsData: {
        url: 'https://example.com',
        showToolbar: false
      }
    })

    expect(wrapper.find('.browser-toolbar').exists()).toBe(false)
  })

  it('RedFlagTooltip renders tooltip content', () => {
    const wrapper = shallowMount(RedFlagTooltip, {
      propsData: {
        tooltipContent: 'Invalid value found'
      },
      stubs: {
        'v-tooltip': true
      }
    })

    expect(wrapper.vm.$options.name).toBe('RedFlagTooltip')
    expect(wrapper.text()).toContain('Invalid value found')
  })
})
