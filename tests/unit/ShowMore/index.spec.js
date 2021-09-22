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
      status: 1
    })

    //expecting show more button to be rendered
    const button = wrapper.find('.show-more__right')
    expect(button.exists()).toBe(true)
    //checking menu icon
    expect(button.find('.mdi-menu-up').exists()).toBe(true)
    //checking text
    expect(button.text().includes('Show less')).toBeTruthy()

    //clicking button

    await button.find('button').trigger('click')

    //checking icon

    expect(button.find('.mdi-menu-down').exists()).toBe(true)

    //checking text

    expect(button.text().includes('+2 more')).toBe(true)
  })
})
