<template>
  <v-tooltip bottom offset-overflow max-width="200">
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-list-item
          :disabled="getDisabledStatusOfAction"
          :id="`btn-edit--target-group-${scope.$index}`"
          @click="!getDisabledStatusOfAction && $emit('on-delete', scope.row)"
        >
          <v-list-item-title>
            <v-icon :disabled="getDisabledStatusOfAction" class="pr-3">mdi-delete</v-icon>
            <span>Delete</span>
          </v-list-item-title>
        </v-list-item>
      </div>
    </template>
    <span>{{ getTooltipMessage }}</span>
  </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TargetGroupRowActionsDeleteButton',
  props: {
    scope: {
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tooltipMessage: {
      type: String
    }
  },
  computed: {
    ...mapGetters({
      getTargetGroupsDeletePermissions: 'permissions/getTargetGroupsDeletePermissions'
    }),
    getTooltipMessage() {
      if (this.tooltipMessage) {
        return this.tooltipMessage
      }
      const { row } = this.scope
      const indent = row.ldapConfigName ? 'LDAP' : 'SCIM'
      if (!row.isEditable)
        return `${indent}(${
          indent === 'LDAP' ? row.ldapConfigName : row.scimSettingName
        }) synced groups cannot be deleted`
      return !this.getDisabledStatusOfAction ? 'Delete' : 'No Permission'
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !this.getTargetGroupsDeletePermissions || this.disabled
    }
  }
}
</script>
