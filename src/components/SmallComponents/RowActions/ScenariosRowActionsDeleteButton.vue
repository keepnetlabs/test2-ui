<template>
  <v-tooltip :disabled="!getDisabledStatusOfAction" bottom offset-overflow>
    <template #activator="{ on }">
      <div v-on="on">
        <v-list-item
          :disabled="getDisabledStatusOfAction"
          :id="id"
          @click="!getDisabledStatusOfAction && $emit('on-click', scope.row)"
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
export default {
  name: 'ScenariosRowActionsDeleteButton',
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
    },
    disabled: {
      type: Boolean
    }
  },
  computed: {
    getTooltipMessage() {
      const { row } = this.scope
      return row.isOwner ? this.name : 'You are not authorized to delete this template'
    },
    getDisabledStatusOfAction() {
      const { row } = this.scope
      return !row.isOwner || this.disabled
    }
  }
}
</script>
