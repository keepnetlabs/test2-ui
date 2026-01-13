<template>
  <div class="agentic-ai-settings">
    <company-settings-header
      title="Agentic AI Settings"
      sub-title="Configure how and when AI can act across your organization."
    />
    <div class="send-training-settings__lms-switch mb-6" style="width: 554px;">
      <VSwitch
        v-model="agenticAISettings.isAgenticAIEnabled"
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

export default {
  name: 'AgenticAISettings',
  components: {
    CompanySettingsHeader
  },
  data() {
    return {
      agenticAISettings: {
        isAgenticAIEnabled: false
      }
    }
  },
  methods: {
    handleAgenticAIToggle(val) {
      const message = val ? 'Agentic AI is now enabled.' : 'Agentic AI is now disabled.'
      this.$store.dispatch('common/createSnackBar', {
        message,
        color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
        icon: 'mdi-information'
      })
    }
  }
}
</script>
