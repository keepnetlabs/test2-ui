<template>
  <v-container class="add-in-settings" fluid id="add-in-settings" tag="div">
    <v-list-item class="pl-0 add-in-settings__list-item" v-if="showHeader">
      <v-list-item-content>
        <v-list-item-title class="add-in-settings__title">
          Add-in Settings
        </v-list-item-title>
        <v-list-item-subtitle class="add-in-settings__subtitle mb-6">
          General add-in settings
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-form lazy-validation ref="refForm" v-model="isValid">
      <v-list-item class="px-0 add-in-settings__list-item mt-0">
        <v-list-item-content>
          <label class="add-in-settings__label" for="add-in-text">Add-in Name</label>
          <v-text-field
            :rules="[
              (v) => validations.maxLength(v, 50, 'Investigation Name must between 1-50 characters')
            ]"
            class="k-textfield mt-2"
            dense
            id="add-in-text"
            outlined
            placeholder="Suspicious E-Mail Reporter"
            required
            v-model="formValues.addInName"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label" for="company-text">Brand Name</label>
          <v-text-field
            :rules="[
              (v) => validations.maxLength(v, 50, 'Brand Name must between 1-50 characters')
            ]"
            class="k-textfield mt-2"
            dense
            id="company-text"
            outlined
            placeholder="Company Name"
            required
            v-model="formValues.brandName"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label">Add-in Logo</label>
          <div class="add-in-settings__subtitle">
            Recommended size is 60x60px
          </div>
          <v-btn @click="onBtnSelectFileClick" class="btn-select-file mt-2" rounded>
            SELECT FILE
            <input
              :value="formValues.hiddenFileUploadValue"
              @change="onFileChanged"
              accept="image/gif, image/jpeg, image/png"
              class="d-none"
              ref="uploader"
              type="file"
            />
          </v-btn>
        </v-list-item-content>
      </v-list-item>

      <v-list-item
        class="px-0 add-in-settings__list-item mt-6"
        :class="[inModal ? 'mt-5' : 'mt-6']"
      >
        <v-list-item-content>
          <label class="add-in-settings__label" for="alertbox-text">AlertBox Heading</label>
          <v-text-field
            :rules="[
              (v) => validations.maxLength(v, 150, 'Alertbox Heading must between 1-150 characters')
            ]"
            class="k-textfield mt-2"
            dense
            id="alertbox-text"
            outlined
            placeholder="Phishing Reporter"
            required
            v-model="formValues.msgBoxTitle"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 mt-n4 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label" for="alertbox-text">Report Warning</label>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content class="show-warning" :class="[inModal ? 'show-warning-margin' : '']">
          <v-checkbox
            color="#2196f3"
            label="Show Warning"
            class="k-checkbox"
            v-model="formValues.isConfirmationBeforeAnalysis"
          ></v-checkbox>
          <template v-if="formValues.isConfirmationBeforeAnalysis">
            <transition appear name="fade">
              <div class="report-warning__container">
                <span class="report-warning__message mt-4">Report Warning Message</span>
                <v-text-field
                  class="k-textfield mt-2 report-warning__textfield"
                  dense
                  id="alertbox-text"
                  outlined
                  placeholder="Report this email?"
                  required
                  v-model="formValues.analysisConfirmationMessage"
                ></v-text-field>
              </div>
            </transition>
          </template>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label" for="reported-text">Reported Message</label>
          <v-text-field
            class="k-textfield mt-2"
            dense
            id="reported-text"
            outlined
            placeholder="Thank you for reporting this email. Our organisation is more secure thanks to you."
            required
            v-model="formValues.analysisThankYouMessage"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label" for="delete-text">Delete Warning</label>
          <v-text-field
            class="k-textfield mt-2"
            dense
            id="delete-text"
            outlined
            placeholder="Do you wish to delete original email?"
            required
            v-model="formValues.analysisEmailDeleteMessage"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label" for="warning-text">Warning Label</label>
          <v-text-field
            :rules="[
              (v) => validations.maxLength(v, 50, 'Warning Label must between 1-150 characters')
            ]"
            class="k-textfield mt-2"
            dense
            id="alertbox-text"
            outlined
            placeholder="Suspicious E-Mail"
            required
            v-model="formValues.warningLabel"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <div class="add-in-settings__footer mt-4 mb-2" v-if="showFooter">
        <v-btn @click="submit" class="white--text btn-util" color="#2196f3" rounded>
          SAVE CHANGES
        </v-btn>
        <v-btn class="white--text btn-util ml-3" color="#00bcd4" rounded>
          <v-icon left>mdi-download</v-icon>
          Save and Download Add-in
        </v-btn>
        <a
          class="add-in-settings__link"
          href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
          target="_blank"
        >
          Installation and configuration guide
        </a>
      </div>
    </v-form>
  </v-container>
</template>

<script>
import { maxLength } from '../../../utils/validations'

export default {
  name: 'AddinSettings',
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: null
    },
    inModal: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      isValid: false,
      formValues: {
        addInName: '',
        brandName: '',
        file: '',
        msgBoxTitle: '',
        isConfirmationBeforeAnalysis: false,
        analysisConfirmationMessage: '',
        analysisThankYouMessage: '',
        analysisEmailDeleteMessage: '',
        warningLabel: '',
        hiddenFileUploadValue: ''
      },
      marginStatus: true,
      validations: {
        maxLength
      }
    }
  },
  methods: {
    onBtnSelectFileClick(e) {
      this.$refs.uploader.click()
    },
    onFileChanged(e) {
      this.formValues.file = e.target.files[0]
    },
    submit() {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', this.formValues)
        return this.formValues
      } else {
        return false
      }
    },
    getFormValues() {
      if (this.$refs.refForm.validate()) {
        return this.formValues
      } else {
        return false
      }
    }
  },
  created() {
    //If has a report
    if (this.formData) {
      const {
        addInName,
        brandName,
        warningLabel,
        msgBoxTitle,
        isConfirmationBeforeAnalysis,
        analysisConfirmationMessage,
        analysisThankYouMessage,
        analysisEmailDeleteMessage
      } = this.formData
      this.formValues.addInName = addInName
      this.formValues.brandName = brandName
      this.formValues.warningLabel = warningLabel
      this.formValues.msgBoxTitle = msgBoxTitle
      this.formValues.isConfirmationBeforeAnalysis = isConfirmationBeforeAnalysis
      this.formValues.analysisConfirmationMessage = analysisConfirmationMessage
      this.formValues.analysisThankYouMessage = analysisThankYouMessage
      this.formValues.analysisEmailDeleteMessage = analysisEmailDeleteMessage
    } else {
      this.formValues.brandName = localStorage.getItem('companyName')
      this.formValues.addInName = 'Suspicious E-Mail Reporter'
      this.formValues.msgBoxTitle = 'Phishing Reporter'
      this.formValues.analysisConfirmationMessage = 'Report this email?'
      this.formValues.isConfirmationBeforeAnalysis = true
      this.formValues.analysisEmailDeleteMessage = 'Do you wish to delete original email?'
      this.formValues.analysisThankYouMessage =
        'Thank you for reporting this email. Our organisation is more secure thanks to you.'
      this.formValues.warningLabel = 'Suspicious E-Mail'
    }
  }
}
</script>

<style lang="scss">
.add-in {
  &-settings {
    &__label {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    &__title {
      font-size: 24px;
      line-height: 1.29;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    &__subtitle {
      font-size: 14px;
      line-height: 1.5;
      letter-spacing: normal;
      margin-top: 2px;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    &__link {
      font-family: 'Open Sans', sans-serif !important;
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      font-stretch: normal;
      font-style: normal;
      line-height: 1.71;
      letter-spacing: normal;
      color: #2196f3;
      flex-basis: 100%;
      text-align: center;
      display: flex;
      justify-content: flex-end;
    }

    &__footer {
      display: flex;
      align-items: center;
      @media (max-width: 768px) {
        flex-direction: column;
      }
    }

    &__list-item {
      max-width: 554px;
      margin-top: -4px;
      &.v-list-item {
        padding: 0 !important;

        &--active {
          border-left: none !important;
        }
      }
      .v-list-item__content {
        padding: 0 !important;
      }
    }

    &__list-group {
      .v-list-group__header {
        max-width: 554px;
        padding: 0 !important;
        border-left: none !important;
      }
      .v-list-group__items {
        .v-list-item {
          padding-left: 0 !important;
          overflow: visible;
        }
        .v-list-item__content {
          padding: 0 !important;
          overflow: visible;
        }
      }
    }
    .v-list-item__content > *:not(:last-child) {
      margin-bottom: 0;
    }
  }
}

.btn-select-file {
  max-width: 111px !important;
  max-height: 36px !important;
  border-radius: 18px !important;
  font-family: 'Open Sans', sans-serif !important;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
  background-color: #2196f3 !important;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: center;
  color: #ffffff !important;
}

.report-warning {
  &__container {
    margin-top: -20px;
    margin-left: 32px;
    display: flex;
    @media (max-width: 768px) {
      flex-direction: column;
      margin-left: 0;
    }
  }
  &__message {
    opacity: 0.7;
    font-family: 'Open Sans', sans-serif !important;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.5;
    letter-spacing: normal;
    color: rgba(0, 0, 0, 0.87);
    display: inline-block;
    margin-right: 21px;
  }
  &__textfield {
    max-width: 365px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s !important;
}

.fade-enter-active {
  transition: all 0.3s ease;
}

.fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0 !important;
}

.btn-util {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.71;
  letter-spacing: normal;
  color: #ffffff;
  max-height: 36px;

  @media (max-width: 768px) {
    margin: 8px 0;
  }

  .v-icon {
    font-size: 19px;
  }
}

.margin-status {
  margin-top: -7px;
  margin-bottom: 22px;
}
.show-warning {
  overflow: visible;
}
</style>
