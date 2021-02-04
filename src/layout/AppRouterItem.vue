<template>
  <v-list-item class="menu-list-item">
    <v-list-item-icon>
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-title>{{ title }}</v-list-item-title>
  </v-list-item>
</template>

<script>
export default {
  name: 'AppRouterItem',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>
