<template>
  <AppDialog
    :title-id="CONSTANTS.titleId"
    :subtitle-id="CONSTANTS.subtitleId"
    :status="status"
    :icon="CONSTANTS.icon"
    :title="CONSTANTS.title"
    :subtitle="item.firstName"
    :size="CONSTANTS.size"
    :max-height-size="CONSTANTS.maxHeightSize"
    @changeStatus="handleClose"
  >
    <template #app-dialog-body>
      <TargetUsersViewTargetUserGroupsTable :item-resource-id="item.resourceId" />
    </template>
    <template #app-dialog-footer>
      <div class="d-flex justify-end">
        <v-btn text color="#2196f3" class="k-dialog__button" @click="$emit('on-close')">
          {{ labels.Close }}
        </v-btn>
      </div>
    </template>
  </AppDialog>
</template>

<script>
import AppDialog from '@/components/AppDialog'
import labels from '@/model/constants/labels'
import TargetUsersViewTargetUserGroupsTable from '@/components/TargetUsers/TargetUsersViewTargetUserGroupsTable'
const CONSTANTS = {
  onClose: 'on-close'
}
export default {
  name: 'TargetUsersViewTargetUserGroups',
  components: { TargetUsersViewTargetUserGroupsTable, AppDialog },
  props: {
    item: {
      type: Object
    },
    status: {
      type: Boolean
    }
  },
  emits: [CONSTANTS.onClose],
  data() {
    return {
      labels,
      CONSTANTS: {
        icon: 'mdi-account-supervisor-outline',
        title: 'User’s Groups',
        size: 'ultraMaximum',
        titleId: 'text--target-users-view-user-groups-popup-title',
        subtitleId: 'text--target-users-view-user-groups-popup-subtitle',
        maxHeightSize: '665'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit(CONSTANTS.onClose)
    }
  }
}
</script>

<style></style>
