import { shallowMount } from '@vue/test-utils'
import InputPhone from '@/components/Common/Inputs/InputPhone.vue'
import InputPhoneNumberComboBox from '@/components/Common/Inputs/InputPhoneNumberComboBox.vue'
import InputCallerPhoneNumber from '@/components/Common/Inputs/InputCallerPhoneNumber.vue'

describe('Phone country name localization (integration)', () => {
  it('passes Türkiye as the TR country name to vue-tel-input', () => {
    const wrapper = shallowMount(InputPhone)
    const telInput = wrapper.findComponent({ name: 'VueTelInput' })
    const turkeyCountry = telInput.props('allCountries').find((country) => country.iso2 === 'TR')

    expect(turkeyCountry.name).toBe('Türkiye')
  })

  it('shows Türkiye for stored +90 phone numbers in phone number combobox items', () => {
    const wrapper = shallowMount(InputPhoneNumberComboBox, {
      propsData: {
        isSmishing: true
      }
    })

    expect(wrapper.vm.getPhoneNumberCountry('+905551112233')).toBe('Türkiye')
  })

  it('shows Türkiye for stored +90 caller phone numbers', () => {
    const wrapper = shallowMount(InputCallerPhoneNumber, {
      propsData: {
        value: '+905551112233',
        defaultPhoneNumbers: ['+905551112233']
      },
      stubs: {
        FormGroup: true,
        KSelect: true
      }
    })

    expect(wrapper.vm.getPhoneNumberCountry('+905551112233')).toBe('Türkiye')
  })
})
