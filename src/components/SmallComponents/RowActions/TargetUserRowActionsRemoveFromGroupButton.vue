<template>
  <v-tooltip disabled bottom>
    <template v-slot:activator="{ on }">
      <v-list-item
        v-on="on"
        :disabled="getDisabledStatusOfAction"
        :id="`btn-remove--target-group-users-${scope.$index}`"
        @click="!getDisabledStatusOfAction && $emit('on-remove', scope.row)"
      >
        <v-list-item-title>
          <v-icon :disabled="getDisabledStatusOfAction" class="pr-3">mdi-minus-circle</v-icon>
          <span>Remove from group</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <span>{{ getTooltipMessage }}</span>
  </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TargetUserRowActionsRemoveFromGroupButton',
  props: {
    scope: {
      type: Object
    },
    isGroupEditable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      getTargetGroupsDeleteUsersPermissions: 'permissions/getTargetGroupsDeleteUsersPermissions'
    }),
    getTooltipMessage() {
      // const { row } = this.scope
      // if (!row.isEditable)
      //   return `SCIM(${row.scimSettingName}) synced user cannot be removed from group`
      return !this.getDisabledStatusOfAction ? 'Remove from group' : 'No Permission'
    },
    getDisabledStatusOfAction() {
      return !this.isGroupEditable || !this.getTargetGroupsDeleteUsersPermissions
    }
  }
}
</script>
