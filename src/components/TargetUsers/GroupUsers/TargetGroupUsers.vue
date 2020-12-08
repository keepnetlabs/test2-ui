<template>
  <div class="target-users-group-users">
    <div class="target-users-group-users__container">
      <EditUserModal
        v-if="showEditUserModal"
        :editData="selectedRow"
        :custom-fields="customFields"
        :status="showEditUserModal"
        @closeAddUserModal="toggleEditUserModal"
        @closeAddUserModalWithUpdate="closeEditUserModalWithUpdate"
      />
      <AddToAnExistingGroupModal
        v-if="showAddToAnExistingGroupModal"
        :selected-rows="getSelectedRow"
        :status="showAddToAnExistingGroupModal"
        @closeOverlay="toggleShowAddToAnExistingGroupModal"
      />
      <TargetGroupUsersAddUsersModal
        v-if="showAddUsersModal"
        :custom-fields="customFields"
        :table-data="tableData"
        :status="showAddUsersModal"
        :group-name="getGroupName"
        @closeOverlay="toggleAddUserModal"
      />
      <TargetGroupUsersTable
        ref="refTable"
        :custom-fields="customFields"
        :loading="loading"
        :resource-id="resourceId"
        :table-data="tableData"
        @callForSearchTargetGroupUsers="callForSearchTargetGroupUsers"
        @handleAddAction="toggleAddUserModal"
        @handleAddToAnExistingGroup="handleAddToAnExistingGroup"
        @handleEditTargetUser="handleEditTargetUser"
      />
    </div>
  </div>
</template>

<script>
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable'
import { getTargetUserCustomFieldsByCompanyId, searchTargetGroupUsers } from '@/api/targetUsers'
import AddUserModal from '../AddUserModal'
import AddToAnExistingGroupModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddToAnExistingGroupModal'
import TargetGroupUsersAddUsersModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddUsersModal'
export default {
  name: 'TargetGroupUsers',
  components: {
    TargetGroupUsersAddUsersModal,
    AddToAnExistingGroupModal,
    TargetGroupUsersTable,
    EditUserModal: AddUserModal
  },
  data() {
    return {
      customFields: [],
      loading: false,
      tableData: [],
      resourceId: null,
      showEditUserModal: false,
      selectedRow: null,
      showAddToAnExistingGroupModal: false,
      showAddUsersModal: false
    }
  },
  computed: {
    getSelectedRow() {
      if (this.selectedRow.constructor.name === 'Array') {
        return this.selectedRow
      }
      return [this.selectedRow]
    },
    getGroupName() {
      return this.$route.params.label
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
    },
    handleEditTargetUser(row = {}) {
      this.handleSelectedRow(row)
      this.toggleEditUserModal()
    },
    handleAddToAnExistingGroup(row = {}) {
      this.handleSelectedRow(row)
      this.toggleShowAddToAnExistingGroupModal()
    },
    toggleAddUserModal() {
      this.showAddUsersModal = !this.showAddUsersModal
    },
    toggleEditUserModal() {
      this.showEditUserModal = !this.showEditUserModal
    },
    toggleShowAddToAnExistingGroupModal() {
      this.showAddToAnExistingGroupModal = !this.showAddToAnExistingGroupModal
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
