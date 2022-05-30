<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on }">
      <v-list-item
        v-on="on"
        :disabled="getDisabledStatusOfAction"
        :id="`btn-edit--target-user-${scope.$index}`"
        @click="!getDisabledStatusOfAction && $emit('on-delete', scope.row)"
      >
        <v-list-item-title>
          <v-icon :disabled="getDisabledStatusOfAction" class="pr-3">{{ icon }}</v-icon>
          <span>Delete</span>
        </v-list-item-title>
      </v-list-item>
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
    }
  },
  computed: {
    ...mapGetters({
      getTargetUsersDeletePermissions: 'permissions/getTargetUsersDeletePermissions'
    }),
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
      return !row.isEditable || !this.getTargetUsersDeletePermissions
    }
  }
}
</script>
