import { createLocalVue, mount } from '@vue/test-utils'
import { customVuetify as vuetify } from '../utils'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputHelper from '../Objects/InputHelper'

describe('Input entity name', () => {
  const localVue = createLocalVue()

  it('should render successfully', () => {
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: {
        id: 'input-entity-name'
      }
    })
    expect(wrapper.find('#input-entity-name').exists()).toBeTruthy()
  })
  it('should render props successfully', async () => {
    const props = {
      id: 'input-entity-name',
      value: 'Some input entity name value',
      initialPlaceholder: 'Some input entity name placeholder',
      initialRules: [],
      required: false,
      entityName: 'entity-name'
    }
    const wrapper = await mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })

    expect(wrapper.find('#input-entity-name').exists()).toBeTruthy()
    expect(wrapper.find('#input-entity-name').element.value).toEqual(props.value)
    expect(wrapper.find('#input-entity-name').attributes().placeholder).toEqual(
      props.initialPlaceholder
    )
    expect(wrapper.find('.v-messages__wrapper').text().includes('*Required')).toBe(false)
  })

  it('should apply rules successfully', async () => {
    const props = {
      id: 'input-entity-name',
      value: 'Some input entity name value',
      initialPlaceholder: 'Some input entity name placeholder',
      required: true,
      entityName: 'entity-name'
    }
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })
    const inputHelper = new InputHelper()
    const textInput = wrapper.find('input')

    //checking cannot start empty space
    await inputHelper.addData(' my custom input first name data', textInput, wrapper)

    expect(
      wrapper.find('.v-messages__message').text().includes('Cannot start with space')
    ).toBeTruthy()

    //checking length
    await inputHelper.addData(
      'my custom input first name data my custom input first name data my custom input first name datamy custom input first name data  vmy custom input first name datamy custom input first name datamy custom input first name data',
      textInput,
      wrapper
    )
    expect(wrapper.find('.v-messages__message').text()).toEqual(
      `${props.entityName} cannot exceed 200 characters`
    )
    //checking required
    await inputHelper.addData('', textInput, wrapper)

    expect(wrapper.find('.v-messages__message').text().includes('Required')).toBeTruthy()
  })

  it('should apply custom rules', async () => {
    const customRules = [(v) => v && v.length > 0 || 'Must not be empty']
    const props = {
      id: 'input-entity-name',
      value: '',
      initialPlaceholder: 'Enter entity name',
      initialRules: customRules,
      required: true,
      entityName: 'Custom Entity'
    }
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })
    expect(wrapper.find('#input-entity-name').exists()).toBeTruthy()
  })

  it('should handle different entity names', () => {
    const props = {
      id: 'input-entity-name',
      value: '',
      initialPlaceholder: 'Enter user name',
      required: false,
      entityName: 'User Name'
    }
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })
    expect(wrapper.vm.$props.entityName).toEqual('User Name')
  })

  it('should display custom placeholder', () => {
    const placeholder = 'Custom placeholder text'
    const props = {
      id: 'input-entity-name',
      value: '',
      initialPlaceholder: placeholder,
      required: false,
      entityName: 'entity'
    }
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })
    expect(wrapper.find('input').attributes('placeholder')).toEqual(placeholder)
  })

  it('should update value when prop changes', async () => {
    const props = {
      id: 'input-entity-name',
      value: 'Initial Value',
      initialPlaceholder: 'Enter text',
      required: false,
      entityName: 'entity'
    }
    const wrapper = mount(InputEntityName, {
      localVue,
      vuetify,
      propsData: props
    })

    expect(wrapper.find('input').element.value).toEqual('Initial Value')

    await wrapper.setProps({ value: 'Updated Value' })
    expect(wrapper.find('input').element.value).toEqual('Updated Value')
  })
})
