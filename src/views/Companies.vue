<template>
  <KContainer id="companies">
    <template v-if="!$route.params.groupId && $route.name === 'Companies'">
      <el-tabs v-model="tab">
        <el-tab-pane
          v-if="getCompaniesSearchPermissions"
          label="Companies"
          name="company-companies"
          id="company-companies-content"
        >
          <company-list v-if="tab === 'company-companies'" ref="refCompanyList"
        /></el-tab-pane>
        <el-tab-pane
          v-if="getCompanyGroupsSearchPermissions"
          label="Company Groups"
          name="company-company-groups"
          id="company-company-groups-content"
        >
          <company-group-list :isLoadState="isLoadState" v-if="tab === 'company-company-groups'"
        /></el-tab-pane>
      </el-tabs>
    </template>
    <template v-else>
      <company-group-details :groupId="$route.params.groupId" />
    </template>
  </KContainer>
</template>

<script>
import CompanyList from '@/components/Companies/CompanyList'
import CompanyGroupList from '@/components/CompanyGroups/CompanyGroupList'
import CompanyGroupDetails from '@/components/CompanyGroups/CompanyGroupDetails'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
export default {
  name: 'Companies',
  props: {},
  components: { KContainer, CompanyGroupDetails, CompanyGroupList, CompanyList },
  data() {
    return {
      tab: 'company-companies',
      isLoadState: false
    }
  },
  computed: {
    ...mapGetters({
      getCompaniesSearchPermissions: 'permissions/getCompaniesSearchPermissions',
      getCompanyGroupsSearchPermissions: 'permissions/getCompanyGroupsSearchPermissions'
    })
  },
  watch: {
    tab(val) {
      if (val === 'company-companies') this.isLoadState = false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'Company Group Details') {
        vm.tab = 'company-company-groups'
        vm.isLoadState = true
      } else if (to.name === 'Company Group Details') {
        vm.tab = 'company-companies'
      }
    })
  },
  created() {
    if (!this.getCompaniesSearchPermissions && this.getCompanyGroupsSearchPermissions) {
      this.tab = 'company-company-groups'
    }
  },
  updated() {
    if (this.$route.params && this.$route.params.tab && !this.$route.params.force) {
      this.tab = this.$route.params.tab
    }
    if (!this.getCompaniesSearchPermissions) {
      this.tab = 'company-company-groups'
    }
  },
  beforeRouteLeave(to, from, next) {
    const { refCompanyList } = this.$refs
    if (refCompanyList && refCompanyList.isShowCreateOrEditModal) {
      const { refCreateOrEditModal } = refCompanyList.$refs
      if (refCreateOrEditModal && refCreateOrEditModal.isFormDataChanged()) {
        this.$store.dispatch('common/setIsShowLeavingDialog', {
          show: true,
          callback() {
            refCompanyList.isShowCreateOrEditModal = false
            refCompanyList.cancelCreateOrEditForm()
          }
        })
        next(false)
      } else {
        refCompanyList.isShowCreateOrEditModal = false
      }
    } else {
      next()
    }
  },
  methods: {
    changeTabStatus(status) {
      this.tab = status
    }
  }
}
</script>
