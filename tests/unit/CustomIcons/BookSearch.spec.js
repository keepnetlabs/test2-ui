import { shallowMount } from '@vue/test-utils'
import BookSearch from '@/components/CustomIcons/BookSearch.vue'

describe('BookSearch.vue', () => {
  it('renders search icon image with expected alt text', () => {
    const wrapper = shallowMount(BookSearch)
    const img = wrapper.find('img')

    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('book-search-icon')
    expect(img.attributes('src')).toContain('book-search-icon.svg')
  })
})
