<template>
  <div class="data-container-with-search-item" :style="getStyle">
    <div class="data-container-with-search-item__text">
      <span v-if="!isEdit" :style="!isValid && { color: '#B83A3A' }">{{ value }}</span>
      <v-form v-else ref="refForm" onSubmit="return false;">
        <v-text-field
          ref="refTextField"
          id="input--saml-settings-domain-to-add"
          dense
          hide-details
          :value="textFieldValue"
          :class="[!isValid && 'data-container-with-search-item__text-field--error']"
          :placeholder="textFieldPlaceholder"
          :rules="textFieldRules"
          @input="handleTextFieldChange"
        ></v-text-field>
      </v-form>
    </div>
    <div v-if="!isEdit" class="data-container-with-search-item__actions">
      <v-tooltip v-if="!isValid && isEditable" bottom opacity="1">
        <template #activator="{ on }">
          <v-icon v-on="on" class="mr-2" color="#F56C6C" style="font-size: 24px !important;"
            >mdi-alert-circle</v-icon
          >
        </template>
        This Domain is not valid!
      </v-tooltip>
      <v-btn v-if="isEditable" icon @click="handleEditClick">
        <v-icon> mdi-pencil</v-icon>
      </v-btn>
      <v-btn v-if="isEditable" icon class="ml-2" @click="$emit('on-delete', value)">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-tooltip v-if="!isEditable" right>
        <template v-slot:activator="{ on }">
          <div
            v-if="!isEditable"
            v-on="on"
            class="d-flex justify-center align-center v-btn--icon v-size--default"
          >
            <v-icon> mdi-information-outline </v-icon>
          </div>
        </template>
        <span>{{ disabledTooltipText }}</span>
      </v-tooltip>
    </div>
    <div v-else class="d-flex download-buttons flex-row flex-wrap justify-end">
      <v-tooltip v-if="!isValid" bottom opacity="1">
        <template #activator="{ on }">
          <v-icon v-on="on" class="mr-2" color="#F56C6C">mdi-alert-circle</v-icon>
        </template>
        {{ getErrorMessage }}
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
    isEditable: {
      type: Boolean,
      default: true
    },
    disabledTooltipText: {
      type: String,
      default: 'You cannot edit or delete this record.'
    },
    itemHeight: {
      type: String,
      default: '48'
    },
    textFieldPlaceholder: {
      type: String,
      default: 'Enter Domain name'
    },
    textFieldErrorMessage: {
      type: String,
      default: 'This Domain is not valid!'
    },
    showValidationErrorMesssage: {
      type: Boolean,
      default: false
    },
    textFieldDefaultValue: {
      type: String
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
      textFieldValue: this.textFieldDefaultValue || this.value,
      validations,
      labels
    }
  },
  computed: {
    getErrorMessage() {
      const comparator = this.isEdit ? this.textFieldValue : this.value

      if (this.showValidationErrorMesssage) {
        return this.getValidationErrorMessage(comparator)
      }

      return this.textFieldErrorMessage
    },
    isValid() {
      if (!this.isEditable) return true
      const comparator = this.isEdit ? this.textFieldValue : this.value
      return comparator && this.textFieldRules.every((func) => func(comparator) === true)
    },
    getStyle() {
      const style = {
        height: `${this.itemHeight}px`
      }
      if (!this.isValid) {
        style.backgroundColor = '#FEF7F7'
      }
      if (this.isEdit) {
        style.backgroundColor = 'white'
      }
      return style
    }
  },
  methods: {
    getValidationErrorMessage(comparator) {
      let message = ''
      for (const rule of this.textFieldRules) {
        const valid = rule(comparator)
        if (valid === true) continue
        else {
          message = valid
          break
        }
      }
      return message
    },
    handleActionButtonClick() {
      if (this.$refs.refForm.validate()) {
        this.$emit('input', this.textFieldValue, this.value, this.index)
      }
    },
    handleTextFieldChange(val) {
      this.textFieldValue = val
      this.$emit('update:text-field-default-value', val)
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
      this.$emit('update:is-edit', val)
    }
  }
}
</script>
