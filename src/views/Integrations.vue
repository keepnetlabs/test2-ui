<template>
  <div class="k-container" id="integrations">
    <v-layout id="ts-layout" wrap style="min-height: 80vh;">
      <v-col class="k-container__tab-container" cols="12">
        <v-card id="integrations-card" class="k-card">
          <el-tabs v-model="tab">
            <el-tab-pane label="Integrations" name="integrations" id="integrations-content">
              <integrations v-if="tab === 'integrations'" ref="refIntegrations"></integrations>
            </el-tab-pane>
            <el-tab-pane
              name="advanced-settings"
              :label="labels.AdvancedSettings"
              :id="`${labels.AdvancedSettings.toLowerCase()}-content`"
            >
              <advanced-settings
                v-if="tab === 'advanced-settings'"
                ref="refAdvancedSettings"
              ></advanced-settings>
            </el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import Integrations from '../components/Integrations/Integrations'
import labels from '@/model/constants/labels'
import AdvancedSettings from '@/components/Integrations/AdvancedSettings/AdvancedSettings'
export default {
  name: 'Integrations',
  components: {
    integrations: Integrations,
    'advanced-settings': AdvancedSettings
  },
  data() {
    return {
      tab: 'integrations',
      labels
    }
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refIntegrations } = this.$refs
    if (refIntegrations && refIntegrations.modalStatus) {
      refIntegrations.checkIfCanCloseNewIntegrationModal()
      next(false)
    } else {
      next()
    }
  }
}
</script>
