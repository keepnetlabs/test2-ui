<template>
  <div class="k-container" id="dnsServices">
    <v-layout id="ts-layout" wrap style="min-height: 80vh;">
      <v-col class="k-container__tab-container" cols="12">
        <v-card id="dns-services-card" class="k-card">
          <el-tabs v-model="tab">
            <el-tab-pane
              v-if="getDomainSearchPermissions"
              label="Domains"
              name="Domains"
              id="domains-content"
              ><DomainsList v-if="tab === 'Domains'" ref="refDomains"
            /></el-tab-pane>
            <el-tab-pane
              v-if="getDnsSearchPermissions"
              label="DNS Services"
              name="DNSServices"
              id="dns-services-content"
              ><DnsServiceList v-if="tab === 'DNSServices'" ref="refDnsServiceList"
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
import { mapGetters } from 'vuex'
export default {
  name: 'DNSandDomains',
  components: {
    DnsServiceList,
    DomainsList
  },
  data() {
    return {
      tab: 'Domains'
    }
  },
  computed: {
    ...mapGetters({
      getDomainSearchPermissions: 'permissions/getDomainSearchPermissions',
      getDnsSearchPermissions: 'permissions/getDnsSearchPermissions'
    })
  },
  created() {
    if (!this.getDomainSearchPermissions && this.getDnsSearchPermissions) {
      this.tab = 'DNSServices'
    }
  },
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
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
