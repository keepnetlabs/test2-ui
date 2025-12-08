<template>
  <div class="input-manager-wrapper">
    <div
      :class="['input-manager', { 'input-manager--error': hasPartialFields || !allFieldsValid }]"
    >
      <v-text-field
        ref="firstNameField"
        v-model.trim="managerFirstName"
        outlined
        dense
        label="First Name"
        placeholder="Enter manager first name"
        persistent-placeholder
        :hide-details="!hasAnyManagerField || firstNameValid"
        :rules="firstNameRules"
        class="input-manager__field"
        id="input--target-user-manager-first-name"
        @input="handleFirstNameInput"
      />
      <v-text-field
        ref="lastNameField"
        v-model.trim="managerLastName"
        outlined
        dense
        label="Last Name"
        placeholder="Enter manager last name"
        persistent-placeholder
        :hide-details="!hasAnyManagerField || lastNameValid"
        :rules="lastNameRules"
        class="input-manager__field"
        id="input--target-user-manager-last-name"
        @input="handleLastNameInput"
      />
      <v-text-field
        ref="emailField"
        v-model.trim="managerEmail"
        outlined
        dense
        label="Email"
        placeholder="Enter manager email address"
        persistent-placeholder
        :hide-details="!hasAnyManagerField || emailValid"
        :rules="emailRules"
        class="input-manager__field"
        id="input--target-user-manager-email"
        @input="handleEmailInput"
      />
    </div>
    <div v-if="hasPartialFields || !allFieldsValid" class="input-manager-wrapper__error-message">
      <span class="input-manager-wrapper__error-text">
        Please fill in all manager fields or leave them all blank.
      </span>
    </div>
  </div>
</template>

<script>
import * as Validations from '@/utils/validations'
import labels from '@/model/constants/labels'

export default {
  name: 'InputManager',
  props: {
    value: {
      type: Object,
      default: () => ({
        managerFirstName: '',
        managerLastName: '',
        managerEmail: ''
      })
    }
  },
  data() {
    return {
      managerFirstName: this.value?.managerFirstName || '',
      managerLastName: this.value?.managerLastName || '',
      managerEmail: this.value?.managerEmail || '',
      firstNameValid: true,
      lastNameValid: true,
      emailValid: true
    }
  },
  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(newVal) {
        if (newVal && typeof newVal === 'object') {
          this.managerFirstName = newVal.managerFirstName || ''
          this.managerLastName = newVal.managerLastName || ''
          this.managerEmail = newVal.managerEmail || ''
        }
      }
    }
  },
  computed: {
    hasAnyManagerField() {
      return !!(this.managerFirstName || this.managerLastName || this.managerEmail)
    },
    allFieldsFilled() {
      return !!(this.managerFirstName && this.managerLastName && this.managerEmail)
    },
    hasPartialFields() {
      return this.hasAnyManagerField && !this.allFieldsFilled
    },
    isValid() {
      return !this.hasPartialFields && this.allFieldsValid
    },
    allFieldsValid() {
      // If no fields are filled, validation passes
      if (!this.hasAnyManagerField) {
        return true
      }
      // If any field is filled, all must be valid
      return this.firstNameValid && this.lastNameValid && this.emailValid
    },
    firstNameRules() {
      const rules = [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) =>
          Validations.maxLength(v, 40, labels.getMaxLengthMessage(labels.FirstNameSecondLower, 40))
      ]
      // Add required rule if any field is filled
      if (this.hasAnyManagerField) {
        rules.unshift((v) => Validations.required(v, labels.Required))
      }
      return rules
    },
    lastNameRules() {
      const rules = [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) =>
          Validations.maxLength(
            v,
            40,
            labels.getMaxLengthMessage(labels.LastNameSecondLower || labels.LastName, 40)
          )
      ]
      // Add required rule if any field is filled
      if (this.hasAnyManagerField) {
        rules.unshift((v) => Validations.required(v, labels.Required))
      }
      return rules
    },
    emailRules() {
      const rules = [
        (v) => Validations.startsWithSpace(v, labels.CannotStartWithSpace),
        (v) => Validations.email(v, labels.InvalidEmailAddress),
        (v) => Validations.maxLength(v, 320, labels.getMaxLengthMessage(labels.Email, 320)),
        (v) => {
          if (Validations.email(v)) {
            return Validations.controlEmailLength(v) || labels.InvalidEmailAddress
          }
          return false
        }
      ]
      // Add required rule if any field is filled
      if (this.hasAnyManagerField) {
        rules.unshift((v) => Validations.required(v, labels.Required))
      }
      return rules
    }
  },
  mounted() {
    // Validate fields on mount if any field is filled
    if (this.hasAnyManagerField) {
      this.validateFields()
    }
  },
  methods: {
    handleFirstNameInput(value) {
      this.managerFirstName = value
      this.validateFields()
      this.emitChange()
    },
    handleLastNameInput(value) {
      this.managerLastName = value
      this.validateFields()
      this.emitChange()
    },
    handleEmailInput(value) {
      this.managerEmail = value
      this.validateFields()
      this.emitChange()
    },
    validateFields() {
      this.$nextTick(() => {
        if (this.$refs.firstNameField) {
          this.firstNameValid = this.$refs.firstNameField.validate()
        }
        if (this.$refs.lastNameField) {
          this.lastNameValid = this.$refs.lastNameField.validate()
        }
        if (this.$refs.emailField) {
          this.emailValid = this.$refs.emailField.validate()
        }
      })
    },
    emitChange() {
      this.$emit('input', {
        managerFirstName: this.managerFirstName,
        managerLastName: this.managerLastName,
        managerEmail: this.managerEmail
      })
    }
  }
}
</script>

<style lang="scss">
.input-manager-wrapper {
  &__error-message {
    margin-top: 4px;
  }

  &__error-text {
    font-size: 9px;
    color: #f56c6c;
    padding-left: 12px;
  }

  .v-text-field__details {
    margin-bottom: 0 !important;
  }
}

.input-manager {
  border-radius: 8px;
  background-color: #f2f2f2;
  padding: 8px;
  border: 1px solid transparent;
  transition: border-color 0.2s;

  &--error {
    border-color: #f56c6c;
  }

  &__field:not(:last-child) {
    margin-bottom: 8px;
  }
}
</style>
