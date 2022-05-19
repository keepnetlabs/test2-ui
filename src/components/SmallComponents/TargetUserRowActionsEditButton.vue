<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <div style="display: inline-flex;" v-on="on">
        <v-btn
          v-on="on"
          :id="`btn-edit-${scope.$index}`"
          style="margin-bottom: -5px;"
          icon
          :disabled="getDisabledStatusOfAction"
          @click.native="$emit('on-edit', scope.row, scope)"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </div>
    </template>
    <span>{{ getTooltipMessage }}</span>
  </v-tooltip>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'TargetUserRowActionsEditButton',
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
    }
  },
  computed: {
    ...mapGetters({
      getTargetUsersEditPermissions: 'permissions/getTargetUsersEditPermissions'
    }),
    getTooltipMessage() {
      const { row } = this.scope
      return !row.isEditable
        ? `SCIM(${row.scimSettingName}) synced ${this.type} cannot be edited`
        : !this.getDisabledStatusOfAction
        ? this.name
        : 'No Permission'
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isEditable || !this.getTargetUsersEditPermissions
    }
  }
}
</script>
