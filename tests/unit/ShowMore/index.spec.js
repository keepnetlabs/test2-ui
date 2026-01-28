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
      computedData: []
    })
    //expecting show more button to be rendered
    const button = wrapper.find('.show-more__right')
    expect(button.exists()).toBe(true)
    //checking text
    expect(button.text().includes('Show less')).toBeTruthy()
    //clicking button
    await button.find('button').trigger('click')
    //checking text
    expect(button.text().includes('+2 more')).toBe(true)
  })

  it('Renders with correct container', () => {
    const { wrapper } = new ShowMore(localVue, {
      data: [{ subject: 'item1' }, { subject: 'item2' }, { subject: 'item3' }]
    })
    expect(wrapper.find('.show-more').exists()).toBe(true)
    expect(wrapper.classes('show-more')).toContain('show-more')
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
})
