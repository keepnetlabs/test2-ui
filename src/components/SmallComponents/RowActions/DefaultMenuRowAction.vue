<template>
  <v-list-item :disabled="disabled" @click="$emit('on-click', scope)">
    <v-list-item-title>
      <v-icon :disabled="disabled" class="pr-3">{{ icon }}</v-icon>
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
    }
  }
}
</script>
