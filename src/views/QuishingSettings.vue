<template>
  <KContainer id="quishing-settings">
    <ElTabs v-model="tab">
      <ElTabPane v-if="true" label="Domains" name="Domains" id="domains-content">
        <DomainsList v-if="tab === 'Domains'" ref="refDomains" />
      </ElTabPane>
      <ElTabPane v-if="true" label="DNS Services" name="DNSServices" id="dns-services-content">
      </ElTabPane>
      <ElTabPane
        v-if="true"
        label="Exclude IP Address"
        name="ExcludeIpAddress"
        id="exclude-ip-address-content"
      >
      </ElTabPane>
    </ElTabs>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import DomainsList from '@/components/QuishingSettings/Domains/DomainsList'

export default {
  name: 'QuishingSettings',
  components: { DomainsList, KContainer },
  data() {
    return {
      tab: 'Domains'
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refDomains, refDnsServiceList } = this.$refs
    if (refDomains && refDomains.modalStatus) {
      refDomains.checkIfCanCloseDomainModal()
      next(false)
    } else if (refDnsServiceList && refDnsServiceList.modalStatus) {
      refDnsServiceList.checkIfCanCloseDnsServiceModal()
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
