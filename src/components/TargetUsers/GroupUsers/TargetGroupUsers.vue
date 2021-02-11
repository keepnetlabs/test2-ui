<template>
  <div class="target-users-group-users">
    <div class="target-users-group-users__container">
      <TargetUserEditUserModal
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
      <TargetGroupsUsersRemoveFromGroups
        v-if="showRemoveUserModal"
        :status="showRemoveUserModal"
        :selected-rows="getSelectedRow"
        :group-name="getGroupName"
        :resource-id="resourceId"
        @closeDialog="toggleShowRemoveUserModal"
        @handleRemoveUsers="handleRemoveUsers"
      />
      <TargetGroupUsersTable
        ref="refTable"
        has-selection-slot
        class="pb-0"
        :resource-id="resourceId"
        @handleAddAction="toggleAddUserModal"
        @handleAddUsersSelectionClick="handleAddUsersSelectionClick"
        @handleAddToAnExistingGroup="handleAddToAnExistingGroup"
        @handleEditTargetUser="handleEditTargetUser"
        @handleRemoveToGroup="handleRemoveToGroup"
        @handleRemoveUsersSelectionClick="handleRemoveUsersSelectionClick"
        @handleRouteBackToTargetUsers="handleRouteBackToTargetUsers"
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
import TargetGroupsUsersRemoveFromGroups from '@/components/TargetUsers/GroupUsers/TargetGroupsUsersRemoveFromGroups'
export default {
  name: 'TargetGroupUsers',
  components: {
    TargetGroupsUsersRemoveFromGroups,
    TargetGroupUsersAddUsersModal,
    TargetGroupUsersAddToAnExistingGroupModal,
    TargetGroupUsersTable,
    TargetUserEditUserModal: AddUserModal
  },
  data() {
    return {
      customFields: [],
      resourceId: null,
      showEditUserModal: false,
      selectedRow: null,
      showAddToAnExistingGroupModal: false,
      showAddUsersModal: false,
      showRemoveUserModal: false
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
    callForSearchTargetGroupUsers() {
      this.$refs.refTable.callForSearchTargetGroupUsers()
    },
    closeAddOverlayWithUpdate() {
      this.toggleAddUserModal()
      this.callForSearchTargetGroupUsers()
    },
    closeEditUserModalWithUpdate() {
      this.toggleEditUserModal()
      this.callForSearchTargetGroupUsers()
    },
    closeAddToAnExistingGroupModalWithUpdate() {
      this.toggleShowAddToAnExistingGroupModal()
      this.callForSearchTargetGroupUsers()
    },
    handleAddUsersSelectionClick(selection = []) {
      this.selectedRow = selection
      this.toggleShowAddToAnExistingGroupModal()
    },
    handleRemoveUsersSelectionClick(selection = []) {
      this.selectedRow = selection
      this.toggleShowRemoveUserModal()
    },
    handleRemoveToGroup(selection = []) {
      this.handleSelectedRow(selection)
      this.toggleShowRemoveUserModal()
    },
    handleRouteBackToTargetUsers() {
      this.$router.push({ name: 'Target Users', params: { tab: 'second' } })
    },
    handleSelectedRow(row = []) {
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
    handleRemoveUsers() {
      this.toggleShowRemoveUserModal()
      this.callForSearchTargetGroupUsers()
    },
    toggleAddUserModal() {
      this.showAddUsersModal = !this.showAddUsersModal
    },
    toggleEditUserModal() {
      this.showEditUserModal = !this.showEditUserModal
    },
    toggleShowRemoveUserModal() {
      this.showRemoveUserModal = !this.showRemoveUserModal
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
