<template>
  <div class="agentic-ai-settings">
    <company-settings-header
      title="Agentic AI Settings"
      sub-title="Configure how and when AI can act across your organization."
    />

    <DatatableLoading v-if="isFetching" :loading="isFetching" />

    <div v-else class="send-training-settings__lms-switch mb-6" style="width: 554px;">
      <VSwitch
        v-model="agenticAISettings.isAgenticAIEnabled"
        :disabled="!hasAgenticAILicense || isSaving"
        hide-details
        color="#2196f3"
        @change="handleAgenticAIToggle"
      >
        <template #label>
          <div class="d-flex flex-column ml-6">
            <span style="font-weight: 600; color: #383b41;">Enable Agentic AI</span>
            <span style="color: #383b41;">
              {{
                agenticAISettings.isAgenticAIEnabled
                  ? 'AI actions are controlled by execution mode, safeguards and policies.'
                  : 'Agentic AI is currently disabled. No AI-driven actions will be executed.'
              }}
            </span>
          </div>
        </template>
      </VSwitch>
    </div>
  </div>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader.vue'
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
import { getAgenticAISettings, saveAgenticAISettings } from '@/api/company'
import DatatableLoading from '@/components/SkeletonLoading/DatatableLoading.vue'

export default {
  name: 'AgenticAISettings',
  components: {
    CompanySettingsHeader,
    DatatableLoading
  },
  data() {
    return {
      agenticAISettings: {
        isAgenticAIEnabled: false
      },
      isFetching: true,
      isSaving: false
    }
  },
  computed: {
    hasAgenticAILicense() {
      return this.$store.getters['login/getHasAgenticAILicense']
    }
  },
  mounted() {
    this.fetchAgenticAISettings()
  },
  methods: {
    fetchAgenticAISettings() {
      if (!this.hasAgenticAILicense) {
        this.isFetching = false
        return
      }
      this.isFetching = true
      getAgenticAISettings()
        .then((response) => {
          const enabled = !!response?.data?.data?.agenticAIEnabled
          this.agenticAISettings.isAgenticAIEnabled = enabled
        })
        .finally(() => {
          this.isFetching = false
        })
    },
    handleAgenticAIToggle(val) {
      if (!this.hasAgenticAILicense) return
      const previousValue = !val
      this.isSaving = true
      saveAgenticAISettings({ agenticAIEnabled: val })
        .then(() => {
          const message = val ? 'Agentic AI is now enabled.' : 'Agentic AI is now disabled.'
          this.$store.dispatch('common/createSnackBar', {
            message,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-information'
          })
          // keep global state in sync so ChatPanel can react immediately
          this.$store.dispatch('login/getAgenticAIEnabled')
        })
        .catch(() => {
          // revert UI state on failure
          this.agenticAISettings.isAgenticAIEnabled = previousValue
        })
        .finally(() => {
          this.isSaving = false
        })
    }
  }
}
</script>
