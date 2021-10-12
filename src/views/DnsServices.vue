<template>
  <div class="dnsServices" id="dnsServices">
    <v-layout id="ts-layout" wrap style="min-height: 80vh;">
      <v-col class="pl-0 dnsServices__tab-container" cols="12">
        <v-card id="pr-card" class="pr-card pr-6 pb-0">
          <el-tabs v-model="tab">
            <el-tab-pane label="Domains" name="Domains" id="domains-content"
              ><DomainsList v-if="tab === 'Domains'"
            /></el-tab-pane>
            <el-tab-pane label="DNS Services" name="DNSServices" id="dns-services-content"
              ><DnsServiceList v-if="tab === 'DNSServices'"
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
  methods: {
    changeTabStatus(tabStatus) {
      this.tab = tabStatus
    }
  }
}
</script>

<style lang="scss">
.dnsServices {
  padding: 0 16px 16px 16px;

  .el-tabs__content {
    margin-top: 24px;
  }

  &__tab-container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 11px !important;
  }

  .v-slide-group__content {
    border-bottom: 2px solid #e4e7ed;
  }

  .v-window__container {
    margin-top: 24px !important;
  }

  .v-card:not(.v-sheet--tile):not(.v-card--shaped) {
    border-radius: 20px;
    box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
    background-color: #ffffff;
    padding: 0;
  }

  .v-tabs-slider-wrapper {
    bottom: 0 !important;
    color: #0486fe !important;
  }
}

.pr-tab {
  font-family: 'Open Sans', sans-serif !important;
  font-size: 20px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.15;
  letter-spacing: normal;
  text-transform: capitalize;
  color: rgba(0, 0, 0, 0.87) !important;

  &-users {
    margin-right: 35px !important;
  }

  &-active {
    color: #2196f3 !important;
  }
}

.pr-card {
  box-shadow: 0 1px 3px 0 rgba(142, 142, 142, 0.2), 0 1px 1px 0 rgba(243, 243, 243, 0.14),
    0 1px 1px -1px rgba(204, 204, 204, 0.12);
  padding: 10px 5px 18px 24px !important;
  border-radius: 20px;
}
</style>
