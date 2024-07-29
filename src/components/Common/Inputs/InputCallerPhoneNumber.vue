<template>
  <FormGroup has-hint class="mt-6" :title="title" :sub-title="subTitle">
    <KSelect
      :value="value"
      outlined
      dense
      persistent-hint
      hint="*Required"
      placeholder="Select a phone number"
      :items="getPhoneNumberItems"
      :slots="{ item: true, append: true }"
      :rules="[(v) => Validations.required(v)]"
      @input="handleInputChange"
    >
      <template #item="{ item }">
        <div :class="['mail-configuration-select-sources__item-container']">
          <div class="mail-configuration-select-sources__item">
            <div class="mail-configuration-select-sources__item-left">
              {{ getPhoneNumberFormatted(item) }}
            </div>
            <div class="mail-configuration-select-sources__item-right-platform">
              {{ getPhoneNumberCountry(item) }}
            </div>
          </div>
        </div>
      </template>
      <template #append>
        <div class="mail-configuration-select-sources__item-right-platform d-flex align-center">
          <span>{{ getPhoneNumberCountry(value) }}</span>
          <VIcon class="ml-2 mr-n3">mdi-menu-down</VIcon>
        </div>
      </template>
    </KSelect>
  </FormGroup>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup'
import KSelect from '@/components/Common/Inputs/KSelect'
import { getPhoneNumbers } from '@/api/vishing'
import PhoneNumber from 'awesome-phonenumber'
import * as Validations from '@/utils/validations'
import { getPhishingScenariosPhoneNumber } from '@/api/phishingsimulator'
import { getSmishingScenariosPhoneNumber } from '@/api/smishing'
import { getQuishingScenariosPhoneNumber } from '@/api/quishing'
import { mapGetters } from 'vuex'
export default {
  name: 'InputCallerPhoneNumber',
  components: { KSelect, FormGroup },
  props: {
    value: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Caller Phone Number'
    },
    subTitle: {
      type: String,
      default: 'Select caller phone number for this campaign'
    },
    defaultPhoneNumbers: {
      type: Array,
      required: false
    },
    selectFirstItem: {
      type: Boolean,
      default: false
    },
    isPhishingScenario: {
      type: Boolean,
      default: false
    },
    isSmishing: {
      type: Boolean,
      default: false
    },
    isQuishing: {
      type: Boolean,
      default: false
    },
    callerPhoneNumber: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      Validations,
      phoneNumbers: []
    }
  },
  computed: {
    ...mapGetters({
      countryCode: 'whitelabel/getCountryCode'
    }),
    getPhoneNumberItems() {
      if (this.defaultPhoneNumbers?.length) {
        return this.defaultPhoneNumbers
      }

      return this.phoneNumbers
    }
  },
  mounted() {
    if (!this.defaultPhoneNumbers) this.callForPhoneNumbers()
  },
  methods: {
    callForPhoneNumbers() {
      if (this.isPhishingScenario) {
        getPhishingScenariosPhoneNumber().then((response) => {
          const { data: { data = [] } = {} } = response
          if (!data) return
          data.sort((a, b) => {
            return a.phoneNumber < b.phoneNumber ? -1 : 1
          })
          this.phoneNumbers = this.sortPhoneNumbersAndOrderByRegionCode(data, true).map(
            (phoneNumberWrapper) => {
              return {
                text: this.getPhoneNumberFormatted({
                  text: phoneNumberWrapper.phoneNumber
                }),
                value: phoneNumberWrapper.resourceId
              }
            }
          )
          if (!this.value && this.selectFirstItem)
            this.handleInputChange(this.phoneNumbers[0].value)
        })
      } else if (this.isSmishing) {
        getSmishingScenariosPhoneNumber().then((response) => {
          const { data: { data = [] } = {} } = response
          if (!data) return
          data.sort((a, b) => {
            return a.phoneNumber < b.phoneNumber ? -1 : 1
          })
          this.phoneNumbers = this.sortPhoneNumbersAndOrderByRegionCode(data, true).map(
            (phoneNumberWrapper) => {
              return {
                text: this.getPhoneNumberFormatted({
                  text: phoneNumberWrapper.phoneNumber
                }),
                value: phoneNumberWrapper.resourceId
              }
            }
          )
          if (!this.value && this.selectFirstItem)
            this.handleInputChange(this.phoneNumbers[0].value)
        })
      } else if (this.isQuishing) {
        getQuishingScenariosPhoneNumber().then((response) => {
          const { data: { data = [] } = {} } = response
          if (!data) return
          data.sort((a, b) => {
            return a.phoneNumber < b.phoneNumber ? -1 : 1
          })
          this.phoneNumbers = this.sortPhoneNumbersAndOrderByRegionCode(data, true).map(
            (phoneNumberWrapper) => {
              return {
                text: this.getPhoneNumberFormatted({
                  text: phoneNumberWrapper.phoneNumber
                }),
                value: phoneNumberWrapper.resourceId
              }
            }
          )
          if (!this.value && this.selectFirstItem)
            this.handleInputChange(this.phoneNumbers[0].value)
        })
      } else {
        getPhoneNumbers().then((response) => {
          const { data } = response
          data.sort()
          if (!data) return
          this.phoneNumbers = this.sortPhoneNumbersAndOrderByRegionCode(data).map((phoneNumber) =>
            this.getPhoneNumberFormatted(phoneNumber)
          )
          if (!this.value && this.selectFirstItem) this.handleInputChange(this.phoneNumbers[0])
        })
      }
    },
    sortPhoneNumbersAndOrderByRegionCode(data, isPhishing = false) {
      const sortedRegionalPhoneNumbers = []
      const sortedOtherNumbers = []
      const regionCode = PhoneNumber.getCountryCodeForRegionCode(this.countryCode || 'US')
      if (isPhishing) {
        data.forEach((phoneNumberWrapper) => {
          phoneNumberWrapper.phoneNumber.startsWith(`+${regionCode}`)
            ? sortedRegionalPhoneNumbers.push(phoneNumberWrapper)
            : sortedOtherNumbers.push(phoneNumberWrapper)
        })
      } else {
        data.forEach((phoneNumber) => {
          phoneNumber.startsWith(`+${regionCode}`)
            ? sortedRegionalPhoneNumbers.push(phoneNumber)
            : sortedOtherNumbers.push(phoneNumber)
        })
      }
      return [...sortedRegionalPhoneNumbers, ...sortedOtherNumbers]
    },
    getPhoneNumberFormatted(phoneNumber) {
      const phoneNumberObj = this.createPhoneNumberObj(
        this.isPhishingScenario || this.isSmishing || this.isQuishing
          ? phoneNumber.text
          : phoneNumber
      )
      return phoneNumberObj?.g?.number?.international
    },
    getPhoneNumberCountry(phoneNumber) {
      if (!phoneNumber) return ''
      if (
        (this.isPhishingScenario || this.isSmishing || this.isQuishing) &&
        !this.phoneNumbers.length
      )
        return 'EN'
      const phoneNumberObj = this.createPhoneNumberObj(
        this.isPhishingScenario || this.isSmishing || this.isQuishing
          ? typeof phoneNumber === 'object'
            ? phoneNumber.text
            : this.phoneNumbers.find(
                (phoneNumberWrapper) => phoneNumberWrapper.value === phoneNumber
              )?.text
          : phoneNumber
      )
      const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' })
      return regionNamesInEnglish.of(phoneNumberObj?.getRegionCode())
    },
    createPhoneNumberObj(phoneNumber = '') {
      return new PhoneNumber(phoneNumber)
    },
    handleInputChange(val) {
      this.$emit('input', val)
      this.$emit(
        'update:callerPhoneNumber',
        this.phoneNumbers.find((phoneNumberWrapper) => phoneNumberWrapper.value === val)?.text
      )
    }
  }
}
</script>
