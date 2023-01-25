<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getTitle"
    :save-disable="getConfirmButtonDisabled"
    confirm-button-id="btn-save--target-users-group-add-users-group-modal"
    cancel-button-id="btn-cancel--target-users-group-add-users-group-modal"
    title-id="text--target-users-group-add-users-modal-title"
    icon-name="mdi-account-plus"
    confirm-button-text="Add Selected Users"
    :confirm-button-style="{ minWidth: '180px' }"
    @closeOverlay="closeOverlay"
    @submit="submit"
  >
    <template #overlay-body>
      <AppModalBodyHeader
        title="Add Users To Group"
        sub-title="Select Users and add them to your group"
      />
      <TargetGroupUsersTable
        ref="refTargetGroupUsersTable"
        :has-row-actions="false"
        :has-add-button="false"
        :i-empty="iEmpty"
        :resource-id="resourceId"
        exclude-group-users
        @handleSelectionChange="handleSelectionChange"
      />
    </template>
  </AppModal>
</template>

<script>
import AppModal from '@/components/AppModal'
import AppModalBodyHeader from '@/components/SmallComponents/AppModalBodyHeader'
import TargetGroupUsersTable from '@/components/TargetUsers/GroupUsers/TargetGroupUsersTable'
import { bulkImportTargetUsersToGroups } from '@/api/targetUsers'
import labels from '@/model/constants/labels'

export default {
  name: 'TargetGroupUsersAddUsersModal',
  components: { TargetGroupUsersTable, AppModalBodyHeader, AppModal },
  props: {
    customFields: {
      type: Array
    },
    tableData: {
      type: Array
    },
    resourceId: {
      type: String
    },
    status: {
      type: Boolean
    },
    groupName: {
      type: String,
      required: true
    }
  },
  emits: ['closeOverlay', 'closeOverlayWithUpdate'],
  data() {
    return {
      selectedUsers: [],
      saveDisable: false,
      iEmpty: {
        message: labels.NoUsersToAdd
      },
      excludedResourceIdList: [],
      isSelectedAllEver: false,
      payload: {
        selectAll: false,
        excludedResourceIdList: [],
        targetGroupResourceIds: [],
        targetUserResourceIds: []
      }
    }
  },
  computed: {
    getTitle() {
      return `Add Users To “${this.groupName}” Group`
    },
    getConfirmButtonDisabled() {
      return (
        this.saveDisable || (!this.payload.targetUserResourceIds.length && !this.payload.selectAll)
      )
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      this.saveDisable = true
      const serverSideParams = this.$refs?.refTargetGroupUsersTable?.$refs?.refTargetGroupUsersTable?.getServerSideSelectionParams() || {
        isSelectedAllEver: false,
        excludedResourceIdList: []
      }
      this.payload = {
        ...this.payload,
        selectAll: serverSideParams?.isSelectedAllEver || false,
        excludedResourceIdList: serverSideParams?.excludedResourceIdList || [],
        targetGroupResourceIds: [this.resourceId],
        targetUserResourceIds: serverSideParams?.isSelectedAllEver ? [] : this.selectedUsers
      }
      bulkImportTargetUsersToGroups(this.payload)
        .then(() => {
          this.$emit('closeOverlayWithUpdate')
        })
        .finally(() => {
          this.saveDisable = false
        })
    },
    handleSelectionChange(
      selectedUsers = [],
      excludedResourceIdList = [],
      isSelectedAllEver = false
    ) {
      this.selectedUsers = selectedUsers.map((user) => user.resourceId)
      this.payload = {
        targetUserResourceIds: isSelectedAllEver ? [] : this.selectedUsers,
        selectAll: isSelectedAllEver,
        filter: this.$refs?.refTargetGroupUsersTable?.axiosPayload?.filter || {},
        excludedResourceIdList,
        targetGroupResourceIds: [this.resourceId]
      }
    }
  }
}
</script>
