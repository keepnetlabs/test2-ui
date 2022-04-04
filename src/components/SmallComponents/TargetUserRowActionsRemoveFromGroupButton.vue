<template>
  <v-tooltip bottom>
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
import { checkPermission } from '@/utils/functions'

export default {
  name: 'TargetUserRowActionsRemoveFromGroupButton',
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    getTooltipMessage() {
      const { row } = this.scope
      return !row.isEditable
        ? `SCIM(${row.scimSettingName}) synced user cannot be removed from group`
        : !this.getDisabledStatusOfAction
        ? 'Remove from group'
        : 'No Permission'
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !checkPermission('target-groups/{resourceId}/users', 'DELETE')
    }
  }
}
</script>
