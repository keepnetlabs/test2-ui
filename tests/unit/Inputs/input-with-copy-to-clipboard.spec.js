import { createLocalVue, mount } from '@vue/test-utils'
import InputWithCopyToClipboard from '@/components/Common/Inputs/InputWithCopyToClipboard'
describe('Input Copy with clipboard component', () => {
  const localVue = createLocalVue()

  it('Check is rendering', () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue
    })
    //expecting component is rendering

    expect(wrapper.find('.input-copy-to-clipboard').exists()).toBeTruthy()

    //checking is input rendered
    expect(wrapper.find('input').exists()).toBeTruthy()

    //checking is button rendered

    expect(wrapper.find('button').exists()).toBeTruthy()
  })

  it('Check actions and props', async () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue,
      propsData: {
        title: 'Custom title',
        subTitle: 'Custom subtitle',
        copyKey: 'id'
      }
    })
    //expecting component is rendering
    expect(wrapper.find('.k-form-group__title').text()).toContain('Custom title')

    //clicking button

    await wrapper.find('button').trigger('click')
    //is event throwed
    const emittedEvent = wrapper.emitted()['on-copy']
    expect(emittedEvent.length).toBe(1)
    //comparing value
    expect(emittedEvent[0][0]).toEqual('id')
  })
})
