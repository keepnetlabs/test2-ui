<template>
  <v-container class="add-in-settings" fluid id="add-in-settings" tag="div">
    <LanguageDeletionDialog
      v-if="isLanguageDeletionDialogVisible"
      :status="isLanguageDeletionDialogVisible"
      @close="handleCloseLanguageDeletionDialog"
      @confirm="handleDeleteSelectedLanguageConfirm"
    />
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
            :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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
            :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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
            :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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

      <div class="add-in-settings__body-container mt-6">
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
            v-if="showForm"
            v-model.trim="defaultLanguage"
            class="add-in-settings__default-language-select mt-3"
            style="max-width: 200px;"
            :items="getDefaultLanguageOptions"
            outlined
            label="Set Default Language"
            placeholder="Set Default Language"
            :disabled="!showForm || isFetchingDefaultSettingsForLanguage"
            :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
          ></KSelect>
          <KSelect
            v-else
            v-model.trim="defaultLanguage"
            class="mt-3"
            style="max-width: 200px;"
            :items="getDefaultLanguageOptions"
            outlined
            label="Default Language"
            placeholder="Default Language"
            append-icon=""
            :disabled="!showForm"
          ></KSelect>
        </div>
        <ElTabs
          v-model="tab"
          ref="tabs"
          :before-leave="handleTabChange"
          id="add-new-language"
          class="k-sub-tab add-in-settings__languages-tabs mt-6"
        >
          <ElTabPane
            v-for="setting in formValues.dialogBoxSettings"
            :key="setting.languageName"
            :label="setting.languageName"
            :name="setting.languageName"
            class="pt-6"
          >
            <template v-if="showForm" #label>
              <div
                style="display: flex;"
                :style="
                  setting.languageName === 'English'
                    ? { width: '48px' }
                    : { width: getLabelWidth(setting.languageName) }
                "
              >
                <span class="landing-page-tab__label">
                  {{ setting.languageName }}
                </span>
                <v-menu
                  v-if="setting.languageName !== 'English'"
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
                      @click="handleDeleteSelectedLanguage(setting.languageName)"
                    >
                      <v-list-item-title
                        ><v-icon class="mr-2">mdi-delete</v-icon>Delete</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>
            </template>
            <v-skeleton-loader
              v-if="isFetchingDefaultSettingsForLanguage"
              type="list-item@10"
            ></v-skeleton-loader>
            <div v-else class="add-in-settings__dialog-box-settings__inner-container">
              <div class="add-in-settings__body-item mb-4">
                <label class="add-in-settings__list-item-header"
                  >{{ labels.DialogBox }} {{ labels.Heading }}</label
                >
                <InputEntityName
                  v-model.trim="setting.msgBoxTitle"
                  initialPlaceholder="Enter a dialog box name"
                  entityName="dialog box name"
                  id="input--phishing-reporter-message-box-title"
                  class="k-textfield"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                  :applyRules="showForm"
                />
              </div>
              <div class="add-in-settings__body-item mb-4">
                <label class="add-in-settings__list-item-header">Confirm Button Label</label>
                <InputEntityName
                  v-model.trim="setting.msgBoxBtnYesText"
                  initialPlaceholder="Enter confirm button label"
                  entityName="confirm button label"
                  id="input--phishing-reporter-message-button-yes-text"
                  class="k-textfield"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                  :applyRules="showForm"
                />
              </div>
              <div class="add-in-settings__body-item mb-4">
                <label class="add-in-settings__list-item-header">No Button Label</label>
                <InputEntityName
                  v-model.trim="setting.msgBoxBtnNoText"
                  initialPlaceholder="Enter a no button label"
                  entityName="no button label"
                  id="input--phishing-reporter-message-button-no-text"
                  class="k-textfield"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                  :applyRules="showForm"
                />
              </div>
              <div v-if="false" class="add-in-settings__body-item mb-4">
                <label class="add-in-settings__list-item-header">Cancel Button Label</label>
                <InputEntityName
                  v-model.trim="setting.msgBoxBtnCancelText"
                  initialPlaceholder="Enter cancel button label"
                  entityName="cancel button label"
                  id="input--phishing-reporter-message-button-cancel-text"
                  class="k-textfield"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                  :applyRules="showForm"
                />
              </div>
              <div class="add-in-settings__body-item mb-4">
                <label class="add-in-settings__list-item-header">Okay Button Label</label>
                <InputEntityName
                  v-model.trim="setting.msgBoxBtnOkText"
                  initialPlaceholder="Enter okay button label"
                  entityName="okay button label"
                  id="input--phishing-reporter-message-button-ok-text"
                  class="k-textfield"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                  :applyRules="showForm"
                />
              </div>
              <div class="add-in-settings__body-item mb-4">
                <label
                  class="add-in-settings__list-item-header add-in-settings__list-item-header--1"
                  >Instant Report Message</label
                >
                <InputDescription
                  v-model.trim="setting.analysisThankYouMessage"
                  initialPlaceholder="Enter instant report message"
                  entityName="instant report message"
                  id="input--phishing-reporter-analysis-thank-you-message"
                  rows="2"
                  height="80"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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
                  v-model.trim="setting.noInternetConnectionMessage"
                  initialPlaceholder="Enter a connection error message"
                  entityName="connection error message"
                  id="input--phishing-reporter-no-internet-connection-message"
                  rows="2"
                  height="80"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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
                  v-model.trim="setting.emailSendingErrorMessage"
                  initialPlaceholder="Enter sending error message"
                  entityName="sending error message"
                  id="input--phishing-reporter-email-sending-error-message"
                  rows="2"
                  height="80"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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
                  v-model.trim="setting.emailSelectionErrorMessage"
                  initialPlaceholder="Enter a no email selected message"
                  entityName="no email selected error message"
                  id="input--phishing-reporter-email-selection-error-message"
                  rows="2"
                  height="80"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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
                  v-model.trim="setting.badFormatEmailMessage"
                  initialPlaceholder="Enter a bad format email message"
                  entityName="bad format email message"
                  id="input--phishing-reporter-bad-format-email-message"
                  rows="2"
                  height="80"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
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
                  v-model="setting.isConfirmationBeforeAnalysis"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                ></v-checkbox>
                <InputDescription
                  v-model.trim="setting.analysisConfirmationMessage"
                  initialPlaceholder="Enter a confirmation message when reporting email"
                  entityName="confirmation message when reporting email"
                  id="input--phishing-reporter-analysis-confirmation-message-rules"
                  rows="2"
                  height="80"
                  :disabled="!setting.isConfirmationBeforeAnalysis"
                  :initialRules="setting.isConfirmationBeforeAnalysis ? textAreaRules : []"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                  :maxLength="256"
                  :applyRules="showForm"
                  :required="setting.isConfirmationBeforeAnalysis"
                />
              </div>
              <div class="add-in-settings__body-item mb-4">
                <v-checkbox
                  color="#2196f3"
                  label="Delete reported emails"
                  class="k-checkbox add-in-settings__list-item-checkbox"
                  id="input--phishing-reporter-is-delete-email-before-analysis"
                  v-model="setting.isDeleteEmailBeforeAnalysis"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                ></v-checkbox>
                <div class="">
                  <KSelect
                    v-model.trim="setting.isDeleteWithoutConfirmation"
                    style="max-width: 200px;"
                    itemText="text"
                    itemValue="value"
                    :items="deleteEmailOptions"
                    outlined
                    placeholder="Select delete reported emails option"
                    :disabled="!showForm || !setting.isDeleteEmailBeforeAnalysis"
                  ></KSelect>
                  <InputDescription
                    v-if="setting.isDeleteWithoutConfirmation === false"
                    v-model.trim="setting.analysisEmailDeleteMessage"
                    initialPlaceholder="Enter a confirmation message to delete email"
                    entityName="confirmation message to delete email"
                    id="input--phishing-reporter-analysis-email-delete-message"
                    rows="2"
                    height="80"
                    :disabled="!setting.isDeleteEmailBeforeAnalysis"
                    :initialRules="setting.isDeleteEmailBeforeAnalysis ? textAreaRules : []"
                    :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                    :maxLength="256"
                    :required="setting.isDeleteEmailBeforeAnalysis"
                  />
                  <AlertBox
                    v-if="setting.isDeleteEmailBeforeAnalysis"
                    class="bg-aqua-light"
                    style="width: 362px;"
                    icon-color="#2196F3"
                    icon-name="mdi-information"
                    text="Emails that are deleted may be moved to the trash folder due to Microsoft's policies."
                    :slots="{ primaryAction: false, secondaryAction: false }"
                  />
                </div>
              </div>
              <div class="add-in-settings__body-item">
                <v-checkbox
                  v-model="setting.isSendSimulationMails"
                  color="#2196f3"
                  label="Turn off email forwarding for reported Phishing Simulation Emails"
                  class="k-checkbox add-in-settings__list-item-checkbox"
                  id="input--phishing-reporter-is-send-simulatiion-mails"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                ></v-checkbox>
                <InputDescription
                  v-model.trim="setting.simulationMailMessage"
                  initialPlaceholder="Enter a simulation email message"
                  entityName="simulation mail message"
                  id="input--phishing-reporter-simulation-email-message"
                  rows="2"
                  height="80"
                  :disabled="!setting.isSendSimulationMails"
                  :initialRules="setting.isDeleteEmailBeforeAnalysis ? textAreaRules : []"
                  :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
                  :maxLength="256"
                  :required="setting.isSendSimulationMails"
                />
              </div>
            </div>
          </ElTabPane>
          <ElTabPane v-if="getLanguageOptions.length && showForm" name="addNewLangauge">
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
                  <v-btn
                    v-on="menu"
                    text
                    color="#2196f3"
                    @click="handleAddNewLanguageMenuClick"
                    :disabled="isFetchingDefaultSettingsForLanguage"
                  >
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
                    :key="language.resourceId"
                    class="add-new-language-menu__item"
                    @click="handleSelectLanguage(language.text)"
                  >
                    {{ language.text }}
                  </v-list-item>
                </div>
              </v-menu>
            </template>
          </ElTabPane>
        </ElTabs>
      </div>

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
            :readonly="!showForm || isFetchingDefaultSettingsForLanguage"
            :applyRules="showForm"
          />
        </v-list-item-content>
      </v-list-item>
      <phishing-settings-footer
        v-if="showFooter"
        className="mt-3"
        :saveDisable="saveDisable || isFetchingDefaultSettingsForLanguage"
        @submit="submit($event)"
        @submitWithDownload="submit($event, true)"
      />
    </v-form>
  </v-container>
</template>

<script>
import { maxLength, required } from '@/utils/validations'
import { getPhishingReporterImg, getDefaultSettingsForLanguage } from '@/api/phishingReporter'
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
import LanguageDeletionDialog from '@/components/PhishingReporter/Settings/LanguageDeletionDialog'
import LookupLocalStorage from '@/helper-classes/lookup-local-storage'
import {
  defaultDialogBoxSettings,
  deleteEmailOptions,
  checkDialogBoxSettings
} from '@/components/PhishingReporter/Settings/utils'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import AlertBox from '@/components/AlertBox'

export default {
  name: 'AddinSettings',
  components: {
    AlertBox,
    KFileUpload,
    ReporterVersionModal,
    VersionHistoryModal,
    PhishingSettingsFooter,
    InputEntityName,
    InputDescription,
    KSelect,
    LanguageDeletionDialog
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
      deleteEmailOptions,
      labels,
      isFetchingDefaultSettingsForLanguage: false,
      isLanguageDeletionDialogVisible: false,
      selectedLanguageToDelete: '',
      isAddNewLanguageMenuVisible: false,
      languageFilter: '',
      tab: 'English',
      defaultLanguage: 'English',
      languageOptions: [],
      formValues: {
        addInName: 'Suspicious email reporter',
        brandName: '',
        file: '',
        warningLabel: 'Suspicious E-mail',
        dialogBoxSettings: [{ ...defaultDialogBoxSettings }]
      },
      reporterVersionModalStatus: false,
      versionHistoryModalStatus: false,
      selectedVersionRow: null,
      marginStatus: true,
      validations: {
        maxLength,
        required
      },
      textAreaRules: [
        (v) => this.validations.required(v, labels.Required),
        (v) =>
          this.validations.maxLength(
            v,
            256,
            this.labels.getMaxLengthMessage('Confirmation message', 256)
          )
      ]
    }
  },
  computed: {
    ...mapGetters({ whiteLabelBrandName: 'whitelabel/getBrandName' }),
    getDefaultLanguageOptions() {
      return this.formValues?.dialogBoxSettings?.map((setting) => setting.languageName) || []
    },
    getLanguageOptions() {
      return this.languageOptions.filter(
        (language) =>
          !this.formValues.dialogBoxSettings.some(
            (setting) => setting.languageName === language.text
          )
      )
    },
    getLanguageFilterOptions() {
      return this.languageFilter.length > 0
        ? this.getLanguageOptions.filter((item) => {
            return item.text.toLowerCase().includes(this.languageFilter.toLowerCase())
          })
        : this.getLanguageOptions
    }
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageOptions =
          response?.map((language) => ({
            text: language.name,
            value: language.resourceId
          })) || []
      })
    },
    getLabelWidth(language) {
      return `${language.length * 10}px`
    },
    handleAddNewLanguageMenuClick() {
      this.isAddNewLanguageMenuVisible = true
    },
    handleSelectLanguage(language) {
      const payload = {
        languageJson: JSON.stringify(defaultDialogBoxSettings),
        languageName: language
      }
      this.isAddNewLanguageMenuVisible = false
      this.languageFilter = ''
      this.isFetchingDefaultSettingsForLanguage = true
      getDefaultSettingsForLanguage(payload)
        .then((response) => {
          if (!response?.data?.data?.startsWith?.('{')) {
            this.$store.dispatch('common/createSnackBar', {
              message:
                'Translation could not be processed. Please fill in the required fields yourself or try again later.',
              color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
              icon: 'mdi-alert'
            })
            return
          }
          const dialogBoxSettings = JSON.parse(response.data.data)
          const languageResourceId =
            this.languageOptions.find((lo) => lo.text === language)?.value || ''
          this.formValues.dialogBoxSettings.push({
            ...dialogBoxSettings,
            isConfirmationBeforeAnalysis: true,
            isDeleteEmailBeforeAnalysis: true,
            isSendSimulationMails: true,
            isDefault: false,
            languageName: language,
            languageResourceId
          })
          this.tab = language
        })
        .catch(() => {
          this.$store.dispatch('common/createSnackBar', {
            message:
              'Translation could not be processed. Please fill in the required fields yourself or try again later.',
            color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
            icon: 'mdi-alert'
          })
          return
        })
        .finally(() => {
          this.isFetchingDefaultSettingsForLanguage = false
        })
    },
    handleTabChange(activeTab) {
      if (activeTab === 'addNewLangauge') {
        return false
      }
      return true
    },
    handleCloseLanguageDeletionDialog() {
      this.selectedLanguageToDelete = ''
      this.isLanguageDeletionDialogVisible = false
    },
    handleDeleteSelectedLanguage(language) {
      this.selectedLanguageToDelete = language
      this.isLanguageDeletionDialogVisible = true
    },
    handleDeleteSelectedLanguageConfirm() {
      if (!this.selectedLanguageToDelete) return
      const languageItemIndex = this.formValues.dialogBoxSettings.findIndex(
        (fl) => fl.languageName === this.selectedLanguageToDelete
      )
      if (languageItemIndex === -1) return
      this.formValues.dialogBoxSettings.splice(languageItemIndex, 1)
      this.tab = 'English'
      if (this.defaultLanguage === this.selectedLanguageToDelete) {
        this.defaultLanguage = 'English'
      }
      this.selectedLanguageToDelete = ''
      this.isLanguageDeletionDialogVisible = false
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
    checkDialogBoxSettings() {
      const invalidLanguages = []
      for (let i = 0; i < this.formValues.dialogBoxSettings.length; i++) {
        if (!checkDialogBoxSettings(this.formValues.dialogBoxSettings[i]))
          invalidLanguages.push(this.formValues.dialogBoxSettings[i].languageName)
      }
      return invalidLanguages
    },
    submit(event, isAddIn = false) {
      const invalidLanguages = this.checkDialogBoxSettings()
      if (invalidLanguages.length) {
        this.$store.dispatch('common/createSnackBar', {
          message: `Please fill in all required “${
            invalidLanguages.length === 2
              ? invalidLanguages[0] + ' and ' + invalidLanguages[1]
              : invalidLanguages.length > 2
              ? invalidLanguages.slice(0, invalidLanguages.length - 1).join(', ') +
                ' and ' +
                invalidLanguages[invalidLanguages.length - 1]
              : invalidLanguages[0]
          }” fields in the dialog box settings.`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert'
        })
        return
      }
      if (this.$refs.refForm.validate()) {
        this.formValues = {
          ...this.formValues,
          dialogBoxSettings: this.formValues.dialogBoxSettings.map((setting) => ({
            ...setting,
            analysisConfirmationMessage: setting?.analysisConfirmationMessage || '',
            analysisEmailDeleteMessage: setting?.analysisEmailDeleteMessage || '',
            simulationMailMessage: setting?.simulationMailMessage || ''
          }))
        }
        this.formValues.dialogBoxSettings.sort((x) => {
          return x.languageName === 'English' ? -1 : 1
        })
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
    this.callForLanguages()
    if (this.formData) {
      const { addInName, brandName, warningLabel, dialogBoxSettings } = this.formData
      this.formValues.addInName = addInName
      this.formValues.brandName = brandName
      this.formValues.warningLabel = warningLabel
      this.formValues.dialogBoxSettings = dialogBoxSettings
      this.formValues.dialogBoxSettings.sort((x) => {
        return x.languageName === 'English' ? -1 : 1
      })
      const defaultSettingIndex = dialogBoxSettings.findIndex((setting) => setting.isDefault)
      if (defaultSettingIndex !== -1) {
        this.defaultLanguage = dialogBoxSettings[defaultSettingIndex].languageName
        this.tab = dialogBoxSettings[defaultSettingIndex].languageName
      }
      getPhishingReporterImg().then((response) => {
        this.formValues.file = response.data
      })
    } else {
      this.formValues.brandName = this.whiteLabelBrandName
        ? this.whiteLabelBrandName
        : localStorage.getItem('selectedCompanyName') || localStorage.getItem('companyName')
      this.formValues.addInName = 'Suspicious E-Mail Reporter'
      this.formValues.dialogBoxSettings = [{ ...defaultDialogBoxSettings }]
      imageToBlob(PhishingReporterLogo, (err, blob) => {
        this.formValues.file = new File([blob], 'defaultlogo.png')
      })
      this.$emit('getInitialFormValues', this.formValues)
    }
  },
  watch: {
    defaultLanguage(val) {
      if (!val) return
      const settingIndex = this.formValues.dialogBoxSettings.findIndex(
        (setting) => setting.languageName === val
      )
      if (settingIndex !== -1) {
        this.formValues.dialogBoxSettings[settingIndex].isDefault = true
        this.formValues.dialogBoxSettings.forEach((setting, index) => {
          if (index === settingIndex) return
          setting.isDefault = false
        })
      }
    },
    formData(val) {
      const { addInName, brandName, warningLabel, dialogBoxSettings } = val
      this.formValues.addInName = addInName
      this.formValues.brandName = brandName
      this.formValues.warningLabel = warningLabel
      this.formValues.dialogBoxSettings = [...dialogBoxSettings]
      this.formValues.dialogBoxSettings.sort((x) => {
        return x.languageName === 'English' ? -1 : 1
      })
      const defaultSettingIndex = dialogBoxSettings.findIndex((setting) => setting.isDefault)
      if (defaultSettingIndex !== -1) {
        this.defaultLanguage = dialogBoxSettings[defaultSettingIndex].languageName
        this.tab = dialogBoxSettings[defaultSettingIndex].languageName
      }
      getPhishingReporterImg().then((response) => {
        this.formValues.file = response.data
      })
    }
  }
}
</script>
