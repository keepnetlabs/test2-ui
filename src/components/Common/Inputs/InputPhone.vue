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
    <div class="v-messages theme--light" v-else>
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
  props: ['value'],
  data() {
    return {
      isPhoneNumberValid: true,
      maxLen: 17
    }
  },
  computed: {
    getErrorText() {
      if (this.value) {
        return labels.InvalidPhoneNumber
      }
      return 'Required'
    }
  },
  watch: {
    value() {
      this.validatePhoneNumber()
    }
  },
  methods: {
    handleTelChange(newVal) {
      if (newVal.length > 12 && this.$refs.refTelInput.phoneObject.possibility === 'too-long') {
        this.$refs.refTelInput.phone = this.value
        this.$emit('input', this.value)
      } else if (
        //CHINA BUG
        newVal.length === 17 &&
        this.$refs.refTelInput.phoneObject.regionCode === 'CN' &&
        newVal[4] !== '1'
      ) {
        const val = newVal.substring(0, 16)
        this.$refs.refTelInput.phone = val
        this.$emit('input', val)
      } else {
        this.$refs.refTelInput.phone = newVal
        this.$emit('input', newVal)
      }
    },
    handleTelBlur() {
      this.validatePhoneNumber()
    },
    validatePhoneNumber() {
      this.$nextTick(() => {
        this.isPhoneNumberValid = this.$refs.refTelInput.phoneObject.isValid
      })
    }
  }
}
</script>
