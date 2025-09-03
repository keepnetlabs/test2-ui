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
    <v-form lazy-validation ref="refForm">
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

export default {
  name: 'MicrosoftTeamsSettings',
  components: {
    CompanySettingsHeader,
    FormGroup,
    TeamsIntegrationModal,
    DisableMicrosoftTeamsModal
  },
  data() {
    return {
      isMicrosoftTeamsActive: false,
      isModalVisible: false,
      isDisableModalVisible: false,
      isButtonsDisabled: false,
      isSaveDisabled: false,
      botName:''
    }
  },
  computed:{
    computed: {
    getSaveButtonStyle() {
      const style = {}
      if (
        this.isSaveDisabled
      ) {
        style.opacity = 0.5
        style.cursor = 'auto'
        style.pointerEvents = 'none'
      }
      return style
    }
  }
  },
  created() {
    this.getMicrosoftTeamsSettings()
  },
  methods: {
    getMicrosoftTeamsSettings() {
      MicrosoftTeamsSettingsService.getMicrosoftTeamsSettings().then((response) => {
        this.isMicrosoftTeamsActive = response.data.isActive
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
      MicrosoftTeamsSettingsService.disableMicrosoftTeamsIntegration().then(() => {
        this.isMicrosoftTeamsActive = false
        this.handleCloseDisableModal()
      }).finally(() => {
        this.isButtonsDisabled = false
      })
    },
    handleCopyLink() {
      MicrosoftTeamsSettingsService.getMicrosoftTeamsIntegrationLink().then((res) => {
        if (res?.data?.data) {
          navigator.clipboard.writeText(res.data.data)
          this.$store.dispatch('common/setIsShowSnackbar', {
            message: labels.CopiedToClipboard,
            color: 'success'
          })
        }
      }).finally(() => {
        this.isButtonsDisabled = false
      })
    },
    handleEnableNow() {
      this.isButtonsDisabled = true
      MicrosoftTeamsSettingsService.getMicrosoftTeamsIntegrationLink().then((res) => {
        if (res?.data?.data) window.location = res.data.data
      })
    },
    handleSave(){
      this.isSaveDisabled = true
      MicrosoftTeamsSettingsService.saveMicrosoftTeamsSettings(this.botName).then((res) => {
        console.log(res)
      }).finally(() => {
        this.isSaveDisabled = false
      })
    }
  }
}
</script>