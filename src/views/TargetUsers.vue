<template>
  <KContainer id="target-users">
    <target-users-check-license-dialog
      v-if="showLicenseExceededDialog"
      :status="showLicenseExceededDialog"
      :dialogBody="getDialogBody"
      @close-overlay="toggleShowLicenseExceededDialog"
    />
    <el-tabs v-model="tab">
      <el-tab-pane
        v-if="getTargetUsersSearchPermissions"
        id="target-users--people-content"
        label="People"
        name="target-users--people"
        ><people
          v-if="tab === 'target-users--people'"
          ref="refPeople"
          :company-license="companyLicense"
          @call-for-company-licenses="callForLicenseCheck"
          @on-empty-target-group-route="handleRouteToTargetGroup"
      /></el-tab-pane>
      <el-tab-pane
        v-if="getTargetGroupsSearchPermissions"
        id="target-users--group-content"
        label="Groups"
        name="target-users--group"
      >
        <groups
          v-if="tab === 'target-users--group'"
          ref="groups"
          :isLoadState="isLoadState"
          :is-open-target-group-modal-on-created="isOpenTargetGroupModalOnCreated"
      /></el-tab-pane>
    </el-tabs>
  </KContainer>
</template>

<script>
import People from '../components/TargetUsers/People'
import Groups from '../components/TargetUsers/Groups'
import { getCheckCompanyLicense } from '@/api/company'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
import { mapGetters } from 'vuex'
import KContainer from '@/components/KContainer/KContainer'
export default {
  components: {
    KContainer,
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
      isOpenTargetGroupModalOnCreated: false,
      showLicenseExceededDialog: false,
      tab: 'target-users--people'
    }
  },
  computed: {
    ...mapGetters({
      getTargetUsersSearchPermissions: 'permissions/getTargetUsersSearchPermissions',
      getTargetGroupsSearchPermissions: 'permissions/getTargetGroupsSearchPermissions'
    }),
    getDialogBody() {
      return this.companyLicense
        ? `Your license allows to use the system with ${this.companyLicense.licenseLimit} target users. Current target user count is ${this.companyLicense.totalUserCount}.`
        : ''
    }
  },
  watch: {
    tab(val) {
      if (val === 'target-users--people') this.isLoadState = false
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.name === 'Target Group Users') {
        if (from.params.tab !== 'people') {
          vm.tab = 'target-users--group'
          vm.isLoadState = true
        }
      }
    })
  },
  created() {
    const {
      $route: { params }
    } = this
    if (params && params.tab) {
      let tab
      if (params.tab === 'first') {
        tab = 'target-users--people'
      } else if (params.tab === 'second') {
        tab = 'target-users--group'
      } else {
        tab = params.tab
      }
      this.tab = tab
    }
    if (!this.getTargetUsersSearchPermissions && this.getTargetGroupsSearchPermissions) {
      this.tab = 'target-users--group'
    }
    this.callForLicenseCheck(true)
  },
  beforeRouteLeave(to, from, next) {
    const refs = this.$refs
    if (refs?.refPeople) {
      const refPeople = refs.refPeople
      if (refPeople.isWantToShowDeleteUserModal) {
        refPeople.changeDeleteModalStatus(false)
        next(false)
      } else if (refPeople.isWantToShowAddUsersManuallyModal) {
        refPeople.isWantToShowAddUsersManuallyModal = false
        next(false)
      } else if (refPeople.isWantToShowAddUsersModal) {
        refPeople.checkIfCanCloseAddUserModal()
        next(false)
      } else if (refPeople.isWantToShowImportUsersFromFileModal) {
        refPeople.isWantToShowImportUsersFromFileModal = false
        next(false)
      } else if (refPeople.isWantToShowCustomFieldsModal) {
        next(false)
      } else if (refs.refPeople.$refs.targetUserFromAFile) {
        const refExcelUpload = refs.refPeople.$refs.targetUserFromAFile
        if (refExcelUpload.isExcelUploaded) {
          refExcelUpload.closeTargetUserImport = true
          next()
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
    changeTabStatus(status) {
      this.tab = status
    },
    toggleShowLicenseExceededDialog() {
      this.showLicenseExceededDialog = !this.showLicenseExceededDialog
    },
    handleRouteToTargetGroup() {
      this.isOpenTargetGroupModalOnCreated = true
      this.tab = 'target-users--group'
      this.$nextTick(() => (this.isOpenTargetGroupModalOnCreated = false))
    }
  }
}
</script>
