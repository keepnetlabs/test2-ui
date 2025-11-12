<template>
  <div>
    <app-modal
      :status="status"
      icon-name="mdi-domain"
      title="Phishing Reporter Add-in Configuration"
      class-name="add-in-configuration add-in-configuration-container"
      title-id="text--create-phishing-reporter-modal-title"
      @closeOverlay="$emit('closeOverlay')"
    >
      <template v-slot:overlay-body>
        <download-add-in-modal :status="showModal" @handleClose="handleContinue" />
        <v-stepper v-model="step" class="k-stepper">
          <v-stepper-header class="k-stepper__header">
            <v-stepper-step
              id="step--create-phishing-reporter-addin-settings"
              class="k-stepper__step"
              :complete="step > 1"
              :step="1"
              >Add-in Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step
              id="step--create-phishing-reporter-email-settings"
              class="k-stepper__step"
              :complete="step > 2"
              :step="2"
              >Email Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step
              id="step--create-phishing-reporter-other-settings"
              class="k-stepper__step"
              :complete="step > 3"
              :step="3"
              >Other Settings</v-stepper-step
            >
            <v-divider class="k-stepper__divider" />
            <v-stepper-step
              id="step--create-phishing-reporter-diagnostic-tools"
              class="k-stepper__step"
              :complete="step > 4"
              :step="4"
              >Diagnostic Tool
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items class="k-stepper__items">
            <v-stepper-content class="k-stepper__content" :step="1">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    Add-in Settings
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle mb-6">
                    General add-in settings
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <addin-settings
                ref="refAddInSettings"
                :showFooter="false"
                :inModal="true"
                :showHeader="false"
                @getInitialFormValues="getInitialAddInSettings"
                @getFormValues="getAddinSettingsValues"
              />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="2">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    Email Settings
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle">
                    Reported emails will be sent to specified recipients
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <email-settings
                ref="refEmailSettings"
                :showFooter="false"
                :showHeader="false"
                @getFormValues="getEmailSettingsValues"
                @getInitialFormValues="getInitialEmailSettings"
              />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="3">
              <v-list-item class="pl-0 add-in-configuration__list-item">
                <v-list-item-content>
                  <v-list-item-title class="add-in-configuration__title">
                    Other Settings
                  </v-list-item-title>
                  <v-list-item-subtitle class="add-in-configuration__subtitle mb-3">
                    Additional settings for add-in and archive
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <other-settings
                ref="refOtherSettings"
                :showFooter="false"
                :inModal="true"
                :show-header="false"
                @getFormValues="getOtherSettingsValues"
                @getInitialFormValues="getInitialOtherSettings"
              />
            </v-stepper-content>
            <v-stepper-content class="k-stepper__content" :step="4">
              <diagnostic-tool
                ref="refDiagnosticTool"
                :show-footer="false"
                :show-header-link="false"
                @getInitialFormValues="getInitialDiagnosticToolValues"
              />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </template>
      <template #overlay-footer>
        <StepperFooter
          max-step="4"
          :step="step"
          :ids="{
            cancelButton: 'btn-cancel--phishing-reporter-settings-add-in-configuration',
            backButton: 'btn-back--phishing-reporter-settings-add-in-configuration',
            nextButton: 'btn-next--phishing-reporter-settings-add-in-configuration',
            saveButton: 'btn-save--phishing-reporter-settings-add-in-configuration'
          }"
          :disabled-statuses="{
            nextButton: isActionButtonDisabled,
            submitButton: isActionButtonDisabled
          }"
          @on-cancel="closeOverlay"
          @on-back="changeStep(-1)"
          @on-next="changeStep(+1)"
          @on-submit="submit"
        />
      </template>
    </app-modal>
  </div>
</template>

<script>
import AddinSettings from './Settings/AddinSettings'
import EmailSettings from './Settings/EmailSettings'
import OtherSettings from './Settings/OtherSettings'
import DownloadAddInModal from './DownloadAddInModal'
import {
  createPhishingReporter,
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  generateDiagnosticTool,
  generateOutlookAddIn
} from '@/api/phishingReporter'
import AppModal from '../AppModal'
import DiagnosticTool from './Settings/DiagnosticTool'
import labels from '@/model/constants/labels'
import { isDifferent } from '@/utils/functions'
import StepperFooter from '@/components/Stepper/StepperFooter'

export default {
  name: 'AddInConfiguration',
  components: {
    StepperFooter,
    DiagnosticTool,
    AddinSettings,
    EmailSettings,
    OtherSettings,
    AppModal,
    DownloadAddInModal
  },
  props: {
    status: {
      type: Boolean
    }
  },
  data() {
    return {
      isActionButtonDisabled: false,
      labels,
      step: 1,
      initialAddInSettings: null,
      initialEmailSettings: null,
      initialOtherSettings: null,
      initialDiagnosticToolValues: null,
      addingSettings: {},
      emailSettings: {},
      otherSettings: {},
      diagnosticTool: {},
      showModal: false,
      outlookSpinnerStatus: false,
      diagnosticToolSpinnerStatus: false
    }
  },
  methods: {
    checkIfAnyStepChanged() {
      const currentAddInSettings = this.$refs.refAddInSettings.getCurrentValues()
      const isAddInSettingsChanged = isDifferent(currentAddInSettings, this.initialAddInSettings)
      if (isAddInSettingsChanged) return true

      const currentEmailSettings = this.$refs.refEmailSettings.getCurrentValues()
      const isEmailSettingsChanged = isDifferent(currentEmailSettings, this.initialEmailSettings)
      if (isEmailSettingsChanged) return true

      const currentOtherSettings = this.$refs.refOtherSettings.getCurrentValues()
      const isOtherSettingsChanged = isDifferent(currentOtherSettings, this.initialOtherSettings)
      if (isOtherSettingsChanged) return true

      const currentDiagnosticTool = this.$refs.refDiagnosticTool.getCurrentValues()
      const isDiagnosticToolChanged = isDifferent(
        currentDiagnosticTool,
        this.initialDiagnosticToolValues
      )
      return !!isDiagnosticToolChanged
    },
    closeOverlay() {
      const isChanged = this.checkIfAnyStepChanged()
      if (!isChanged) {
        this.resetValues()
        this.$emit('changeAddInConfigurationStatus', false)
        return
      }
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          this.resetValues()
          this.$emit('changeAddInConfigurationStatus', false)
        }
      })
    },
    getInitialAddInSettings(values) {
      this.initialAddInSettings = { ...values }
    },
    getInitialEmailSettings(values) {
      this.initialEmailSettings = { ...values }
    },
    getInitialOtherSettings(values) {
      this.initialOtherSettings = { ...values }
    },
    getInitialDiagnosticToolValues(values) {
      this.initialDiagnosticToolValues = { ...values }
    },
    callForGenerateOutlookAddIn() {
      generateOutlookAddIn().then((response) => {
        response.data.data && this.callForDownloadOutlookAddIn(response.data.data.resourceId)
      })
    },
    callForDownloadOutlookAddIn(resourceId) {
      downloadOutlookAddIn(resourceId)
        .then((response) => {
          this.outlookSpinnerStatus = false
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `OutlookPhishingReporter.msi`
          link.click()
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.outlookSpinnerStatus = true
            setTimeout(() => {
              this.callForDownloadOutlookAddIn(resourceId)
            }, 7500)
          } else {
            this.outlookSpinnerStatus = false
          }
        })
    },
    callForGenerateDiagnosticTool() {
      generateDiagnosticTool().then((response) => {
        response.data.data && this.callForDownloadDiagnosticTool(response.data.data.resourceId)
      })
    },
    callForDownloadDiagnosticTool(id) {
      this.diagnosticToolSpinnerStatus = true
      downloadDiagnosticTool(id)
        .then((response) => {
          this.diagnosticToolSpinnerStatus = false
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `DiagnosticTool.msi`
          link.click()
        })
        .catch((error) => {
          if (error.response.status === 404) {
            this.diagnosticToolSpinnerStatus = true
            setTimeout(() => {
              this.callForDownloadDiagnosticTool(id)
            }, 7500)
          } else {
            this.diagnosticToolSpinnerStatus = false
          }
        })
    },
    changeStep(flag) {
      let hasValidationError = false
      let ret = null
      if (this.step === 1) {
        ret = this.$refs.refAddInSettings.submit()
        if (ret) {
          this.addingSettings = ret
        } else {
          hasValidationError = true
        }
      }
      if (this.step === 2) {
        ret = this.$refs.refEmailSettings.submit()
        if (ret) {
          this.emailSettings = { ...ret, sendUsACopy: !ret.sendUsACopy }
          hasValidationError = false
        } else {
          hasValidationError = true
        }
      }
      if (this.step === 3) {
        ret = this.$refs.refOtherSettings.submit()
        if (ret) {
          this.otherSettings = ret
          hasValidationError = false
        } else {
          hasValidationError = true
        }
      }
      if (this.step === 4) {
        ret = this.$refs.refDiagnosticTool.formValues
        this.diagnosticTool = ret
        hasValidationError = false
      }
      if (!hasValidationError || flag === -1) {
        this.step += flag
      }
      ret = null
    },
    submit() {
      const isOtherSettingsValid = this.$refs.refOtherSettings.submit()
      if (isOtherSettingsValid) {
        this.diagnosticTool = this.$refs.refDiagnosticTool.formValues
        this.callForCreatePhishingReporter()
      }
    },
    getEmailSettingsValues(formValues) {
      this.addingSettings = { ...formValues }
    },
    getAddinSettingsValues(formValues) {
      this.emailSettings = { ...formValues }
    },
    getOtherSettingsValues(formValues) {
      this.otherSettings = { ...formValues }
    },
    handleContinue() {
      this.showModal = false
      this.$emit('getPhishingReport')
    },
    resetValues() {
      this.addingSettings = {}
      this.emailSettings = {}
      this.otherSettings = {}
    },
    callForCreatePhishingReporter() {
      this.isActionButtonDisabled = true
      const otherSettings = {
        companyKey: localStorage.getItem('companyId'),
        enableEnterpriseVault: false,
        apiKey: APP_CONFIG.VUE_APP_API_KEY || '9DtfGZnBazfjbZ47VJJZ2NNV6BXry6gxkmpRWAhX',
        apiUrl:
          APP_CONFIG.VUE_APP_PHISHING_REPORTER_URL || 'https://test-addin-api.devkeepnet.com/api',
        ...this.otherSettings
      }
      const payload = {
        ...this.addingSettings,
        ...this.emailSettings,
        ...otherSettings,
        ...this.diagnosticTool,
        isProcessAttachmentOnTheFly: true
      }
      const formData = new FormData()
      Object.keys(payload).forEach((key) => {
        if (key === 'dialogBoxSettings') {
          for (let i = 0; i < payload.dialogBoxSettings.length; i++) {
            formData.append(
              `DialogBoxSettings[${i}].LanguageName`,
              payload?.dialogBoxSettings?.[i]?.languageName || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].LanguageResourceId`,
              payload?.dialogBoxSettings?.[i]?.languageResourceId || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxTitle`,
              payload?.dialogBoxSettings?.[i]?.msgBoxTitle || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnCancelText`,
              payload?.dialogBoxSettings?.[i]?.msgBoxBtnCancelText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].AnalysisConfirmationMessage`,
              payload?.dialogBoxSettings?.[i]?.analysisConfirmationMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsConfirmationBeforeAnalysis`,
              payload?.dialogBoxSettings?.[i]?.isConfirmationBeforeAnalysis || false
            )
            formData.append(
              `DialogBoxSettings[${i}].AnalysisEmailDeleteMessage`,
              payload?.dialogBoxSettings?.[i]?.analysisEmailDeleteMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].AnalysisThankYouMessage`,
              payload?.dialogBoxSettings?.[i]?.analysisThankYouMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsDeleteEmailBeforeAnalysis`,
              payload?.dialogBoxSettings?.[i]?.isDeleteEmailBeforeAnalysis || false
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnYesText`,
              payload?.dialogBoxSettings?.[i]?.msgBoxBtnYesText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnNoText`,
              payload?.dialogBoxSettings?.[i]?.msgBoxBtnNoText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnOkText`,
              payload?.dialogBoxSettings?.[i]?.msgBoxBtnOkText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].EmailSendingErrorMessage`,
              payload?.dialogBoxSettings?.[i]?.emailSendingErrorMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].NoInternetConnectionMessage`,
              payload?.dialogBoxSettings?.[i]?.noInternetConnectionMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].EmailSelectionErrorMessage`,
              payload?.dialogBoxSettings?.[i]?.emailSelectionErrorMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].BadFormatEmailMessage`,
              payload?.dialogBoxSettings?.[i]?.badFormatEmailMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsSendSimulationMails`,
              payload?.dialogBoxSettings?.[i]?.isSendSimulationMails || false
            )
            formData.append(
              `DialogBoxSettings[${i}].SimulationMailMessage`,
              payload?.dialogBoxSettings?.[i]?.simulationMailMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsDeleteWithoutConfirmation`,
              payload?.dialogBoxSettings?.[i]?.isDeleteWithoutConfirmation || false
            )
            formData.append(
              `DialogBoxSettings[${i}].IsDefault`,
              payload?.dialogBoxSettings?.[i]?.isDefault || false
            )
          }
        } else {
          formData.append(key.charAt(0).toLocaleUpperCase('en-US') + key.slice(1), payload[key])
        }
      })
      createPhishingReporter(formData)
        .then(() => {
          this.showModal = true
        })
        .finally(() => {
          this.isActionButtonDisabled = false
        })
    }
  }
}
</script>
