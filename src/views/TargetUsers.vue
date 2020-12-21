<template>
  <div class="target-users" id="target-users">
    <v-layout wrap class="target-users__container">
      <app-dialog
        v-if="showLicenseExceededDialog"
        :status="showLicenseExceededDialog"
        icon="mdi-license"
        title="License Warning"
        body="License is exceeded"
        @changeStatus="toggleShowLicenseExceededDialog"
      >
        <template #app-dialog-footer>
          <div class="d-flex justify-end">
            <v-btn
              text
              color="#2196f3"
              class="k-dialog__button"
              @click="toggleShowLicenseExceededDialog"
            >
              {{ labels.OK }}
            </v-btn>
          </div>
        </template>
      </app-dialog>
      <v-card class="target-users__container-card">
        <el-tabs v-model="tab">
          <el-tab-pane
            label="People"
            name="first"
            v-if="checkPermissions('target-users/search', 'POST')"
            ><people ref="refPeople" v-if="tab === 'first'"
          /></el-tab-pane>
          <el-tab-pane
            label="Group"
            name="second"
            v-if="checkPermissions('target-groups/search', 'POST')"
          >
            <groups v-if="tab === 'second'"
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
import labels from '@/model/constants/labels'
import AppDialog from '@/components/AppDialog'
export default {
  components: {
    AppDialog,
    People,
    Groups
  },
  data() {
    return {
      showLicenseExceededDialog: false,
      tab: 'first',
      labels
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
    this.callForLicenseCheck()
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
      } else {
        next()
      }
    } else {
      next()
    }
  },
  methods: {
    callForLicenseCheck() {
      const companyResourceId = localStorage.getItem('companyId')
      getCheckCompanyLicense(companyResourceId).then((response) => {
        const { data: { data = {} } = {} } = response
        const { isLicenseExceeded } = data
        if (isLicenseExceeded) {
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
