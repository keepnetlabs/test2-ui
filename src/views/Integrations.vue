<template>
  <KContainer id="integrations">
    <el-tabs v-model="tab">
      <el-tab-pane label="Integrations" name="integrations" id="integrations-content">
        <integrations
          v-if="isRenderIntegrations"
          ref="refIntegrations"
          :permissions="integrationPermissions"
        ></integrations>
      </el-tab-pane>
      <el-tab-pane
        name="advanced-settings"
        :label="labels.AdvancedSettings"
        :id="`${labels.LowerAdvancedSettings}-content`"
      >
        <advanced-settings
          v-if="isRenderAdvancedSettings"
          ref="refAdvancedSettings"
          :permissions="advancedSettingsPermissions"
        ></advanced-settings>
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import Integrations from '../components/Integrations/Integrations'
import labels from '@/model/constants/labels'
import AdvancedSettings from '@/components/Integrations/AdvancedSettings/AdvancedSettings'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'Integrations',
  components: {
    KContainer,
    integrations: Integrations,
    'advanced-settings': AdvancedSettings
  },
  data() {
    return {
      tab: 'integrations',
      labels
    }
  },
  computed: {
    ...mapGetters({
      integrationPermissions: 'permissions/getIntegrationPermissions',
      advancedSettingsPermissions: 'permissions/getAdvancedSettingsPermissions'
    }),
    isRenderIntegrations() {
      return this.tab === 'integrations' && this?.integrationPermissions?.SEARCH?.hasPermission
    },
    isRenderAdvancedSettings() {
      return (
        this.tab === 'advanced-settings' && this?.advancedSettingsPermissions?.SEARCH?.hasPermission
      )
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
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    }
  }
}
</script>
