<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div style="display: inline-flex;" v-on="on">
        <v-btn
          v-on="on"
          :id="`btn-delete-${scope.$index}`"
          style="margin-bottom: -5px;"
          icon
          :disabled="getDisabledStatusOfAction"
          @click.native="$emit('on-delete', scope.row)"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    <span>{{ getTooltipMessage }}</span>
  </v-tooltip>
</template>

<script>
import { checkPermission } from '@/utils/functions'

export default {
  name: 'TargetUserRowActionsDeleteButton',
  props: {
    scope: {
      type: Object
    },
    icon: {
      type: String,
      default: 'mdi-delete'
    },
    name: {
      type: String,
      default: 'Delete'
    }
  },
  computed: {
    getTooltipMessage() {
      const { row } = this.scope
      return !row.isEditable
        ? `SCIM(${row.scimSettingName}) synced users cannot be deleted`
        : !this.getDisabledStatusOfAction
        ? this.name
        : 'No Permission'
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !checkPermission('target-users/{resourceId}', 'DELETE')
    }
  }
}
</script>
