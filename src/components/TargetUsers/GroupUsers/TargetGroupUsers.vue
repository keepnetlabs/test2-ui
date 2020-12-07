<template>
  <div class="target-users-group-users">
    <div class="target-users-group-users__container">
      <EditUserModal
        :status="showEditUserModal"
        @closeAddUserModal="toggleEditUserModal"
        @closeAddUserModalWithUpdate="closeEditUserModalWithUpdate"
        :editData="selectedRow"
        :custom-fields="customFields"
        v-if="showEditUserModal"
      />
      <TargetGroupUsersTable
        ref="refTable"
        :loading="loading"
        :tableData="tableData"
        :customFields="customFields"
        :resourceId="resourceId"
        @handleSelectedRow="handleSelectedRow"
        @callForSearchTargetGroupUsers="callForSearchTargetGroupUsers"
      />
    </div>
  </div>
</template>

<script>
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable'
import { getTargetUserCustomFieldsByCompanyId, searchTargetGroupUsers } from '@/api/targetUsers'
import AddUserModal from '../AddUserModal'
export default {
  name: 'TargetGroupUsers',
  components: {
    TargetGroupUsersTable,
    EditUserModal: AddUserModal
  },
  data() {
    return {
      tableData: [],
      resourceId: null,
      showEditUserModal: false,
      customFields: [],
      selectedRow: null,
      loading: false
    }
  },
  created() {
    const {
      $route: { params }
    } = this
    if (params && params.id) {
      this.resourceId = params.id
      this.callForGetTargetUserCustomFieldsByCompanyId()
      if (!params.label) {
        this.$route.params.label = localStorage.getItem('lastTargetGroupUsers')
      } else {
        localStorage.setItem('lastTargetGroupUsers', this.$route.params.label)
      }
    } else {
      this.handleRouteBackToTargetUsers()
    }
  },
  methods: {
    callForGetTargetUserCustomFieldsByCompanyId() {
      this.loading = true
      getTargetUserCustomFieldsByCompanyId()
        .then((response) => {
          const { data } = response
          this.customFields = data.data.filter((item) => {
            return item.isActive
          })
          const sortProp = 'sortOrder'
          this.customFields.sort((a, b) => {
            if (a[sortProp] > b[sortProp]) {
              return 1
            } else if (a[sortProp] === b[sortProp]) {
              return 0
            }
            return -1
          })
        })
        .finally(() =>
          this.callForSearchTargetGroupUsers(this.resourceId, this.$refs.refTable.axiosPayload)
        )
    },
    callForSearchTargetGroupUsers(id = this.resourceId, axiosPayload) {
      this.loading = true
      searchTargetGroupUsers(id, axiosPayload)
        .then((response) => {
          const { data: { data: { results = [] } } = {} } = response
          this.tableData = results.map((item) => {
            const { customFieldValues } = item
            for (let { name, value } of customFieldValues) {
              item[name] = value
            }
            return item
          })
        })
        .catch(() => {
          this.handleRouteBackToTargetUsers()
        })
        .finally(() => {
          this.loading = false
        })
    },
    closeEditUserModalWithUpdate() {
      this.toggleEditUserModal()
      this.$refs.refTable.callForSearchTargetGroupUsers()
    },
    handleRouteBackToTargetUsers() {
      this.$router.push({ name: 'Target Users', params: { tab: 'second' } })
    },
    handleSelectedRow(row = {}) {
      this.selectedRow = row
      this.toggleEditUserModal()
    },

    toggleEditUserModal() {
      this.showEditUserModal = !this.showEditUserModal
    }
  }
}
</script>

<style lang="scss">
.target-users-group-users {
  background-color: white;
  margin: 16px;
  border-radius: 20px;
  box-shadow: 0 10px 15px -5px rgba(205, 205, 205, 0.5);
  &__container {
    padding: 24px;
  }
}
</style>
