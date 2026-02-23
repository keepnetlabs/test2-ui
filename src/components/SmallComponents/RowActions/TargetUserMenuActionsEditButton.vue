<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div v-on="on">
        <v-list-item
          :disabled="getDisabledStatusOfAction"
          :id="`btn-edit--target-user-${scope.$index}`"
          @click="!getDisabledStatusOfAction && $emit('on-click', scope.row)"
        >
          <v-list-item-title>
            <v-icon :disabled="getDisabledStatusOfAction" class="pr-3">{{ icon }}</v-icon>
            <span>Edit</span>
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
  name: 'TargetUserMenuActionsEditButton',
  props: {
    scope: {
      type: Object
    },
    icon: {
      type: String,
      default: 'mdi-pencil'
    },
    name: {
      type: String,
      default: 'Edit this row'
    },
    type: {
      type: String,
      default: 'users'
    },
    id: {
      type: String
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
      getTargetUsersEditPermissions: 'permissions/getTargetUsersEditPermissions'
    }),
    getTooltipMessage() {
      if (this.tooltipMessage) {
        return this.tooltipMessage
      }
      const { row } = this.scope
      const indent = row.ldapConfigName ? 'LDAP' : 'SCIM'
      if (!row.isEditable)
        return `${indent}(${indent === 'LDAP' ? row.ldapConfigName : row.scimSettingName}) synced ${
          this.type
        } cannot be edited`
      else return this.getDisabledStatusOfAction ? 'No Permission' : this.name
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !this.getTargetUsersEditPermissions || this.disabled
    }
  }
}
</script>
