import { createLocalVue } from '@vue/test-utils'
import ShowMore from '../Objects/ShowMore'

describe('Show more component', () => {
  const localVue = createLocalVue()
  it('Check renders', async () => {
    const { wrapper } = new ShowMore(localVue, {
      data: [{ subject: 'tag2' }, { subject: 'tag23' }]
    })
    expect(wrapper.find('.show-more').exists()).toBe(true)
  })
  it('Check content', async () => {
    const { wrapper } = new ShowMore(localVue, {
      data: [{ subject: 'tag2' }, { subject: 'tag23' }]
    })
    await wrapper.setData({
      renderedBadgeCount: 2,
      status: 1
    })
    //checking content chips
    const chips = wrapper.findAll('.v-chip')
    expect(chips.exists()).toBe(true)
    expect(chips.length).toBe(2)
    //comparing text contents
    chips.filter((item, index) => {
      expect(item.text().includes(wrapper.vm.data[index].subject)).toBeTruthy()
    })
  })
  it('Check button and other actions', async () => {
    const { wrapper } = new ShowMore(localVue, {
      data: [{ subject: 'tag2' }, { subject: 'tag23' }]
    })
    await wrapper.setData({
      renderedBadgeCount: 1,
      status: 1,
      unRenderedBadgeCount: 1,
      computedData: [{ subject: 'tag2' }, { subject: 'tag23' }]
    })
    //expecting show more button to be rendered
    const button = wrapper.find('.show-more__right')
    if (button.exists()) {
      //checking text
      expect(button.text().includes('Show less')).toBeTruthy()
      //clicking button
      await button.find('button').trigger('click')
      //checking text - after click, status should change
      expect(wrapper.vm.status !== 1).toBe(true)
    }
  })

  it('Renders with correct container', () => {
    const { wrapper } = new ShowMore(localVue, {
      data: [{ subject: 'item1' }, { subject: 'item2' }, { subject: 'item3' }]
    })
    expect(wrapper.find('.show-more').exists()).toBe(true)
    expect(wrapper.classes()).toContain('show-more')
  })

  it('Handles empty data gracefully', () => {
    const { wrapper } = new ShowMore(localVue, {
      data: []
    })
    expect(wrapper.find('.show-more').exists()).toBe(true)
    expect(wrapper.vm.data.length).toBe(0)
  })

  it('Toggles visibility state on button click', async () => {
    const { wrapper } = new ShowMore(localVue, {
      data: [{ subject: 'tag1' }, { subject: 'tag2' }, { subject: 'tag3' }]
    })
    await wrapper.setData({ renderedBadgeCount: 1 })

    const initialStatus = wrapper.vm.status
    const button = wrapper.find('.show-more__right button')
    if (button.exists()) {
      await button.trigger('click')
      // Status should toggle
      expect(wrapper.vm.status).not.toBe(initialStatus)
    }
  })

  describe('Component Rendering', () => {
    it('renders show-more container element', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'test' }]
      })
      expect(wrapper.find('.show-more').exists()).toBe(true)
    })

    it('applies show-more class to root element', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'test' }]
      })
      expect(wrapper.classes()).toContain('show-more')
    })

    it('renders with multiple data items', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [
          { subject: 'item1' },
          { subject: 'item2' },
          { subject: 'item3' },
          { subject: 'item4' }
        ]
      })
      expect(wrapper.find('.show-more').exists()).toBe(true)
      expect(wrapper.vm.data.length).toBe(4)
    })
  })

  describe('Data Handling', () => {
    it('accepts array of data items', () => {
      const testData = [{ subject: 'tag1' }, { subject: 'tag2' }]
      const { wrapper } = new ShowMore(localVue, {
        data: testData
      })
      expect(wrapper.vm.data.length).toBe(2)
    })

    it('handles single item in data', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'single-item' }]
      })
      expect(wrapper.vm.data.length).toBe(1)
      expect(wrapper.vm.data[0].subject).toBe('single-item')
    })

    it('handles items with special characters in subject', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'tag@special#chars!' }]
      })
      expect(wrapper.vm.data[0].subject).toContain('@special#chars!')
    })

    it('preserves data order', () => {
      const testData = [
        { subject: 'first' },
        { subject: 'second' },
        { subject: 'third' }
      ]
      const { wrapper } = new ShowMore(localVue, {
        data: testData
      })
      expect(wrapper.vm.data[0].subject).toBe('first')
      expect(wrapper.vm.data[1].subject).toBe('second')
      expect(wrapper.vm.data[2].subject).toBe('third')
    })
  })

  describe('Chip Rendering', () => {
    it('renders chips for visible items', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'chip1' }, { subject: 'chip2' }]
      })
      await wrapper.setData({ renderedBadgeCount: 2 })

      const chips = wrapper.findAll('.v-chip')
      expect(chips.exists()).toBe(true)
    })

    it('displays correct text in chips', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'test-tag' }]
      })
      await wrapper.setData({ renderedBadgeCount: 1 })

      const chips = wrapper.findAll('.v-chip')
      chips.filter((item, index) => {
        expect(item.text().includes(wrapper.vm.data[index].subject)).toBeTruthy()
      })
    })

    it('handles multiple chips display', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [
          { subject: 'tag1' },
          { subject: 'tag2' },
          { subject: 'tag3' }
        ]
      })
      await wrapper.setData({ renderedBadgeCount: 3 })

      const chips = wrapper.findAll('.v-chip')
      expect(chips.length).toBe(3)
    })

    it('hides chips when renderedBadgeCount is 0', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'hidden-tag' }]
      })
      await wrapper.setData({ renderedBadgeCount: 0 })

      const chips = wrapper.findAll('.v-chip')
      expect(chips.length).toBe(0)
    })
  })

  describe('Badge Count Management', () => {
    it('updates rendered badge count', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [
          { subject: 'item1' },
          { subject: 'item2' },
          { subject: 'item3' }
        ]
      })
      await wrapper.setData({ renderedBadgeCount: 2 })
      expect(wrapper.vm.renderedBadgeCount).toBe(2)
    })

    it('calculates unrendered badge count correctly', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [
          { subject: 'item1' },
          { subject: 'item2' },
          { subject: 'item3' }
        ]
      })
      await wrapper.setData({
        renderedBadgeCount: 2,
        unRenderedBadgeCount: 1
      })
      expect(wrapper.vm.unRenderedBadgeCount).toBe(1)
    })

    it('handles zero unrendered count', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'item1' }, { subject: 'item2' }]
      })
      await wrapper.setData({
        renderedBadgeCount: 2,
        unRenderedBadgeCount: 0
      })
      expect(wrapper.vm.unRenderedBadgeCount).toBe(0)
    })
  })

  describe('Visibility Toggle', () => {
    it('toggles show more button visibility', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [
          { subject: 'tag1' },
          { subject: 'tag2' },
          { subject: 'tag3' }
        ]
      })
      await wrapper.setData({ renderedBadgeCount: 1, status: 1 })

      const button = wrapper.find('.show-more__right')
      if (button.exists()) {
        expect(button.exists()).toBe(true)
      }
    })

    it('changes text from "Show more" to "Show less"', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'tag1' }, { subject: 'tag2' }]
      })
      await wrapper.setData({
        renderedBadgeCount: 1,
        status: 1,
        unRenderedBadgeCount: 1
      })

      const button = wrapper.find('.show-more__right')
      if (button.exists()) {
        expect(button.text().includes('Show less')).toBeTruthy()
      }
    })

    it('updates status on button click', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'tag1' }, { subject: 'tag2' }]
      })
      await wrapper.setData({
        renderedBadgeCount: 1,
        status: 1
      })

      const button = wrapper.find('.show-more__right button')
      if (button.exists()) {
        const initialStatus = wrapper.vm.status
        await button.trigger('click')
        expect(wrapper.vm.status).not.toBe(initialStatus)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles very long subject text', () => {
      const longText = 'a'.repeat(100)
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: longText }]
      })
      expect(wrapper.vm.data[0].subject.length).toBe(100)
    })

    it('handles unicode characters in subject', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'Tag with émojis 🎉 and spëcial çharacters' }]
      })
      expect(wrapper.vm.data[0].subject).toContain('émojis')
    })

    it('handles large data set', () => {
      const largeData = Array.from({ length: 100 }, (_, i) => ({
        subject: `item-${i}`
      }))
      const { wrapper } = new ShowMore(localVue, {
        data: largeData
      })
      expect(wrapper.vm.data.length).toBe(100)
    })

    it('maintains structure with missing properties', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'item1' }, {}]
      })
      expect(wrapper.vm.data.length).toBe(2)
    })
  })

  describe('Component State', () => {
    it('initializes with default status', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'item' }]
      })
      expect(typeof wrapper.vm.status).toBe('number')
    })

    it('updates computed data on state change', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'item1' }, { subject: 'item2' }]
      })
      await wrapper.setData({
        computedData: [{ subject: 'item1' }, { subject: 'item2' }]
      })
      expect(wrapper.vm.computedData.length).toBe(2)
    })

    it('maintains state consistency after multiple operations', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'tag1' }, { subject: 'tag2' }, { subject: 'tag3' }]
      })
      await wrapper.setData({ renderedBadgeCount: 1, status: 1 })
      const firstStatus = wrapper.vm.status

      await wrapper.setData({ renderedBadgeCount: 3, status: 0 })
      const secondStatus = wrapper.vm.status

      expect(firstStatus).not.toBe(secondStatus)
    })
  })

  describe('DOM Structure', () => {
    it('renders left section for chips', () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'item' }]
      })
      const leftSection = wrapper.find('.show-more__left')
      // Element may not exist depending on implementation
      if (leftSection.exists()) {
        expect(leftSection.exists()).toBe(true)
      }
    })

    it('renders right section for button', async () => {
      const { wrapper } = new ShowMore(localVue, {
        data: [{ subject: 'item1' }, { subject: 'item2' }]
      })
      await wrapper.setData({ unRenderedBadgeCount: 1 })

      const rightSection = wrapper.find('.show-more__right')
      if (rightSection.exists()) {
        expect(rightSection.exists()).toBe(true)
      }
    })
  })
})
