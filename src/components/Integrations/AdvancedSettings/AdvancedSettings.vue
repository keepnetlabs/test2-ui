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
      >
        <DatatableLoading v-if="isLoading" class="mt-5" :loading="isLoading" />
        <component
          v-else-if="!isLoading && tab === item.name"
          :is="item.component"
          :form-data="formData"
          @on-submit="handleSubmit"
        />
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
import { getAnalysisExclusions, updateAnalysisExclusions } from '@/api/integrations'
import DatatableLoading from '@/components/SkeletonLoading/WidgetLoading'
export default {
  name: 'AdvancedSettings',
  components: { DatatableLoading, CompanySettingsHeader },
  data() {
    return {
      labels,
      tab: labels.URLS.toLowerCase(),
      isLoading: false,
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
    getAnalysisExclusions() {
      this.setLoading(true)
      getAnalysisExclusions()
        .then(({ data: { data } }) => {
          const { exclusionItems } = data
          this.formData = exclusionItems
        })
        .finally(this.setLoading)
    },
    handleSubmit(payload = {}, key = null) {
      const newPayload = { exclusionItems: [...this.removeKeysFromData(key), ...payload] }
      this.setLoading(true)
      updateAnalysisExclusions(newPayload)
        .then(() => {
          this.getAnalysisExclusions()
        })
        .finally(this.setLoading)
    },
    setLoading(value = false) {
      this.isLoading = value
    },
    removeKeysFromData(key) {
      const copyOfData = JSON.parse(JSON.stringify(this.formData))
      return copyOfData.filter(({ exclusionType }) => exclusionType !== key)
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
