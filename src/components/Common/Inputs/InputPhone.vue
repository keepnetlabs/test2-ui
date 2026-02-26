<template>
  <div style="margin-bottom: 21px;">
    <vue-tel-input
      :value="value"
      validCharactersOnly
      defaultCountry="GB"
      :inputOptions="{
        showDialCode: true
      }"
      :maxLen="maxLen"
      mode="international"
      :class="['k-tel-input', !isPhoneNumberValid && 'phone-number-invalid']"
      ref="refTelInput"
      @blur="handleTelBlur"
      @input="handleTelChange"
    />
    <div class="v-text-field__details checkbox-error" v-if="!isPhoneNumberValid">
      <transition appear name="bounce">
        <div class="v-messages theme--light error--text" role="alert">
          <div class="v-messages__wrapper">
            <div class="v-messages__message" style="padding-left: 10px;">
              {{ getErrorText }}
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="v-messages theme--light" v-if="isPhoneNumberValid && this.required">
      <div class="v-messages__wrapper">
        <div class="v-messages__message" style="padding-left: 12px; font-size: 9px;">
          *Required
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { VueTelInput } from 'vue-tel-input'
import labels from '@/model/constants/labels'
export default {
  name: 'InputPhone',
  components: {
    VueTelInput
  },
  props: {
    value: {
      type: String
    },
    required: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isPhoneNumberValid: true,
      maxLen: 17,
      regionCode: 'GB'
    }
  },
  computed: {
    getErrorText() {
      if (this.value) {
        return labels.InvalidPhoneNumber
      }

      if (this.required) {
        return 'Required'
      }

      return ''
    }
  },
  watch: {
    value() {
      this.validatePhoneNumber()
    }
  },
  methods: {
    handleTelChange(newVal) {
      if (newVal?.split('+')?.length > 2) {
        this.setOldValueBySplitter('+', newVal)
      } else if (this.isRegionGBOrTRAndHasHyphen(newVal)) {
        this.setOldValueBySplitter('-', newVal)
      } else if (
        newVal?.length > 12 &&
        this.$refs.refTelInput.phoneObject.possibility === 'too-long'
      ) {
        if (this.regionCode === this.$refs.refTelInput.phoneObject.regionCode) {
          this.$refs.refTelInput.phone = this.value
          this.$emit('input', this.value)
        } else {
          this.$refs.refTelInput.phone = newVal
          this.$emit('input', newVal)
        }
      } else if (
        //CHINA BUG
        newVal?.length === 17 &&
        this.$refs.refTelInput.phoneObject.regionCode === 'CN' &&
        newVal[4] !== '1'
      ) {
        this.setValueSubStr(16, newVal)
      } else if (newVal?.length === 16 && this.$refs.refTelInput.phoneObject.regionCode === 'PL') {
        this.setValueSubStr(15, newVal)
      } else if (newVal?.length === 17 && this.$refs.refTelInput.phoneObject.regionCode === 'SE') {
        this.setValueSubStr(16, newVal)
      } else {
        this.$refs.refTelInput.phone = newVal
        this.$emit('input', newVal)
      }
    },
    isRegionGBOrTRAndHasHyphen(val) {
      return (
        (this.$refs.refTelInput.phoneObject.regionCode === 'GB' ||
          this.$refs.refTelInput.phoneObject.regionCode === 'TR') &&
        val.includes('-')
      )
    },
    handleTelBlur() {
      this.validatePhoneNumber()
    },
    setOldValueBySplitter(splitter = '-', newVal = '') {
      if (this.value) {
        this.$refs.refTelInput.phone = this.value
        this.$emit('input', this.value)
      } else {
        const splittedVal = newVal?.split(splitter)?.[0]
        this.$refs.refTelInput.phone = splittedVal
        this.$emit('input', splittedVal)
      }
    },
    setValueSubStr(length, newVal) {
      const val = newVal ? newVal.substring(0, length) : ''
      this.$refs.refTelInput.phone = val
      this.$emit('input', val)
    },
    validatePhoneNumber() {
      this.$nextTick(() => {
        try {
          if (!this.$refs.refTelInput) {
            return
          }
          const { phoneObject } = this.$refs.refTelInput
          if (!phoneObject) {
            return
          }
          this.regionCode = phoneObject.regionCode
          if (!this.required && !this.value) {
            this.isPhoneNumberValid = true
            return
          }
          this.isPhoneNumberValid = phoneObject.isValid
        } catch (e) {
          this.isPhoneNumberValid = false
        }
      })
    }
  }
}
</script>
