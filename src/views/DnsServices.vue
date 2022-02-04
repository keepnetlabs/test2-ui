<template>
  <div class="k-container" id="dnsServices">
    <v-layout id="ts-layout" wrap style="min-height: 80vh;">
      <v-col class="k-container__tab-container" cols="12">
        <v-card id="dns-services-card" class="k-card">
          <el-tabs v-model="tab">
            <el-tab-pane v-if="isDomainRender" label="Domains" name="Domains" id="domains-content"
              ><DomainsList
                v-if="tab === 'Domains'"
                :PERMISSIONS="PERMISSIONS['DOMAIN']"
                ref="refDomains"
            /></el-tab-pane>
            <el-tab-pane
              v-if="isDNSRender"
              label="DNS Services"
              name="DNSServices"
              id="dns-services-content"
              ><DnsServiceList
                v-if="tab === 'DNSServices'"
                :PERMISSIONS="PERMISSIONS['DNS']"
                ref="refDnsServiceList"
            /></el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import DnsServiceList from '@/components/DnsServices/DnsServicesList'
import DomainsList from '@/components/Domains/DomainsList'
import PERMISSIONS from '@/permissions'
import { getPermissionsOfAllItems } from '@/utils/functions'
export default {
  name: 'DNSandDomains',
  components: {
    DnsServiceList,
    DomainsList
  },
  data() {
    return {
      tab: 'Domains',
      PERMISSIONS: {
        DOMAIN: {},
        DNS: {}
      }
    }
  },
  computed: {
    isDomainRender() {
      return this.PERMISSIONS?.DOMAIN?.SEARCH?.hasPermission
    },
    isDNSRender() {
      return this.PERMISSIONS?.DNS?.SEARCH?.hasPermission
    }
  },
  created() {
    this.getPermissions()
    if (!this.isDomainRender) {
      this.tab = 'DNSServices'
    }
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    },
    getPermissions() {
      const { DNS_PERMISSIONS, DOMAIN_PERMISSIONS } = PERMISSIONS
      this.$set(this.PERMISSIONS, 'DNS', getPermissionsOfAllItems(DNS_PERMISSIONS))
      this.$set(this.PERMISSIONS, 'DOMAIN', getPermissionsOfAllItems(DOMAIN_PERMISSIONS))
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
  }
}
</script>
