<template>
  <AppModal
    :status="status"
    v-if="status"
    :title="getTitle"
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
      iEmpty: {
        message: labels.NoUsersToAdd
      }
    }
  },
  computed: {
    getTitle() {
      return `Add Users To “${this.groupName}” Group`
    }
  },
  methods: {
    closeOverlay() {
      this.$emit('closeOverlay')
    },
    submit() {
      console.log('this.selections', this.selectedUsers)
      createTargetGroupUsers(this.resourceId, {
        targetUserResourceIds: this.selectedUsers.map((user) => user.resourceId)
      }).then(() => {
        this.$emit('closeOverlayWithUpdate')
      })
    },
    handleSelectionChange(selectedUsers = []) {
      this.selectedUsers = selectedUsers
    }
  }
}
</script>
