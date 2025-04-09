<template>
  <KContainer id="phishing-settings">
    <el-tabs ref="refTabs" :value="tab" @input="changeTabStatus">
      <el-tab-pane
        v-if="getDomainSearchPermissions"
        label="Domains"
        name="Domains"
        id="domains-content"
      >
        <DomainsList v-if="tab === 'Domains'" ref="refDomains" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getDnsSearchPermissions"
        label="DNS Services"
        name="DNSServices"
        id="dns-services-content"
      >
        <DnsServiceList v-if="tab === 'DNSServices'" ref="refDnsServiceList" />
      </el-tab-pane>
      <el-tab-pane
        v-if="getExcludedIpAddressGetPermissions"
        label="Exclude IP Address"
        name="ExcludeIpAddress"
        id="exclude-ip-address-content"
      >
        <ExcludeIPAddress ref="refExcludeIPAddress" v-if="tab === 'ExcludeIpAddress'" />
      </el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import DnsServiceList from '@/components/Settings/DnsServices/DnsServicesList'
import DomainsList from '@/components/Settings/Domains/DomainsList'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
import ExcludeIPAddress from '@/components/Settings/ExcludeIPAddress/ExcludeIPAddress'

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
      getDomainSearchPermissions: 'permissions/getDomainSearchPermissions',
      getDnsSearchPermissions: 'permissions/getDnsSearchPermissions',
      getExcludedIpAddressGetPermissions: 'permissions/getExcludedIpAddressGetPermissions'
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
