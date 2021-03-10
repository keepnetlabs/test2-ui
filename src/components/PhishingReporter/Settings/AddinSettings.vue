<template>
  <v-container class="add-in-settings" fluid id="add-in-settings" tag="div">
    <version-history-modal
      :status="versionHistoryModalStatus"
      @changeVersionHistoryModalStatus="versionHistoryModalStatus = false"
      @handleHistoryRow="handleHistoryRow"
      v-if="versionHistoryModalStatus"
    />
    <reporter-version-modal
      :selected-version-row="selectedVersionRow"
      :status="reporterVersionModalStatus"
      @changeReporterVersionModalStatus="reporterVersionModalStatus = false"
      v-if="reporterVersionModalStatus"
    />
    <v-list-item
      class="pl-0 add-in-settings__list-item add-in-settings__header mt-0 mr-2"
      v-if="showHeader"
    >
      <v-list-item-content>
        <v-list-item-title class="add-in-settings__title">
          {{ labels.AddIn }} {{ labels.Settings }}
        </v-list-item-title>
        <v-list-item-subtitle class="add-in-settings__subtitle mb-6">
          {{ labels.General }} add-in {{ labels.Settings }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-content>
        <a
          href="https://doc.keepnetlabs.com/beta-modules/incident-responder#2-phishing-reporter"
          class="other-settings__link"
          target="_blank"
          v-if="showHeaderLink"
        >
          {{ labels.Installation }} {{ labels.And }} {{ labels.Configuration }} {{ labels.Guide }}
        </a>
      </v-list-item-content>
    </v-list-item>
    <v-form class="add-in-settings__form" lazy-validation ref="refForm" v-model="isValid">
      <v-list-item class="px-0 add-in-settings__list-item mt-0">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.AddIn }} {{ labels.Name }}</label>
          <v-text-field
            :rules="
              showForm
                ? [
                    (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Add-in name')),
                    (v) => validations.required(v, labels.Required)
                  ]
                : []
            "
            class="k-textfield mt-2"
            dense
            outlined
            placeholder="Enter an add-in name"
            :readonly="!showForm"
            v-model.trim="formValues.addInName"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.Brand }} {{ labels.Name }}</label>
          <v-text-field
            :rules="
              showForm
                ? [
                    (v) => validations.maxLength(v, 64, labels.getMaxLengthMessage('Brand name')),
                    (v) => validations.required(v, labels.Required)
                  ]
                : []
            "
            class="k-textfield mt-2"
            dense
            id="company-text"
            outlined
            placeholder="Enter a Company Name"
            :readonly="!showForm"
            v-model.trim="formValues.brandName"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item add-in-settings__file-upload">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.AddIn }} {{ labels.Logo }}</label>
          <div class="add-in-settings__subtitle mb-2">
            Recommended size is 60x60px
          </div>

          <k-file-upload
            hint="Only jpg, png, gif, bmp files. Max. file size 3MB"
            ref="refFileUpload"
            @inputFile="onFileChanged"
            :readonly="!showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="formValues.file"
        class="px-0 add-in-settings__list-item add-in-settings__logo-container"
      >
        <v-list-item-content>
          <div>
            <div class="add-in-settings__image-container">
              <img class="add-in-settings__image" :src="getImagePreview()" alt="logo-preview" />
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item add-in-settings__body-container mt-6">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.DialogBox }} {{ labels.Settings }}</label>
          <div class="add-in-settings__body-item mt-4">
            <label class="add-in-settings__list-item-header"
              >{{ labels.DialogBox }} {{ labels.Heading }}</label
            >
            <v-text-field
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          64,
                          labels.getMaxLengthMessage('Dialog box heading')
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
              class="k-textfield"
              dense
              id="alertbox-text"
              outlined
              placeholder="Enter a dialog box name"
              required
              v-model.trim="formValues.msgBoxTitle"
            ></v-text-field>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header">Confirm Button Label</label>
            <v-text-field
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          64,
                          labels.getMaxLengthMessage('Confirm button label')
                        ),
                      (v) => validations.required(v, 'Required')
                    ]
                  : []
              "
              :readonly="!showForm"
              class="k-textfield"
              dense
              outlined
              placeholder="Enter confirm button label"
              required
              v-model.trim="formValues.msgBoxBtnYesText"
            ></v-text-field>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header">No Button Label</label>
            <v-text-field
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(v, 64, labels.getMaxLengthMessage('No button label')),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
              class="k-textfield"
              dense
              outlined
              placeholder="Enter a no button label"
              required
              v-model.trim="formValues.msgBoxBtnNoText"
            ></v-text-field>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header">Cancel Button Label</label>
            <v-text-field
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          64,
                          labels.getMaxLengthMessage('Cancel button label')
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
              class="k-textfield"
              dense
              outlined
              placeholder="Enter cancel button label"
              required
              v-model.trim="formValues.msgBoxBtnCancelText"
            ></v-text-field>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header">Okay Button Label</label>
            <v-text-field
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          64,
                          labels.getMaxLengthMessage('Okay button label')
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
              class="k-textfield"
              dense
              outlined
              placeholder="Enter okay button label"
              required
              v-model.trim="formValues.msgBoxBtnOkText"
            ></v-text-field>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Instant Report Message</label
            >
            <v-textarea
              placeholder="Enter instant report message"
              outlined
              dense
              rows="2"
              no-resize
              height="80"
              v-model.trim="formValues.analysisThankYouMessage"
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          256,
                          labels.getMaxLengthMessage('Instant report message', 256)
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
            ></v-textarea>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Connection error message</label
            >
            <v-textarea
              placeholder="Enter a connection error message"
              outlined
              dense
              rows="2"
              no-resize
              height="80"
              v-model.trim="formValues.noInternetConnectionMessage"
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          256,
                          labels.getMaxLengthMessage('Connection error message', 256)
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
            ></v-textarea>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Sending error message</label
            >
            <v-textarea
              placeholder="Enter sending error message"
              outlined
              dense
              rows="2"
              no-resize
              height="80"
              v-model.trim="formValues.emailSendingErrorMessage"
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          256,
                          labels.getMaxLengthMessage('Sending error message', 256)
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
            ></v-textarea>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >No email selected message</label
            >
            <v-textarea
              placeholder="Enter a no email selected message"
              outlined
              dense
              rows="2"
              no-resize
              height="80"
              v-model.trim="formValues.emailSelectionErrorMessage"
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          256,
                          labels.getMaxLengthMessage('No email selected message', 256)
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
            ></v-textarea>
          </div>
          <div class="add-in-settings__body-item">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Bad format email message</label
            >
            <v-textarea
              placeholder="Enter a bad format email message"
              outlined
              dense
              rows="2"
              no-resize
              height="80"
              v-model.trim="formValues.badFormatEmailMessage"
              :rules="
                showForm
                  ? [
                      (v) =>
                        validations.maxLength(
                          v,
                          256,
                          labels.getMaxLengthMessage('Bad format email message', 256)
                        ),
                      (v) => validations.required(v, labels.Required)
                    ]
                  : []
              "
              :readonly="!showForm"
            ></v-textarea>
          </div>
          <div class="add-in-settings__body-item">
            <v-checkbox
              color="#2196f3"
              label="Show confirmation messsage when reporting email"
              class="k-checkbox add-in-settings__list-item-checkbox"
              v-model="formValues.isConfirmationBeforeAnalysis"
              :readonly="!showForm"
            ></v-checkbox>
            <v-textarea
              placeholder="Enter a confirmation message when reporting email"
              outlined
              dense
              rows="2"
              no-resize
              height="80"
              :disabled="!formValues.isConfirmationBeforeAnalysis"
              v-model.trim="formValues.analysisConfirmationMessage"
              :rules="getAnalysisConfirmationMessageRules"
              :readonly="!showForm"
            ></v-textarea>
          </div>
          <div class="add-in-settings__body-item">
            <v-checkbox
              color="#2196f3"
              label="Show confirmation message to delete email"
              class="k-checkbox add-in-settings__list-item-checkbox"
              v-model="formValues.isDeleteEmailBeforeAnalysis"
              :readonly="!showForm"
            ></v-checkbox>
            <v-textarea
              placeholder="Enter a confirmation message to delete email"
              outlined
              dense
              rows="2"
              no-resize
              height="80"
              :disabled="!formValues.isDeleteEmailBeforeAnalysis"
              v-model.trim="formValues.analysisEmailDeleteMessage"
              :rules="getAnalysisConfirmationMessageRules"
              :readonly="!showForm"
            ></v-textarea>
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item mt-2">
        <v-list-item-content>
          <label class="add-in-settings__label">Warning Label</label>
          <label class="add-in-settings__subtitle"
            >Appears on email header when suspicious email is opened</label
          >
          <v-text-field
            :rules="
              showForm
                ? [
                    (v) =>
                      validations.maxLength(v, 64, labels.getMaxLengthMessage('Warning label')),
                    (v) => validations.required(v, labels.Required)
                  ]
                : []
            "
            class="k-textfield mt-2"
            dense
            outlined
            placeholder="Enter a warning label"
            required
            :readonly="!showForm"
            v-model.trim="formValues.warningLabel"
          ></v-text-field>
        </v-list-item-content>
      </v-list-item>
      <phishing-settings-footer
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
        v-if="showFooter"
        className="mt-3"
        :saveDisable="saveDisable"
      />
    </v-form>
  </v-container>
</template>

<script>
import { maxLength, required } from '@/utils/validations'
import { getPhishingReporterImg } from '@/api/phishingReporter'
import VersionHistoryModal from './VersionHistoryModal'
import PhishingReporterLogo from '../../../assets/img/phishing-reporter-default-logo.png'
import imageToBlob from 'image-to-blob'
import ReporterVersionModal from './ReporterVersionModal'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter'
import labels from '@/model/constants/labels'
import { scrollToComponent } from '@/utils/functions'
export default {
  name: 'AddinSettings',
  components: { KFileUpload, ReporterVersionModal, VersionHistoryModal, PhishingSettingsFooter },
  props: {
    showFooter: {
      type: Boolean,
      default: true
    },
    showHeaderLink: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: null
    },
    showForm: {
      type: Boolean,
      default: true
    },
    inModal: {
      type: Boolean,
      default: false
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    spinnerStatus: {
      type: Boolean,
      default: false
    },
    saveDisable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isValid: false,
      files: [],
      labels,
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
        hiddenFileUploadValue: '',
        isDeleteEmailBeforeAnalysis: null,
        msgBoxBtnYesText: '',
        noInternetConnectionMessage: '',
        msgBoxBtnNoText: '',
        msgBoxBtnOkText: '',
        emailSelectionErrorMessage: '',
        badFormatEmailMessage: ''
      },
      reporterVersionModalStatus: false,
      versionHistoryModalStatus: false,
      selectedVersionRow: null,
      marginStatus: true,
      validations: {
        maxLength,
        required
      }
    }
  },
  computed: {
    getAnalysisConfirmationMessageRules() {
      const validations = []
      if (this.formValues.isConfirmationBeforeAnalysis) {
        validations.push((v) => this.validations.required(v, this.labels.Required))
        validations.push((v) =>
          this.validations.maxLength(
            v,
            256,
            this.labels.getMaxLengthMessage('Confirmation message', 256)
          )
        )
      }
      return validations
    }
  },
  methods: {
    getImagePreview() {
      return this.formValues.file && URL.createObjectURL(this.formValues.file)
    },
    onFileChanged(file) {
      this.formValues.file = file
    },
    handleHistoryRow(row) {
      this.selectedVersionRow = row
      this.reporterVersionModalStatus = true
    },
    submit(event, isAddIn = false) {
      if (this.$refs.refForm.validate()) {
        this.$emit('updateForm', { ...this.formValues, isAddIn })
        return this.formValues
      } else {
        const el = this.$refs.refForm.$el.querySelector('.error--text')
        scrollToComponent(el)
        return false
      }
    },
    getFormValues() {
      if (this.$refs.refForm.validate()) {
        return this.formValues
      } else {
        return false
      }
    },
    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png)$/i.test(newFile.name)) {
          //alert('Invalid file type. Allowed file types are gif, jpg, jpeg, png')
          return prevent()
        }
      }
      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
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
        analysisEmailDeleteMessage,
        isDeleteEmailBeforeAnalysis,
        msgBoxBtnYesText,
        msgBoxBtnNoText,
        msgBoxBtnCancelText,
        msgBoxBtnOkText,
        noInternetConnectionMessage,
        emailSendingErrorMessage,
        emailSelectionErrorMessage,
        badFormatEmailMessage
      } = this.formData
      this.formValues.addInName = addInName
      this.formValues.brandName = brandName
      this.formValues.msgBoxBtnYesText = msgBoxBtnYesText
      this.formValues.msgBoxBtnNoText = msgBoxBtnNoText
      this.formValues.warningLabel = warningLabel
      this.formValues.msgBoxTitle = msgBoxTitle
      this.formValues.isConfirmationBeforeAnalysis = isConfirmationBeforeAnalysis
      this.formValues.analysisConfirmationMessage = analysisConfirmationMessage
      this.formValues.analysisThankYouMessage = analysisThankYouMessage
      this.formValues.analysisEmailDeleteMessage = analysisEmailDeleteMessage
      this.formValues.isDeleteEmailBeforeAnalysis = isDeleteEmailBeforeAnalysis
      this.formValues.msgBoxBtnCancelText = msgBoxBtnCancelText
      this.formValues.msgBoxBtnOkText = msgBoxBtnOkText
      this.formValues.noInternetConnectionMessage = noInternetConnectionMessage
      this.formValues.emailSendingErrorMessage = emailSendingErrorMessage
      this.formValues.emailSelectionErrorMessage = emailSelectionErrorMessage
      this.formValues.badFormatEmailMessage = badFormatEmailMessage
      getPhishingReporterImg().then((response) => {
        //this.$refs.refFileUpload.$refs.upload.add(response.data)
        this.formValues.file = response.data
      })
    } else {
      this.formValues.brandName =
        localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName')
      this.formValues.addInName = 'Suspicious E-Mail Reporter'
      this.formValues.msgBoxTitle = 'Phishing Reporter'
      this.formValues.msgBoxBtnCancelText = 'Cancel'
      this.formValues.analysisConfirmationMessage =
        'Do you want to report this email to the system administrator for analysis?'
      this.formValues.isConfirmationBeforeAnalysis = true
      this.formValues.analysisEmailDeleteMessage =
        'Do you wish to delete the original email from your inbox?'
      this.formValues.analysisThankYouMessage =
        'Thank you for reporting this email. Our organisation is more secure thanks to your actions. Please keep reporting suspicious emails.'
      this.formValues.warningLabel = 'Suspicious E-Mail'
      this.formValues.isDeleteEmailBeforeAnalysis = true
      this.formValues.msgBoxBtnYesText = 'Yes'
      this.formValues.msgBoxBtnNoText = 'No'
      this.formValues.msgBoxBtnOkText = 'Okay'
      this.formValues.emailSendingErrorMessage =
        'Report email cannot be sent to related department. Please try again later.'
      this.formValues.noInternetConnectionMessage =
        'Phishing Reporter add-in cannot connect to server. Please inform related department.'
      this.formValues.emailSelectionErrorMessage =
        'To report an email you must first select the email and then click the report button.'
      this.formValues.badFormatEmailMessage = 'Your selection is not a valid email message'
      imageToBlob(PhishingReporterLogo, (err, blob) => {
        this.formValues.file = blob
      })
    }
  },
  watch: {
    formData(val) {
      const {
        addInName,
        brandName,
        warningLabel,
        msgBoxTitle,
        isConfirmationBeforeAnalysis,
        analysisConfirmationMessage,
        analysisThankYouMessage,
        analysisEmailDeleteMessage,
        isDeleteEmailBeforeAnalysis,
        msgBoxBtnNoText,
        msgBoxBtnYesText,
        msgBoxBtnCancelText,
        msgBoxBtnOkText,
        noInternetConnectionMessage,
        emailSendingErrorMessage,
        emailSelectionErrorMessage,
        badFormatEmailMessage
      } = val
      this.formValues.addInName = addInName
      this.formValues.brandName = brandName
      this.formValues.msgBoxBtnNoText = msgBoxBtnNoText
      this.formValues.warningLabel = warningLabel
      this.formValues.msgBoxBtnYesText = msgBoxBtnYesText
      this.formValues.msgBoxBtnCancelText = msgBoxBtnCancelText
      this.formValues.msgBoxBtnOkText = msgBoxBtnOkText
      this.formValues.msgBoxTitle = msgBoxTitle
      this.formValues.isConfirmationBeforeAnalysis = isConfirmationBeforeAnalysis
      this.formValues.analysisConfirmationMessage = analysisConfirmationMessage
      this.formValues.analysisThankYouMessage = analysisThankYouMessage
      this.formValues.analysisEmailDeleteMessage = analysisEmailDeleteMessage
      this.formValues.isDeleteEmailBeforeAnalysis = isDeleteEmailBeforeAnalysis
      this.formValues.noInternetConnectionMessage = noInternetConnectionMessage
      this.formValues.emailSendingErrorMessage = emailSendingErrorMessage
      this.formValues.emailSelectionErrorMessage = emailSelectionErrorMessage
      this.formValues.badFormatEmailMessage = badFormatEmailMessage
      getPhishingReporterImg().then((response) => {
        this.formValues.file = response.data
      })
    }
  }
}
</script>

<style lang="scss">
@keyframes spin {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

.add-in {
  &-settings {
    &__label {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.2;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
    }

    &__image {
      width: 100%;
      height: 100%;
      &-container {
        border: 2px solid whitesmoke;
        border-radius: 3px;
        width: fit-content;
      }
    }

    &__file-upload {
      max-width: 205px !important;
    }

    &__logo-container {
      max-width: 60px !important;
      margin-top: 8px;
    }

    &__header {
      max-width: 100% !important;
    }

    &__spinner {
      animation: spin 2s linear infinite;
      margin-left: 8px;

      &-text {
        white-space: nowrap;
        margin-left: 4px;
        font-size: 10px;
        color: rgb(0, 188, 212) !important;
      }
    }

    &__title {
      font-size: 24px !important;
      line-height: 1.29 !important;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      overflow: visible;
      opacity: 0.9;
    }

    &__subtitle {
      font-size: 14px;
      line-height: 1.5 !important;
      letter-spacing: normal;
      color: rgba(0, 0, 0, 0.87) !important;
      overflow: visible;
      opacity: 0.9;
    }

    &__link {
      text-transform: uppercase;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      line-height: 1.71;
      cursor: pointer;
      letter-spacing: normal;
      color: #2196f3;
      flex-basis: 100%;
      display: flex;
      justify-content: flex-end;
    }

    &__footer {
      display: flex;
      align-items: center;
      padding-bottom: 24px;
    }

    &__form {
      .add-in-settings__list-item {
        margin-bottom: 3px;
      }
    }

    &__list-item {
      max-width: 554px;
      //margin-top: -2px;
      .v-text-field.v-text-field--enclosed .v-text-field__details {
        margin-bottom: 6px;
      }
      &.v-list-item {
        padding: 0 !important;

        &--active {
          border-left: none !important;
        }
      }
      &-header {
        font-size: 14px;
        font-weight: normal;
        line-height: 1.5;
        letter-spacing: normal;
        color: rgba(0, 0, 0, 0.87) !important;
        margin-top: -16px !important;
        &--1 {
          margin-top: 12px !important;
          align-self: flex-start !important;
        }
      }
      &-checkbox {
        margin-top: 8px;
        align-self: flex-start !important;
      }
      .v-list-item__content {
        padding: 0 !important;
        overflow: visible;
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
    &__body {
      &-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: -4px;
        > *:first-child {
          flex-basis: 35%;
        }
        .v-text-field.v-text-field--enclosed .v-text-field__details {
          margin-bottom: 2px;
        }
        .v-input--dense > .v-input__control > .v-input__slot {
          margin-bottom: 0;
        }
        .v-text-field {
          max-width: 400px !important;
        }
      }
      &-container {
        max-width: 650px !important;
      }
    }
  }
}

.btn-select-file {
  max-width: 111px !important;
  max-height: 36px !important;
  border-radius: 18px !important;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.1), 0 2px 5px 0 rgba(33, 150, 243, 0.3);
  background-color: #2196f3 !important;
  font-weight: 500;
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

  &.v-btn--disabled {
    .v-btn__content {
      color: white !important;

      .v-icon {
        color: white !important;
      }
    }
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
