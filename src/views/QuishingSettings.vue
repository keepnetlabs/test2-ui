<template>
  <KContainer id="quishing-settings">
    <ElTabs v-model="tab">
      <ElTabPane
        v-if="getDomainSearchPermissions"
        label="Domains"
        name="Domains"
        id="domains-content"
      >
        <DomainsList v-if="tab === 'Domains'" ref="refDomains" />
      </ElTabPane>
      <ElTabPane
        v-if="getDnsSearchPermissions"
        label="DNS Services"
        name="DNSServices"
        id="dns-services-content"
      >
        <DnsServiceList v-if="tab === 'DNSServices'" ref="refDnsServiceList" />
      </ElTabPane>
      <ElTabPane
        v-if="getExcludedIpAddressGetPermissions"
        label="Exclude IP Address"
        name="ExcludeIpAddress"
        id="exclude-ip-address-content"
      >
        <ExcludeIPAddress v-if="tab === 'ExcludeIpAddress'" ref="refExcludeIPAddress" />
      </ElTabPane>
    </ElTabs>
  </KContainer>
</template>

<script>
import KContainer from '@/components/KContainer/KContainer'
import DomainsList from '@/components/QuishingSettings/Domains/DomainsList'
import ExcludeIPAddress from '@/components/QuishingSettings/ExcludeIPAddress/ExcludeIPAddress.vue'
import DnsServiceList from '@/components/QuishingSettings/DnsServices/DnsServicesList.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'QuishingSettings',
  components: { DnsServiceList, ExcludeIPAddress, DomainsList, KContainer },
  data() {
    return {
      tab: 'Domains'
    }
  },
  computed: {
    ...mapGetters({
      getDomainSearchPermissions: 'permissions/getQuishingDomainSearchPermissions',
      getDnsSearchPermissions: 'permissions/getQuishingDnsSearchPermissions',
      getExcludedIpAddressGetPermissions: 'permissions/getQuishingExcludedIpAddressGetPermissions'
    })
  },
  created() {
    if (!this.getDomainSearchPermissions && this.getDnsSearchPermissions) {
      this.tab = 'DNSServices'
    } else if (
      !this.getDomainSearchPermissions &&
      !this.getDnsSearchPermissions &&
      this.getExcludedIpAddressGetPermissions
    ) {
      this.tab = 'ExcludeIpAddress'
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refDomains, refDnsServiceList, refExcludeIPAddress } = this.$refs
    if (refDomains && refDomains.modalStatus) {
      refDomains.checkIfCanCloseDomainModal()
      next(false)
    } else if (refDnsServiceList && refDnsServiceList.modalStatus) {
      refDnsServiceList.checkIfCanCloseDnsServiceModal()
      next(false)
    } else if (refExcludeIPAddress && !refExcludeIPAddress?.isInitialDataAndModelEqual) {
      this.$store.dispatch('common/setIsShowLeavingDialog', {
        show: true,
        callback: () => {
          next(true)
        }
      })
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
