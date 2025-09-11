<template>
  <div class="microsoft-teams-settings">
    <TeamsIntegrationModal
      :status="isModalVisible"
      :isActionButtonDisabled="isButtonsDisabled"
      @on-close="handleCloseModal"
      @on-cancel="handleCloseModal"
      @on-copy-link="handleCopyLink"
      @on-enable="handleEnableNow"
    />
    <DisableMicrosoftTeamsModal
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
        title="1. Integrate your Microsoft Teams"
        sub-title="Enable a Microsoft account to integrate with the platform."
        class="mb-6"
      >
        <VBtn
          v-if="!isMicrosoftTeamsActive"
          color="#2196f3"
          class="clustered-table-back-btn"
          outlined
          rounded
          @click="handleOpenModal"
        >
          <span>Enable Teams Integration</span>
        </VBtn>
        <VBtn
          v-else
          color="#F56C6C"
          class="clustered-table-back-btn"
          outlined
          rounded
          @click="handleDisableTeamsIntegration"
        >
          <span>Disable Teams Integration</span>
        </VBtn>
      </FormGroup>
      <FormGroup
        v-if="isMicrosoftTeamsActive"
        title="2. Bot Name"
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
      <VBtn
        v-if="isMicrosoftTeamsActive"
        class="k-overlay__btn-save white--text"
        color="#2196f3"
        rounded
        placeholder="Enter bot name"
        :style="getSaveButtonStyle"
        @click="handleSubmit"
      >
        SAVE
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
      loading: false
    }
  },
  computed: {
    getSaveButtonStyle() {
      const style = {}
      if (this.isSaveDisabled) {
        style.opacity = 0.5
        style.cursor = 'auto'
        style.pointerEvents = 'none'
      }
      return style
    }
  },
  created() {
    this.getMicrosoftTeamsSettings()
    const { $route: { query } = {} } = this
    if (query?.code && query?.state) {
      this.callMicrosoftTeamsOboCallback(query.code, query.state)
    } else if (query?.admin_consent && query?.error && query?.error_description && query?.state) {
      this.$store.dispatch('common/createSnackBar', {
        message: `Error: ${query.error}
        Description: ${query.error_description}`,
        color: COMMON_CONSTANTS.ERRORSNACKBARCOLOR,
        icon: 'mdi-alert-circle'
      })
    }
  },
  methods: {
    getMicrosoftTeamsSettings() {
      this.loading = true
      MicrosoftTeamsSettingsService.getMicrosoftTeamsSettings()
        .then((response) => {
          const {
            data: { data }
          } = response
          this.isMicrosoftTeamsActive = data.isFound
          this.botName = data?.displayName
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
    },
    handleCloseDisableModal() {
      this.isDisableModalVisible = false
    },
    handleDisableTeamsIntegration() {
      this.isDisableModalVisible = true
    },
    handleConfirmDisable() {
      this.isButtonsDisabled = true
      MicrosoftTeamsSettingsService.disableMicrosoftTeamsIntegration()
        .then(() => {
          this.isMicrosoftTeamsActive = false
          this.handleCloseDisableModal()
        })
        .finally(() => {
          this.isButtonsDisabled = false
        })
    },
    handleCopyLink() {
      this.getMicrosoftTeamsOboIntegrationLink()
        .then((link) => {
          if (link) {
            navigator.clipboard.writeText(link)
            this.$store.dispatch('common/createSnackBar', {
              message: labels.CopiedToClipboard,
              icon: 'mdi-checkbox-marked-circle',
              color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR
            })
          }
        })
        .finally(() => {
          this.isButtonsDisabled = false
        })
    },
    handleEnableNow() {
      this.isButtonsDisabled = true
      this.getMicrosoftTeamsOboIntegrationLink().then((link) => {
        if (link) window.location = link
      })
    },
    handleSave() {
      this.isSaveDisabled = true
      MicrosoftTeamsSettingsService.saveMicrosoftTeamsSettings(this.botName)
        .then((res) => {
          console.log(res)
        })
        .finally(() => {
          this.isSaveDisabled = false
        })
    },
    getMicrosoftTeamsOboIntegrationLink() {
      return MicrosoftTeamsSettingsService.getMicrosoftTeamsOboIntegrationLink().then((res) => {
        const {
          data: { data }
        } = res
        console.log('data.authorizationUrl', data.authorizationUrl)
        return data.authorizationUrl
      })
    },
    callMicrosoftTeamsOboCallback(code, state) {
      MicrosoftTeamsSettingsService.callMicrosoftTeamsOboCallback(code, state).then((res) => {
        MicrosoftTeamsSettingsService.authorizeMicrosoftTeamsApp().then((res) => {
          console.log('res', res)
        })
      })
    },
    handleSubmit() {
      this.isSaveDisabled = true
      MicrosoftTeamsSettingsService.uploadMicrosoftTeamsSettings()
        .then((res) => {
          console.log('res', res)
        })
        .finally(() => {
          this.isSaveDisabled = false
        })
    }
  }
}
</script>
