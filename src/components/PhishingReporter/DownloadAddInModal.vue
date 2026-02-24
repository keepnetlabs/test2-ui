<template>
  <VNavigationDrawer
    v-if="isVisible"
    v-click-outside="handleDrawerClickOutside"
    :value="isVisible"
    :data-drawer-id="drawerId"
    class="k-navigation-drawer download-add-in-drawer"
    temporary
    fixed
    stateless
    overlay-color="rgba(0, 0, 0, 0.17)"
    overlay-opacity="1"
    right
    width="calc(100% - 72px)"
    height="100%"
    @input="handleDrawerInput"
  >
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

    <div class="download-add-in-drawer__layout">
      <div class="campaign-manager-scenario-statistics-modal__header--sticky">
        <div class="campaign-manager-scenario-statistics-modal__header k-navigation-drawer__header">
          <div>
            <VListItem>
              <VListItemContent>
                <VListItemTitle
                  id="text--phishing-reporter-download-add-in-modal-title"
                  class="k-overlay__title"
                >
                  Download Add-in
                </VListItemTitle>
                <VListItemSubtitle
                  id="text--phishing-reporter-download-add-in-modal-subtitle"
                >
                  Add-in packages required for email reporting are available below.
                </VListItemSubtitle>
              </VListItemContent>
            </VListItem>
          </div>
          <div>
            <VIcon class="cursor-pointer" color="#757575" @click="handleClose">
              mdi-close
            </VIcon>
          </div>
        </div>
      </div>

      <div class="download-add-in-drawer__body">
        <aside class="download-add-in-drawer__nav">
          <nav class="download-add-in-drawer__nav-list">
            <span class="download-add-in-drawer__nav-label">Integration Type</span>
            <div
              v-for="item in integrationTypes"
              :key="item.id"
              :class="[
                'download-add-in-drawer__nav-item',
                { 'download-add-in-drawer__nav-item--active': selectedIntegrationType === item.id }
              ]"
              :data-integration="item.id"
              :title="item.label"
              role="button"
              tabindex="0"
              @click="selectedIntegrationType = item.id"
              @keydown.enter="selectedIntegrationType = item.id"
              @keydown.space.prevent="selectedIntegrationType = item.id"
            >
              <img
                v-if="item.logo"
                :src="item.logo"
                :alt="item.label"
                class="download-add-in-drawer__nav-item-logo"
              />
              <span v-else class="download-add-in-drawer__nav-item-text">{{ item.label }}</span>
            </div>
          </nav>
        </aside>

        <main class="download-add-in-drawer__content">
          <component
            :is="currentContentComponent"
            v-bind="currentContentProps"
            v-on="currentContentListeners"
          />
        </main>
      </div>
    </div>
  </VNavigationDrawer>
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
import DelegatedLevelAuthorizationDialog from '@/components/PhishingReporter/DelegatedLevelAuthorizationDialog.vue'
import ApplicationLevelAuthorizationDialog from '@/components/PhishingReporter/ApplicationLevelAuthorizationDialog.vue'
import Microsoft365Content from '@/components/PhishingReporter/DownloadAddIn/Microsoft365Content.vue'
import GoogleWorkspaceContent from '@/components/PhishingReporter/DownloadAddIn/GoogleWorkspaceContent.vue'
import OutlookContent from '@/components/PhishingReporter/DownloadAddIn/OutlookContent.vue'
import DiagnosticToolContent from '@/components/PhishingReporter/DownloadAddIn/DiagnosticToolContent.vue'
import { copyToClipboard, createRandomCryptStringNumber } from '@/utils/functions'

const INTEGRATION_TYPES = {
  MICROSOFT365: 'microsoft365',
  GOOGLE_WORKSPACE: 'googleWorkspace',
  OUTLOOK: 'outlook',
  DIAGNOSTIC_TOOL: 'diagnosticTool'
}

export default {
  name: 'DownloadAddInModal',
  components: {
    DelegatedLevelAuthorizationDialog,
    ApplicationLevelAuthorizationDialog,
    Microsoft365Content,
    GoogleWorkspaceContent,
    OutlookContent,
    DiagnosticToolContent
  },
  props: {
    status: {
      type: Boolean
    },
    formData: {
      type: Object
    }
  },
  data() {
    return {
      isVisible: false,
      drawerId: `download-add-in-drawer-${createRandomCryptStringNumber()}`,
      selectedIntegrationType: INTEGRATION_TYPES.MICROSOFT365,
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
        : false,
      integrationTypes: [
        {
          id: INTEGRATION_TYPES.MICROSOFT365,
          label: 'Microsoft 365',
          logo: require('@/assets/img/microsoft-365-logo.svg')
        },
        {
          id: INTEGRATION_TYPES.GOOGLE_WORKSPACE,
          label: 'Google Workspace',
          logo: require('@/assets/img/google-workspace.svg')
        },
        {
          id: INTEGRATION_TYPES.OUTLOOK,
          label: 'Outlook',
          logo: require('@/assets/img/outlook.svg')
        },
        {
          id: INTEGRATION_TYPES.DIAGNOSTIC_TOOL,
          label: 'Diagnostic Tool',
          logo: null
        }
      ]
    }
  },
  computed: {
    currentContentComponent() {
      const map = {
        [INTEGRATION_TYPES.MICROSOFT365]: 'Microsoft365Content',
        [INTEGRATION_TYPES.GOOGLE_WORKSPACE]: 'GoogleWorkspaceContent',
        [INTEGRATION_TYPES.OUTLOOK]: 'OutlookContent',
        [INTEGRATION_TYPES.DIAGNOSTIC_TOOL]: 'DiagnosticToolContent'
      }
      return map[this.selectedIntegrationType] || 'Microsoft365Content'
    },
    currentContentProps() {
      const base = {}
      switch (this.selectedIntegrationType) {
        case INTEGRATION_TYPES.MICROSOFT365:
          return {
            isAccountConnected: this.isAccountConnected,
            isApplicationLevelAuthorized: this.isApplicationLevelAuthorized,
            o365SpinnerStatus: this.o365SpinnerStatus,
            pageViewSpinnerStatus: this.gmailSpinnerStatus
          }
        case INTEGRATION_TYPES.GOOGLE_WORKSPACE:
          return { isLoading: this.googleWorkSpaceSpinnerStatus }
        case INTEGRATION_TYPES.OUTLOOK:
          return { isLoading: this.outlookSpinnerStatus }
        case INTEGRATION_TYPES.DIAGNOSTIC_TOOL:
          return { isLoading: this.diagnosticToolSpinnerStatus }
        default:
          return base
      }
    },
    currentContentListeners() {
      switch (this.selectedIntegrationType) {
        case INTEGRATION_TYPES.MICROSOFT365:
          return {
            'delegated-graph-access': this.handleDelegatedGraphAPIAccess,
            'application-level-graph-access': this.handleApplicationLevelGraphAPIAccess,
            'download-ribbon-view': this.callForGenerateO365SpamAddIn,
            'download-page-view': this.callForGenerateO365AddIn
          }
        case INTEGRATION_TYPES.GOOGLE_WORKSPACE:
          return { download: this.callForGenerateGoogleWorkSpaceAddIn }
        case INTEGRATION_TYPES.OUTLOOK:
          return { download: this.callForGenerateOutlookAddIn }
        case INTEGRATION_TYPES.DIAGNOSTIC_TOOL:
          return { download: this.callForGenerateDiagnosticTool }
        default:
          return {}
      }
    }
  },
  watch: {
    status: {
      handler(val) {
        if (val && !this.isVisible) {
          this.isVisible = true
          this.$nextTick(() => {
            this.openDrawer()
          })
        } else if (!val && this.isVisible) {
          this.closeDrawer()
        }
      },
      immediate: true
    },
    formData: {
      handler(val) {
        if (val) {
          this.isAccountConnected = val.isGraphAccountConnected || false
          this.isApplicationLevelAuthorized = val.isAppPermissionAccessGranted || false
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.status) {
      this.isVisible = true
      this.$nextTick(() => {
        this.openDrawer()
      })
    }
  },
  beforeDestroy() {
    document.documentElement.style.overflow = ''
    document.body.style.overflow = ''
    this.clearOutlookAddInTimeout()
    this.clearDiagnosticToolTimeout()
  },
  methods: {
    openDrawer() {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
        setTimeout(() => {
          drawerElement.style.right = '0'
        }, 10)
      }
    },
    closeDrawer() {
      const drawerElement = document.querySelector(`[data-drawer-id="${this.drawerId}"]`)
      if (drawerElement) {
        drawerElement.style.right = '-100%'
      }
      setTimeout(() => {
        this.isVisible = false
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
        this.$emit('handleClose')
      }, 250)
    },
    handleClose() {
      this.closeDrawer()
    },
    handleDrawerClickOutside(event) {
      if (event?.target) {
        const snackbarElement = event.target.closest(
          '.v-snack__wrapper, .v-snackbar, .v-snackbar__wrapper, .v-snackbar__content, [data-snackbar]'
        )
        if (snackbarElement) {
          return
        }
        const dialogElement = event.target.closest(
          '.v-dialog, .k-dialog'
        )
        if (dialogElement) {
          return
        }
      }
      if (this.showDelegatedLevelAuthorizationDialog || this.showApplicationLevelDialog) {
        return
      }
      this.closeDrawer()
    },
    handleDrawerInput(val) {
      if (!val) {
        this.closeDrawer()
      }
    },
    handleDelegatedGraphAPIAccess() {
      this.showDelegatedLevelAuthorizationDialog = true
    },
    handleApplicationLevelGraphAPIAccess() {
      this.showApplicationLevelDialog = true
    },
    closeDelegatedLevelAuthorizationDialog() {
      this.showDelegatedLevelAuthorizationDialog = false
    },
    closeApplicationLevelDialog() {
      this.showApplicationLevelDialog = false
      this.isApplicationLevelAuthorizing = false
    },
    handleCopyDelegatedLevelAuthorizationLink() {
      this.isDelegatedLevelAuthorizing = true
      this.handleConnectAccount()
        .then((link) => {
          copyToClipboard(link)
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
          globalThis.location.href = link
        })
        .finally(() => {
          this.closeDelegatedLevelAuthorizationDialog()
          this.isDelegatedLevelAuthorizing = false
        })
    },
    handleCopyApplicationLevelLink() {
      this.isApplicationLevelAuthorizing = true
      this.handleConnectApplicationLevelAccount()
        .then((link) => {
          copyToClipboard(link)
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
          globalThis.location.href = link
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
          if (this.formData) this.formData.isGraphAccountConnected = false
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
          if (this.formData) this.formData.isAppPermissionAccessGranted = false
          this.closeApplicationLevelDialog()
        })
        .finally(() => {
          this.isApplicationLevelAuthorizing = false
        })
    },
    callForGenerateGoogleWorkSpaceAddIn() {
      this.googleWorkSpaceSpinnerStatus = true
      generateGoogleWorkSpaceAddIn()
        .then((response) => {
          const { data } = response
          const url = globalThis.URL.createObjectURL(data)
          const link = document.createElement('a')
          link.href = url
          link.download = `GoogleWorkspaceAddIn.zip`
          link.click()
          globalThis.URL.revokeObjectURL(url)
        })
        .finally(() => {
          this.googleWorkSpaceSpinnerStatus = false
        })
    },
    callForGenerateOutlookAddIn() {
      this.outlookSpinnerStatus = true
      generateOutlookAddIn()
        .then((response) => {
          const resourceId = response?.data?.data?.resourceId
          if (resourceId) {
            this.callForDownloadOutlookAddIn(resourceId)
          } else {
            this.outlookSpinnerStatus = false
          }
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
          const url = globalThis.URL.createObjectURL(data)
          const link = document.createElement('a')
          link.href = url
          link.download = `Microsoft365PhishingReporterAddin.xml`
          link.click()
          globalThis.URL.revokeObjectURL(url)
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
          const url = globalThis.URL.createObjectURL(data)
          const link = document.createElement('a')
          link.href = url
          link.download = `MicrosoftPhishingReporterRibbon.xml`
          link.click()
          globalThis.URL.revokeObjectURL(url)
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
          const url = globalThis.URL.createObjectURL(data)
          const link = document.createElement('a')
          link.href = url
          link.download = `OutlookPhishingReporter.msi`
          link.click()
          globalThis.URL.revokeObjectURL(url)
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
      this.diagnosticToolSpinnerStatus = true
      generateDiagnosticTool()
        .then((response) => {
          const resourceId = response?.data?.data?.resourceId
          if (resourceId) {
            this.callForDownloadDiagnosticTool(resourceId)
          } else {
            this.diagnosticToolSpinnerStatus = false
          }
        })
        .catch(() => {
          this.diagnosticToolSpinnerStatus = false
        })
    },
    callForDownloadDiagnosticTool(id) {
      downloadDiagnosticTool(id)
        .then((response) => {
          this.diagnosticToolSpinnerStatus = false
          this.clearDiagnosticToolTimeout()
          const { data } = response
          const url = globalThis.URL.createObjectURL(data)
          const link = document.createElement('a')
          link.href = url
          link.download = `DiagnosticTool.msi`
          link.click()
          globalThis.URL.revokeObjectURL(url)
        })
        .catch((error) => {
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
        }&redirect_uri=${data.redirectUri ? data.redirectUri : globalThis.location.href}`
      })
    },
    handleConnectApplicationLevelAccount() {
      return connectGraphAccount().then((response) => {
        const {
          data: { data }
        } = response
        return data.appPermissionAuthorizationUrl
      })
    }
  }
}
</script>
