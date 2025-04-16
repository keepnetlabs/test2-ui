<template>
  <KContainer tabless>
    <DefaultErrorDialog
      v-if="!!bulkDeleteErrorMessage"
      :status="!!bulkDeleteErrorMessage"
      :error-message="bulkDeleteErrorMessage"
      @on-close="bulkDeleteErrorMessage = ''"
    />
    <TargetUserEditUserModal
      v-if="showEditUserModal"
      :editData="selectedRow"
      :custom-fields="customFields"
      :status="showEditUserModal"
      :language-items="languageFilterOptions"
      @closeAddUserModal="toggleEditUserModal"
      @closeAddUserModalWithUpdate="closeEditUserModalWithUpdate"
    />
    <TargetGroupUsersAddToAnExistingGroupModal
      v-if="showAddToAnExistingGroupModal"
      :bulkImportPayload="bulkImportPayload"
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
      :bulk-delete-error-message.sync="bulkDeleteErrorMessage"
      @closeDialog="toggleShowRemoveUserModal"
      @handleRemoveUsers="handleRemoveUsers"
    />
    <TargetUserCreateGroupWithUserDialog
      v-if="isShowingTargetUserCreateGroupWithUser"
      :status="isShowingTargetUserCreateGroupWithUser"
      @onConfirm="handleConfirmCreateUserWithGroup"
      @onClose="toggleShowingTargetUserCreateGroupWithUser"
    />
    <TargetGroupUsersTable
      ref="refTable"
      has-selection-slot
      class="pb-0"
      :resource-id="resourceId"
      :isServerSide="false"
      :groupName="getGroupName"
      @handleAddAction="toggleAddUserModal"
      @handleAddUsersSelectionClick="handleAddUsersSelectionClick"
      @handleAddToAnExistingGroup="handleAddToAnExistingGroup"
      @handleEditTargetUser="handleEditTargetUser"
      @handleRemoveToGroup="handleRemoveToGroup"
      @handleRemoveUsersSelectionClick="handleRemoveUsersSelectionClick"
      @handleRouteBackToTargetUsers="handleRouteBackToTargetUsers"
      @handleCreateGroupWithUser="handleCreateGroupWithUser"
    />
  </KContainer>
</template>

<script>
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable'
import { getTargetUserCustomFieldsByCompanyId } from '@/api/targetUsers'
import AddUserModal from '../AddUserModal'
import TargetGroupUsersAddToAnExistingGroupModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddToAnExistingGroupModal'
import TargetGroupUsersAddUsersModal from '@/components/TargetUsers/GroupUsers/TargetGroupUsersAddUsersModal'
import TargetGroupsUsersRemoveFromGroups from '@/components/TargetUsers/GroupUsers/TargetGroupsUsersRemoveFromGroups'
import DefaultErrorDialog from '@/components/Common/Others/DefaultErrorDialog'
import KContainer from '@/components/KContainer/KContainer'
import TargetUserCreateGroupWithUserDialog from '@/components/TargetUsers/TargetUserCreateGroupWithUserDialog'
import LookupLocalStorage from '../../../helper-classes/lookup-local-storage'

export default {
  name: 'TargetGroupUsers',
  components: {
    KContainer,
    DefaultErrorDialog,
    TargetGroupsUsersRemoveFromGroups,
    TargetGroupUsersAddUsersModal,
    TargetGroupUsersAddToAnExistingGroupModal,
    TargetGroupUsersTable,
    TargetUserEditUserModal: AddUserModal,
    TargetUserCreateGroupWithUserDialog
  },
  data() {
    return {
      languageFilterOptions: [],
      isShowingTargetUserCreateGroupWithUser: false,
      selectedUserToCreateGroupWith: null,
      customFields: [],
      resourceId: null,
      showEditUserModal: false,
      bulkDeleteErrorMessage: '',
      selectedRow: null,
      bulkImportPayload: {},
      showAddToAnExistingGroupModal: false,
      showAddUsersModal: false,
      showRemoveUserModal: false,
      from: ''
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
      return this.$route.params.label || localStorage.getItem('lastTargetGroupUsers')
    }
  },
  created() {
    this.callForLanguages()
    const {
      $route: { params }
    } = this
    if (params && params.id) {
      if (params.from) this.from = params.from
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
  beforeRouteLeave(to, from, next) {
    if (this.from === 'people') from.params.tab = 'people'
    next()
  },
  methods: {
    callForLanguages() {
      LookupLocalStorage.getSingle(21).then((response) => {
        this.languageFilterOptions =
          response?.map((language) => ({
            text: language.name,
            value: language.resourceId
          })) || []
      })
    },
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
    handleAddUsersSelectionClick(
      selection = [],
      filter = {},
      serverSideParams = {},
      serverSideProps = {}
    ) {
      this.selectedUserToAddToGroup = selection
      this.bulkImportPayload = {
        targetUserResourceIds: serverSideParams?.isSelectedAllEver
          ? []
          : selection.map((item) => item.resourceId),
        selectAll: serverSideParams?.isSelectedAllEver || false,
        excludedResourceIdList: serverSideParams?.excludedResourceIdList || [],
        filter,
        selectedRowCount: serverSideParams?.isSelectedAllEver
          ? serverSideProps.totalNumberOfRecords - serverSideParams?.excludedResourceIdList.length
          : selection.length
      }
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
      const { params = {} } = this.$route
      this.$router.push({
        name: 'Target Users',
        params: { tab: params.from === 'people' ? 'people' : 'second' }
      })
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
      this.bulkImportPayload = {
        targetUserResourceIds: [row.resourceId],
        selectAll: false,
        excludedResourceIdList: [],
        filter: this?.payload?.filter,
        selectedRowCount: 1
      }
      this.toggleShowAddToAnExistingGroupModal()
    },
    handleRemoveUsers() {
      this.toggleShowRemoveUserModal()
      const refTable = this.$refs.refTable.$refs.refTargetGroupUsersTable
      refTable.$refs.elTableRef.clearSelection()
      refTable.serverSideSelectionCount = 0
      refTable.excludedResourceIdList = []
      refTable.isSelectedAllEver = false
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
    },
    handleCreateGroupWithUser(selectedRow = {}) {
      this.selectedUserToCreateGroupWith = selectedRow
      this.bulkImportPayload = {
        targetUserResourceIds: [selectedRow.resourceId],
        selectAll: false,
        excludedResourceIdList: [],
        filter: this?.payload?.filter,
        selectedRowCount: 1
      }
      this.toggleShowingTargetUserCreateGroupWithUser()
    },
    handleConfirmCreateUserWithGroup() {
      this.selectedUserToCreateGroupWith = null
      this.toggleShowingTargetUserCreateGroupWithUser()
    },
    toggleShowingTargetUserCreateGroupWithUser() {
      if (this.isShowingTargetUserCreateGroupWithUser) {
        this.selectedUserToCreateGroupWith = null
        this.bulkImportPayload = {
          targetUserResourceIds: [],
          selectAll: false,
          excludedResourceIdList: [],
          filter: this?.payload?.filter,
          selectedRowCount: 0
        }
      }
      this.isShowingTargetUserCreateGroupWithUser = !this.isShowingTargetUserCreateGroupWithUser
    }
  }
}
</script>
