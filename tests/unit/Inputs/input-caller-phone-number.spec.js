import { createLocalVue, mount } from '@vue/test-utils'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber'
import { setupPromisePool } from '../promise-pool-helpers'
describe('Input caller phone number component', () => {
  setupPromisePool()
  const localVue = createLocalVue()
  it('Check is rendering', () => {
    const wrapper = mount(InputCallerPhoneNumber, {
      localVue
    })
    //expecting component is rendering
    expect(wrapper.text().includes('Caller Phone Number')).toBeTruthy()
    //checking subtitle
    expect(wrapper.text().includes('Select caller phone number for this campaign')).toBeTruthy()
  })
  it('createPhoneNumberObj', () => {
    const wrapper = mount(InputCallerPhoneNumber, {
      localVue,
      propsData: {
        value: '+905372086061'
      }
    })
    expect(wrapper.vm.createPhoneNumberObj(wrapper.vm.value)).toBeTruthy()
  })
  it('getPhoneNumberFormatted', () => {
    const wrapper = mount(InputCallerPhoneNumber, {
      localVue,
      propsData: {
        value: '+905372086061'
      }
    })
    expect(wrapper.vm.getPhoneNumberFormatted(wrapper.vm.value)).toBe('+90 537 208 60 61')
  })
  it('getPhoneNumberCountry', () => {
    const wrapper = mount(InputCallerPhoneNumber, {
      localVue,
      propsData: {
        value: '+905372086061'
      }
    })
    expect(wrapper.vm.getPhoneNumberCountry(wrapper.vm.value)).toBe('Türkiye')
  })
})
