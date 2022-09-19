<template>
  <v-list-item :id="id" :disabled="isDisabled" @click="$emit('on-click', scope)">
    <v-list-item-title>
      <v-icon :disabled="isDisabled" class="pr-3">{{ icon }}</v-icon>
      <span>{{ text }}</span>
    </v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: 'DefaultMenuRowAction',
  props: {
    icon: {
      type: String
    },
    text: {
      type: String
    },
    scope: {
      type: Object
    },
    disabled: {
      type: Boolean
    },
    checkIsOwnerProperty: {
      type: Boolean,
      default: true
    },
    id: {
      type: String
    }
  },
  computed: {
    isDisabled() {
      const { row } = this.scope
      if (row.hasOwnProperty('isOwner') && this.checkIsOwnerProperty) {
        return this.disabled || !row.isOwner
      }
      return this.disabled
    }
  }
}
</script>
