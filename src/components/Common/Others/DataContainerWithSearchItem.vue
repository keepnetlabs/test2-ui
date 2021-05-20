<template>
  <div class="data-container-with-search-item" :style="isEdit && { backgroundColor: 'white' }">
    <div class="data-container-with-search-item__text">
      <span v-if="!isEdit" :style="!isValid && { color: '#B83A3A' }">{{ value }}</span>
      <v-form v-else ref="refForm">
        <v-text-field
          v-model="textFieldValue"
          id="input--saml-settings-domain-to-add"
          :placeholder="textFieldPlaceholder"
          dense
          hide-details
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
        This Domain is not valid!
      </v-tooltip>
      <v-btn
        text
        color="#2196f3"
        class="k-dialog__button mr-5"
        :disabled="!isValid"
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
    textFieldPlaceholder: {
      type: String,
      default: 'Enter Domain name'
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
      isEdit: false,
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
        this.$emit('input', this.textFieldValue)
        this.isEdit = false
      }
    },
    handleCancelClick() {
      this.isEdit = false
    },
    handleEditClick() {
      this.isEdit = true
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
}
</style>
