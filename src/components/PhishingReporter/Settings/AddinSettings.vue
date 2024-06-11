<template>
  <v-container class="add-in-settings" fluid id="add-in-settings" tag="div">
    <version-history-modal
      v-if="versionHistoryModalStatus"
      :status="versionHistoryModalStatus"
      @changeVersionHistoryModalStatus="versionHistoryModalStatus = false"
      @handleHistoryRow="handleHistoryRow"
    />
    <reporter-version-modal
      v-if="reporterVersionModalStatus"
      :selected-version-row="selectedVersionRow"
      :status="reporterVersionModalStatus"
      @changeReporterVersionModalStatus="reporterVersionModalStatus = false"
    />
    <v-list-item
      v-if="showHeader"
      class="pl-0 add-in-settings__list-item add-in-settings__header mt-0 mr-2"
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
            id="input--phishing-reporter-settings-add-in-name"
            class="k-textfield mt-2"
            initial-placeholder="Enter an add-in name"
            entity-name="add-in name"
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
            id="input--phishing-reporter-settings-brand-name"
            class="k-textfield mt-2"
            initial-placeholder="Enter a Brand Name"
            entity-name="brand name"
            :readonly="!showForm"
            :applyRules="showForm"
          />
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="px-0 add-in-settings__list-item add-in-settings__file-upload">
        <v-list-item-content>
          <label class="add-in-settings__label">{{ labels.AddIn }} {{ labels.Logo }}</label>
          <div class="add-in-settings__subtitle mb-2">Recommended size is 60x60px</div>

          <k-file-upload
            id="input--phishing-reporter-settings-logo"
            hint="Only jpg and png files. Max. file size 2MB"
            ref="refFileUpload"
            :readonly="!showForm"
            :extensions="['jpg', 'png']"
            :size="2"
            @inputFile="onFileChanged"
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

      <v-list-item class="add-in-settings__body-container mt-6">
        <v-list-item-content class="add-in-settings__body-container-content py-0">
          <div class="add-in-settings__dialog-box-settings-header">
            <div class="add-in-settings__dialog-box-settings-header__label-container">
              <label class="add-in-settings__label"
                >{{ labels.DialogBox }} {{ labels.Settings }}</label
              >
              <span class="add-in-settings__subtitle"
                >Customize the language options for the dialog box</span
              >
            </div>
            <KSelect
              v-model.trim="formValues.defaultLanguage"
              class="mt-3"
              style="max-width: 200px;"
              :items="selectedLanguages"
              outlined
              label="Set Default Language"
              placeholder="Set Default Language"
            ></KSelect>
          </div>
          <ElTabs
            v-model="tab"
            ref="tabs"
            :before-leave="handleTabChange"
            id="add-new-language"
            class="k-sub-tab add-in-settings__languages-tabs"
          >
            <ElTabPane
              v-for="language in formValues.languages"
              :key="language.language"
              :label="language.language"
              :name="language.language"
              class="pt-6"
            >
              <template #label>
                <div style="display: flex;">
                  <span class="landing-page-tab__label">
                    {{ language.language }}
                  </span>
                  <v-menu
                    v-if="language.language !== 'English'"
                    :min-width="128"
                    :offset-y="true"
                    nudge-left="50"
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-icon v-ripple="false" v-on="on" class="landing-page-tab-content__button"
                        >mdi-dots-horizontal</v-icon
                      >
                    </template>
                    <v-list>
                      <v-list-item
                        style="cursor: pointer;"
                        @click="handleDeleteSelectedLanguage(language.language)"
                      >
                        <v-list-item-title
                          ><v-icon class="mr-2">mdi-delete</v-icon>Delete</v-list-item-title
                        >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </div>
              </template>
              <div class="add-in-settings__dialog-box-settings__inner-container">
                <div class="add-in-settings__body-item mb-4">
                  <label class="add-in-settings__list-item-header"
                    >{{ labels.DialogBox }} {{ labels.Heading }}</label
                  >
                  <InputEntityName
                    v-model.trim="language.msgBoxTitle"
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
                    v-model.trim="language.msgBoxBtnYesText"
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
                    v-model.trim="language.msgBoxBtnNoText"
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
                    v-model.trim="language.msgBoxBtnCancelText"
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
                    v-model.trim="language.msgBoxBtnOkText"
                    initialPlaceholder="Enter okay button label"
                    entityName="okay button label"
                    id="input--phishing-reporter-message-button-ok-text"
                    class="k-textfield"
                    :readonly="!showForm"
                    :applyRules="showForm"
                  />
                </div>
                <div class="add-in-settings__body-item mb-4">
                  <label
                    class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
                    >Instant Report Message</label
                  >
                  <InputDescription
                    v-model.trim="language.analysisThankYouMessage"
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
                  <label
                    class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
                    >Connection error message</label
                  >
                  <InputDescription
                    v-model.trim="language.noInternetConnectionMessage"
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
                  <label
                    class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
                    >Sending error message</label
                  >
                  <InputDescription
                    v-model.trim="language.emailSendingErrorMessage"
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
                  <label
                    class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
                    >No email selected message</label
                  >
                  <InputDescription
                    v-model.trim="language.emailSelectionErrorMessage"
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
                  <label
                    class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
                    >Bad format email message</label
                  >
                  <InputDescription
                    v-model.trim="language.badFormatEmailMessage"
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
                    label="Show confirmation message when reporting email"
                    class="k-checkbox add-in-settings__list-item-checkbox"
                    id="input--phishing-reporter-is-confirmation-before-analysis"
                    v-model="language.isConfirmationBeforeAnalysis"
                    :readonly="!showForm"
                  ></v-checkbox>
                  <InputDescription
                    v-model.trim="language.analysisConfirmationMessage"
                    initialPlaceholder="Enter a confirmation message when reporting email"
                    entityName="confirmation message when reporting email"
                    id="input--phishing-reporter-analysis-confirmation-message-rules"
                    rows="2"
                    height="80"
                    :disabled="!language.isConfirmationBeforeAnalysis"
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
                    v-model="language.isDeleteEmailBeforeAnalysis"
                    :readonly="!showForm"
                  ></v-checkbox>
                  <InputDescription
                    v-model.trim="language.analysisEmailDeleteMessage"
                    initialPlaceholder="Enter a confirmation message to delete email"
                    entityName="confirmation message to delete email"
                    id="input--phishing-reporter-analysis-email-delete-message"
                    rows="2"
                    height="80"
                    :disabled="!language.isDeleteEmailBeforeAnalysis"
                    :initialRules="getTextAreaRules('isDeleteEmailBeforeAnalysis')"
                    :readonly="!showForm"
                    :maxLength="256"
                    :required="getRequiredValue('isDeleteEmailBeforeAnalysis')"
                  />
                </div>
                <div class="add-in-settings__body-item">
                  <v-checkbox
                    v-model="language.isSendSimulationMails"
                    color="#2196f3"
                    label="Turn off email forwarding for reported Phishing Simulation Emails"
                    class="k-checkbox add-in-settings__list-item-checkbox"
                    id="input--phishing-reporter-is-send-simulatiion-mails"
                    :readonly="!showForm"
                  ></v-checkbox>
                  <InputDescription
                    v-model.trim="language.simulationMailMessage"
                    initialPlaceholder="Enter a simulation email message"
                    entityName="simulation mail message"
                    id="input--phishing-reporter-simulation-email-message"
                    rows="2"
                    height="80"
                    :disabled="!language.isSendSimulationMails"
                    :initialRules="getTextAreaRules('isSendSimulationMails')"
                    :readonly="!showForm"
                    :maxLength="256"
                    :required="getRequiredValue('isSendSimulationMails')"
                  />
                </div>
              </div>
            </ElTabPane>
            <ElTabPane v-if="languageOptions.length" name="addNewLangauge">
              <template #label>
                <v-menu
                  v-model="isAddNewLanguageMenuVisible"
                  :z-index="10000"
                  content-class="add-new-language-menu"
                  :nudge-bottom="36"
                  bottom
                  :close-on-content-click="false"
                >
                  <template v-slot:activator="{ on: menu }">
                    <v-btn v-on="menu" text color="#2196f3" @click="handleAddNewLanguageMenuClick">
                      <v-icon class="mr-2" size="18" color="#2196f3">mdi-plus</v-icon>
                      <span class="landing-page-tab__label"> Add New Language </span>
                    </v-btn>
                  </template>
                  <div>
                    <div class="add-new-language-menu__filter-container">
                      <v-text-field
                        v-model="languageFilter"
                        placeholder="Search"
                        class="filter__text"
                        prepend-inner-icon="mdi-magnify"
                        outlined
                        dense
                        height="40"
                      ></v-text-field>
                    </div>
                    <v-list-item
                      v-for="language in getLanguageFilterOptions"
                      :key="language"
                      class="add-new-language-menu__item"
                      @click="handleSelectLanguage(language)"
                    >
                      {{ language }}
                    </v-list-item>
                  </div>
                </v-menu>
              </template>
            </ElTabPane>
          </ElTabs>
        </v-list-item-content>
      </v-list-item>

      <v-list-item class="mt-6 px-0 add-in-settings__list-item mt-2">
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
        className="mt-3"
        :saveDisable="saveDisable"
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
      />
    </v-form>
  </v-container>
</template>

<script>
import { maxLength, required } from '@/utils/validations'
import { getPhishingReporterImg } from '@/api/phishingReporter'
import VersionHistoryModal from './VersionHistoryModal'
import PhishingReporterLogo from '../../../assets/img/phishing-reporter-default-logo.png'
import ReporterVersionModal from './ReporterVersionModal'
import KFileUpload from '@/components/Common/FileUpload/FileUpload'
import PhishingSettingsFooter from '@/components/PhishingReporter/PhishingSettingsFooter'
import labels from '@/model/constants/labels'
import { scrollToComponent } from '@/utils/functions'
import { mapGetters } from 'vuex'
import InputEntityName from '@/components/Common/Inputs/InputEntityName'
import InputDescription from '@/components/Common/Inputs/InputDescription'
import imageToBlob from '@/utils/image-to-blob'
import KSelect from '@/components/Common/Inputs/KSelect'
export default {
  name: 'AddinSettings',
  components: {
    KFileUpload,
    ReporterVersionModal,
    VersionHistoryModal,
    PhishingSettingsFooter,
    InputEntityName,
    InputDescription,
    KSelect
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
      isAddNewLanguageMenuVisible: false,
      languageFilter: '',
      tab: 'English',
      selectedLanguages: ['English'],
      languageOptions: [
        'English',
        'Turkish',
        'French',
        'Arabic',
        'Chinese',
        'Russian',
        'German',
        'Czech',
        'Danish',
        'Dutch',
        'Finnish',
        'Greek',
        'Hebrew',
        'Hindi',
        'Hungarian',
        'Indonesian',
        'Italian',
        'Japanese',
        'Korean',
        'Malay',
        'Norwegian',
        'Polish',
        'Portuguese',
        'Romanian',
        'Spanish',
        'Swedish',
        'Thai',
        'Ukrainian',
        'Vietnamese',
        'Azerbaijani'
      ],
      formValues: {
        addInName: '',
        brandName: '',
        file: '',
        defaultLanguage: 'English',
        languages: [
          {
            language: 'English',
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
          }
        ]
      },
      languageList: [
        {
          text: 'English',
          resourceId: 'English'
        },
        {
          text: 'Turkish',
          resourceId: 'Turkish'
        }
      ],
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
    ...mapGetters({ whiteLabelBrandName: 'whitelabel/getBrandName' }),
    getLanguageOptions() {
      return this.languageOptions.filter(
        (language) => !this.selectedLanguages.some((sl) => sl === language)
      )
    },
    getLanguageFilterOptions() {
      return this.languageFilter.length > 0
        ? this.getLanguageOptions.filter((item) => {
            return item.toLowerCase().includes(this.languageFilter.toLowerCase())
          })
        : this.getLanguageOptions
    }
  },
  methods: {
    handleAddNewLanguageMenuClick() {
      this.isAddNewLanguageMenuVisible = true
    },
    handleSelectLanguage(language) {
      this.selectedLanguages.push(language)
      this.formValues.languages.push({
        language,
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
      })
      this.isAddNewLanguageMenuVisible = false
      this.languageFilter = ''
      this.tab = language
    },
    handleTabChange(activeTab) {
      if (activeTab === 'addNewLangauge') {
        return false
      }
      return true
    },
    handleCloseLanguageDeletionDialog() {
      this.selectedLanguageToDelete = ''
      this.isConfirmLanguageDeletionDialogVisible = false
    },
    handleDeleteSelectedLanguage(language) {
      this.selectedLanguageToDelete = language
      this.isConfirmLanguageDeletionDialogVisible = true
    },
    handleDeleteSelectedLanguageConfirm() {
      const languageIndex = this.selectedLanguages.findIndex((sl) => sl === language)
      if (languageIndex !== -1) {
        this.selectedLanguages.splice(languageIndex, 1)
        const languageItemIndex = this.formValues.languages.findIndex(
          (fl) => fl.language === language
        )
        this.formValues.languages.splice(languageItemIndex, 1)
        this.tab = 'English'
        if (this.formValues.defaultLanguage === language) {
          this.formValues.defaultLanguage = 'English'
        }
        this.selectedLanguageToDelete = ''
        this.isConfirmLanguageDeletionDialogVisible = false
      }
    },
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
      this.formValues.languages[0].msgBoxBtnNoText = msgBoxBtnNoText
      this.formValues.languages[0].warningLabel = warningLabel
      this.formValues.languages[0].msgBoxBtnYesText = msgBoxBtnYesText
      this.formValues.languages[0].msgBoxBtnCancelText = msgBoxBtnCancelText
      this.formValues.languages[0].msgBoxBtnOkText = msgBoxBtnOkText
      this.formValues.languages[0].msgBoxTitle = msgBoxTitle
      this.formValues.languages[0].isConfirmationBeforeAnalysis = isConfirmationBeforeAnalysis
      this.formValues.languages[0].analysisConfirmationMessage = analysisConfirmationMessage
      this.formValues.languages[0].analysisThankYouMessage = analysisThankYouMessage
      this.formValues.languages[0].analysisEmailDeleteMessage = analysisEmailDeleteMessage
      this.formValues.languages[0].isDeleteEmailBeforeAnalysis = isDeleteEmailBeforeAnalysis
      this.formValues.languages[0].noInternetConnectionMessage = noInternetConnectionMessage
      this.formValues.languages[0].emailSendingErrorMessage = emailSendingErrorMessage
      this.formValues.languages[0].emailSelectionErrorMessage = emailSelectionErrorMessage
      this.formValues.languages[0].badFormatEmailMessage = badFormatEmailMessage
      this.formValues.languages[0].isSendSimulationMails = isSendSimulationMails
      this.formValues.languages[0].simulationMailMessage = simulationMailMessage
      getPhishingReporterImg().then((response) => {
        this.formValues.file = response.data
      })
    }
  }
}
</script>
