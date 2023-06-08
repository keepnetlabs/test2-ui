<template>
  <FormGroup has-hint class="mt-6" :title="title" :sub-title="subTitle">
    <KSelect
      :value="value"
      outlined
      dense
      persistent-hint
      hint="*Required"
      placeholder="Select a phone number"
      :items="getPhoneNumbers"
      :slots="{ item: true }"
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
    </KSelect>
  </FormGroup>
</template>

<script>
import FormGroup from '@/components/SmallComponents/FormGroup.vue'
import KSelect from '@/components/Common/Inputs/KSelect.vue'
import { getPhoneNumbers } from '@/api/vishing'
import PhoneNumber from 'awesome-phonenumber'
import * as Validations from '@/utils/validations'
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
    }
  },
  data() {
    return {
      Validations,
      phoneNumbers: []
    }
  },
  mounted() {
    this.callForPhoneNumbers()
  },
  computed: {
    getPhoneNumbers() {
      if (this.defaultPhoneNumbers?.length) {
        return this.defaultPhoneNumbers
      }

      return this.phoneNumbers
    }
  },
  methods: {
    callForPhoneNumbers() {
      getPhoneNumbers().then((response) => {
        const { data } = response
        if (!data) return
        this.phoneNumbers = data.map((phoneNumber) => this.getPhoneNumberFormatted(phoneNumber))
      })
    },
    getPhoneNumberFormatted(phoneNumber = '') {
      const phoneNumberObj = this.createPhoneNumberObj(phoneNumber)
      return phoneNumberObj?.g?.number?.international
    },
    getPhoneNumberCountry(phoneNumber = '') {
      const phoneNumberObj = this.createPhoneNumberObj(phoneNumber)
      const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' })
      return regionNamesInEnglish.of(phoneNumberObj?.getRegionCode())
    },
    createPhoneNumberObj(phoneNumber = '') {
      return new PhoneNumber(phoneNumber)
    },
    handleInputChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>
