<template>
  <section id="advanced-settings" class="advanced-settings">
    <company-settings-header
      :title="labels.AdvancedSettings"
      :sub-title="labels.AdvancedSettingsSubTitle"
    />
    <el-tabs v-model="tab" id="settings-el-tabs">
      <el-tab-pane
        v-for="item in tabItems"
        :key="item.name"
        :id="item.id"
        :name="item.name"
        :label="item.label"
        :form-data="formData"
      >
        <component :is="item.component" />
      </el-tab-pane>
    </el-tabs>
  </section>
</template>

<script>
import CompanySettingsHeader from '@/components/Company Settings/CompanySettingsHeader'
import labels from '@/model/constants/labels'
import AdvancedSettingsURLs from '@/components/Integrations/AdvancedSettings/AdvancedSettingsURLs'
import AdvancedSettingsIpAddresses from '@/components/Integrations/AdvancedSettings/AdvancedSettingsIpAddresses'
import AdvancedSettingsAttachments from '@/components/Integrations/AdvancedSettings/AdvancedSettingsAttachments'
import { getAnalysisExclusions } from '@/api/integrations'
export default {
  name: 'AdvancedSettings',
  components: { CompanySettingsHeader },
  data() {
    return {
      labels,
      tab: labels.URLS.toLowerCase(),
      tabItems: [
        {
          label: labels.URLS,
          name: labels.URLS.toLowerCase(),
          id: `${labels.URLS.toLowerCase()}-content`,
          component: AdvancedSettingsURLs
        },
        {
          label: labels.IpAddresses,
          name: labels.IpAddresses.toLowerCase(),
          id: `${labels.IpAddresses.toLowerCase()}-content`,
          component: AdvancedSettingsIpAddresses
        },

        {
          label: labels.Attachments,
          name: labels.Attachments.toLowerCase(),
          id: `${labels.Attachments.toLowerCase()}-content`,
          component: AdvancedSettingsAttachments
        }
      ],
      formData: []
    }
  },
  created() {
    this.getAnalysisExclusions()
  },
  methods: {
    async getAnalysisExclusions() {
      const response = await getAnalysisExclusions()
    }
  }
}
</script>

<style lang="scss">
.advanced-settings {
  .el-tabs__header {
    background-color: rgb(245, 247, 250);
    border-color: rgb(245, 247, 250);
  }
  .el-tabs__nav {
    margin-left: 16px;
  }
  .el-tabs__item {
    font-size: 14px !important;
    height: 48px;
    line-height: 48px;
  }
  .el-tabs__active-bar {
    min-width: 34px !important;
  }
}
</style>
