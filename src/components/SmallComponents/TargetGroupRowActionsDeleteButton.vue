<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-list-item
        v-on="on"
        :disabled="getDisabledStatusOfAction"
        :id="`btn-edit--target-group-${scope.$index}`"
        @click="$emit('on-delete', scope.row)"
      >
        <v-list-item-title>
          <v-icon :disabled="getDisabledStatusOfAction" class="pr-3">mdi-delete</v-icon>
          <span>Delete</span>
        </v-list-item-title>
      </v-list-item>
    </template>
    <span>{{ getTooltipMessage }}</span>
  </v-tooltip>
</template>

<script>
import { checkPermission } from '@/utils/functions'

export default {
  name: 'TargetGroupRowActionsDeleteButton',
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    getTooltipMessage() {
      const { row } = this.scope
      return !row.isEditable
        ? `SCIM(${row.scimSettingName}) synced groups cannot be deleted`
        : !this.getDisabledStatusOfAction
        ? 'Delete'
        : 'No Permission'
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !checkPermission('target-groups/{resourceId}', 'DELETE')
    }
  }
}
</script>
