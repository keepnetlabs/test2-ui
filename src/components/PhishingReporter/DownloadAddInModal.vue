<template>
  <v-overlay :value="status" :z-index="99" fixed class="download-add-in">
    <UnlinkMicrosoftAccessDialog
      v-if="isShowUnlinkDialog"
      :status="isShowUnlinkDialog"
      @close="toggleUnlinkDialog"
    />
    <v-card
      light
      :class="[
        'overlay__container',
        isAccountConnected ? 'overlay__container-account-connected' : ''
      ]"
      style="
        border-radius: 12px !important;
        padding: 24px 24px 16px 24px !important;
        width: 820px !important;
        max-width: 820px !important;
      "
    >
      <v-list-item
        class="pl-0 pr-0 add-in-configuration__list-item"
        style="border-bottom: 1px solid #f5f7fa; padding-bottom: 16px;"
      >
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
          :src="require('../../assets/img/google-workspace.svg')"
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
          :is-loading="o365SpinnerStatus"
          class="flex-nowrap align-start"
          title-class="download-add-in__list-item-margin-title"
          hide-border
          title="Ribbon View"
          description="Ribbon Reporter requires authorization to Microsoft Graph API to function correctly."
        >
          <template #buttons>
            <div class="d-flex justify-end align-end flex-column gap-6">
              <VTooltip v-if="!isAccountConnected" bottom>
                <template #activator="{ on }">
                  <VBtn
                    v-on="on"
                    class="white--text btn-util btn-download-add-in text-capitalize"
                    color="#2196f3"
                    rounded
                    @click="handleConnectAccount"
                  >
                    Connect Account
                  </VBtn>
                </template>
                <span>
                  Connect your account to enable download.
                </span>
              </VTooltip>
              <VBtn
                v-else
                text
                rounded
                color="#F56C6C"
                style="
                  text-transform: capitalize;
                  font-weight: 600;
                  font-size: 12px;
                  border: 1px solid #f56c6c;
                "
                @click="toggleUnlinkDialog(false)"
              >
                <v-icon left>mdi-link-off</v-icon>
                <span>Unlink</span>
              </VBtn>
              <VBtn
                id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
                class="white--text btn-util btn-download-add-in"
                style="margin-left: 5px !important; text-transform: capitalize;"
                color="#2196f3"
                rounded
                :style="!isAccountConnected ? { opacity: 0.5, pointerEvents: 'none' } : ''"
                :loading="o365SpinnerStatus"
                @click="callForGenerateO365SpamAddIn"
              >
                <v-icon left>mdi-download</v-icon>
                Download
                <template #loader>
                  <img
                    src="../../assets/img/spinner.svg"
                    class="add-in-settings__spinner"
                    alt="spinner"
                  />
                  <span style="font-size: 14px; text-transform: capitalize;">
                    Generating...
                  </span>
                </template>
              </VBtn>
            </div>
          </template>
        </DownloadAddInListItem>
        <DownloadAddInListItem
          :is-loading="gmailSpinnerStatus"
          class="mt-n4"
          title="Page View"
          description="Users can report phishing directly from the main ribbon with a dedicated 'Report' button."
          :is-button-disabled="!isAccountConnected"
          :show-buttons="false"
          @button-click="callForGenerateO365AddIn"
        >
          <div class="download-add-in__list-item-page-view">
            <div class="d-flex flex-column">
              <div class="download-add-in__list-item-page-view-title">
                Graph API
              </div>
              <div class="download-add-in__list-item-page-view-desc">
                For Microsoft 365 environments using Graph API.
              </div>
            </div>
            <div>
              <VBtn
                id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
                class="white--text btn-util btn-download-add-in"
                style="margin-left: 5px !important; text-transform: capitalize;"
                color="#2196f3"
                rounded
                :style="!isAccountConnected ? { opacity: 0.5, pointerEvents: 'none' } : ''"
                :loading="gmailSpinnerStatus"
                @click="callForGenerateO365AddIn"
              >
                <v-icon left>mdi-download</v-icon>
                Download
                <template #loader>
                  <img
                    src="../../assets/img/spinner.svg"
                    class="add-in-settings__spinner"
                    alt="spinner"
                  />
                  <span style="font-size: 14px; text-transform: capitalize;">
                    Generating...
                  </span>
                </template>
              </VBtn>
            </div>
          </div>
          <div class="download-add-in__list-item-page-view">
            <div class="d-flex flex-column">
              <div class="download-add-in__list-item-page-view-title">
                On-Premise Exchange
              </div>
              <div class="download-add-in__list-item-page-view-desc">
                For on-premise Exchange environments that use EWS without Microsoft 365 integration.
              </div>
            </div>
            <div>
              <VBtn
                id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
                class="white--text btn-util btn-download-add-in"
                style="margin-left: 5px !important; text-transform: capitalize;"
                color="#2196f3"
                rounded
                :loading="onPremiseSpinnerStatus"
                @click="callForGenerateOnPremiseAddIn"
              >
                <v-icon left>mdi-download</v-icon>
                Download
                <template #loader>
                  <img
                    src="../../assets/img/spinner.svg"
                    class="add-in-settings__spinner"
                    alt="spinner"
                  />
                  <span style="font-size: 14px; text-transform: capitalize;">
                    Generating...
                  </span>
                </template>
              </VBtn>
            </div>
          </div>
          <AlertBox
            v-if="isAccountConnected"
            class="mt-4 w-100"
            style="background-color: rgba(67, 160, 71, 0.15);"
            icon-name="mdi-check-circle"
            icon-color="#43A047"
            :slots="{ primaryAction: false, secondaryAction: false }"
          >
            <template #text>
              <div class="ml-2" style="font-size: 14px; color: #383b41;">
                <div class="fw-600">GRAPH Authorization Successful</div>
                <div style="color: #000;">
                  All Phishing Reporters in your domain can now use the Graph APIs.
                </div>
              </div>
            </template>
          </AlertBox>
        </DownloadAddInListItem>
        <DownloadAddInListItem
          :is-loading="diagnosticToolSpinnerStatus"
          hide-border
          title="Diagnostic Tool"
          description="Only for Outlook Desktop (Windows OS only)"
          @button-click="callForGenerateDiagnosticTool"
        />
      </div>
      <v-list-item
        class="px-0 mt-0 pt-2 add-in-configuration__list-item"
        style="border-top: 1px solid #f5f7fa;"
      >
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
  connectGraphAccount,
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  downloadSpamReport,
  generateDiagnosticTool,
  generateGoogleWorkSpaceAddIn,
  generateO365AddIn,
  generateOutlookAddIn
} from '@/api/phishingReporter'
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'
import AlertBox from '@/components/AlertBox.vue'
import UnlinkMicrosoftAccessDialog from '@/components/PhishingReporter/UnlinkMicrosoftAccessDialog.vue'
export default {
  name: 'DownloadAddInModal',
  props: {
    status: {
      type: Boolean
    },
    formData: {
      type: Object
    }
  },
  components: {
    UnlinkMicrosoftAccessDialog,
    AlertBox,
    DownloadAddInListItem
  },
  data() {
    return {
      outlookSpinnerStatus: false,
      onPremiseSpinnerStatus: false,
      isAccountConnected: this.formData ? this.formData.isGraphAccountConnected : false,
      isShowUnlinkDialog: false,
      diagnosticToolSpinnerStatus: false,
      downloadOutlookAddInTimeout: null,
      diagnosticToolAddInTimeout: null,
      gmailSpinnerStatus: false,
      o365SpinnerStatus: false,
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
    callForGenerateO365AddIn(isShowSpinner = true) {
      if (isShowSpinner) this.gmailSpinnerStatus = true
      return generateO365AddIn()
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Microsoft365PhishingReporterAddin.xml`
          link.click()
        })
        .finally(() => {
          if (isShowSpinner) this.gmailSpinnerStatus = false
        })
    },
    callForGenerateOnPremiseAddIn() {
      this.onPremiseSpinnerStatus = true
      this.callForGenerateO365AddIn(false).finally(() => {
        this.onPremiseSpinnerStatus = false
      })
    },
    callForGenerateO365SpamAddIn() {
      this.o365SpinnerStatus = true
      downloadSpamReport()
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `MicrosoftPhishingReporterRibbon.xml`
          link.click()
        })
        .finally(() => {
          this.o365SpinnerStatus = false
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
    },
    toggleUnlinkDialog(forceUpdate = false) {
      if (forceUpdate) {
        this.formData.isGraphAccountConnected = false
        this.isAccountConnected = false
      }
      this.isShowUnlinkDialog = !this.isShowUnlinkDialog
    },
    handleConnectAccount() {
      connectGraphAccount().then((response) => {
        const {
          data: { data }
        } = response
        window.location.href = `https://login.microsoftonline.com/common/adminconsent?client_id=${
          data.applicationId
        }&redirect_uri=${data.redirectUri ? data.redirectUri : window.location.href}`
      })
    }
  }
}
</script>
