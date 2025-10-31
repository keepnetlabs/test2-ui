<template>
  <v-overlay :value="status" :z-index="99" fixed class="download-add-in">
    <DelegatedLevelAuthorizationDialog
      v-if="showDelegatedLevelAuthorizationDialog"
      :status="showDelegatedLevelAuthorizationDialog"
      :is-authorizing="isDelegatedLevelAuthorizing"
      :is-authorized="isAccountConnected"
      @close="closeDelegatedLevelAuthorizationDialog"
      @cancel="closeDelegatedLevelAuthorizationDialog"
      @copy-link="handleCopyDelegatedLevelAuthorizationLink"
      @authorize-now="handleAuthorizeDelegatedLevelNow"
      @revoke-authorization="handleRevokeDelegatedLevelAuthorization"
    />
    <ApplicationLevelAuthorizationDialog
      v-if="showApplicationLevelDialog"
      :status="showApplicationLevelDialog"
      :is-authorizing="isApplicationLevelAuthorizing"
      :is-authorized="isApplicationLevelAuthorized"
      @close="closeApplicationLevelDialog"
      @cancel="closeApplicationLevelDialog"
      @copy-link="handleCopyApplicationLevelLink"
      @authorize-now="handleAuthorizeApplicationLevel"
      @revoke-authorization="handleRevokeApplicationLevelAuthorization"
    />
    <v-card
      light
      :class="['overlay__container', 'overlay__container-account']"
      style="
        border-radius: 12px !important;
        padding: 24px 24px 16px 24px !important;
        width: 930px !important;
        max-width: 930px !important;
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
          :src="require('../../assets/img/microsoft-365-logo.svg')"
          :is-loading="o365SpinnerStatus"
          class="flex-nowrap align-start"
          title-class="download-add-in__list-item-margin-title"
          hide-border
          title="Authorize GRAPH APIs (Delegated Access)"
          description="Enables phishing email reporting from Outlook Ribbon and Page Views using delegated permissions."
        >
          <template #buttons>
            <div class="d-flex justify-end align-self-center mt-8 flex-column gap-6">
              <VBtn
                id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
                class="btn-util btn-download-add-in"
                :class="{ 'white--text': !isAccountConnected }"
                style="
                  margin-left: 5px !important;
                  text-transform: capitalize;
                  box-shadow: none !important;
                "
                :color="isAccountConnected ? '#F56C6C' : '#2196f3'"
                rounded
                :outlined="isAccountConnected"
                @click="handleDelegatedGraphAPIAccess"
              >
                <v-icon left>mdi-check-circle</v-icon>
                {{ isAccountConnected ? 'Revoke Authorization' : 'Authorize' }}
              </VBtn>
            </div>
          </template>
        </DownloadAddInListItem>
        <AlertBox
          class="w-100"
          :style="{
            backgroundColor: isAccountConnected ? 'rgba(67, 160, 71, 0.15)' : '#f2f2f2',
            padding: '8px !important',
            paddingLeft: '12px !important'
          }"
          :icon-name="isAccountConnected ? 'mdi-lock-check' : 'mdi-lock'"
          :icon-color="isAccountConnected ? '#43A047' : '#757575'"
          :icon-props="{ size: 16 }"
          :slots="{ primaryAction: false, secondaryAction: false }"
        >
          <template #text>
            <div class="ml-2" style="font-size: 12px; color: #383b41;">
              <div class="text-primary-color">
                {{
                  isAccountConnected
                    ? 'Delegated access successfully authorized.'
                    : 'Required for all user-based Outlook reporting.'
                }}
              </div>
            </div>
          </template>
        </AlertBox>
        <DownloadAddInListItem
          class="flex-nowrap align-start mt-0"
          hide-border
          is-optional
          title="Authorize GRAPH APIs (Application-Level Access)"
          description="Provides organization-wide authentication and identity mapping, powered by Microsoft Graph."
        >
          <template #buttons>
            <div class="d-flex justify-end align-end flex-column gap-6">
              <VTooltip
                v-if="!isAccountConnected && !isApplicationLevelAuthorized"
                bottom
                max-width="200"
              >
                <template #activator="{ on }">
                  <div v-on="on">
                    <VBtn
                      id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
                      class="btn-util btn-download-add-in"
                      style="
                        margin-left: 5px !important;
                        text-transform: capitalize;
                        box-shadow: none !important;
                        margin-top: 4px;
                      "
                      :style="{ opacity: 0.5, pointerEvents: 'none' }"
                      :color="isApplicationLevelAuthorized ? '#F56C6C' : '#2196f3'"
                      rounded
                      outlined
                      @click="handleApplicationLevelGraphAPIAccess"
                    >
                      <v-icon left>mdi-check-circle</v-icon>
                      {{ isApplicationLevelAuthorized ? 'Revoke Authorization' : 'Authorize' }}
                    </VBtn>
                  </div>
                </template>
                <span>Delegated Access authorization is required to enable this option.</span>
              </VTooltip>
              <VBtn
                v-else
                id="btn-download-g-suite--phishing-reporter-settings-add-in-modal"
                class="btn-util btn-download-add-in"
                style="
                  margin-left: 5px !important;
                  text-transform: capitalize;
                  box-shadow: none !important;
                  margin-top: 4px;
                "
                :color="isApplicationLevelAuthorized ? '#F56C6C' : '#2196f3'"
                rounded
                outlined
                @click="handleApplicationLevelGraphAPIAccess"
              >
                <v-icon left>mdi-check-circle</v-icon>
                {{ isApplicationLevelAuthorized ? 'Revoke Authorization' : 'Authorize' }}
              </VBtn>
            </div>
          </template>
        </DownloadAddInListItem>
        <AlertBox
          class="w-100"
          :style="{
            backgroundColor: isApplicationLevelAuthorized ? 'rgba(67, 160, 71, 0.15)' : '#f2f2f2',
            padding: '8px !important',
            paddingLeft: '12px !important'
          }"
          :icon-name="isApplicationLevelAuthorized ? 'mdi-lock-check' : 'mdi-lock'"
          :icon-color="isApplicationLevelAuthorized ? '#43A047' : '#757575'"
          :icon-props="{ size: 16 }"
          :slots="{ primaryAction: false, secondaryAction: false }"
        >
          <template #text>
            <div class="ml-2" style="font-size: 12px; color: #383b41;">
              <div class="text-primary-color">
                {{
                  isApplicationLevelAuthorized
                    ? 'Application-level access successfully authorized.'
                    : 'Recommended for organizations using Conditional Access or Advanced Identity Policies.'
                }}
              </div>
            </div>
          </template>
        </AlertBox>

        <!-- Ribbon View and Page View -->
        <v-row class="mt-2">
          <v-col cols="6">
            <div
              style="
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 16px;
                border: 1px solid var(--Gray-Gray, #e0e0e0);
              "
            >
              <h4
                class="mb-2"
                style="
                  color: #383b41;
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 600;
                  line-height: 21px;
                "
              >
                Ribbon View
              </h4>
              <p class="mb-3" style="color: rgba(56, 59, 65, 0.72); font-size: 14px;">
                Requires Microsoft Graph API access to report suspicious emails from the Outlook
                ribbon.
              </p>
              <VTooltip bottom max-width="200" :disabled="isAccountConnected">
                <template #activator="{ on }">
                  <span v-on="on">
                    <VBtn
                      id="btn-download-ribbon-view--phishing-reporter-settings-add-in-modal"
                      class="white--text btn-util btn-download-add-in"
                      style="margin-left: 5px !important; text-transform: capitalize;"
                      color="#2196f3"
                      rounded
                      :style="{
                        opacity: !isAccountConnected ? 0.5 : 1,
                        pointerEvents: !isAccountConnected ? 'none' : 'auto'
                      }"
                      :loading="o365SpinnerStatus"
                      @click="callForGenerateO365SpamAddIn"
                    >
                      <v-icon left small>mdi-download</v-icon>
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
                  </span>
                </template>
                <span>
                  Ribbon View is disabled because delegated access has not been granted.
                </span>
              </VTooltip>
            </div>
          </v-col>
          <v-col cols="6">
            <div
              style="
                background-color: rgba(255, 255, 255, 0.05);
                border-radius: 8px;
                padding: 16px;
                border: 1px solid #e0e0e0;
              "
            >
              <h4
                class="mb-2"
                style="
                  color: #383b41;
                  font-size: 14px;
                  font-style: normal;
                  font-weight: 600;
                  line-height: 21px;
                "
              >
                Page View
              </h4>
              <p class="mb-3" style="color: rgba(56, 59, 65, 0.72); font-size: 14px;">
                Allows users to report suspicious emails from the Outlook side panel.
              </p>
              <VBtn
                id="btn-download-page-view--phishing-reporter-settings-add-in-modal"
                class="white--text btn-util btn-download-add-in"
                style="margin-left: 5px !important; text-transform: capitalize;"
                color="#2196f3"
                rounded
                :loading="gmailSpinnerStatus"
                @click="callForGenerateO365AddIn"
              >
                <v-icon left small>mdi-download</v-icon>
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
          </v-col>
        </v-row>

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
          :is-loading="diagnosticToolSpinnerStatus"
          hide-border
          title="Diagnostic Tool"
          description="Only for Outlook Desktop (Windows OS only)"
          @button-click="callForGenerateDiagnosticTool"
        />
      </div>
      <v-list-item class="px-0 mt-2 add-in-configuration__list-item">
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
  deleteGraphAccount,
  downloadDiagnosticTool,
  downloadOutlookAddIn,
  downloadSpamReport,
  generateDiagnosticTool,
  generateGoogleWorkSpaceAddIn,
  generateO365AddIn,
  generateOutlookAddIn,
  updateApplicationLevelAccount
} from '@/api/phishingReporter'
import DownloadAddInListItem from '@/components/PhishingReporter/DownloadAddInListItem.vue'
import AlertBox from '@/components/AlertBox.vue'
import DelegatedLevelAuthorizationDialog from '@/components/PhishingReporter/DelegatedLevelAuthorizationDialog.vue'
import ApplicationLevelAuthorizationDialog from '@/components/PhishingReporter/ApplicationLevelAuthorizationDialog.vue'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
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
    AlertBox,
    DownloadAddInListItem,
    DelegatedLevelAuthorizationDialog,
    ApplicationLevelAuthorizationDialog
  },
  data() {
    return {
      outlookSpinnerStatus: false,
      isAccountConnected: this.formData ? this.formData.isGraphAccountConnected : false,
      diagnosticToolSpinnerStatus: false,
      downloadOutlookAddInTimeout: null,
      diagnosticToolAddInTimeout: null,
      gmailSpinnerStatus: false,
      o365SpinnerStatus: false,
      googleWorkSpaceSpinnerStatus: false,
      showDelegatedLevelAuthorizationDialog: false,
      showApplicationLevelDialog: false,
      isApplicationLevelAuthorizing: false,
      isDelegatedLevelAuthorizing: false,
      isApplicationLevelAuthorized: this.formData
        ? this.formData.isAppPermissionAccessGranted || false
        : false
    }
  },
  methods: {
    handleDelegatedGraphAPIAccess() {
      this.showDelegatedLevelAuthorizationDialog = true
    },
    handleApplicationLevelGraphAPIAccess() {
      this.showApplicationLevelDialog = true
    },
    closeDelegatedLevelAuthorizationDialog() {
      this.showDelegatedLevelAuthorizationDialog = false
    },
    handleCopyDelegatedLevelAuthorizationLink() {
      this.isDelegatedLevelAuthorizing = true
      this.handleConnectAccount()
        .then((link) => {
          navigator.clipboard.writeText(link)
          this.$store.dispatch('common/createSnackBar', {
            message: labels.CopiedToClipboard,
            icon: 'mdi-checkbox-marked-circle',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
          })
        })
        .finally(() => {
          this.closeDelegatedLevelAuthorizationDialog()
          this.isDelegatedLevelAuthorizing = false
        })
    },
    handleAuthorizeDelegatedLevelNow() {
      this.isDelegatedLevelAuthorizing = true
      this.handleConnectAccount()
        .then((link) => {
          window.location.href = link
        })
        .finally(() => {
          this.closeDelegatedLevelAuthorizationDialog()
          this.isDelegatedLevelAuthorizing = false
        })
    },
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
    handleConnectAccount() {
      return connectGraphAccount().then((response) => {
        const {
          data: { data }
        } = response
        return `https://login.microsoftonline.com/common/adminconsent?client_id=${
          data.applicationId
        }&redirect_uri=${data.redirectUri ? data.redirectUri : window.location.href}`
      })
    },
    handleConnectApplicationLevelAccount() {
      return connectGraphAccount().then((response) => {
        const {
          data: { data }
        } = response
        return data.appPermissionAuthorizationUrl
      })
    },
    closeApplicationLevelDialog() {
      this.showApplicationLevelDialog = false
      this.isAuthorizing = false
    },
    handleCopyApplicationLevelLink() {
      this.isApplicationLevelAuthorizing = true
      this.handleConnectApplicationLevelAccount()
        .then((link) => {
          navigator.clipboard.writeText(link)
          this.$store.dispatch('common/createSnackBar', {
            message: labels.CopiedToClipboard,
            icon: 'mdi-checkbox-marked-circle',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
          })
        })
        .finally(() => {
          this.closeApplicationLevelDialog()
          this.isApplicationLevelAuthorizing = false
        })
    },
    handleAuthorizeApplicationLevel() {
      this.isApplicationLevelAuthorizing = true
      this.handleConnectApplicationLevelAccount()
        .then((link) => {
          window.location.href = link
        })
        .finally(() => {
          this.closeApplicationLevelDialog()
          this.isApplicationLevelAuthorizing = false
        })
    },
    handleRevokeDelegatedLevelAuthorization() {
      this.isDelegatedLevelAuthorizing = true
      deleteGraphAccount()
        .then(() => {
          this.isAccountConnected = false
          this.formData.isGraphAccountConnected = false
          this.closeDelegatedLevelAuthorizationDialog()
        })
        .finally(() => {
          this.isDelegatedLevelAuthorizing = false
        })
    },
    handleRevokeApplicationLevelAuthorization() {
      this.isApplicationLevelAuthorizing = true
      updateApplicationLevelAccount(false)
        .then(() => {
          this.isApplicationLevelAuthorized = false
          this.formData.isAppPermissionAccessGranted = false
          this.closeApplicationLevelDialog()
        })
        .finally(() => {
          this.isApplicationLevelAuthorizing = false
        })
    }
  }
}
</script>
