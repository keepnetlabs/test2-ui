<template>
  <KSelect
    :value="value"
    outlined
    dense
    persistent-hint
    hint="*Required"
    placeholder="Select a phone number"
    type="autocomplete"
    chips
    clearable
    :item-text="itemText"
    :item-value="itemValue"
    multiple
    small-chips
    deletable-chips
    required
    :items="getPhoneNumberItems"
    :slots="{ item: true, append: true }"
    :rules="[(v) => Validations.required(v), ...rules]"
    @input="handleInputChange"
  >
    <template #item="{ item }">
      <div :class="['mail-configuration-select-sources__item-container']">
        <v-checkbox
          v-if="isSmishing"
          hide-details
          color="#2196f3"
          class="mt-n1"
          :input-value="getSelectedPhoneNumbers.includes(item[itemText])"
        />
        <div class="mail-configuration-select-sources__item">
          <div class="mail-configuration-select-sources__item-left">
            {{ getPhoneNumberFormatted(item[itemText]) }}
          </div>
          <div class="mail-configuration-select-sources__item-right-platform">
            {{ getPhoneNumberCountry(item[itemText]) }}
          </div>
        </div>
      </div>
    </template>
  </KSelect>
</template>

<script>
import KSelect from '@/components/Common/Inputs/KSelect'
import { getPhoneNumbers } from '@/api/vishing'
import PhoneNumber from 'awesome-phonenumber'
import * as Validations from '@/utils/validations'
import { getPhishingScenariosPhoneNumber } from '@/api/phishingsimulator'
import { mapGetters } from 'vuex'
export default {
  name: 'InputPhoneNumberComboBox',
  components: { KSelect },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    itemText: {
      type: String,
      default: 'phoneNumber'
    },
    itemValue: {
      type: String,
      default: 'resourceId'
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
    callerPhoneNumber: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
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
    },
    getSelectedPhoneNumbers() {
      return this.getPhoneNumberItems
        .filter((pn) => this.value.includes(pn[this.itemValue]))
        .map((pn) => pn[this.itemText])
    }
  },
  mounted() {
    if (!this.isSmishing) this.callForPhoneNumbers()
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
        this.isPhishingScenario ? phoneNumber.phoneNumber : phoneNumber
      )
      return phoneNumberObj?.g?.number?.international
    },
    getPhoneNumberCountry(phoneNumber) {
      if (!phoneNumber) return ''
      if (this.isPhishingScenario && !this.phoneNumbers.length) return 'EN'
      const phoneNumberObj = this.createPhoneNumberObj(
        this.isPhishingScenario
          ? typeof phoneNumber === 'object'
            ? phoneNumber.phoneNumber
            : this.phoneNumbers.find(
                (phoneNumberWrapper) => phoneNumberWrapper.value === phoneNumber
              )?.phoneNumber
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
