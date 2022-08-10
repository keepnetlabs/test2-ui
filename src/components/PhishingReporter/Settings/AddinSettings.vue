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
    </v-list-item>
    <v-form class="add-in-settings__form" lazy-validation ref="refForm" v-model="isValid">
      <v-list-item class="px-0 add-in-settings__list-item mt-0">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.AddIn }} {{ labels.Name }}</label>
          <InputEntityName
            v-model.trim="formValues.addInName"
            initialPlaceholder="Enter an add-in name"
            entityName="add-in name"
            id="input--phishing-reporter-settings-add-in-name"
            class="k-textfield mt-2"
            :readonly="!showForm"
            :applyRules="showForm"
          />
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.Brand }} {{ labels.Name }}</label>
          <InputEntityName
            v-model.trim="formValues.brandName"
            initialPlaceholder="Enter a Brand Name"
            entityName="brand name"
            id="input--phishing-reporter-settings-brand-name"
            class="k-textfield mt-2"
            :readonly="!showForm"
            :applyRules="showForm"
          />
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item add-in-settings__file-upload">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.AddIn }} {{ labels.Logo }}</label>
          <div class="add-in-settings__subtitle mb-2">
            Recommended size is 60x60px
          </div>

          <k-file-upload
            id="input--phishing-reporter-settings-logo"
            hint="Only jpg and png files. Max. file size 2MB"
            ref="refFileUpload"
            :readonly="!showForm"
            :extensions="['jpg', 'png']"
            @inputFile="onFileChanged"
            :size="2"
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
          <div class="add-in-settings__body-item mt-4 mb-4">
            <label class="add-in-settings__list-item-header"
              >{{ labels.DialogBox }} {{ labels.Heading }}</label
            >
            <InputEntityName
              v-model.trim="formValues.msgBoxTitle"
              initialPlaceholder="Enter a dialog box name"
              entityName="dialog box name"
              id="input--phishing-reporter-message-box-title"
              class="k-textfield"
              :readonly="!showForm"
              :applyRules="showForm"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header">Confirm Button Label</label>
            <InputEntityName
              v-model.trim="formValues.msgBoxBtnYesText"
              initialPlaceholder="Enter confirm button label"
              entityName="confirm button label"
              id="input--phishing-reporter-message-button-yes-text"
              class="k-textfield"
              :readonly="!showForm"
              :applyRules="showForm"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header">No Button Label</label>
            <InputEntityName
              v-model.trim="formValues.msgBoxBtnNoText"
              initialPlaceholder="Enter a no button label"
              entityName="no button label"
              id="input--phishing-reporter-message-button-no-text"
              class="k-textfield"
              :readonly="!showForm"
              :applyRules="showForm"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header">Cancel Button Label</label>
            <InputEntityName
              v-model.trim="formValues.msgBoxBtnCancelText"
              initialPlaceholder="Enter cancel button label"
              entityName="cancel button label"
              id="input--phishing-reporter-message-button-cancel-text"
              class="k-textfield"
              :readonly="!showForm"
              :applyRules="showForm"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header">Okay Button Label</label>
            <InputEntityName
              v-model.trim="formValues.msgBoxBtnOkText"
              initialPlaceholder="Enter okay button label"
              entityName="okay button label"
              id="input--phishing-reporter-message-button-ok-text"
              class="k-textfield"
              :readonly="!showForm"
              :applyRules="showForm"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Instant Report Message</label
            >
            <InputDescription
              v-model.trim="formValues.analysisThankYouMessage"
              initialPlaceholder="Enter instant report message"
              entityName="instant report message"
              id="input--phishing-reporter-analysis-thank-you-message"
              rows="2"
              height="80"
              :readonly="!showForm"
              :applyRules="showForm"
              :maxLength="256"
              :required="true"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Connection error message</label
            >
            <InputDescription
              v-model.trim="formValues.noInternetConnectionMessage"
              initialPlaceholder="Enter a connection error message"
              entityName="connection error message"
              id="input--phishing-reporter-no-internet-connection-message"
              rows="2"
              height="80"
              :readonly="!showForm"
              :applyRules="showForm"
              :maxLength="256"
              :required="true"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Sending error message</label
            >
            <InputDescription
              v-model.trim="formValues.emailSendingErrorMessage"
              initialPlaceholder="Enter sending error message"
              entityName="sending error message"
              id="input--phishing-reporter-email-sending-error-message"
              rows="2"
              height="80"
              :readonly="!showForm"
              :applyRules="showForm"
              :maxLength="256"
              :required="true"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >No email selected message</label
            >
            <InputDescription
              v-model.trim="formValues.emailSelectionErrorMessage"
              initialPlaceholder="Enter a no email selected message"
              entityName="no email selected error message"
              id="input--phishing-reporter-email-selection-error-message"
              rows="2"
              height="80"
              :readonly="!showForm"
              :applyRules="showForm"
              :maxLength="256"
              :required="true"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <label class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
              >Bad format email message</label
            >
            <InputDescription
              v-model.trim="formValues.badFormatEmailMessage"
              initialPlaceholder="Enter a bad format email message"
              entityName="bad format email message"
              id="input--phishing-reporter-bad-format-email-message"
              rows="2"
              height="80"
              :readonly="!showForm"
              :applyRules="showForm"
              :maxLength="256"
              :required="true"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <v-checkbox
              color="#2196f3"
              label="Show confirmation messsage when reporting email"
              class="k-checkbox add-in-settings__list-item-checkbox"
              id="input--phishing-reporter-is-confirmation-before-analysis"
              v-model="formValues.isConfirmationBeforeAnalysis"
              :readonly="!showForm"
            ></v-checkbox>
            <InputDescription
              v-model.trim="formValues.analysisConfirmationMessage"
              initialPlaceholder="Enter a confirmation message when reporting email"
              entityName="confirmation message when reporting email"
              id="input--phishing-reporter-analysis-confirmation-message-rules"
              rows="2"
              height="80"
              :disabled="!formValues.isConfirmationBeforeAnalysis"
              :initialRules="getTextAreaRules('isConfirmationBeforeAnalysis')"
              :readonly="!showForm"
              :maxLength="256"
              :required="getRequiredValue('isConfirmationBeforeAnalysis')"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <v-checkbox
              color="#2196f3"
              label="Show confirmation message to delete email"
              class="k-checkbox add-in-settings__list-item-checkbox"
              id="input--phishing-reporter-is-delete-email-before-analysis"
              v-model="formValues.isDeleteEmailBeforeAnalysis"
              :readonly="!showForm"
            ></v-checkbox>
            <InputDescription
              v-model.trim="formValues.analysisEmailDeleteMessage"
              initialPlaceholder="Enter a confirmation message to delete email"
              entityName="confirmation message to delete email"
              id="input--phishing-reporter-analysis-email-delete-message"
              rows="2"
              height="80"
              :disabled="!formValues.isDeleteEmailBeforeAnalysis"
              :initialRules="getTextAreaRules('isDeleteEmailBeforeAnalysis')"
              :readonly="!showForm"
              :maxLength="256"
              :required="getRequiredValue('isDeleteEmailBeforeAnalysis')"
            />
          </div>
          <div class="add-in-settings__body-item mb-4">
            <v-checkbox
              color="#2196f3"
              label="Turn off email forwarding for reported Phishing Simulation Emails"
              class="k-checkbox add-in-settings__list-item-checkbox"
              id="input--phishing-reporter-is-send-simulatiion-mails"
              v-model="formValues.isSendSimulationMails"
              :readonly="!showForm"
            ></v-checkbox>
            <InputDescription
              v-model.trim="formValues.simulationMailMessage"
              initialPlaceholder="Enter a simulation email message"
              entityName="simulation mail message"
              id="input--phishing-reporter-simulation-email-message"
              rows="2"
              height="80"
              :disabled="!formValues.isSendSimulationMails"
              :initialRules="getTextAreaRules('isSendSimulationMails')"
              :readonly="!showForm"
              :maxLength="256"
              :required="getRequiredValue('isSendSimulationMails')"
            />
          </div>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item mt-2">
        <v-list-item-content>
          <label class="add-in-settings__label">Warning Label</label>
          <label class="add-in-settings__subtitle"
            >Appears on email header when suspicious email is opened</label
          >
          <InputEntityName
            v-model.trim="formValues.warningLabel"
            initialPlaceholder="Enter a warning label"
            entityName="warning label"
            id="input--phishing-reporter-warning-label"
            class="k-textfield mt-2"
            :readonly="!showForm"
            :applyRules="showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <phishing-settings-footer
        v-if="showFooter"
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
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
import { mapGetters } from 'vuex'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
export default {
  name: 'AddinSettings',
  components: {
    KFileUpload,
    ReporterVersionModal,
    VersionHistoryModal,
    PhishingSettingsFooter,
    InputEntityName,
    InputDescription
  },
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
        badFormatEmailMessage: '',
        isSendSimulationMails: false,
        simulationMailMessage: ''
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
    ...mapGetters({ whiteLabelBrandName: 'whitelabel/getBrandName' })
  },
  methods: {
    getRequiredValue(key) {
      let required = false
      if (this.formValues[key]) {
        required = true
      }
      return required
    },
    getTextAreaRules(key) {
      const validations = []
      if (this.formValues[key]) {
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
    },
    getImagePreview() {
      try {
        return this.formValues.file && URL.createObjectURL(this.formValues.file)
      } catch (e) {
        return ''
      }
    },
    onFileChanged(file) {
      if (Array.isArray(file) && file.length === 0) {
        this.formValues.file = ''
      } else {
        this.formValues.file = file
      }
    },
    handleHistoryRow(row) {
      this.selectedVersionRow = row
      this.reporterVersionModalStatus = true
    },
    submit(event, isAddIn = false) {
      if (this.$refs.refForm.validate()) {
        this.formValues = {
          ...this.formValues,
          analysisConfirmationMessage: this.formValues.analysisConfirmationMessage || '',
          analysisEmailDeleteMessage: this.formValues.analysisEmailDeleteMessage || '',
          simulationMailMessage: this.formValues.simulationMailMessage || ''
        }
        this.$emit('updateForm', { ...this.formValues, isAddIn })
        return this.formValues
      } else {
        const el = this.$refs.refForm.$el.querySelector('.error--text')
        scrollToComponent(el)
        return false
      }
    },
    getCurrentValues() {
      return this.formValues
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
        badFormatEmailMessage,
        isSendSimulationMails,
        simulationMailMessage
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
      this.formValues.isSendSimulationMails = isSendSimulationMails
      this.formValues.simulationMailMessage = simulationMailMessage
      getPhishingReporterImg().then((response) => {
        //this.$refs.refFileUpload.$refs.upload.add(response.data)
        this.formValues.file = response.data
      })
    } else {
      this.formValues.brandName = this.whiteLabelBrandName
        ? this.whiteLabelBrandName
        : localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName')
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
      this.formValues.isSendSimulationMails = true
      this.formValues.simulationMailMessage =
        'This was a phishing simulation sent to by your cyber-security team. Thank you for your awareness and cautiousness.'
      imageToBlob(PhishingReporterLogo, (err, blob) => {
        this.formValues.file = new File([blob], 'defaultlogo.png')
      })
      this.$emit('getInitialFormValues', this.formValues)
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
        badFormatEmailMessage,
        isSendSimulationMails,
        simulationMailMessage
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
      this.formValues.isSendSimulationMails = isSendSimulationMails
      this.formValues.simulationMailMessage = simulationMailMessage
      getPhishingReporterImg().then((response) => {
        this.formValues.file = response.data
      })
    }
  }
}
</script>
