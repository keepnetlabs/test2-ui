<template>
  <div class="companies">
    <v-layout wrap class="companies__container">
      <v-card class="companies__container-card">
        <v-tabs
          active-class="pr-tab-active"
          background-color="transparent"
          color="basil"
          class="k-tabs"
          v-model="tab"
        >
          <v-tab @click="changeTabStatus(0)" class="k-tab p-2" id="pr-tab-people">
            Companies
          </v-tab>
          <v-tab @click="changeTabStatus(1)" class="k-tab p-2">Company Groups</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" class="target-users__tabs-items">
          <v-tab-item>
            <company-list />
          </v-tab-item>
          <v-tab-item>
            222222222
          </v-tab-item>
          <v-tab-item> </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import CompanyList from '@/components/Companies/CompanyList'
export default {
  name: 'Companies',
  components: { CompanyList },
  data() {
    return {
      tab: 0
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    }
  }
}
</script>

<style lang="scss">
.companies {
  min-height: 80vh !important;
  &__container {
    padding: 0px 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 5px 18px 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
