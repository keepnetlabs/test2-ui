<template>
  <div class="companies">
    <v-layout wrap class="companies__container">
      <v-card class="companies__container-card">
        <template v-if="!$route.params.groupId">
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
              <company-list v-if="tab === 0" />
            </v-tab-item>
            <v-tab-item>
              <company-group-list v-if="tab === 1" />
            </v-tab-item>
          </v-tabs-items>
        </template>
        <template v-else>
          <company-group-details :groupId="$route.params.groupId" />
        </template>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import CompanyList from '@/components/Companies/CompanyList'
import CompanyGroupList from '@/components/CompanyGroups/CompanyGroupList'
import CompanyGroupDetails from '@/components/CompanyGroups/CompanyGroupDetails'
export default {
  name: 'Companies',
  props: {},
  components: { CompanyGroupDetails, CompanyGroupList, CompanyList },
  data() {
    return {
      tab: 0
    }
  },
  mounted() {},
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
  padding-top: 10px;
  &__container {
    padding: 0px 16px 24px 16px !important;
    width: 100%;
    &-card {
      box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5) !important;
      padding: 10px 24px 0 24px !important;
      border-radius: 20px !important;
      width: 100%;
    }
  }
}
</style>
