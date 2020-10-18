<template>
  <div class="companies">
    <v-layout wrap class="companies__container">
      <v-card class="companies__container-card">
        <template v-if="!$route.params.groupId">
          <el-tabs v-model="tab">
            <el-tab-pane label="Companies" name="first"> <company-list /></el-tab-pane>
            <el-tab-pane label="Company Groups" name="second"> <company-group-list /></el-tab-pane>
          </el-tabs>
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
      tab: 'first'
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
