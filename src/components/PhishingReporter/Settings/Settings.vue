<template>
  <div
    class="settings"
    id="settings"
    :class="[
      inModal && 'settings__in-modal',
      applicationType === 'DiagnosticTool' && 'settings__in-modal--diagnostic-tool'
    ]"
  >
    <download-add-in-modal
      v-if="downloadAddInModalStatus"
      :status="downloadAddInModalStatus"
      :form-data="formData"
      @handleClose="downloadAddInModalStatus = false"
    />
    <el-tabs
      id="settings-el-tabs"
      v-model="tab"
      v-if="!inModal || applicationType !== 'DiagnosticTool'"
      class="k-sub-tab mt-2"
    >
      <el-tab-pane
        v-if="!inModal || applicationType !== 'DiagnosticTool'"
        class="pt-6"
        label="Add-in Settings"
        name="phishing-reporter-settings-add-in-settings"
        id="phishing-reporter-settings-add-in-settings-content"
      >
        <addin-settings
          ref="refAddinSettings"
          :formData="formData"
          :spinnerStatus="spinnerStatus"
          :show-footer="!inModal"
          :show-header-link="!inModal"
          :showForm="!inModal"
          :saveDisable="saveDisable"
          @updateForm="callForCreatePhishingReporter"
      /></el-tab-pane>
      <el-tab-pane
        v-if="!inModal || applicationType !== 'DiagnosticTool'"
        class="pt-6"
        label="Email Settings"
        name="phishing-reporter-settings-email-settings"
        id="phishing-reporter-settings-email-settings-content"
      >
        <email-settings
          ref="refEmailSettings"
          :formData="formData"
          :show-footer="!inModal"
          :showHeaderLink="!inModal"
          :showForm="!inModal"
          :saveDisable="saveDisable"
          @updateForm="callForCreatePhishingReporter"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="!inModal || applicationType !== 'DiagnosticTool'"
        class="pt-6"
        label="Other Settings"
        name="phishing-reporter-settings-other-settings"
        id="phishing-reporter-settings-other-settings-content"
      >
        <other-settings
          ref="refOtherSettings"
          :formData="formData"
          :show-footer="!inModal"
          :show-header-link="!inModal"
          :showForm="!inModal"
          :saveDisable="saveDisable"
          @updateForm="callForCreatePhishingReporter"
        />
      </el-tab-pane>
      <el-tab-pane
        v-if="!inModal || applicationType === 'DiagnosticTool'"
        class="pt-6"
        id="phishing-reporter-settings-diagnostic-tool-content"
        label="Diagnostic Tool"
        name="phishing-reporter-settings-diagnostic-tool"
      >
        <diagnostic-tool
          ref="refDiagnosticTool"
          :formData="formData"
          :show-footer="!inModal"
          :show-header-link="!inModal"
          :showForm="!inModal"
          :saveDisable="saveDisable"
          @updateForm="callForCreatePhishingReporter"
        />
      </el-tab-pane>
    </el-tabs>
    <div v-else>
      <diagnostic-tool
        ref="refDiagnosticTool"
        :formData="formData"
        :show-footer="!inModal"
        :show-header-link="!inModal"
        :showForm="!inModal"
        :saveDisable="saveDisable"
        @updateForm="callForCreatePhishingReporter"
      />
    </div>
  </div>
</template>

<script>
import AddinSettings from './AddinSettings'
import DiagnosticTool from './DiagnosticTool'
import EmailSettings from './EmailSettings'
import OtherSettings from './OtherSettings'
import { createGraphAccount, createPhishingReporter } from '@/api/phishingReporter'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import DownloadAddInModal from '../DownloadAddInModal'
import labels from '@/model/constants/labels'
export default {
  name: 'Settings',
  components: {
    DownloadAddInModal,
    AddinSettings,
    EmailSettings,
    OtherSettings,
    DiagnosticTool
  },
  props: {
    formData: {
      type: Object,
      default: null
    },
    inModal: {
      type: Boolean,
      default: false
    },
    applicationType: {
      type: String,
      default: COMMON_CONSTANTS.OUTLOOK
    }
  },
  data() {
    return {
      saveDisable: false,
      tab: 'phishing-reporter-settings-add-in-settings',
      spinnerStatus: false,
      downloadAddInModalStatus: false,
      isMicrosoftEmailCreationInitial: false,
      tenantId: ''
    }
  },
  watch: {
    formData() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.tab !== 'phishing-reporter-settings-add-in-settings') {
            let transformValue
            if (this.tab === 'phishing-reporter-settings-email-settings') {
              transformValue = 'translateX(130px)'
            } else if (this.tab === 'phishing-reporter-settings-other-settings') {
              transformValue = 'translateX(253px)'
            } else {
              transformValue = 'translateX(379px)'
            }
            document
              .querySelector('#settings-el-tabs')
              .querySelector('.el-tabs__active-bar').style.transform = transformValue
          }
        }, 100)
      })
    }
  },
  created() {
    const { query = {} } = this.$route
    const { tenant = '', error = '', error_description = '', error_subcode = '' } = query
    this.isMicrosoftEmailCreationInitial = !tenant
    const errorSubCodeMessage =
      error_subcode === 'cancel' ? labels.ErrorMicrosoftCreationMessage : ''
    const errorMessage = error && (error_description || errorSubCodeMessage)
    if (!this.isMicrosoftEmailCreationInitial || errorMessage) {
      if (errorMessage) {
        this.$store.dispatch('common/createSnackBar', {
          message: errorMessage,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
        this.downloadAddInModalStatus = true
      } else {
        this.tenantId = tenant
        createGraphAccount({ tenantId: this.tenantId }).then(() => {
          this.formData.isGraphAccountConnected = true
          this.downloadAddInModalStatus = true
        })
        this.$router.replace('/phishing-reporter')
      }
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    },
    activateLoader(value = 1) {
      this.$store.dispatch('common/activateLoader', value)
    },
    callForCreatePhishingReporter(updatedValues) {
      this.saveDisable = true
      let addinSettings = this?.$refs?.refAddinSettings?.getFormValues() || {}
      const emailSettings = this?.$refs?.refEmailSettings?.getFormValues() || {}
      const otherSettingsFormValues = this?.$refs?.refOtherSettings?.getFormValues() || {}
      const otherSettings = {
        companyKey: localStorage.getItem('companyId'),
        enableEnterpriseVault: false,
        apiKey: APP_CONFIG.VUE_APP_API_KEY || '9DtfGZnBazfjbZ47VJJZ2NNV6BXry6gxkmpRWAhX',
        apiUrl:
          APP_CONFIG.VUE_APP_PHISHING_REPORTER_URL || 'https://test-addin-api.devkeepnet.com/api',
        ...otherSettingsFormValues
      }
      const diagnosticTool = this?.$refs?.refDiagnosticTool?.getFormValues() || {}
      const newFormData = {
        ...this.formData,
        ...addinSettings,
        ...emailSettings,
        ...otherSettings,
        ...diagnosticTool,
        ...updatedValues
      }
      //this is added for previewing and deleting obj key on sending
      if (!newFormData?.file?.name) {
        delete newFormData.file
      }
      const formData = new FormData()
      Object.keys(newFormData).forEach((key) => {
        if (key === 'dialogBoxSettings') {
          for (let i = 0; i < newFormData.dialogBoxSettings.length; i++) {
            formData.append(
              `DialogBoxSettings[${i}].LanguageName`,
              newFormData?.dialogBoxSettings?.[i]?.languageName || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].LanguageResourceId`,
              newFormData?.dialogBoxSettings?.[i]?.languageResourceId || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxTitle`,
              newFormData?.dialogBoxSettings?.[i]?.msgBoxTitle || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnCancelText`,
              newFormData?.dialogBoxSettings?.[i]?.msgBoxBtnCancelText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].AnalysisConfirmationMessage`,
              newFormData?.dialogBoxSettings?.[i]?.analysisConfirmationMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsConfirmationBeforeAnalysis`,
              newFormData?.dialogBoxSettings?.[i]?.isConfirmationBeforeAnalysis || false
            )
            formData.append(
              `DialogBoxSettings[${i}].AnalysisEmailDeleteMessage`,
              newFormData?.dialogBoxSettings?.[i]?.analysisEmailDeleteMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].AnalysisThankYouMessage`,
              newFormData?.dialogBoxSettings?.[i]?.analysisThankYouMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsDeleteEmailBeforeAnalysis`,
              newFormData?.dialogBoxSettings?.[i]?.isDeleteEmailBeforeAnalysis || false
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnYesText`,
              newFormData?.dialogBoxSettings?.[i]?.msgBoxBtnYesText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnNoText`,
              newFormData?.dialogBoxSettings?.[i]?.msgBoxBtnNoText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].MsgBoxBtnOkText`,
              newFormData?.dialogBoxSettings?.[i]?.msgBoxBtnOkText || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].EmailSendingErrorMessage`,
              newFormData?.dialogBoxSettings?.[i]?.emailSendingErrorMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].NoInternetConnectionMessage`,
              newFormData?.dialogBoxSettings?.[i]?.noInternetConnectionMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].EmailSelectionErrorMessage`,
              newFormData?.dialogBoxSettings?.[i]?.emailSelectionErrorMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].BadFormatEmailMessage`,
              newFormData?.dialogBoxSettings?.[i]?.badFormatEmailMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsSendSimulationMails`,
              newFormData?.dialogBoxSettings?.[i]?.isSendSimulationMails || false
            )
            formData.append(
              `DialogBoxSettings[${i}].SimulationMailMessage`,
              newFormData?.dialogBoxSettings?.[i]?.simulationMailMessage || ''
            )
            formData.append(
              `DialogBoxSettings[${i}].IsDeleteWithoutConfirmation`,
              newFormData?.dialogBoxSettings?.[i]?.isDeleteWithoutConfirmation || false
            )
            formData.append(
              `DialogBoxSettings[${i}].IsDefault`,
              newFormData?.dialogBoxSettings?.[i]?.isDefault || false
            )
          }
        } else {
          formData.append(
            key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1),
            this.getFormDataValue(newFormData[key])
          )
        }
      })

      if (updatedValues.isAddIn) {
        this.activateLoader()
      }
      createPhishingReporter(formData)
        .then(() => {
          this.saveDisable = false
          this.$emit('getPhishingReport')
          if (updatedValues.isAddIn) {
            this.activateLoader(-1)
            this.downloadAddInModalStatus = true
          }
        })
        .catch(() => {
          this.saveDisable = false
          this.$emit('getPhishingReport')
          if (updatedValues.isAddIn) {
            this.activateLoader(-1)
          }
        })
    },
    getFormDataValue(value = '') {
      return value === null || value === undefined ? '' : value
    }
  }
}
</script>
