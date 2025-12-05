<template>
  <div class="input-manager-wrapper">
    <div :class="['input-manager', { 'input-manager--error': hasPartialFields }]">
      <v-text-field
        v-model.trim="managerFirstName"
        outlined
        dense
        label="First Name"
        placeholder="Enter manager first name"
        persistent-placeholder
        hide-details
        class="input-manager__field"
        id="input--target-user-manager-first-name"
        @input="handleFirstNameInput"
      />
      <v-text-field
        v-model.trim="managerLastName"
        outlined
        dense
        label="Last Name"
        placeholder="Enter manager last name"
        persistent-placeholder
        hide-details
        class="input-manager__field"
        id="input--target-user-manager-last-name"
        @input="handleLastNameInput"
      />
      <v-text-field
        v-model.trim="managerEmail"
        outlined
        dense
        label="Email"
        placeholder="Enter manager email address"
        persistent-placeholder
        hide-details
        class="input-manager__field"
        id="input--target-user-manager-email"
        @input="handleEmailInput"
      />
    </div>
    <div v-if="hasPartialFields" class="input-manager-wrapper__error-message">
      <span class="input-manager-wrapper__error-text">
        Please fill in all manager fields or leave them all blank.
      </span>
    </div>
  </div>
</template>

<script>
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
      managerEmail: this.value?.managerEmail || ''
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
      return !this.hasPartialFields
    }
  },
  methods: {
    handleFirstNameInput(value) {
      this.managerFirstName = value
      this.emitChange()
    },
    handleLastNameInput(value) {
      this.managerLastName = value
      this.emitChange()
    },
    handleEmailInput(value) {
      this.managerEmail = value
      this.emitChange()
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

<style scoped lang="scss">
.input-manager-wrapper {
  &__error-message {
    margin-top: 4px;
  }

  &__error-text {
    font-size: 9px;
    color: #f56c6c;
    padding-left: 12px;
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
