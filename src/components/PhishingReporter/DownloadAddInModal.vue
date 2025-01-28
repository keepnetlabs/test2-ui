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
          class="flex-nowrap"
          hide-border
          title="Spam Integration"
          description="Advanced XML add-in for web-based M365 emails, requires admin consent"
        >
          <template #buttons>
            <div :style="{ minWidth: !isAccountConnected ? '294px' : 'auto' }">
              <VBtn
                v-if="!isAccountConnected"
                class="white--text btn-util btn-download-add-in"
                style="margin-left: 5px !important; text-transform: capitalize;"
                color="#2196f3"
                rounded
                @click="handleConnectAccount"
              >
                Connect Account
              </VBtn>
              <VBtn
                v-else
                text
                color="#F56C6C"
                style="text-transform: capitalize; font-weight: 600; font-size: 12px;"
                @click="toggleUnlinkDialog"
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
          title="Legacy Version"
          description="Basic XML add-in for web-based M365 emails"
          @button-click="callForGenerateO365AddIn"
        >
          <AlertBox
            class="bg-phishing-gray mt-4"
            icon-color="#757575"
            icon-name="mdi-information"
            :slots="{ primaryAction: false, secondaryAction: false }"
          >
            <template #text>
              <span class="ml-2" style="font-size: 14px;"
                ><strong>M365 Spam Integration</strong> provides improved spam detection, more
                accurate reports, and seamless compatibility with Microsoft tools. Without it, only
                basic reporting features are available.</span
              >
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
  connectGraphAccount,
  createGraphAccount,
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
    callForGenerateO365SpamAddIn() {
      this.o365SpinnerStatus = true
      downloadSpamReport()
        .then((response) => {
          const { data } = response
          const link = document.createElement('a')
          link.href = window.URL.createObjectURL(data)
          link.download = `Microsoft365PhishingReporterSpamAddin.xml`
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
      if (forceUpdate) this.isShowUnlinkDialog = false
      this.isShowUnlinkDialog = !this.isShowUnlinkDialog
    },
    handleUnlinkMicrosoftDialog() {},
    handleConnectAccount() {
      connectGraphAccount().then((response) => {
        const {
          data: { data }
        } = response
        console.log('data', data)
        const { applicationId, redirectUrl } = data
      })
    }
  }
}
</script>
