<template>
  <div class="microsoft-teams-settings">
    <TeamsIntegrationModal
      v-if="isModalVisible"
      :status="isModalVisible"
      :isActionButtonDisabled="isButtonsDisabled"
      :isStep2="isStep2"
      @on-close="handleCloseModal"
      @on-cancel="handleCloseModal"
      @on-copy-link="handleCopyLink"
      @on-enable="handleEnableNow"
    />
    <DisableMicrosoftTeamsModal
      v-if="isDisableModalVisible"
      :status="isDisableModalVisible"
      :isActionButtonDisabled="isButtonsDisabled"
      @on-close="handleCloseDisableModal"
      @on-confirm="handleConfirmDisable"
    />
    <CompanySettingsHeader
      title="Microsoft Teams Settings"
      sub-title="Manage and customize Microsoft Teams integration settings for the platform."
    />
    <DatatableLoading v-if="loading" :loading="loading" />
    <v-form v-else lazy-validation ref="refForm">
      <FormGroup
        title="Step 1: Integrate with Microsoft Teams"
        sub-title="Allow the platform to connect with your Microsoft Teams account."
        class="mb-6"
      >
        <div
          class="d-flex text-primary-color align-center justify-space-between"
          style="border-radius: 8px; background-color: #fafafa; padding: 16px;"
        >
          <div class="d-flex flex-column gap-1">
            <span class="fw-600" style="font-size: 14px;">Access 1: Connect to Teams</span>
            <span style="font-size: 12px;">Allows platform to link your Teams account.</span>
          </div>
          <VBtn
            v-if="!isMicrosoftTeamsActive && !isStep2"
            color="#2196f3"
            class="fw-600 white--text"
            rounded
            style="box-shadow: none;"
            @click="handleOpenModal"
          >
            <span>ENABLE ACCESS</span>
          </VBtn>
          <div v-else class="d-flex align-center">
            <VIcon color="#43a047">mdi-check-circle</VIcon>
            <span class="fw-600 ml-1" style="font-size: 14px; color: #43a047;">Access Enabled</span>
          </div>
        </div>
        <div
          class="d-flex align-center text-primary-color mt-4 justify-space-between"
          style="border-radius: 8px; background-color: #fafafa; padding: 16px;"
        >
          <div class="d-flex flex-column gap-1">
            <span class="fw-600" style="font-size: 14px;">Access 2: Training Delivery</span>
            <span style="font-size: 12px;"
              >Allows the platform to send training notifications to Teams users.</span
            >
          </div>
          <VBtn
            v-if="!isMicrosoftTeamsActive || isStep2"
            color="#2196f3"
            class="fw-600 white--text"
            rounded
            :style="getEnableButtonStyle"
            @click="handleOpenModal"
          >
            <span>ENABLE ACCESS</span>
          </VBtn>
          <div v-else class="d-flex align-center">
            <VIcon color="#43a047">mdi-check-circle</VIcon>
            <span class="fw-600 ml-1" style="font-size: 14px; color: #43a047;">Access Enabled</span>
          </div>
        </div>
        <div
          v-if="isMicrosoftTeamsActive"
          class="info-card-wrapper mt-2"
          style="border-radius: 8px; background: rgba(230, 162, 60, 0.2);"
        >
          <div
            class="info-card-header d-flex align-center justify-space-between pa-3"
            @click="isAccordionOpen = !isAccordionOpen"
            style="cursor: pointer;"
          >
            <div class="d-flex align-center">
              <VIcon color="#B6791D" class="mr-2" size="20">mdi-information</VIcon>
              <span style="color: #383b41; font-size: 14px; font-weight: 600;">
                Add the App to a Microsoft Teams Policy
              </span>
            </div>
            <VIcon color="#757575">
              {{ isAccordionOpen ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
            </VIcon>
          </div>
          <v-expand-transition>
            <div v-show="isAccordionOpen" class="info-card-content pt-0 px-4 pb-4">
              <div
                class="mb-2"
                style="
                  color: #383b41;
                  font-family: 'Open Sans';
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 19px;
                "
              >
                After installing and authorizing the app, you need to ensure it's added to your
                Microsoft Teams App Setup Policy.
              </div>
              <div
                style="
                  color: #383b41;
                  font-family: 'Open Sans';
                  font-size: 12px;
                  font-style: normal;
                  font-weight: 400;
                  line-height: 19px;
                "
              >
                Go to
                <a
                  href="https://admin.teams.microsoft.com/policies/app-setup"
                  target="_blank"
                  style="color: #2196f3; font-weight: 600; text-decoration: underline;"
                >
                  Teams Admin Center
                </a>
                → Teams Apps → Setup Policies → [Global (Org-wide default) or your custom policy] →
                Add Apps → [Search for "Keepnet Security Awareness"] → Add → Save
              </div>
            </div>
          </v-expand-transition>
        </div>
        <VBtn
          v-if="isStep2 || isMicrosoftTeamsActive"
          class="fw-600 mt-2"
          color="#F56C6C"
          rounded
          outlined
          :style="getSaveButtonStyle"
          @click="handleDisableTeamsIntegration"
        >
          {{ isStep2 ? 'Disable Access' : 'Disable Accesses' }}
        </VBtn>
      </FormGroup>
      <FormGroup
        v-if="isMicrosoftTeamsActive"
        title="Step 2: Bot Name"
        sub-title="Enter a name for the bot that will represent Microsoft Teams integration."
        class="mb-3"
      >
        <VTextField
          v-model="botName"
          placeholder="Enter bot name"
          hint="*Required"
          outlined
          rounded
          disabled
          persistent-hint
        />
      </FormGroup>
      <VTooltip v-if="isMicrosoftTeamsActive && isLastVersion" bottom>
        <template #activator="{ on }">
          <div v-on="on" :style="getUpdateButtonStyle">
            <VBtn
              class="white--text fw-600"
              style="pointer-events: none; box-shadow: none !important;"
              color="#2196f3"
              rounded
              @click="handleSubmit"
            >
              Update Integration Version
            </VBtn>
          </div>
        </template>
        <span>
          The integration is already using the latest version.
        </span>
      </VTooltip>
      <VBtn
        v-else-if="isMicrosoftTeamsActive && !isStep2"
        class="white--text fw-600"
        color="#2196f3"
        rounded
        :style="getUpdateActionButtonStyle"
        @click="handleSubmit"
      >
        Update Integration Version
      </VBtn>
    </v-form>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import FormGroup from '@/components/SmallComponents/FormGroup'
import TeamsIntegrationModal from './TeamsIntegrationModal.vue'
import DisableMicrosoftTeamsModal from './DisableMicrosoftTeamsModal.vue'
import MicrosoftTeamsSettingsService from '@/api/microsoftTeamsSettings'
import labels from '@/model/constants/labels'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
export default {
  name: 'MicrosoftTeamsSettings',
  components: {
    CompanySettingsHeader,
    FormGroup,
    TeamsIntegrationModal,
    DisableMicrosoftTeamsModal,
    DatatableLoading
  },
  data() {
    return {
      isMicrosoftTeamsActive: false,
      isModalVisible: false,
      isDisableModalVisible: false,
      isButtonsDisabled: false,
      isSaveDisabled: false,
      botName: '',
      loading: false,
      isStep2: false,
      isLastVersion: false,
      isAccordionOpen: false
    }
  },
  computed: {
    getSaveButtonStyle() {
      const style = { boxShadow: 'none' }
      if (this.isSaveDisabled) {
        style.opacity = 0.5
        style.cursor = 'auto'
        style.pointerEvents = 'none'
      }
      return style
    },
    getUpdateButtonStyle() {
      const style = { boxShadow: 'none', display: 'inline-block' }
      if (this.isLastVersion || this.isSaveDisabled) {
        style.opacity = 0.5
        style.cursor = 'auto'
      }
      return style
    },
    getUpdateActionButtonStyle() {
      const style = { boxShadow: 'none' }
      if (this.isSaveDisabled) {
        style.opacity = 0.5
        style.cursor = 'auto'
        style.pointerEvents = 'none'
      }
      return style
    },
    getEnableButtonStyle() {
      const style = {}
      style.boxShadow = 'none'
      if (!this.isMicrosoftTeamsActive && !this.isStep2) {
        style.opacity = 0.5
        style.cursor = 'auto'
        style.pointerEvents = 'none'
      }
      return style
    }
  },
  created() {
    const { $route: { query } = {} } = this
    if (query?.code && query?.state) {
      //step 2
      this.callMicrosoftTeamsOboCallback(query.code, query.state)
      return
    } else if (query?.admin_consent && query?.tenant && query?.scope) {
      this.callMicrosoftTeamsAppCallback(query.admin_consent, query.tenant, query.scope)
      return
    } else if (
      (query?.admin_consent && query?.error && query?.error_description && query?.state) ||
      (query?.error && query?.error_subcode && query?.state)
    ) {
      this.getMicrosoftTeamsSettings()
      if (query.error && query.error_description) {
        this.$store.dispatch('common/createSnackBar', {
          message: `Error: ${query.error}
        Description: ${query.error_description}`,
          color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
          icon: 'mdi-alert-circle'
        })
      }
      this.$router.replace('/company/company-settings?')
      return
    } else {
      this.getMicrosoftTeamsSettings()
    }
  },
  methods: {
    getMicrosoftTeamsSettings(isCallback = false) {
      this.loading = true
      MicrosoftTeamsSettingsService.getMicrosoftTeamsSettings()
        .then((response) => {
          const {
            data: { data }
          } = response
          const { neededAction = '' } = data
          if (
            neededAction.includes('retryAppConsent') ||
            neededAction.includes('completeAppConsent')
          ) {
            this.isStep2 = true
          }
          this.isMicrosoftTeamsActive = this.isStep2 ? false : data?.isFound
          this.botName = data?.displayName
          this.isLastVersion = data?.installedVersion === data?.latestAvailableVersion
          if (isCallback) {
            this.isModalVisible = true
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleOpenModal() {
      this.isModalVisible = true
    },
    handleCloseModal() {
      this.isModalVisible = false
      this.isButtonsDisabled = false
    },
    handleCloseDisableModal() {
      this.isDisableModalVisible = false
    },
    handleDisableTeamsIntegration() {
      this.isDisableModalVisible = true
    },
    handleConfirmDisable() {
      this.isButtonsDisabled = true
      this.loading = true
      MicrosoftTeamsSettingsService.disableMicrosoftTeamsIntegration()
        .then(() => {
          this.isMicrosoftTeamsActive = false
          this.isButtonsDisabled = false
          this.isStep2 = false
          this.isMicrosoftTeamsActive = false
          this.handleCloseDisableModal()
          this.getMicrosoftTeamsSettings()
        })
        .catch(() => {
          this.isButtonsDisabled = false
          this.getMicrosoftTeamsSettings()
        })
    },
    handleCopyLink() {
      if (this.isStep2) {
        this.getMicrosoftTeamsAppAuthorizeLink().then((link) => {
          if (link) {
            navigator.clipboard.writeText(link)
            this.$store.dispatch('common/createSnackBar', {
              message: labels.CopiedToClipboard,
              icon: 'mdi-checkbox-marked-circle',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
            })
            this.handleCloseModal()
          }
        })
      } else {
        this.getMicrosoftTeamsOboIntegrationLink().then((link) => {
          if (link) {
            navigator.clipboard.writeText(link)
            this.$store.dispatch('common/createSnackBar', {
              message: labels.CopiedToClipboard,
              icon: 'mdi-checkbox-marked-circle',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
            })
          }
        })
      }
    },
    handleEnableNow() {
      this.isButtonsDisabled = true
      if (this.isStep2) {
        this.getMicrosoftTeamsAppAuthorizeLink().then((link) => {
          if (link) window.location = link
        })
      } else {
        this.getMicrosoftTeamsOboIntegrationLink().then((link) => {
          if (link) window.location = link
        })
      }
    },
    getMicrosoftTeamsOboIntegrationLink() {
      return MicrosoftTeamsSettingsService.getMicrosoftTeamsOboIntegrationLink().then((res) => {
        const {
          data: { data }
        } = res
        return data.authorizationUrl
      })
    },
    callMicrosoftTeamsOboCallback(code, state) {
      this.loading = true
      MicrosoftTeamsSettingsService.callMicrosoftTeamsOboCallback(code, state)
        .then(() => {
          this.getMicrosoftTeamsSettings(true)
          this.$store.dispatch('common/createSnackBar', {
            message: 'Microsoft Teams connection established successfully.',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
        })
        .catch(() => {
          this.loading = false
        })
        .finally(() => {
          this.$router.replace('/company/company-settings')
        })
    },
    callMicrosoftTeamsAppCallback(admin_consent, tenant, scope) {
      this.loading = true
      MicrosoftTeamsSettingsService.callMicrosoftTeamsAppCallback(admin_consent, tenant, scope)
        .then(() => {
          this.$store.dispatch('common/createSnackBar', {
            message: 'All accesses enabled. You can now deliver trainings via Microsoft Teams.',
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          this.isAccordionOpen = true
          this.handleSubmit()
        })
        .catch(() => {
          this.loading = false
        })
        .finally(() => {
          this.$router.replace('/company/company-settings')
        })
    },
    getMicrosoftTeamsAppAuthorizeLink() {
      return MicrosoftTeamsSettingsService.getMicrosoftTeamsAppAuthorizeLink().then((res) => {
        const {
          data: { data }
        } = res
        return data.authorizationUrl
      })
    },
    handleSubmit() {
      if (this.isLastVersion) return
      this.isSaveDisabled = true
      MicrosoftTeamsSettingsService.uploadMicrosoftTeamsSettings().finally(() => {
        this.getMicrosoftTeamsSettings()
        MicrosoftTeamsSettingsService.installMicrosoftTeamsAppToUsers()
        this.isSaveDisabled = false
      })
    }
  }
}
</script>
