<template>
  <div class="target-users" id="target-users">
    <v-layout wrap class="target-users__container">
      <target-users-check-license-dialog
        v-if="showLicenseExceededDialog"
        :status="showLicenseExceededDialog"
        :dialogBody="getDialogBody"
        @close-overlay="toggleShowLicenseExceededDialog"
      />
      <v-card class="target-users__container-card">
        <el-tabs v-model="tab">
          <el-tab-pane
            label="People"
            name="first"
            v-if="checkPermissions('target-users/search', 'POST')"
            ><people
              ref="refPeople"
              v-if="tab === 'first'"
              :company-license="companyLicense"
              @call-for-company-licenses="callForLicenseCheck"
          /></el-tab-pane>
          <el-tab-pane
            label="Group"
            name="second"
            v-if="checkPermissions('target-groups/search', 'POST')"
          >
            <groups ref="groups" :isLoadState="isLoadState" v-if="tab === 'second'"
          /></el-tab-pane>
        </el-tabs>
      </v-card>
    </v-layout>
  </div>
</template>
<script>
import People from '../components/TargetUsers/People'
import Groups from '../components/TargetUsers/Groups'
import { checkPermission } from '@/utils/functions'
import { getCheckCompanyLicense } from '@/api/company'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
export default {
  components: {
    TargetUsersCheckLicenseDialog,
    People,
    Groups
  },
  provide() {
    return {
      companyLicense: this.companyLicense
    }
  },
  data() {
    return {
      companyLicense: null,
      isLoadState: false,
      showLicenseExceededDialog: false,
      tab: 'first'
    }
  },
  computed: {
    getDialogBody() {
      return this.companyLicense
        ? `Your license allows to use the system with ${this.companyLicense.licenseLimit} target users. Current target user count is ${this.companyLicense.totalUserCount}.`
        : ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'Target Group Users') {
        vm.tab = 'second'
        vm.isLoadState = true
      }
    })
  },
  watch: {
    tab(val) {
      if (val === 'first') this.isLoadState = false
    }
  },
  created() {
    const {
      $route: { params }
    } = this
    if (params && params.tab) {
      this.tab = params.tab
    }
    if (!this.checkPermissions('target-users/search', 'POST')) {
      this.tab = 'second'
    }
    this.callForLicenseCheck(true)
  },
  beforeRouteLeave(to, from, next) {
    const refs = this.$refs
    if (refs && refs.refPeople) {
      const refPeople = refs.refPeople
      if (refPeople.isWantToShowDeleteUserModal) {
        refPeople.changeDeleteModalStatus(false)
        next(false)
      } else if (refPeople.isWantToShowAddUsersManuallyModal) {
        refPeople.isWantToShowAddUsersManuallyModal = false
        next(false)
      } else if (refPeople.isWantToShowAddUsersModal) {
        refPeople.isWantToShowAddUsersModal = false
        next(false)
      } else if (refPeople.isWantToShowImportUsersFromFileModal) {
        refPeople.isWantToShowImportUsersFromFileModal = false
        next(false)
      } else if (refPeople.isWantToShowCustomFieldsModal) {
        next(false)
      } else if (refs && refs.refPeople.$refs.targetUserFromAFile) {
        const refExcelUpload = refs.refPeople.$refs.targetUserFromAFile
        if (refExcelUpload.isExcelUploaded) {
          refExcelUpload.closeTargetUserImport = true
          next(false)
        } else if (refExcelUpload.isLeaveAccepted) {
          next()
        } else next()
      } else {
        next()
      }
    } else {
      next()
    }
  },
  methods: {
    callForLicenseCheck(showMainModal = false) {
      const companyResourceId = localStorage.getItem('companyId')
      getCheckCompanyLicense(companyResourceId).then((response) => {
        const { data: { data = {} } = {} } = response
        const { isLimited, isLicenseExceeded } = data
        this.companyLicense = data
        if (isLimited && isLicenseExceeded && showMainModal) {
          this.toggleShowLicenseExceededDialog()
        }
      })
    },
    checkPermissions(permission, type) {
      return checkPermission(permission, type)
    },
    changeTabStatus(status) {
      this.tab = status
    },
    toggleShowLicenseExceededDialog() {
      this.showLicenseExceededDialog = !this.showLicenseExceededDialog
    }
  }
}
</script>
<style lang="scss">
.target-users {
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
