<template>
  <v-overlay :value="status" :z-index="9999" fixed class="download-add-in">
    <v-card
      class="overlay__container"
      light
      style="
        border-radius: 12px !important;
        padding: 24px 24px 16px 24px !important;
        width: 700px !important;
        max-width: 700px !important;
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
      <v-list-item class="pl-0 pr-0 add-in-configuration__list-item">
        <div class="logos-buttons__container mt-10">
          <div class="logos-buttons__first-row">
            <div class="logo-and-button">
              <div style="display: flex; align-items: center; height: 40px;">
                <img src="../../assets/img/google-workspace.png" alt="g-suite-logo" />
              </div>
              <v-btn
                id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
                class="white--text btn-util btn-download-add-in"
                style="margin-left: 5px !important;"
                color="#2196f3"
                rounded
                :loading="googleWorkSpaceSpinnerStatus"
                @click="callForGenerateGoogleWorkSpaceAddIn"
              >
                <v-icon left>mdi-download</v-icon>
                Download
                <template v-slot:loader>
                  <img
                    src="../../assets/img/spinner.svg"
                    class="add-in-settings__spinner"
                    alt="spinner"
                  />
                  <span style="font-size: 14px; text-transform: capitalize;">
                    Generating...
                  </span>
                </template>
              </v-btn>
            </div>
            <div class="logo-and-button">
              <div style="height: 40px;">
                <img src="../../assets/img/outlook.svg" alt="outlook-logo" />
              </div>
              <v-btn
                id="btn-download-outlook--phishing-reporter-settings-add-in-modal"
                class="white--text btn-util btn-download-add-in ml-5"
                style="margin-left: -6px;"
                color="#2196f3"
                rounded
                :loading="outlookSpinnerStatus"
                @click="callForGenerateOutlookAddIn"
              >
                <v-icon left>mdi-download</v-icon>
                Download
                <template v-slot:loader>
                  <img
                    src="../../assets/img/spinner.svg"
                    class="add-in-settings__spinner"
                    alt="spinner"
                  />
                  <span style="font-size: 14px; text-transform: capitalize;">
                    Generating...
                  </span>
                </template>
              </v-btn>
            </div>
            <div class="logo-and-button">
              <div style="height: 35px;">
                <img src="../../assets/img/microsoft-365-logo.svg" alt="microsoft-365-logo" />
              </div>
              <v-btn
                id="btn-download-office--phishing-reporter-settings-add-in-modal"
                class="white--text btn-util btn-download-add-in mr-n1"
                color="#2196f3"
                rounded
                :loading="gmailSpinnerStatus"
                @click="callForGenerateO365AddIn"
              >
                <v-icon left>mdi-download</v-icon>
                Download
                <template v-slot:loader>
                  <img
                    src="../../assets/img/spinner.svg"
                    class="add-in-settings__spinner"
                    alt="spinner"
                  />
                  <span style="font-size: 14px; text-transform: capitalize;">
                    Generating...
                  </span>
                </template>
              </v-btn>
            </div>
          </div>
        </div>
      </v-list-item>
      <v-list-item class="pl-0 pr-0 mt-2 add-in-configuration__list-item">
        <div class="link__container"></div>
      </v-list-item>

      <v-list-item class="px-0 d-flex align-end mt-6 add-in-configuration__list-item">
        <div class="link__header">Diagnostic Tool</div>
      </v-list-item>
      <v-list-item class="px-0 d-flex align-start add-in-configuration__list-item">
        <div class="link__sub-header">
          Only for Outlook Desktop (Windows OS only)
        </div>
      </v-list-item>
      <v-list-item class="px-0 mt-n3 modal__container add-in-configuration__list-item">
        <diagnostic-tool :isInModal="true" :showFooter="false" :showHeader="false" />
      </v-list-item>
      <v-list-item class="px-0 add-in-configuration__list-item mt-5" style="margin-left: 30px;">
        <v-btn
          @click="callForGenerateDiagnosticTool"
          id="btn-download-diagnostic-tool--phishing-reporter-settings-add-in-modal"
          class="white--text btn-util btn-download-add-in ml-n1"
          color="#2196f3"
          :loading="diagnosticToolSpinnerStatus"
          rounded
        >
          <v-icon left>mdi-download</v-icon>
          Download
          <template v-slot:loader>
            <img
              src="../../assets/img/spinner.svg"
              class="add-in-settings__spinner"
              alt="spinner"
            />
            <span style="font-size: 14px; text-transform: capitalize;">
              Generating...
            </span>
          </template>
        </v-btn>
      </v-list-item>
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
import DiagnosticTool from './Settings/DiagnosticTool'
import {
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  generateDiagnosticTool,
  generateGoogleWorkSpaceAddIn,
  generateO365AddIn,
  generateOutlookAddIn
} from '@/api/phishingReporter'
export default {
  name: 'DownloadAddInModal',
  props: {
    status: {
      type: Boolean
    }
  },
  components: {
    // Logos,
    DiagnosticTool
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
