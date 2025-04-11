<template>
  <KContainer id="smishing-settings">
    <el-tabs ref="refTabs" :value="tab" @input="changeTabStatus">
      <el-tab-pane
        v-if="getSmishingDomainSearchPermissions"
        label="Domains"
        name="Domains"
        id="domains-content"
      >
        <DomainsList v-if="tab === 'Domains'" ref="refDomains" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getSmishingDnsSearchPermissions"
        label="DNS Services"
        name="DNSServices"
        id="dns-services-content"
      >
        <DnsServiceList v-if="tab === 'DNSServices'" ref="refDnsServiceList" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getSmishingExcludedIpGetPermissions"
        label="Exclude IP Address"
        name="ExcludeIpAddress"
        id="exclude-ip-address-content"
      >
        <ExcludeIPAddress v-if="tab === 'ExcludeIpAddress'" ref="refExcludeIPAddress" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import DnsServiceList from '@/components/SmishingSettings/DnsServices/DnsServicesList'
import DomainsList from '@/components/SmishingSettings/Domains/DomainsList'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import ExcludeIPAddress from '@/components/SmishingSettings/ExcludeIPAddress/ExcludeIPAddress'

export default {
  name: 'Settings',
  components: {
    KContainer,
    DnsServiceList,
    DomainsList,
    ExcludeIPAddress
  },
  data() {
    return {
      tab: 'Domains'
    }
  },
  computed: {
    ...mapGetters({
      getSmishingDomainSearchPermissions: 'permissions/getSmishingDomainSearchPermissions',
      getSmishingDnsSearchPermissions: 'permissions/getSmishingDnsSearchPermissions',
      getSmishingExcludedIpGetPermissions: 'permissions/getSmishingExcludedIpGetPermissions'
    })
  },
  created() {
    if (!this.getSmishingDomainSearchPermissions && this.getSmishingDnsSearchPermissions) {
      this.tab = 'DNSServices'
    } else if (
      !this.getSmishingDomainSearchPermissions &&
      !this.getSmishingDnsSearchPermissions &&
      this.getSmishingExcludedIpGetPermissions
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
      if (this.tab === 'ExcludeIpAddress' && tabStatus !== 'ExcludeIpAddress') {
        if (!this?.$refs?.refExcludeIPAddress?.isInitialDataAndModelEqual) {
          this.tab = 'ExcludeIpAddress'
          this.$refs.refTabs.value = 'ExcludeIpAddress'
          this.$refs.refTabs.currentName = 'ExcludeIpAddress'
          this.$store.dispatch('common/setIsShowLeavingDialog', {
            show: true,
            callback: () => {
              this.tab = tabStatus
            }
          })
          return
        }
      }
      this.tab = tabStatus
    }
  }
}
</script>
