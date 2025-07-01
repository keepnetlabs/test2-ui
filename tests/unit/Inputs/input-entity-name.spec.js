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
})
