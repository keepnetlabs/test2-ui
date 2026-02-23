<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-list-item
          :disabled="getDisabledStatusOfAction"
          :id="`btn-edit--target-user-${scope.$index}`"
          @click="!getDisabledStatusOfAction && $emit('on-delete', scope.row)"
        >
          <v-list-item-title>
            <v-icon :disabled="getDisabledStatusOfAction" class="pr-3">{{ icon }}</v-icon>
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
    },
    id: {
      type: String
    }
  },
  computed: {
    ...mapGetters({
      getTargetUsersDeletePermissions: 'permissions/getTargetUsersDeletePermissions'
    }),
    getTooltipMessage() {
      const { row } = this.scope
      const indent = row.ldapConfigName ? 'LDAP' : 'SCIM'
      if (!row.isEditable)
        return `${indent}(${
          indent === 'LDAP' ? row.ldapConfigName : row.scimSettingName
        }) synced users cannot be deleted`
      return this.getDisabledStatusOfAction ? 'No Permission' : this.name
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !this.getTargetUsersDeletePermissions
    }
  }
}
</script>
