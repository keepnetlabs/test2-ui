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
import { createTargetGroupUsers } from '@/api/targetUsers'
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
      isSelectedAllEver: false
    }
  },
  computed: {
    getTitle() {
      return `Add Users To “${this.groupName}” Group`
    },
    getConfirmButtonDisabled() {
      return this.saveDisable || !this.selectedUsers.length
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      this.saveDisable = true
      const payload = {}
      if (
        this.isSelectedAllEver ||
        this.$refs.refTargetGroupUsersTable.$refs.refTargetGroupUsersTable.isSelectedAllEver
      ) {
        payload.selectAll = {
          filter: this.$refs.refTargetGroupUsersTable.axiosPayload.filter,
          excludedResourceIdList: this.excludedResourceIdList
        }
        payload.targetUserResourceIds = []
      } else {
        payload.selectAll = null
        payload.targetUserResourceIds = this.selectedUsers.map((item) => item.resourceId)
      }

      createTargetGroupUsers(this.resourceId, payload)
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
      this.isSelectedAllEver = isSelectedAllEver
      this.excludedResourceIdList = excludedResourceIdList
      this.selectedUsers = selectedUsers
    }
  }
}
</script>
