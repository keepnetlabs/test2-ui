<template>
  <v-tooltip :disabled="!getDisabledStatusOfAction" bottom offset-overflow>
    <template #activator="{ on }">
      <div v-on="on">
        <v-list-item
          :disabled="getDisabledStatusOfAction"
          :id="id"
          @click="onEditClick"
        >
          <v-list-item-title>
            <v-icon :disabled="getDisabledStatusOfAction" class="pr-3">{{ icon }}</v-icon>
            <span>{{ name }}</span>
          </v-list-item-title>
        </v-list-item>
      </div>
    </template>
    <span>{{ getTooltipMessage }}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: 'ScenariosRowActionsEditButton',
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
      default: 'Edit'
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
      const row = this.scope && this.scope.row
      if (!row) return this.name
      return row.isOwner ? this.name : 'You are not authorized to edit this template'
    },
    getDisabledStatusOfAction() {
      const row = this.scope && this.scope.row
      if (!row) return true
      return !row.isOwner || this.disabled
    }
  },
  methods: {
    onEditClick() {
      if (!this.getDisabledStatusOfAction && this.scope && this.scope.row) {
        this.$emit('on-click', this.scope.row)
      }
    }
  }
}
</script>
