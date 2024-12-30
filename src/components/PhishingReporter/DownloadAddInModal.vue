<template>
  <v-overlay :value="status" :z-index="9999" fixed class="download-add-in">
    <v-card
      class="overlay__container"
      light
      style="
        border-radius: 12px !important;
        padding: 24px 24px 16px 24px !important;
        width: 800px !important;
        max-width: 800px !important;
      "
    >
      <v-list-item class="pl-0 pr-0 add-in-configuration__list-item">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon class="ml-2" color="blue" left medium>mdi-download</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title
            id="text--phishing-reporter-download-add-in-modal-title"
            class="v-card-headline download-add-in__title"
            >Download Add-in</v-list-item-title
          >
          <v-list-item-subtitle
            id="text--phishing-reporter-download-add-in-modal-subtitle"
            class="v-card-sub-header"
            >You can download the add-in below
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <div class="mt-4">
        <DownloadAddInListItem
          :src="require('../../assets/img/google-workspace.png')"
          :is-loading="googleWorkSpaceSpinnerStatus"
          description="JSON add-in for web-based Google Workspace emails"
          @button-click="callForGenerateGoogleWorkSpaceAddIn"
        />
        <DownloadAddInListItem
          :src="require('../../assets/img/outlook.svg')"
          :is-loading="outlookSpinnerStatus"
          description="MSI add-in for Windows Outlook Desktop"
          @button-click="callForGenerateOutlookAddIn"
        />
        <DownloadAddInListItem
          :src="require('../../assets/img/microsoft-365-logo.svg')"
          :is-loading="gmailSpinnerStatus"
          title="Legacy Version"
          description="Basic XML add-in for web-based M365 emails"
          @button-click="callForGenerateO365AddIn"
        />
        <DownloadAddInListItem
          :is-loading="diagnosticToolSpinnerStatus"
          title="Diagnostic Tool"
          description="Only for Outlook Desktop (Windows OS only)"
          @button-click="callForGenerateDiagnosticTool"
        />
      </div>
      <v-list-item class="px-0 mt-6 add-in-configuration__list-item">
        <div class="px-0 overlay__footer" style="display: flex; justify-content: flex-end;">
          <div
            @click="$emit('handleClose')"
            id="btn-cancel--phishing-reporter-settings-download-add-in-modal"
            class="overlay__footer-text download-add-in__link"
          >
            Close
          </div>
        </div>
      </v-list-item>
    </v-card>
  </v-overlay>
</template>

<script>
import {
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  generateDiagnosticTool,
  generateGoogleWorkSpaceAddIn,
  generateO365AddIn,
  generateOutlookAddIn
} from '@/api/phishingReporter'
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'
export default {
  name: 'DownloadAddInModal',
  props: {
    status: {
      type: Boolean
    }
  },
  components: {
    DownloadAddInListItem
  },
  data() {
    return {
      outlookSpinnerStatus: false,
      diagnosticToolSpinnerStatus: false,
      downloadOutlookAddInTimeout: null,
      diagnosticToolAddInTimeout: null,
      gmailSpinnerStatus: false,
      googleWorkSpaceSpinnerStatus: false
    }
  },
  methods: {
    callForGenerateGoogleWorkSpaceAddIn() {
      this.googleWorkSpaceSpinnerStatus = true
      generateGoogleWorkSpaceAddIn()
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `GoogleWorkspaceAddIn.zip`
          link.click()
        })
        .finally(() => {
          this.googleWorkSpaceSpinnerStatus = false
        })
    },
    callForGenerateOutlookAddIn() {
      this.outlookSpinnerStatus = true
      generateOutlookAddIn()
        .then((response) => {
          this.callForDownloadOutlookAddIn(response.data.data.resourceId)
        })
        .catch(() => {
          this.outlookSpinnerStatus = false
        })
    },
    callForGenerateO365AddIn() {
      this.gmailSpinnerStatus = true
      generateO365AddIn()
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Microsoft365PhishingReporterAddin.xml`
          link.click()
        })
        .finally(() => {
          this.gmailSpinnerStatus = false
        })
    },
    callForDownloadOutlookAddIn(resourceId) {
      downloadOutlookAddIn(resourceId)
        .then((response) => {
          this.outlookSpinnerStatus = false
          this.clearOutlookAddInTimeout()
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `OutlookPhishingReporter.msi`
          link.click()
        })
        .catch((error) => {
          if (error && error.response && error.response.status === 404) {
            this.outlookSpinnerStatus = true
            this.downloadOutlookAddInTimeout = setTimeout(() => {
              this.callForDownloadOutlookAddIn(resourceId)
            }, 7500)
          } else {
            this.outlookSpinnerStatus = false
            this.clearOutlookAddInTimeout()
          }
        })
    },
    callForGenerateDiagnosticTool() {
      generateDiagnosticTool().then((response) => {
        this.diagnosticToolSpinnerStatus = true
        response.data.data && this.callForDownloadDiagnosticTool(response.data.data.resourceId)
      })
    },
    callForDownloadDiagnosticTool(id) {
      downloadDiagnosticTool(id)
        .then((response) => {
          this.diagnosticToolSpinnerStatus = false
          this.clearDiagnosticToolTimeout()
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `DiagnosticTool.msi`
          link.click()
        })
        .catch((error) => {
          //if status is equal to 404 that mean it needs to call api again.
          if (error && error.response && error.response.status === 404) {
            this.diagnosticToolSpinnerStatus = true
            this.diagnosticToolAddInTimeout = setTimeout(() => {
              this.callForDownloadDiagnosticTool(id)
            }, 7500)
          } else {
            this.diagnosticToolSpinnerStatus = false
            this.clearDiagnosticToolTimeout()
          }
        })
    },
    clearDiagnosticToolTimeout() {
      if (this.diagnosticToolAddInTimeout) {
        clearTimeout(this.diagnosticToolAddInTimeout)
        this.diagnosticToolAddInTimeout = null
      }
    },
    clearOutlookAddInTimeout() {
      if (this.downloadOutlookAddInTimeout) {
        clearTimeout(this.downloadOutlookAddInTimeout)
        this.downloadOutlookAddInTimeout = null
      }
    }
  }
}
</script>
