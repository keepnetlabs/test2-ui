<template>
  <div class="data-container-with-search-item" :style="isEdit && { backgroundColor: 'white' }">
    <div class="data-container-with-search-item__text">
      <span v-if="!isEdit" :style="!isValid && { color: '#B83A3A' }">{{ value }}</span>
      <v-form v-else ref="refForm">
        <v-text-field
          v-model="textFieldValue"
          ref="refTextField"
          id="input--saml-settings-domain-to-add"
          dense
          hide-details
          :class="[!isValid && 'data-container-with-search-item__text-field--error']"
          :placeholder="textFieldPlaceholder"
          :rules="textFieldRules"
        ></v-text-field>
      </v-form>
    </div>
    <div v-if="!isEdit" class="data-container-with-search-item__actions">
      <v-tooltip v-if="!isValid" bottom opacity="1">
        <template #activator="{ on }">
          <v-icon v-on="on" class="mr-8" color="#F56C6C" style="font-size: 24px !important;"
            >mdi-alert-circle</v-icon
          >
        </template>
        This Domain is not valid!
      </v-tooltip>
      <v-btn icon @click="handleEditClick">
        <v-icon> mdi-pencil</v-icon>
      </v-btn>
      <v-btn icon class="ml-2" @click="$emit('on-delete', value)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
    <div v-else class="d-flex download-buttons flex-row flex-wrap justify-end">
      <v-tooltip v-if="!isValid" bottom opacity="1">
        <template #activator="{ on }">
          <v-icon v-on="on" class="mr-8" color="#F56C6C">mdi-alert-circle</v-icon>
        </template>
        {{ textFieldErrorMessage }}
      </v-tooltip>
      <v-btn
        text
        color="#2196f3"
        :disabled="!isValid"
        :class="[
          'k-dialog__button mr-5',
          { 'data-container-with-search-item__button--error': !isValid }
        ]"
        @click="handleActionButtonClick"
      >
        {{ labels.Save }}
      </v-btn>
      <v-btn text color="red" class="k-dialog__button mr-6" @click="handleCancelClick">
        {{ labels.Cancel }}
      </v-btn>
    </div>
  </div>
</template>

<script>
import * as validations from '@/utils/validations'
import labels from '@/model/constants/labels'
export default {
  name: 'DataContainerWithSearchItem',
  props: {
    value: {
      type: String
    },
    index: {
      type: Number
    },
    isEdit: {
      type: Boolean
    },
    textFieldPlaceholder: {
      type: String,
      default: 'Enter Domain name'
    },
    textFieldErrorMessage: {
      type: String,
      default: 'This Domain is not valid!'
    },
    textFieldRules: {
      type: Array,
      default: () => [
        (v) => validations.required(v, labels.Required),
        (v) => validations.maxLength(v, 256, labels.getMaxLengthMessage(labels.Domain, 256)),
        (v) => validations.domain(v, labels.InvalidDomainName)
      ]
    }
  },
  data() {
    return {
      textFieldValue: this.value,
      validations,
      labels
    }
  },
  computed: {
    isValid() {
      const comparator = this.isEdit ? this.textFieldValue : this.value
      return this.textFieldRules.every((func) => func(comparator) === true)
    }
  },
  methods: {
    handleActionButtonClick() {
      if (this.$refs.refForm.validate()) {
        this.$emit('input', this.textFieldValue, this.value, this.index)
      }
    },
    handleCancelClick() {
      this.changeIsEdit()
      this.textFieldValue = this.value
    },
    handleEditClick() {
      this.changeIsEdit(true)
      this.$nextTick(() => {
        this.$refs.refTextField.focus()
      })
    },
    changeIsEdit(val = false) {
      this.$emit('update:isEdit', val)
    }
  }
}
</script>

<style lang="scss">
.data-container-with-search-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;
  border-top: 1px solid #e0e0e0;
  &__text {
    font-size: 12px;
    font-style: normal;
    font-weight: normal;
    color: #383b41;
    line-height: 18px;
    padding: 0 16px;
    flex-grow: 1;
  }
  &__actions {
    margin-right: 24px;
    .v-icon {
      font-size: 20px !important;
    }
  }

  .v-input {
    margin-top: 0;
  }
  .v-text-field__slot input {
    font-size: 12px !important;
    line-height: 18px;
  }
  .theme--light.v-text-field > .v-input__control {
    & > .v-input__slot:before,
    .v-input__slot:after {
      visibility: hidden !important;
    }
  }
  &__text-field--error .v-text-field__slot input {
    color: #b83a3a !important;
  }
  &__button--error.v-btn.v-btn--disabled {
    font-weight: 600;
    font-size: 14px;
    color: #757575 !important;
  }
}
#app .data-container-with-search-item__text-field--error .v-text-field__slot input {
  color: #b83a3a !important;
}
</style>
