<template>
  <v-tooltip bottom offset-overflow>
    <template v-slot:activator="{ on }">
      <v-list-item
        v-on="on"
        :disabled="getDisabledStatusOfAction"
        :id="`btn-edit--target-group-${scope.$index}`"
        @click="!getDisabledStatusOfAction && $emit('on-delete', scope.row)"
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
import { mapGetters } from 'vuex'

export default {
  name: 'TargetGroupRowActionsDeleteButton',
  props: {
    scope: {
      type: Object
    }
  },
  computed: {
    ...mapGetters({
      getTargetGroupsDeletePermissions: 'permissions/getTargetGroupsDeletePermissions'
    }),
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
      return !row.isEditable || !this.getTargetGroupsDeletePermissions
    }
  }
}
</script>
