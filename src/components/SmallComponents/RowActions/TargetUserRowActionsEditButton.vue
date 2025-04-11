<template>
  <DefaultButtonRowAction
    :id="id"
    :scope="scope"
    :icon="icon"
    :disabled="getDisabledStatusOfAction"
    :text="getTooltipMessage"
    @on-click="$emit('on-click', scope.row)"
  />
</template>

<script>
import { mapGetters } from 'vuex'
import DefaultButtonRowAction from '@/components/SmallComponents/RowActions/DefaultButtonRowAction'

export default {
  name: 'TargetUserRowActionsEditButton',
  components: { DefaultButtonRowAction },
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
      if (!row.isEditable) {
        if (row.isGoogleGroup) return `Google synced ${this.type} cannot be edited`
        return `${indent}(${indent === 'LDAP' ? row.ldapConfigName : row.scimSettingName}) synced ${
          this.type
        } cannot be edited`
      } else return !this.getDisabledStatusOfAction ? this.name : 'No Permission'
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !this.getTargetUsersEditPermissions || this.disabled
    }
  }
}
</script>
