import { shallowMount } from '@vue/test-utils'
import InputPhone from '@/components/Common/Inputs/InputPhone.vue'
import labels from '@/model/constants/labels'

describe('InputPhone.vue (extra branch coverage)', () => {
  it('getErrorText returns InvalidPhoneNumber when value exists and invalid', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+44123' }
    })
    wrapper.vm.isPhoneNumberValid = false
    expect(wrapper.vm.getErrorText).toBe(labels.InvalidPhoneNumber)
  })

  it('getErrorText returns PhoneNumberTooShort when possibility is too-short', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+4412' }
    })
    wrapper.vm.isPhoneNumberValid = false
    wrapper.vm.phonePossibility = 'too-short'
    expect(wrapper.vm.getErrorText).toBe(labels.PhoneNumberTooShort)
  })

  it('getErrorText returns PhoneNumberTooLong when possibility is too-long', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+44123456789012345' }
    })
    wrapper.vm.isPhoneNumberValid = false
    wrapper.vm.phonePossibility = 'too-long'
    expect(wrapper.vm.getErrorText).toBe(labels.PhoneNumberTooLong)
  })

  it('getErrorText returns empty string when not required and no value', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { required: false, value: '' }
    })
    wrapper.vm.isPhoneNumberValid = false
    expect(wrapper.vm.getErrorText).toBe('')
  })

  it('setOldValueBySplitter uses splitted value when this.value is empty', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    wrapper.vm.$refs.refTelInput = { phone: '' }
    wrapper.vm.setOldValueBySplitter('+', '+44+1234567890')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('')
  })

  it('validatePhoneNumber sets phonePossibility from phoneObject', async () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+4412' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: {
        isValid: false,
        regionCode: 'GB',
        possibility: 'too-short'
      }
    }
    wrapper.vm.validatePhoneNumber()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.phonePossibility).toBe('too-short')
    expect(wrapper.vm.isPhoneNumberValid).toBe(false)
  })

  it('validatePhoneNumber sets isPhoneNumberValid false on catch', async () => {
    const wrapper = shallowMount(InputPhone)
    wrapper.vm.$refs.refTelInput = {
      get phoneObject() {
        throw new Error('test')
      }
    }
    wrapper.vm.validatePhoneNumber()
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.isPhoneNumberValid).toBe(false)
  })

  it('handleTelChange with split plus: setOldValueBySplitter when multiple plus signs', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'GB' },
      phone: '+44'
    }
    wrapper.vm.handleTelChange('+44+55+123')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('')
  })

  it('handleTelChange with hyphen: setOldValueBySplitter for GB region', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'GB' },
      phone: '+44'
    }
    wrapper.vm.handleTelChange('+44-1234-567890')
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('handleTelChange too-long: different regionCode emits newVal', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+441234567890' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'US', possibility: 'too-long' },
      phone: '+441234567890',
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = '+441234567890'
    wrapper.vm.handleTelChange('+44123456789012345')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('+44123456789012345')
  })

  it('handleTelChange too-long: same regionCode reverts to value', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '+441234567890' }
    })
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'GB', possibility: 'too-long' },
      phone: '+441234567890',
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = '+441234567890'
    wrapper.vm.handleTelChange('+44123456789012345')
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe('+441234567890')
  })

  it('handleTelChange China 17-char: setValueSubStr when newVal[4] !== 1', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    const val17 = '+8612345678901234'
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'CN' },
      phone: val17,
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = val17
    wrapper.vm.handleTelChange(val17)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toHaveLength(16)
  })

  it('handleTelChange Poland 16-char: passes through (no truncation)', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    const val16 = '+481234567890123'
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'PL' },
      phone: val16,
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = val16
    wrapper.vm.handleTelChange(val16)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toHaveLength(16)
  })

  it('handleTelChange Sweden 17-char: setValueSubStr', () => {
    const wrapper = shallowMount(InputPhone, {
      propsData: { value: '' }
    })
    const val17 = '+4612345678901234'
    wrapper.vm.$refs.refTelInput = {
      phoneObject: { regionCode: 'SE' },
      phone: val17,
      get phone() {
        return this._phone
      },
      set phone(v) {
        this._phone = v
      }
    }
    wrapper.vm.$refs.refTelInput._phone = val17
    wrapper.vm.handleTelChange(val17)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toHaveLength(16)
  })

  describe('handleTelChange country-specific normal flow', () => {
    function createWrapper(value = '') {
      return shallowMount(InputPhone, { propsData: { value } })
    }

    function mockRef(wrapper, regionCode, phone) {
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode },
        _phone: phone,
        get phone() { return this._phone },
        set phone(v) { this._phone = v }
      }
    }

    // US: +1 + 10 digits = 12 chars (e.g. +12025551234)
    it('handleTelChange US: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+12025551234'
      mockRef(wrapper, 'US', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // DE: +49 + 10-11 digits (e.g. +4915123456789)
    it('handleTelChange Germany: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+4915123456789'
      mockRef(wrapper, 'DE', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // FR: +33 + 9 digits = 12 chars (e.g. +33612345678)
    it('handleTelChange France: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+33612345678'
      mockRef(wrapper, 'FR', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // JP: +81 + 10 digits = 13 chars (e.g. +819012345678)
    it('handleTelChange Japan: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+819012345678'
      mockRef(wrapper, 'JP', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // IN: +91 + 10 digits = 13 chars (e.g. +919876543210)
    it('handleTelChange India: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+919876543210'
      mockRef(wrapper, 'IN', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // AU: +61 + 9 digits = 12 chars (e.g. +61412345678)
    it('handleTelChange Australia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+61412345678'
      mockRef(wrapper, 'AU', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // BR: +55 + 11 digits = 14 chars (e.g. +5511987654321)
    it('handleTelChange Brazil: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+5511987654321'
      mockRef(wrapper, 'BR', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // RU: +7 + 10 digits = 12 chars (e.g. +79161234567)
    it('handleTelChange Russia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+79161234567'
      mockRef(wrapper, 'RU', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // KR: +82 + 10 digits = 13 chars (e.g. +821012345678)
    it('handleTelChange South Korea: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+821012345678'
      mockRef(wrapper, 'KR', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // MX: +52 + 10 digits = 13 chars (e.g. +525512345678)
    it('handleTelChange Mexico: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+525512345678'
      mockRef(wrapper, 'MX', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // IT: +39 + 10 digits = 13 chars (e.g. +393412345678)
    it('handleTelChange Italy: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+393412345678'
      mockRef(wrapper, 'IT', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // ES: +34 + 9 digits = 12 chars (e.g. +34612345678)
    it('handleTelChange Spain: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+34612345678'
      mockRef(wrapper, 'ES', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // NL: +31 + 9 digits = 12 chars (e.g. +31612345678)
    it('handleTelChange Netherlands: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+31612345678'
      mockRef(wrapper, 'NL', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // SA: +966 + 9 digits = 13 chars (e.g. +966512345678)
    it('handleTelChange Saudi Arabia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+966512345678'
      mockRef(wrapper, 'SA', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // AE: +971 + 9 digits = 13 chars (e.g. +971501234567)
    it('handleTelChange UAE: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+971501234567'
      mockRef(wrapper, 'AE', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // ZA: +27 + 9 digits = 12 chars (e.g. +27821234567)
    it('handleTelChange South Africa: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+27821234567'
      mockRef(wrapper, 'ZA', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // NG: +234 + 10 digits = 14 chars (e.g. +2348012345678)
    it('handleTelChange Nigeria: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+2348012345678'
      mockRef(wrapper, 'NG', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // EG: +20 + 10 digits = 13 chars (e.g. +201012345678)
    it('handleTelChange Egypt: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+201012345678'
      mockRef(wrapper, 'EG', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // SG: +65 + 8 digits = 11 chars (e.g. +6591234567)
    it('handleTelChange Singapore: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+6591234567'
      mockRef(wrapper, 'SG', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // IL: +972 + 9 digits = 13 chars (e.g. +972501234567)
    it('handleTelChange Israel: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+972501234567'
      mockRef(wrapper, 'IL', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // CA: +1 + 10 digits = 12 chars
    it('handleTelChange Canada: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+14165551234'
      mockRef(wrapper, 'CA', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // PT: +351 + 9 digits = 13 chars
    it('handleTelChange Portugal: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+351912345678'
      mockRef(wrapper, 'PT', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // AT: +43 + 10 digits = 13 chars
    it('handleTelChange Austria: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+436641234567'
      mockRef(wrapper, 'AT', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // CH: +41 + 9 digits = 12 chars
    it('handleTelChange Switzerland: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+41791234567'
      mockRef(wrapper, 'CH', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // BE: +32 + 9 digits = 12 chars
    it('handleTelChange Belgium: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+32471234567'
      mockRef(wrapper, 'BE', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // DK: +45 + 8 digits = 11 chars
    it('handleTelChange Denmark: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+4512345678'
      mockRef(wrapper, 'DK', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // NO: +47 + 8 digits = 11 chars
    it('handleTelChange Norway: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+4791234567'
      mockRef(wrapper, 'NO', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // FI: +358 + 9 digits = 13 chars
    it('handleTelChange Finland: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+358401234567'
      mockRef(wrapper, 'FI', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // IE: +353 + 9 digits = 13 chars
    it('handleTelChange Ireland: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+353871234567'
      mockRef(wrapper, 'IE', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // GR: +30 + 10 digits = 13 chars
    it('handleTelChange Greece: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+306912345678'
      mockRef(wrapper, 'GR', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // CZ: +420 + 9 digits = 13 chars
    it('handleTelChange Czech Republic: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+420601234567'
      mockRef(wrapper, 'CZ', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // HU: +36 + 9 digits = 12 chars
    it('handleTelChange Hungary: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+36201234567'
      mockRef(wrapper, 'HU', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // RO: +40 + 9 digits = 12 chars
    it('handleTelChange Romania: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+40721234567'
      mockRef(wrapper, 'RO', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // UA: +380 + 9 digits = 13 chars
    it('handleTelChange Ukraine: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+380501234567'
      mockRef(wrapper, 'UA', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // TH: +66 + 9 digits = 12 chars
    it('handleTelChange Thailand: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+66812345678'
      mockRef(wrapper, 'TH', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // MY: +60 + 9-10 digits = 12-13 chars
    it('handleTelChange Malaysia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+60121234567'
      mockRef(wrapper, 'MY', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // PH: +63 + 10 digits = 13 chars
    it('handleTelChange Philippines: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+639171234567'
      mockRef(wrapper, 'PH', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // ID: +62 + 10-12 digits = 13-15 chars
    it('handleTelChange Indonesia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+628121234567'
      mockRef(wrapper, 'ID', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // NZ: +64 + 9 digits = 12 chars
    it('handleTelChange New Zealand: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+64211234567'
      mockRef(wrapper, 'NZ', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // CO: +57 + 10 digits = 13 chars
    it('handleTelChange Colombia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+573101234567'
      mockRef(wrapper, 'CO', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // AR: +54 + 10 digits = 13 chars
    it('handleTelChange Argentina: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+541112345678'
      mockRef(wrapper, 'AR', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // CL: +56 + 9 digits = 12 chars
    it('handleTelChange Chile: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+56912345678'
      mockRef(wrapper, 'CL', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // QA: +974 + 8 digits = 12 chars
    it('handleTelChange Qatar: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+97433123456'
      mockRef(wrapper, 'QA', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // KW: +965 + 8 digits = 12 chars
    it('handleTelChange Kuwait: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+96551234567'
      mockRef(wrapper, 'KW', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // BH: +973 + 8 digits = 12 chars
    it('handleTelChange Bahrain: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+97332123456'
      mockRef(wrapper, 'BH', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // JO: +962 + 9 digits = 13 chars
    it('handleTelChange Jordan: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+962791234567'
      mockRef(wrapper, 'JO', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // KE: +254 + 9 digits = 13 chars
    it('handleTelChange Kenya: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+254712345678'
      mockRef(wrapper, 'KE', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // MA: +212 + 9 digits = 13 chars
    it('handleTelChange Morocco: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+212612345678'
      mockRef(wrapper, 'MA', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // PK: +92 + 10 digits = 13 chars
    it('handleTelChange Pakistan: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+923001234567'
      mockRef(wrapper, 'PK', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // BD: +880 + 10 digits = 14 chars
    it('handleTelChange Bangladesh: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+8801712345678'
      mockRef(wrapper, 'BD', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // VN: +84 + 9 digits = 12 chars
    it('handleTelChange Vietnam: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+84912345678'
      mockRef(wrapper, 'VN', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // HR: +385 + 9 digits = 13 chars
    it('handleTelChange Croatia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+385911234567'
      mockRef(wrapper, 'HR', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // SK: +421 + 9 digits = 13 chars
    it('handleTelChange Slovakia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+421901234567'
      mockRef(wrapper, 'SK', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // BG: +359 + 9 digits = 13 chars
    it('handleTelChange Bulgaria: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+359881234567'
      mockRef(wrapper, 'BG', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // LT: +370 + 8 digits = 12 chars
    it('handleTelChange Lithuania: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+37061234567'
      mockRef(wrapper, 'LT', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // LV: +371 + 8 digits = 12 chars
    it('handleTelChange Latvia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+37121234567'
      mockRef(wrapper, 'LV', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })

    // EE: +372 + 7-8 digits = 11-12 chars
    it('handleTelChange Estonia: normal phone emits correctly', () => {
      const wrapper = createWrapper()
      const val = '+37251234567'
      mockRef(wrapper, 'EE', val)
      wrapper.vm.handleTelChange(val)
      expect(wrapper.emitted('input')).toBeTruthy()
      expect(wrapper.emitted('input')[0][0]).toBe(val)
    })
  })

  describe('phonePossibility per country via validatePhoneNumber', () => {
    const countries = [
      { code: 'US', phone: '+120', name: 'US' },
      { code: 'DE', phone: '+491', name: 'Germany' },
      { code: 'FR', phone: '+336', name: 'France' },
      { code: 'JP', phone: '+813', name: 'Japan' },
      { code: 'IN', phone: '+919', name: 'India' },
      { code: 'AU', phone: '+614', name: 'Australia' },
      { code: 'BR', phone: '+551', name: 'Brazil' },
      { code: 'RU', phone: '+791', name: 'Russia' },
      { code: 'KR', phone: '+821', name: 'South Korea' },
      { code: 'MX', phone: '+525', name: 'Mexico' },
      { code: 'IT', phone: '+393', name: 'Italy' },
      { code: 'ES', phone: '+346', name: 'Spain' },
      { code: 'NL', phone: '+316', name: 'Netherlands' },
      { code: 'SA', phone: '+966', name: 'Saudi Arabia' },
      { code: 'AE', phone: '+971', name: 'UAE' },
      { code: 'ZA', phone: '+278', name: 'South Africa' },
      { code: 'NG', phone: '+234', name: 'Nigeria' },
      { code: 'EG', phone: '+201', name: 'Egypt' },
      { code: 'SG', phone: '+659', name: 'Singapore' },
      { code: 'IL', phone: '+972', name: 'Israel' },
      { code: 'PL', phone: '+481', name: 'Poland' },
      { code: 'SE', phone: '+461', name: 'Sweden' },
      { code: 'CN', phone: '+861', name: 'China' },
      { code: 'TR', phone: '+905', name: 'Turkey' },
      { code: 'GB', phone: '+447', name: 'UK' },
      { code: 'CA', phone: '+141', name: 'Canada' },
      { code: 'PT', phone: '+351', name: 'Portugal' },
      { code: 'AT', phone: '+436', name: 'Austria' },
      { code: 'CH', phone: '+417', name: 'Switzerland' },
      { code: 'BE', phone: '+324', name: 'Belgium' },
      { code: 'DK', phone: '+451', name: 'Denmark' },
      { code: 'NO', phone: '+479', name: 'Norway' },
      { code: 'FI', phone: '+358', name: 'Finland' },
      { code: 'IE', phone: '+353', name: 'Ireland' },
      { code: 'GR', phone: '+306', name: 'Greece' },
      { code: 'CZ', phone: '+420', name: 'Czech Republic' },
      { code: 'HU', phone: '+362', name: 'Hungary' },
      { code: 'RO', phone: '+407', name: 'Romania' },
      { code: 'UA', phone: '+380', name: 'Ukraine' },
      { code: 'TH', phone: '+668', name: 'Thailand' },
      { code: 'MY', phone: '+601', name: 'Malaysia' },
      { code: 'PH', phone: '+639', name: 'Philippines' },
      { code: 'ID', phone: '+628', name: 'Indonesia' },
      { code: 'NZ', phone: '+642', name: 'New Zealand' },
      { code: 'CO', phone: '+573', name: 'Colombia' },
      { code: 'AR', phone: '+541', name: 'Argentina' },
      { code: 'CL', phone: '+569', name: 'Chile' },
      { code: 'QA', phone: '+974', name: 'Qatar' },
      { code: 'KW', phone: '+965', name: 'Kuwait' },
      { code: 'BH', phone: '+973', name: 'Bahrain' },
      { code: 'JO', phone: '+962', name: 'Jordan' },
      { code: 'KE', phone: '+254', name: 'Kenya' },
      { code: 'MA', phone: '+212', name: 'Morocco' },
      { code: 'PK', phone: '+923', name: 'Pakistan' },
      { code: 'BD', phone: '+880', name: 'Bangladesh' },
      { code: 'VN', phone: '+849', name: 'Vietnam' },
      { code: 'HR', phone: '+385', name: 'Croatia' },
      { code: 'SK', phone: '+421', name: 'Slovakia' },
      { code: 'BG', phone: '+359', name: 'Bulgaria' },
      { code: 'LT', phone: '+370', name: 'Lithuania' },
      { code: 'LV', phone: '+371', name: 'Latvia' },
      { code: 'EE', phone: '+372', name: 'Estonia' }
    ]

    countries.forEach(({ code, phone, name }) => {
      it(`${name} (${code}): too-short sets PhoneNumberTooShort`, async () => {
        const wrapper = shallowMount(InputPhone, {
          propsData: { value: phone }
        })
        wrapper.vm.$refs.refTelInput = {
          phoneObject: {
            isValid: false,
            regionCode: code,
            possibility: 'too-short'
          }
        }
        wrapper.vm.validatePhoneNumber()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.phonePossibility).toBe('too-short')
        expect(wrapper.vm.isPhoneNumberValid).toBe(false)
        expect(wrapper.vm.getErrorText).toBe(labels.PhoneNumberTooShort)
      })

      it(`${name} (${code}): too-long sets PhoneNumberTooLong`, async () => {
        const wrapper = shallowMount(InputPhone, {
          propsData: { value: phone + '99999999999' }
        })
        wrapper.vm.$refs.refTelInput = {
          phoneObject: {
            isValid: false,
            regionCode: code,
            possibility: 'too-long'
          }
        }
        wrapper.vm.validatePhoneNumber()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.phonePossibility).toBe('too-long')
        expect(wrapper.vm.isPhoneNumberValid).toBe(false)
        expect(wrapper.vm.getErrorText).toBe(labels.PhoneNumberTooLong)
      })

      it(`${name} (${code}): is-possible sets valid`, async () => {
        const wrapper = shallowMount(InputPhone, {
          propsData: { value: phone + '12345678' }
        })
        wrapper.vm.$refs.refTelInput = {
          phoneObject: {
            isValid: true,
            regionCode: code,
            possibility: 'is-possible'
          }
        }
        wrapper.vm.validatePhoneNumber()
        await wrapper.vm.$nextTick()
        expect(wrapper.vm.phonePossibility).toBe('is-possible')
        expect(wrapper.vm.isPhoneNumberValid).toBe(true)
      })
    })
  })

  describe('handleTelChange hyphen handling for TR region', () => {
    it('handleTelChange with hyphen: setOldValueBySplitter for TR region', () => {
      const wrapper = shallowMount(InputPhone, {
        propsData: { value: '' }
      })
      wrapper.vm.$refs.refTelInput = {
        phoneObject: { regionCode: 'TR' },
        phone: '+90'
      }
      wrapper.vm.handleTelChange('+90-555-1234567')
      expect(wrapper.emitted('input')).toBeTruthy()
    })
  })

  describe('handleTelChange too-long for various countries', () => {
    const tooLongCases = [
      { code: 'DE', value: '+4915123456789', input: '+491512345678901234' },
      { code: 'FR', value: '+33612345678', input: '+3361234567890123' },
      { code: 'JP', value: '+819012345678', input: '+81901234567890123' },
      { code: 'IN', value: '+919876543210', input: '+91987654321012345' },
      { code: 'AU', value: '+61412345678', input: '+6141234567890123' },
      { code: 'BR', value: '+5511987654321', input: '+551198765432112345' },
      { code: 'RU', value: '+79161234567', input: '+7916123456712345' },
      { code: 'KR', value: '+821012345678', input: '+82101234567812345' },
      { code: 'IT', value: '+393412345678', input: '+39341234567812345' },
      { code: 'ES', value: '+34612345678', input: '+3461234567812345' },
      { code: 'CA', value: '+14165551234', input: '+1416555123412345' },
      { code: 'PT', value: '+351912345678', input: '+35191234567812345' },
      { code: 'AT', value: '+436641234567', input: '+43664123456712345' },
      { code: 'CH', value: '+41791234567', input: '+4179123456712345' },
      { code: 'BE', value: '+32471234567', input: '+3247123456712345' },
      { code: 'DK', value: '+4512345678', input: '+451234567812345' },
      { code: 'NO', value: '+4791234567', input: '+479123456712345' },
      { code: 'FI', value: '+358401234567', input: '+35840123456712345' },
      { code: 'IE', value: '+353871234567', input: '+35387123456712345' },
      { code: 'GR', value: '+306912345678', input: '+30691234567812345' },
      { code: 'CZ', value: '+420601234567', input: '+42060123456712345' },
      { code: 'HU', value: '+36201234567', input: '+3620123456712345' },
      { code: 'RO', value: '+40721234567', input: '+4072123456712345' },
      { code: 'UA', value: '+380501234567', input: '+38050123456712345' },
      { code: 'TH', value: '+66812345678', input: '+6681234567812345' },
      { code: 'MY', value: '+60121234567', input: '+6012123456712345' },
      { code: 'PH', value: '+639171234567', input: '+63917123456712345' },
      { code: 'ID', value: '+628121234567', input: '+62812123456712345' },
      { code: 'NZ', value: '+64211234567', input: '+6421123456712345' },
      { code: 'CO', value: '+573101234567', input: '+57310123456712345' },
      { code: 'AR', value: '+541112345678', input: '+54111234567812345' },
      { code: 'CL', value: '+56912345678', input: '+5691234567812345' },
      { code: 'QA', value: '+97433123456', input: '+9743312345612345' },
      { code: 'KW', value: '+96551234567', input: '+9655123456712345' },
      { code: 'BH', value: '+97332123456', input: '+9733212345612345' },
      { code: 'JO', value: '+962791234567', input: '+96279123456712345' },
      { code: 'KE', value: '+254712345678', input: '+25471234567812345' },
      { code: 'MA', value: '+212612345678', input: '+21261234567812345' },
      { code: 'PK', value: '+923001234567', input: '+92300123456712345' },
      { code: 'BD', value: '+8801712345678', input: '+880171234567812345' },
      { code: 'VN', value: '+84912345678', input: '+8491234567812345' },
      { code: 'HR', value: '+385911234567', input: '+38591123456712345' },
      { code: 'SK', value: '+421901234567', input: '+42190123456712345' },
      { code: 'BG', value: '+359881234567', input: '+35988123456712345' },
      { code: 'LT', value: '+37061234567', input: '+3706123456712345' },
      { code: 'LV', value: '+37121234567', input: '+3712123456712345' },
      { code: 'EE', value: '+37251234567', input: '+3725123456712345' }
    ]

    tooLongCases.forEach(({ code, value, input }) => {
      it(`handleTelChange too-long same region (${code}): reverts to value`, () => {
        const wrapper = shallowMount(InputPhone, {
          propsData: { value }
        })
        wrapper.vm.regionCode = code
        wrapper.vm.$refs.refTelInput = {
          phoneObject: { regionCode: code, possibility: 'too-long' },
          _phone: value,
          get phone() { return this._phone },
          set phone(v) { this._phone = v }
        }
        wrapper.vm.handleTelChange(input)
        expect(wrapper.emitted('input')).toBeTruthy()
        expect(wrapper.emitted('input')[0][0]).toBe(value)
      })
    })
  })
})
