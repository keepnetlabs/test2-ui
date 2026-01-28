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

  it('displays custom title and subtitle', () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue,
      propsData: {
        title: 'API Key',
        subTitle: 'Your secret API key'
      }
    })
    expect(wrapper.find('.k-form-group__title').text()).toContain('API Key')
  })

  it('copy button emits event with correct key', async () => {
    const testKey = 'test-api-key-123'
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue,
      propsData: {
        title: 'API Key',
        copyKey: testKey
      }
    })
    await wrapper.find('button').trigger('click')
    const event = wrapper.emitted()['on-copy']
    expect(event[0][0]).toEqual(testKey)
  })

  it('button is clickable and visible', () => {
    const wrapper = mount(InputWithCopyToClipboard, {
      localVue
    })
    const button = wrapper.find('button')
    expect(button.exists()).toBe(true)
    expect(button.isVisible()).toBe(true)
  })

  it('handles different copyKey values', async () => {
    const testCases = ['key1', 'key2', 'abc-def-123']
    for (const key of testCases) {
      const wrapper = mount(InputWithCopyToClipboard, {
        localVue,
        propsData: { copyKey: key }
      })
      await wrapper.find('button').trigger('click')
      expect(wrapper.emitted()['on-copy'][0][0]).toEqual(key)
    }
  })
})
