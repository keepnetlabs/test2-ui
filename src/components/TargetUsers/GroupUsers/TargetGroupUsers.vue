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
      <TargetGroupUsersAddToAnExistingGroupModal
        v-if="showAddToAnExistingGroupModal"
        :selected-rows="getSelectedRow"
        :status="showAddToAnExistingGroupModal"
        @closeOverlay="toggleShowAddToAnExistingGroupModal"
        @closeOverlayWithUpdate="closeAddToAnExistingGroupModalWithUpdate"
      />
      <TargetGroupUsersAddUsersModal
        v-if="showAddUsersModal"
        :status="showAddUsersModal"
        :group-name="getGroupName"
        :resource-id="resourceId"
        @closeOverlay="toggleAddUserModal"
        @closeOverlayWithUpdate="closeAddOverlayWithUpdate"
      />
      <TargetGroupUsersTable
        ref="refTable"
        :resource-id="resourceId"
        has-selection-slot
        @handleAddAction="toggleAddUserModal"
        @handleAddUsersSelectionClick="handleAddUsersSelectionClick"
        @handleAddToAnExistingGroup="handleAddToAnExistingGroup"
        @handleEditTargetUser="handleEditTargetUser"
      />
    </div>
  </div>
</template>

<script>
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import AddUserModal from '../AddUserModal'
import TargetGroupUsersAddToAnExistingGroupModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddToAnExistingGroupModal'
import TargetGroupUsersAddUsersModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddUsersModal'
export default {
  name: 'TargetGroupUsers',
  components: {
    TargetGroupUsersAddUsersModal,
    TargetGroupUsersAddToAnExistingGroupModal,
    TargetGroupUsersTable,
    EditUserModal: AddUserModal
  },
  data() {
    return {
      customFields: [],
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
      getTargetUserCustomFieldsByCompanyId().then((response) => {
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
    },
    closeAddOverlayWithUpdate() {
      this.toggleAddUserModal()
      this.$refs.refTable.callForSearchTargetGroupUsers()
    },
    closeEditUserModalWithUpdate() {
      this.toggleEditUserModal()
      this.$refs.refTable.callForSearchTargetGroupUsers()
    },
    closeAddToAnExistingGroupModalWithUpdate() {
      this.toggleShowAddToAnExistingGroupModal()
      this.$refs.refTable.callForSearchTargetGroupUsers()
    },
    handleAddUsersSelectionClick(selection = []) {
      this.selectedRow = selection
      this.toggleShowAddToAnExistingGroupModal()
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
