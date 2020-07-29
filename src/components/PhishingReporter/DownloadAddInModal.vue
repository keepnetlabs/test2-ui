<template>
  <v-overlay :value="status" :z-index="9999" fixed class="download-add-in">
    <v-card
      class="overlay__container"
      light
      style="
        border-radius: 12px !important;
        padding: 24px 24px 16px 24px !important;
        width: 600px !important;
      "
    >
      <v-list-item class="pl-0 pr-0 add-in-configuration__list-item">
        <div class="v-btn v-cart-icon-wrapper">
          <v-icon class="ml-2" color="blue" left medium>mdi-download</v-icon>
        </div>
        <v-list-item-content class="pt-0 pb-0">
          <v-list-item-title class="v-card-headline download-add-in__title"
            >Download Add-in</v-list-item-title
          >
          <v-list-item-subtitle class="v-card-sub-header"
            >You can download the add-in below
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="pl-0 pr-0 add-in-configuration__list-item">
        <div class="logos-buttons__container">
          <logos wrapperClasses="mt-10 logos" />
          <div class="buttons__container">
            <v-btn class="white--text btn-util btn-download-add-in" color="#2196f3" rounded>
              <v-icon left>mdi-download</v-icon>
              Download
            </v-btn>
            <v-btn
              class="white--text btn-util btn-download-add-in"
              style="margin-left: -6px;"
              color="#2196f3"
              rounded
              :loading="outlookSpinnerStatus"
              @click="callForGenerateOutlookAddIn"
            >
              <v-icon left>mdi-download</v-icon>
              Download
              <template v-slot:loader>
                <img src="../../assets/img/spinner.svg" class="add-in-settings__spinner" />
                <span style="font-size: 14px; text-transform: capitalize;">
                  Generating...
                </span>
              </template>
            </v-btn>
            <v-btn class="white--text btn-util btn-download-add-in mr-n1" color="#2196f3" rounded>
              <v-icon left>mdi-download</v-icon>
              Download
            </v-btn>
          </div>
        </div>
      </v-list-item>
      <v-list-item class="pl-0 pr-0 mt-2 add-in-configuration__list-item">
        <div class="link__container">
          <img src="../../assets/img/copy-icon.png" />
          <div class="link__text ml-2">Copy Link</div>
        </div>
      </v-list-item>

      <v-list-item class="px-0 d-flex align-end mt-6 add-in-configuration__list-item">
        <div class="link__header">Diagnostic Tool</div>
      </v-list-item>
      <v-list-item class="px-0 d-flex align-start add-in-configuration__list-item">
        <div class="link__sub-header">Only for Outlook Desktop (Windows OS only)</div>
      </v-list-item>
      <v-list-item class="px-0 mt-n3 modal__container add-in-configuration__list-item">
        <diagnostic-tool :isInModal="true" :showFooter="false" :showHeader="false" />
      </v-list-item>
      <v-list-item class="px-0 add-in-configuration__list-item mt-5">
        <v-btn
          @click="callForGenerateDiagnosticTool"
          class="white--text btn-util btn-download-add-in ml-n1"
          color="#2196f3"
          :loading="diagnosticToolSpinnerStatus"
          rounded
        >
          <v-icon left>mdi-download</v-icon>
          Download
          <template v-slot:loader>
            <img src="../../assets/img/spinner.svg" class="add-in-settings__spinner" />
            <span style="font-size: 14px; text-transform: capitalize;">
              Generating...
            </span>
          </template>
        </v-btn>
      </v-list-item>
      <v-list-item class="px-0 mt-12 add-in-configuration__list-item">
        <div class="px-0 overlay__footer">
          <a
            class="overlay__footer-text download-add-in__link"
            href="https://doc.keepnetlabs.com/technical-guide/phishing-reporter-add-in/generating-add-in"
            target="_blank"
          >
            Installation and configuration guide
          </a>
          <div @click="$emit('handleClose')" class="overlay__footer-text download-add-in__link">
            Close
          </div>
        </div>
      </v-list-item>
    </v-card>
  </v-overlay>
</template>

<script>
import Logos from './Logos'
import DiagnosticTool from './Settings/DiagnosticTool'
import {
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  generateDiagnosticTool,
  generateOutlookAddIn
} from '../../api/phishingReporter'
export default {
  name: 'DownloadAddInModal',
  props: {
    status: {
      type: Boolean
    }
  },
  components: {
    Logos,
    DiagnosticTool
  },
  methods: {
    callForGenerateOutlookAddIn() {
      generateOutlookAddIn()
        .then((response) => {
          this.outlookSpinnerStatus = true
          this.callForDownloadOutlookAddIn(response.data.data.transactionId)
        })
        .catch((error) => {})
    },
    callForDownloadOutlookAddIn(transactionId) {
      downloadOutlookAddIn(transactionId)
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
            const timeout = setTimeout(() => {
              this.callForDownloadOutlookAddIn(transactionId)
            }, 7500)
          } else {
            this.outlookSpinnerStatus = false
          }
        })
    },
    callForGenerateDiagnosticTool() {
      generateDiagnosticTool().then((response) => {
        this.diagnosticToolSpinnerStatus = true
        response.data.data && this.callForDownloadDiagnosticTool(response.data.data.transactionId)
      })
    },
    callForDownloadDiagnosticTool(id) {
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
    }
  },
  data() {
    return {
      outlookSpinnerStatus: false,
      diagnosticToolSpinnerStatus: false
    }
  }
}
</script>

<style lang="scss">
.btn-download-add-in {
  padding: 2px 16px 2px 22px !important;
  .v-icon {
    margin-top: 2px;
  }
  .v-btn__loader {
    padding-right: 8px;
  }
}
</style>
