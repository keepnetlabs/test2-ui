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
      @handleClose="downloadAddInModalStatus = false"
    />
    <el-tabs id="settings-el-tabs" v-model="tab" v-if="!inModal || applicationType === 'Outlook'">
      <el-tab-pane
        label="Add-in Settings"
        name="phishing-reporter-settings-add-in-settings"
        id="phishing-reporter-settings-add-in-settings-content"
        v-if="!inModal || applicationType === 'Outlook'"
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
        label="Email Settings"
        name="phishing-reporter-settings-email-settings"
        id="phishing-reporter-settings-email-settings-content"
        v-if="!inModal || applicationType === 'Outlook'"
      >
        <email-settings
          ref="refEmailSettings"
          :formData="formData"
          @updateForm="callForCreatePhishingReporter"
          :show-footer="!inModal"
          :showHeaderLink="!inModal"
          :showForm="!inModal"
          :saveDisable="saveDisable"
        />
      </el-tab-pane>
      <el-tab-pane
        label="Other Settings"
        name="phishing-reporter-settings-other-settings"
        id="phishing-reporter-settings-other-settings-content"
        v-if="!inModal || applicationType === 'Outlook'"
      >
        <other-settings
          :formData="formData"
          ref="refOtherSettings"
          @updateForm="callForCreatePhishingReporter"
          :show-footer="!inModal"
          :show-header-link="!inModal"
          :showForm="!inModal"
          :saveDisable="saveDisable"
        />
      </el-tab-pane>
      <el-tab-pane
        label="Diagnostic Tool"
        name="phishing-reporter-settings-diagnostic-tool"
        id="phishing-reporter-settings-diagnostic-tool-content"
        v-if="!inModal || applicationType === 'DiagnosticTool'"
      >
        <diagnostic-tool
          ref="refDiagnosticTool"
          :formData="formData"
          @updateForm="callForCreatePhishingReporter"
          :show-footer="!inModal"
          :show-header-link="!inModal"
          :showForm="!inModal"
          :saveDisable="saveDisable"
        />
      </el-tab-pane>
    </el-tabs>
    <div v-else>
      <diagnostic-tool
        ref="refDiagnosticTool"
        :formData="formData"
        @updateForm="callForCreatePhishingReporter"
        :show-footer="!inModal"
        :show-header-link="!inModal"
        :showForm="!inModal"
        :saveDisable="saveDisable"
      />
    </div>
  </div>
</template>

<script>
import AddinSettings from './AddinSettings'
import DiagnosticTool from './DiagnosticTool'
import EmailSettings from './EmailSettings'
import OtherSettings from './OtherSettings'
import { createPhishingReporter } from '@/api/phishingReporter'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import DownloadAddInModal from '../DownloadAddInModal'
export default {
  name: 'Settings',
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
  components: {
    DownloadAddInModal,
    AddinSettings,
    EmailSettings,
    OtherSettings,
    DiagnosticTool
  },
  data() {
    return {
      saveDisable: false,
      tab: 'phishing-reporter-settings-add-in-settings',
      spinnerStatus: false,
      downloadAddInModalStatus: false
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
      const otherSettings = this?.$refs?.refOtherSettings?.getFormValues() || {}
      const diagnosticTool = this?.$refs?.refDiagnosticTool?.getFormValues() || {}

      addinSettings = {
        ...addinSettings,
        analysisConfirmationMessage: addinSettings.analysisConfirmationMessage || '',
        analysisEmailDeleteMessage: addinSettings.analysisEmailDeleteMessage || '',
        simulationMailMessage: addinSettings.simulationMailMessage || ''
      }

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
        formData.append(
          key.charAt(0).toLocaleUpperCase('en-EN') + key.slice(1),
          newFormData[key] === null || newFormData[key] === undefined ? '' : newFormData[key]
        )
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
    }
  }
}
</script>
