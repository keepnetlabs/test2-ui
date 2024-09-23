<template>
  <Fragment>
    <DatatableLoading v-if="isLoading" :loading="isLoading" />
    <div v-else class="d-flex flex-column" style="width: 650px;">
      <VSwitch
        v-model="isAIAllySettingsEnabled"
        hide-details
        color="#2196f3"
        class="mb-6"
        @change="handleAIAllySettingsChange"
      >
        <template #label>
          <div class="d-flex flex-column ml-6">
            <span style="font-size: 24px; color: #383b41; line-height: 31px;"
              >AI Ally Settings</span
            >
            <span style="color: #383b41;"
              >Manage AI Ally features and settings for AI driven content generation</span
            >
          </div>
        </template>
      </VSwitch>
      <div class="send-training-settings__lms-switch mb-6" style="width: 650px;">
        <VSwitch
          v-model="aiAllySettings.psEmailTemplateGenerationAssistant"
          hide-details
          color="#2196f3"
          :disabled="!isAIAllySettingsEnabled"
        >
          <template #label>
            <div class="d-flex flex-column ml-6">
              <span style="font-weight: 600; color: #383b41;"
                >Enable AI Ally for email template generation</span
              >
              <span style="color: #383b41;"
                >Generate email templates based on your prompts, works with merge tags</span
              >
            </div>
          </template>
        </VSwitch>
      </div>
      <div class="send-training-settings__lms-switch mb-6" style="width: 650px;">
        <VSwitch
          v-model="aiAllySettings.landingPageTemplateGenerationAssistant"
          hide-details
          color="#2196f3"
          :disabled="!isAIAllySettingsEnabled"
        >
          <template #label>
            <div class="d-flex flex-column ml-6">
              <span style="font-weight: 600; color: #383b41;"
                >Enable AI Ally for landing page template generation</span
              >
              <span style="color: #383b41;"
                >Generate landing page templates based on your prompts, works with merge tags</span
              >
            </div>
          </template>
        </VSwitch>
      </div>
      <VBtn class="k-overlay__btn-save white--text" color="#2196f3" rounded @click="handleSubmit">
        SAVE
      </VBtn>
    </div>
  </Fragment>
</template>

<script>
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
import { saveAIAllySettings, getAIAllySettings } from '@/api/company'
import { Fragment } from 'vue-frag'
export default {
  name: 'AIAllySettings',
  components: { Fragment, DatatableLoading },
  data() {
    return {
      isLoading: true,
      isSaveDisabled: false,
      aiAllySettings: {
        psEmailTemplateGenerationAssistant: false,
        landingPageTemplateGenerationAssistant: false
      },
      isAIAllySettingsEnabled: false
    }
  },
  watch: {
    aiAllySettings: {
      deep: true,
      handler(val) {
        if (
          !val.psEmailTemplateGenerationAssistant &&
          !val.landingPageTemplateGenerationAssistant
        ) {
          this.isAIAllySettingsEnabled = false
        }
      }
    }
  },
  created() {
    this.getAIAllySettings()
  },
  methods: {
    handleAIAllySettingsChange(val) {
      if (val) {
        this.aiAllySettings.psEmailTemplateGenerationAssistant = true
        this.aiAllySettings.landingPageTemplateGenerationAssistant = true
      } else {
        this.aiAllySettings.psEmailTemplateGenerationAssistant = false
        this.aiAllySettings.landingPageTemplateGenerationAssistant = false
      }
    },
    getAIAllySettings() {
      this.isLoading = true
      getAIAllySettings()
        .then((res) => {
          this.aiAllySettings = res?.data?.data || {
            psEmailTemplateGenerationAssistant: false,
            landingPageTemplateGenerationAssistant: false
          }
          if (
            this.aiAllySettings.psEmailTemplateGenerationAssistant ||
            this.aiAllySettings.landingPageTemplateGenerationAssistant
          ) {
            this.isAIAllySettingsEnabled = true
          }
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleSubmit() {
      this.isSaveDisabled = true
      saveAIAllySettings(this.aiAllySettings).finally(() => {
        this.isSaveDisabled = false
      })
    }
  }
}
</script>
