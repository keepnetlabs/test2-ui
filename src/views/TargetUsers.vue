<template>
  <div class="k-container" id="target-users">
    <v-layout wrap style="min-height: 80vh;">
      <v-col class="k-container__tab-container" cols="12">
        <v-card class="k-card">
          <target-users-check-license-dialog
            v-if="showLicenseExceededDialog"
            :status="showLicenseExceededDialog"
            :dialogBody="getDialogBody"
            @close-overlay="toggleShowLicenseExceededDialog"
          />
          <el-tabs v-model="tab">
            <el-tab-pane
              label="People"
              name="target-users--people"
              id="target-users--people-content"
              v-if="getTargetUsersSearchPermissions"
              ><people
                ref="refPeople"
                v-if="tab === 'target-users--people'"
                :company-license="companyLicense"
                @call-for-company-licenses="callForLicenseCheck"
            /></el-tab-pane>
            <el-tab-pane
              label="Groups"
              name="target-users--group"
              id="target-users--group-content"
              v-if="getTargetGroupsSearchPermissions"
            >
              <groups ref="groups" :isLoadState="isLoadState" v-if="tab === 'target-users--group'"
            /></el-tab-pane>
          </el-tabs>
        </v-card>
      </v-col>
    </v-layout>
  </div>
</template>

<script>
import People from '../components/TargetUsers/People'
import Groups from '../components/TargetUsers/Groups'
import { getCheckCompanyLicense } from '@/api/company'
import TargetUsersCheckLicenseDialog from '@/components/TargetUsers/TargetUsersCheckLicenseDialog'
import { mapGetters } from 'vuex'
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
  watch: {
    tab(val) {
      if (val === 'target-users--people') this.isLoadState = false
    }
  },
  created() {
    const {
      $route: { params }
    } = this
    if (params && params.tab) {
      let tab
      switch (params.tab) {
        case 'first':
          tab = 'target-users--people'
          break
        case 'second':
          tab = 'target-users--group'
          break
        default:
          tab = params.tab
          break
      }
      this.tab = tab
    }
    if (!this.getTargetGroupsSearchPermissions) {
      this.tab = 'target-users--group'
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
        refPeople.checkIfCanCloseAddUserModal()
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
    }
  }
}
</script>
