<template>
  <FormGroup has-hint class="mt-6" :title="title" :sub-title="subTitle">
    <KSelect
      :value="value"
      outlined
      dense
      persistent-hint
      hint="*Required"
      placeholder="Select a phone number"
      :items="phoneNumbers"
      :slots="{ item: true, append: true }"
      :rules="[(v) => Validations.required(v)]"
      @input="handleInputChange"
    >
      <template #item="{item}">
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
import { getPhishingScenariosPhoneNumber } from '../../../api/phishingsimulator'
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
    selectFirstItem: {
      type: Boolean,
      default: false
    },
    isPhishingScenario: {
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
  created() {
    this.callForPhoneNumbers()
  },
  methods: {
    callForPhoneNumbers() {
      if (this.isPhishingScenario) {
        getPhishingScenariosPhoneNumber().then((response) => {
          const { data: { data = [] } = {} } = response
          if (!data) return
          this.phoneNumbers = data.map((phoneNumberWrapper) => {
            return {
              text: this.getPhoneNumberFormatted({ text: phoneNumberWrapper.phoneNumber }),
              value: phoneNumberWrapper.resourceId
            }
          })
          if (!this.value && this.selectFirstItem)
            this.handleInputChange(this.phoneNumbers[0].value)
        })
      } else {
        getPhoneNumbers().then((response) => {
          const { data } = response
          if (!data) return
          this.phoneNumbers = data.map((phoneNumber) => this.getPhoneNumberFormatted(phoneNumber))
          if (!this.value && this.selectFirstItem) this.handleInputChange(this.phoneNumbers[0])
        })
      }
    },
    getPhoneNumberFormatted(phoneNumber) {
      const phoneNumberObj = this.createPhoneNumberObj(
        this.isPhishingScenario ? phoneNumber.text : phoneNumber
      )
      return phoneNumberObj?.g?.number?.international
    },
    getPhoneNumberCountry(phoneNumber) {
      if (!phoneNumber) return
      const phoneNumberObj = this.createPhoneNumberObj(
        this.isPhishingScenario
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
