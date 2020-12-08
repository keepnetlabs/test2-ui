<template>
  <AppModal
    v-if="status"
    :status="status"
    :title="getTitle"
    :save-disable="saveDisable"
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
import { COMMON_CONSTANTS } from '@/model/constants/commonConstants'
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
      this.saveDisable = true
      createTargetGroupUsers(this.resourceId, {
        targetUserResourceIds: this.selectedUsers.map((user) => user.resourceId)
      }).then(() => {
        this.$store
          .dispatch('common/createSnackBar', {
            message: `${this.selectedUsers.length} target users(s) added to “${this.groupName}”`,
            color: COMMON_CONSTANTS.SUCCESSSNACKBARCOLOR,
            icon: 'mdi-check-circle'
          })
          .finally(() => {
            this.saveDisable = false
          })
        this.$emit('closeOverlayWithUpdate')
      })
    },
    handleSelectionChange(selectedUsers = []) {
      this.selectedUsers = selectedUsers
    }
  }
}
</script>
